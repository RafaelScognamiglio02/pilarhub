import { createTransaction } from "@/app/lancamentos/actions";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionTable } from "@/components/transaction-table";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getCardOptions,
  getProjectOptions,
  getResponsibleOptions,
  getSettings
} from "@/lib/settings";

export default async function LancamentosPage() {
  const user = await requireUser();
  const [transactions, settings, dbProjects] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }]
    }),
    getSettings(user.id),
    prisma.project.findMany({ where: { userId: user.id }, select: { name: true }, orderBy: { name: "asc" } })
  ]);
  const responsibles = getResponsibleOptions(settings);
  const cards = getCardOptions(settings);
  const projects = Array.from(
    new Set([...getProjectOptions(settings), ...dbProjects.map((project) => project.name)])
  );

  return (
    <>
      <PageHeader
        eyebrow="Operação"
        title="Lançamentos"
        description="Cadastre, edite e exclua entradas, saídas, valores a receber e investimentos."
      />

      <SectionCard title="Novo lançamento">
        <TransactionForm
          action={createTransaction}
          responsibles={responsibles}
          cards={cards}
          projects={projects}
        />
      </SectionCard>

      <SectionCard className="mt-6" title="Histórico">
        <TransactionTable
          transactions={transactions}
          editable
          responsibles={responsibles}
          cards={cards}
          projects={projects}
        />
      </SectionCard>
    </>
  );
}
