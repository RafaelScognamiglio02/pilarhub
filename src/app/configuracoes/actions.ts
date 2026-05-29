"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { currentMonthRange } from "@/lib/finance";
import { text } from "@/lib/form";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export async function clearCurrentMonthTransactions(formData: FormData) {
  const user = await requireUser();
  if (formData.get("confirm") !== "LIMPAR") return;

  const { start, end } = currentMonthRange();

  await prisma.transaction.deleteMany({
    where: {
      date: {
        gte: start,
        lte: end
      },
      userId: user.id,
      isRecurring: false,
      installmentGroupId: null
    }
  });

  revalidatePath("/");
  revalidatePath("/lancamentos");
  revalidatePath("/cartoes");
  revalidatePath("/configuracoes");
  redirect("/configuracoes");
}

export async function updateTemplateSettings(formData: FormData) {
  const user = await requireUser();
  const settings = await getSettings(user.id);

  await prisma.appSettings.update({
    where: { id: settings.id },
    data: {
      brandName: text(formData, "brandName", settings.brandName),
      ownerName: text(formData, "ownerName", settings.ownerName),
      partnerName: text(formData, "partnerName", settings.partnerName),
      sharedName: text(formData, "sharedName", settings.sharedName),
      thirdPartyName: text(formData, "thirdPartyName", settings.thirdPartyName),
      cardsCsv: text(formData, "cardsCsv", settings.cardsCsv),
      projectsCsv: text(formData, "projectsCsv", settings.projectsCsv)
    }
  });

  revalidatePath("/");
  revalidatePath("/lancamentos");
  revalidatePath("/cartoes");
  revalidatePath("/configuracoes");
  redirect("/configuracoes");
}
