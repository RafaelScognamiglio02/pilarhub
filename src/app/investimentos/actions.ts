"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { nullableText, numberValue, text } from "@/lib/form";
import { prisma } from "@/lib/prisma";

function investmentPayload(formData: FormData) {
  const quantity = numberValue(formData, "quantity");
  const averagePrice = numberValue(formData, "averagePrice");
  const currentPrice = numberValue(formData, "currentPrice");
  const investedAmount =
    numberValue(formData, "investedAmount") || quantity * averagePrice;
  const currentValue =
    numberValue(formData, "currentValue") || quantity * currentPrice;

  return {
    asset: text(formData, "asset", "Novo ativo"),
    category: text(formData, "category", "Caixa"),
    institution: nullableText(formData, "institution"),
    quantity,
    averagePrice,
    investedAmount,
    currentPrice,
    currentValue,
    notes: nullableText(formData, "notes")
  };
}

export async function createInvestment(formData: FormData) {
  const user = await requireUser();
  await prisma.investment.create({ data: { ...investmentPayload(formData), userId: user.id } });

  revalidatePath("/");
  revalidatePath("/investimentos");
  redirect("/investimentos");
}

export async function updateInvestment(formData: FormData) {
  const user = await requireUser();
  const id = text(formData, "id");
  if (!id) return;

  await prisma.investment.updateMany({
    where: { id, userId: user.id },
    data: investmentPayload(formData)
  });

  revalidatePath("/");
  revalidatePath("/investimentos");
  redirect("/investimentos");
}

export async function deleteInvestment(formData: FormData) {
  const user = await requireUser();
  const id = text(formData, "id");
  if (!id) return;

  await prisma.investment.deleteMany({ where: { id, userId: user.id } });

  revalidatePath("/");
  revalidatePath("/investimentos");
  redirect("/investimentos");
}
