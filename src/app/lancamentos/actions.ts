"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nullableText, numberValue, text } from "@/lib/form";

function numberOrNull(formData: FormData, key: string) {
  const value = numberValue(formData, key);
  return value > 0 ? value : null;
}

function transactionPayload(formData: FormData) {
  return {
    date: new Date(`${text(formData, "date")}T12:00:00`),
    type: text(formData, "type") as "entrada" | "saida" | "a_receber" | "investimento",
    category: text(formData, "category", "Geral"),
    description: text(formData, "description", "Sem descricao"),
    amount: numberValue(formData, "amount"),
    responsible: text(formData, "responsible") as
      | "Rafael"
      | "Siliane"
      | "Ambos"
      | "Terceiros",
    paymentMethod: text(formData, "paymentMethod") as
      | "conta"
      | "cartao"
      | "pix"
      | "dinheiro"
      | "debito",
    card: nullableText(formData, "card") as
      | "Caixa"
      | "Itau"
      | "PicPay"
      | "Outro"
      | null,
    project: text(formData, "project", "Nenhum"),
    status: text(formData, "status") as
      | "pendente"
      | "pago"
      | "recebido"
      | "cancelado",
    notes: nullableText(formData, "notes"),
    isRecurring: formData.has("isRecurring"),
    installmentNumber: numberOrNull(formData, "installmentNumber"),
    installmentTotal: numberOrNull(formData, "installmentTotal")
  };
}

export async function createTransaction(formData: FormData) {
  const user = await requireUser();
  const payload = transactionPayload(formData);
  const installmentTotal = Math.max(1, Math.floor(numberValue(formData, "installmentTotal") || 1));

  if (installmentTotal > 1) {
    const groupId = randomUUID();
    const baseDate = payload.date;
    const installmentAmount = Number((payload.amount / installmentTotal).toFixed(2));
    const lastAmount = Number(
      (payload.amount - installmentAmount * (installmentTotal - 1)).toFixed(2)
    );

    await prisma.transaction.createMany({
      data: Array.from({ length: installmentTotal }, (_, index) => {
        const date = new Date(baseDate);
        date.setMonth(baseDate.getMonth() + index);

        return {
          ...payload,
          userId: user.id,
          date,
          amount: index === installmentTotal - 1 ? lastAmount : installmentAmount,
          description: `${payload.description} (${index + 1}/${installmentTotal})`,
          installmentGroupId: groupId,
          installmentNumber: index + 1,
          installmentTotal
        };
      })
    });
  } else {
    await prisma.transaction.create({
      data: { ...payload, userId: user.id }
    });
  }

  revalidatePath("/");
  revalidatePath("/lancamentos");
  revalidatePath("/cartoes");
  redirect("/lancamentos");
}

export async function updateTransaction(formData: FormData) {
  const user = await requireUser();
  const id = text(formData, "id");
  if (!id) return;

  await prisma.transaction.updateMany({
    where: { id, userId: user.id },
    data: transactionPayload(formData)
  });

  revalidatePath("/");
  revalidatePath("/lancamentos");
  revalidatePath("/cartoes");
  redirect("/lancamentos");
}

export async function deleteTransaction(formData: FormData) {
  const user = await requireUser();
  const id = text(formData, "id");
  if (!id) return;

  await prisma.transaction.deleteMany({
    where: { id, userId: user.id }
  });

  revalidatePath("/");
  revalidatePath("/lancamentos");
  revalidatePath("/cartoes");
  redirect("/lancamentos");
}
