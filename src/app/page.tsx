import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  FileText,
  Wallet
} from "lucide-react";
import { DistributionChart, MoneyBarChart } from "@/components/charts";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { ProgressBar } from "@/components/progress-bar";
import { ReportButton } from "@/components/report-button";
import { SectionCard } from "@/components/section-card";
import { TransactionTable } from "@/components/transaction-table";
import {
  currentMonthRange,
  dashboardMetrics,
  groupMoney
} from "@/lib/finance";
import { labelize, money } from "@/lib/format";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export default async function DashboardPage() {
  const user = await requireUser();
  const [transactions, investments, goals, settings] = await Promise.all([
    prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { date: "desc" } }),
    prisma.investment.findMany({ where: { userId: user.id }, orderBy: { asset: "asc" } }),
    prisma.goal.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } }),
    getSettings(user.id)
  ]);

  const metrics = dashboardMetrics(transactions, investments, goals, settings);
  const { start, end } = currentMonthRange();
  const monthTransactions = transactions.filter(
    (item) => item.status !== "cancelado" && item.date >= start && item.date <= end
  );
  const byType = [
    { name: "Entradas", value: metrics.monthlyIncome },
    { name: "A receber", value: metrics.pendingReceivable },
    { name: "Minhas saídas", value: metrics.myMonthlyExpenses }
  ];
  const investmentByCategory = groupMoney(
    investments,
    (item) => labelize(item.category),
    (item) => item.currentValue
  );
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());

  return (
    <>
      <PageHeader
        eyebrow="Resumo"
        title={settings.brandName}
        description="Visão local do mês, com foco nas suas despesas e no saldo previsto."
        action={
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <span className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-textSoft">
              {today}
            </span>
            <ReportButton />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Entradas do mês"
          value={money(metrics.monthlyIncome)}
          helper="Receitas registradas no mês atual"
          icon={ArrowUpRight}
        />
        <MetricCard
          title="Despesas sem cartão"
          value={money(metrics.monthlyExpenses)}
          helper="Saídas diretas do mês"
          icon={ArrowDownRight}
          tone="rose"
        />
        <MetricCard
          title="Minhas saídas"
          value={money(metrics.myMonthlyExpenses)}
          helper={`${settings.ownerName} + metade de ${settings.sharedName}`}
          icon={FileText}
          tone="gold"
        />
        <MetricCard
          title="Total em cartões"
          value={money(metrics.cardTotal)}
          helper="Faturas e parcelas do mês"
          icon={CreditCard}
          tone="rose"
        />
        <MetricCard
          title="Meu saldo previsto"
          value={money(metrics.expectedBalance)}
          helper="Entradas do mês - minhas saídas"
          icon={Wallet}
          tone="cyan"
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Fluxo do mês" description="Entradas, a receber e minhas saídas totais.">
          <MoneyBarChart data={byType} />
        </SectionCard>
        <SectionCard title="Investimentos" description="Distribuição do valor atual por categoria.">
          <DistributionChart data={investmentByCategory} />
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Reserva" description="Acompanhamento da principal meta de segurança.">
          <ProgressBar value={metrics.reserveProgress} label="Reserva de emergência" />
        </SectionCard>
        <SectionCard title="Últimos lançamentos">
          <TransactionTable transactions={transactions.slice(0, 6)} />
        </SectionCard>
      </div>
    </>
  );
}
