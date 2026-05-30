import { PrintButton } from "@/components/print-button";
import { currentMonthRange, dashboardMetrics, groupMoney } from "@/lib/finance";
import { inputDate, labelize, money } from "@/lib/format";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RelatorioMensalPage() {
  const user = await requireUser();
  const [transactions, investments, goals, settings] = await Promise.all([
    prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
    prisma.investment.findMany({ where: { userId: user.id }, orderBy: { asset: "asc" } }),
    prisma.goal.findMany({ where: { userId: user.id } }),
    getSettings(user.id)
  ]);
  const metrics = dashboardMetrics(transactions, investments, goals, settings);
  const { start, end } = currentMonthRange();
  const monthTransactions = transactions.filter(
    (item) => item.status !== "cancelado" && item.date >= start && item.date <= end
  );
  const expenses = monthTransactions.filter((item) => item.type === "saida");
  const byCategory = groupMoney(expenses, (item) => item.category, (item) => item.amount);
  const byCard = groupMoney(
    expenses.filter((item) => item.paymentMethod === "cartao" && item.card),
    (item) => labelize(item.card),
    (item) => item.amount
  );
  const byResponsible = groupMoney(
    expenses,
    (item) => item.responsible,
    (item) => item.amount
  );
  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric"
  }).format(new Date());

  return (
    <main className="mx-auto max-w-5xl bg-white px-8 py-8 text-slate-950 print:px-0 print:py-0">
      <div className="mb-6 flex items-start justify-between gap-4 print:hidden">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Relatório mensal
          </p>
          <h1 className="mt-1 text-3xl font-semibold">Finanças de {monthLabel}</h1>
        </div>
        <PrintButton />
      </div>

      <section className="mb-8 border-b border-slate-300 pb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
          Relatório mensal
        </p>
        <h1 className="mt-1 text-3xl font-semibold">Finanças de {monthLabel}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Período: {inputDate(start).split("-").reverse().join("/")} até{" "}
          {inputDate(end).split("-").reverse().join("/")}
        </p>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Summary label="Entradas" value={money(metrics.monthlyIncome)} />
        <Summary label="Saídas totais" value={money(metrics.grossMonthlyExpenses)} />
        <Summary label="Minhas saídas" value={money(metrics.myMonthlyExpenses)} />
        <Summary label="Cartões" value={money(metrics.cardTotal)} />
        <Summary label="A receber" value={money(metrics.pendingReceivable)} />
        <Summary label="Saldo previsto" value={money(metrics.expectedBalance)} />
        <Summary label="Investido" value={money(metrics.investedTotal)} />
        <Summary label="Patrimônio" value={money(metrics.netWorth)} />
      </section>

      <ReportSection title="Gastos por categoria" data={byCategory} />
      <ReportSection title="Gastos por cartão" data={byCard} />
      <ReportSection title="Gastos por responsável" data={byResponsible} />

      <section className="mt-8">
        <h2 className="mb-3 text-xl font-semibold">Lançamentos do mês</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="border border-slate-300 px-3 py-2">Data</th>
              <th className="border border-slate-300 px-3 py-2">Descrição</th>
              <th className="border border-slate-300 px-3 py-2">Categoria</th>
              <th className="border border-slate-300 px-3 py-2">Responsável</th>
              <th className="border border-slate-300 px-3 py-2">Cartão</th>
              <th className="border border-slate-300 px-3 py-2 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {monthTransactions.map((item) => (
              <tr key={item.id}>
                <td className="border border-slate-300 px-3 py-2">
                  {inputDate(item.date).split("-").reverse().join("/")}
                </td>
                <td className="border border-slate-300 px-3 py-2">{item.description}</td>
                <td className="border border-slate-300 px-3 py-2">{item.category}</td>
                <td className="border border-slate-300 px-3 py-2">{item.responsible}</td>
                <td className="border border-slate-300 px-3 py-2">{labelize(item.card)}</td>
                <td className="border border-slate-300 px-3 py-2 text-right">
                  {money(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-300 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function ReportSection({
  title,
  data
}: {
  title: string;
  data: { name: string; value: number }[];
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="border border-slate-300 px-3 py-2 text-slate-500">
                Sem dados no período.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.name}>
                <td className="border border-slate-300 px-3 py-2">{item.name}</td>
                <td className="border border-slate-300 px-3 py-2 text-right">
                  {money(item.value)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
