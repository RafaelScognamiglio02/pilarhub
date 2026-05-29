import type { AppSettings } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const defaultSettings = {
  brandName: "PilarHub",
  ownerName: "Principal",
  partnerName: "Parceiro",
  sharedName: "Ambos",
  thirdPartyName: "Terceiros",
  cardsCsv: "Cartão 1,Cartão 2,Outro",
  projectsCsv: "Nenhum,Projeto A,Projeto B"
};

export type FinanceSettings = Pick<
  AppSettings,
  | "id"
  | "userId"
  | "brandName"
  | "ownerName"
  | "partnerName"
  | "sharedName"
  | "thirdPartyName"
  | "cardsCsv"
  | "projectsCsv"
>;

export async function getSettings(userId: string): Promise<FinanceSettings> {
  const settings = await prisma.appSettings.findUnique({
    where: { userId }
  });

  if (settings) return settings;

  return prisma.appSettings.create({
    data: {
      ...defaultSettings,
      userId
    }
  });
}

export function csvToList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getResponsibleOptions(settings: FinanceSettings) {
  return [
    settings.ownerName,
    settings.partnerName,
    settings.sharedName,
    settings.thirdPartyName
  ].filter(Boolean);
}

export function getCardOptions(settings: FinanceSettings) {
  return csvToList(settings.cardsCsv);
}

export function getProjectOptions(settings: FinanceSettings) {
  const projects = csvToList(settings.projectsCsv);
  return projects.includes("Nenhum") ? projects : ["Nenhum", ...projects];
}
