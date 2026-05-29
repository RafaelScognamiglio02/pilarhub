"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { text } from "@/lib/form";
import { defaultSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export async function register(formData: FormData) {
  const name = text(formData, "name");
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");

  if (!name || !email || password.length < 6) return;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      settings: {
        create: {
          ...defaultSettings,
          brandName: "PilarHub",
          ownerName: name
        }
      }
    }
  });

  await createSession(user.id);
  redirect("/");
}

export async function login(formData: FormData) {
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(password, user.passwordHash)) return;

  await createSession(user.id);
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
