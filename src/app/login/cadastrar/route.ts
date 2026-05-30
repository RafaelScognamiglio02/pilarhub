import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { defaultSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!name || !email || password.length < 6) {
      redirect("/login?erro=cadastro");
    }

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
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect("/login?erro=cadastro");
  }
}

function isRedirectError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")
  );
}
