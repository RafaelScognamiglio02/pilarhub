import { Landmark, LineChart, Pencil, PieChart, Plus, Trash2 } from "lucide-react";
import {
  createInvestment,
  deleteInvestment,
  updateInvestment
} from "@/app/investimentos/actions";
import { DistributionChart } from "@/components/charts";
import { InvestmentForm } from "@/components/investment-form";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { groupMoney, sumBy } from "@/lib/finance";
import { labelize, money, ratio } from "@/lib/format";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InvestimentosPage() {
  const user = await requireUser();
  const investments = await prisma.investment.findMany({
    where: { userId: user.id },
    orderBy: { asset: "asc" }
  });

  const invested = sumBy(investments, (item) => item.investedAmount);
  const current = sumBy(investments, (item) => item.currentValue);
  const profit = current - invested;
  const profitability = invested > 0 ? profit / invested : 0;
  const byCategory = groupMoney(
    investments,
    (item) => labelize(item.category),
    (item) => item.currentValue
  );

  return (
    <>
      <PageHeader
        eyebrow="Patrimônio"
        title="Investimentos"
        description="Carteira consolidada por ativo, categoria, valor atual e rentabilidade."
        action={
          <details className="relative">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300">
              <Plus className="size-4" />
              Novo investimento
            </summary>
            <div className="fixed inset-0 z-20 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
              <div className="mx-auto mt-8 max-w-5xl rounded-lg border border-line bg-panel p-5 shadow-2xl">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Novo investimento
                </h3>
                <InvestmentForm action={createInvestment} />
                <p className="mt-4 text-sm text-textSoft">
                  Clique novamente em Novo investimento para fechar.
                </p>
              </div>
            </div>
          </details>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Valor investido" value={money(invested)} icon={Landmark} />
        <MetricCard title="Valor atual" value={money(current)} icon={PieChart} tone="cyan" />
        <MetricCard
          title="Rentabilidade"
          value={`${money(profit)} (${ratio(profitability)})`}
          icon={LineChart}
          tone={profit >= 0 ? "brand" : "rose"}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <SectionCard title="Distribuição por categoria">
          <DistributionChart data={byCategory} />
        </SectionCard>

        <SectionCard title="Carteira">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.14em] text-textSoft">
                <tr>
                  <th className="px-3 py-2">Ativo</th>
                  <th className="px-3 py-2">Categoria</th>
                  <th className="px-3 py-2 text-right">Quantidade</th>
                  <th className="px-3 py-2 text-right">Preço médio</th>
                  <th className="px-3 py-2 text-right">Preço atual</th>
                  <th className="px-3 py-2 text-right">Investido</th>
                  <th className="px-3 py-2 text-right">Atual</th>
                  <th className="px-3 py-2 text-right">Rent.</th>
                  <th className="px-3 py-2">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {investments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-8 text-center text-textSoft">
                      Nenhum investimento cadastrado.
                    </td>
                  </tr>
                ) : (
                  investments.map((item) => {
                    const itemProfit = item.currentValue - item.investedAmount;
                    const itemProfitability =
                      item.investedAmount > 0 ? itemProfit / item.investedAmount : 0;

                    return (
                      <tr key={item.id} className="align-middle">
                        <td className="px-3 py-4">
                          <p className="font-semibold text-white">{item.asset}</p>
                          {item.notes ? (
                            <p className="mt-1 max-w-48 truncate text-xs text-textSoft">
                              {item.notes}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-3 py-4 text-textSoft">{labelize(item.category)}</td>
                        <td className="px-3 py-4 text-right text-textSoft">
                          {item.quantity.toLocaleString("pt-BR", {
                            maximumFractionDigits: 8
                          })}
                        </td>
                        <td className="px-3 py-4 text-right text-textSoft">
                          {money(item.averagePrice)}
                        </td>
                        <td className="px-3 py-4 text-right text-textSoft">
                          {money(item.currentPrice)}
                        </td>
                        <td className="px-3 py-4 text-right text-textSoft">
                          {money(item.investedAmount)}
                        </td>
                        <td className="px-3 py-4 text-right font-semibold text-white">
                          {money(item.currentValue)}
                        </td>
                        <td className="px-3 py-4 text-right text-white">
                          {money(itemProfit)} ({ratio(itemProfitability)})
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-2">
                            <details className="relative">
                              <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-textSoft transition hover:text-white">
                                <Pencil className="size-4" />
                                Editar
                              </summary>
                              <div className="fixed inset-0 z-20 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
                                <div className="mx-auto mt-8 max-w-5xl rounded-lg border border-line bg-panel p-5 shadow-2xl">
                                  <h3 className="mb-4 text-lg font-semibold text-white">
                                    Editar investimento
                                  </h3>
                                  <InvestmentForm action={updateInvestment} investment={item} />
                                  <p className="mt-4 text-sm text-textSoft">
                                    Clique novamente em Editar para fechar.
                                  </p>
                                </div>
                              </div>
                            </details>
                            <form action={deleteInvestment}>
                              <input type="hidden" name="id" value={item.id} />
                              <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-lg border border-danger/30 px-3 py-2 text-sm text-danger transition hover:bg-danger/10"
                              >
                                <Trash2 className="size-4" />
                                Excluir
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
