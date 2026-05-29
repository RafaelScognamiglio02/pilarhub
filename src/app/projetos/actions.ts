"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { nullableDate, nullableText, numberValue, text } from "@/lib/form";
import { prisma } from "@/lib/prisma";

function projectPayload(formData: FormData) {
  return {
    name: text(formData, "name", "Novo projeto"),
    category: text(formData, "category", "Geral"),
    investedAmount: numberValue(formData, "investedAmount"),
    revenueAmount: numberValue(formData, "revenueAmount"),
    status: text(formData, "status", "Ativo"),
    notes: nullableText(formData, "notes")
  };
}

export async function createProject(formData: FormData) {
  const user = await requireUser();
  await prisma.project.create({ data: { ...projectPayload(formData), userId: user.id } });

  revalidatePath("/");
  revalidatePath("/projetos");
  redirect("/projetos");
}

export async function updateProject(formData: FormData) {
  const user = await requireUser();
  const id = text(formData, "id");
  if (!id) return;

  await prisma.project.updateMany({
    where: { id, userId: user.id },
    data: projectPayload(formData)
  });

  revalidatePath("/");
  revalidatePath("/projetos");
  redirect("/projetos");
}

export async function createProjectMonthlyResult(formData: FormData) {
  const user = await requireUser();
  const projectId = text(formData, "projectId");
  if (!projectId) return;
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    select: { id: true }
  });
  if (!project) return;

  const revenue = numberValue(formData, "revenue");
  const cost = numberValue(formData, "cost");
  const profitRaw = text(formData, "profit");
  const profit = profitRaw ? numberValue(formData, "profit") : revenue - cost;

  await prisma.projectMonthlyResult.create({
    data: {
      projectId: project.id,
      month: nullableDate(formData, "month") ?? new Date(),
      revenue,
      cost,
      profit,
      projection: numberValue(formData, "projection"),
      notes: nullableText(formData, "notes")
    }
  });

  revalidatePath("/");
  revalidatePath("/projetos");
  redirect("/projetos");
}

export async function deleteProjectMonthlyResult(formData: FormData) {
  const user = await requireUser();
  const id = text(formData, "id");
  if (!id) return;

  await prisma.projectMonthlyResult.deleteMany({
    where: {
      id,
      project: { userId: user.id }
    }
  });

  revalidatePath("/");
  revalidatePath("/projetos");
  redirect("/projetos");
}

export async function deleteProject(formData: FormData) {
  const user = await requireUser();
  const id = text(formData, "id");
  if (!id) return;

  await prisma.project.deleteMany({ where: { id, userId: user.id } });

  revalidatePath("/");
  revalidatePath("/projetos");
  redirect("/projetos");
}
