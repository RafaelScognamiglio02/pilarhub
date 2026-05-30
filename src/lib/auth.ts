import {
  createHmac,
  randomBytes,
  timingSafeEqual,
  pbkdf2Sync
} from "node:crypto";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "pilarhub_session";
const SESSION_DAYS = 30;

function signSession(token: string, userId: string, passwordHash: string) {
  return createHmac("sha256", passwordHash)
    .update(`${token}.${userId}`)
    .digest("hex");
}

function encodeSessionCookie(token: string, userId: string, passwordHash: string) {
  return `${token}.${userId}.${signSession(token, userId, passwordHash)}`;
}

function parseSessionCookie(value: string) {
  const [token, userId, signature] = value.split(".");
  return { token, userId, signature };
}

function safeCompareHex(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  const attempt = pbkdf2Sync(password, salt, 100_000, 64, "sha512");
  const expected = Buffer.from(hash, "hex");
  return expected.length === attempt.length && timingSafeEqual(expected, attempt);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return;

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt
    }
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSessionCookie(token, user.id, user.passwordHash), {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    expires: expiresAt,
    path: "/"
  });
}

export async function getCurrentUser(): Promise<User | null> {
  noStore();

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE)?.value;
  if (!cookieValue) return null;

  const { token, userId, signature } = parseSessionCookie(cookieValue);
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!session) {
    if (!userId || !signature) return null;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    const expected = signSession(token, user.id, user.passwordHash);
    return safeCompareHex(signature, expected) ? user : null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE)?.value;
  const token = cookieValue ? parseSessionCookie(cookieValue).token : null;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }

  cookieStore.delete(SESSION_COOKIE);
}
