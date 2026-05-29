"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { nullableDate, nullableText, numberValue, text } from "@/lib/form";
import { prisma } from "@/lib/prisma";

function goalPayload(formData: FormData) {
  return {
    name: text(formData, "name", "Nova meta"),
    category: text(formData, "category", "Geral"),
    targetAmount: numberValue(formData, "targetAmount"),
    currentAmount: numberValue(formData, "currentAmount"),
    deadline: nullableDate(formData, "deadline"),
    notes: nullableText(formData, "notes")
  };
}

export async function createGoal(formData: FormData) {
  const user = await requireUser();
  await prisma.goal.create({ data: { ...goalPayload(formData), userId: user.id } });

  revalidatePath("/");
  revalidatePath("/metas");
  redirect("/metas");
}

export async function updateGoal(formData: FormData) {
  const user = await requireUser();
  const id = text(formData, "id");
  if (!id) return;

  await prisma.goal.updateMany({
    where: { id, userId: user.id },
    data: goalPayload(formData)
  });

  revalidatePath("/");
  revalidatePath("/metas");
  redirect("/metas");
}

export async function addGoalProgress(formData: FormData) {
  const user = await requireUser();
  const id = text(formData, "id");
  if (!id) return;

  const amount = numberValue(formData, "amount");
  const goal = await prisma.goal.findFirst({ where: { id, userId: user.id } });
  if (!goal) return;

  await prisma.goal.update({
    where: { id: goal.id },
    data: {
      currentAmount: goal.currentAmount + amount
    }
  });

  revalidatePath("/");
  revalidatePath("/metas");
  redirect("/metas");
}

export async function deleteGoal(formData: FormData) {
  const user = await requireUser();
  const id = text(formData, "id");
  if (!id) return;

  await prisma.goal.deleteMany({ where: { id, userId: user.id } });

  revalidatePath("/");
  revalidatePath("/metas");
  redirect("/metas");
}
