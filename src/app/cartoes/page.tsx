import Link from "next/link";
import { CreditCard, Users, WalletCards } from "lucide-react";
import { DistributionChart, MoneyBarChart } from "@/components/charts";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { TransactionTable } from "@/components/transaction-table";
import { groupMoney, sumBy } from "@/lib/finance";
import { labelize, money } from "@/lib/format";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCardOptions, getSettings } from "@/lib/settings";
import { cn } from "@/lib/ui";

function normalizeCardFilter(value: string | undefined, cardFilters: string[]) {
  return cardFilters.find((card) => card === value) ?? "Todos";
}

export default async function CartoesPage({
  searchParams
}: {
  searchParams?: Promise<{ cartao?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const settings = await getSettings(user.id);
  const cardFilters = ["Todos", ...getCardOptions(settings)];
  const selectedCard = normalizeCardFilter(params?.cartao, cardFilters);
  const cardWhere = selectedCard === "Todos" ? {} : { card: selectedCard };

  const transactions = await prisma.transaction.findMany({
    where: {
      paymentMethod: "cartao",
      userId: user.id,
      type: "saida",
      status: { not: "cancelado" },
      ...cardWhere
    },
    orderBy: [{ date: "desc" }]
  });

  const byCard = groupMoney(
    transactions.filter((item) => item.card),
    (item) => labelize(item.card),
    (item) => item.amount
  );
  const byResponsible = groupMoney(
    transactions,
    (item) => item.responsible,
    (item) => item.amount
  );
  const total = sumBy(transactions, (item) => item.amount);
  const pending = sumBy(
    transactions.filter((item) => item.status === "pendente"),
    (item) => item.amount
  );

  return (
    <>
      <PageHeader
        eyebrow="Faturas"
        title="Cartões"
        description="Totais por cartão, separação por responsável e lançamentos vinculados."
      />

      <SectionCard className="mb-6" title="Filtrar cartão">
        <div className="flex flex-wrap gap-2">
          {cardFilters.map((card) => {
            const active = selectedCard === card;
            const href = card === "Todos" ? "/cartoes" : `/cartoes?cartao=${card}`;

            return (
              <Link
                key={card}
                href={href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "border-brand bg-brand text-slate-950"
                    : "border-line bg-panelSoft text-textSoft hover:text-white"
                )}
              >
                <CreditCard className="size-4" />
                {labelize(card)}
              </Link>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title={
            selectedCard === "Todos"
              ? "Total em cartões"
              : `Total ${labelize(selectedCard)}`
          }
          value={money(total)}
          icon={CreditCard}
          tone="rose"
        />
        <MetricCard title="Pendente" value={money(pending)} icon={WalletCards} tone="gold" />
        <MetricCard title="Responsáveis" value={`${byResponsible.length}`} icon={Users} tone="cyan" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Total por cartão">
          <MoneyBarChart data={byCard} />
        </SectionCard>
        <SectionCard title="Gastos por responsável">
          <DistributionChart data={byResponsible} />
        </SectionCard>
      </div>

      <SectionCard
        className="mt-6"
        title={
          selectedCard === "Todos"
            ? "Transações do cartão"
            : `Transações do cartão ${labelize(selectedCard)}`
        }
      >
        <TransactionTable transactions={transactions} />
      </SectionCard>
    </>
  );
}
