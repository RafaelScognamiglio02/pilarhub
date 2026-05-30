import { FolderKanban, Pencil, Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import {
  createProject,
  createProjectMonthlyResult,
  deleteProject,
  deleteProjectMonthlyResult,
  updateProject
} from "@/app/projetos/actions";
import { MoneyBarChart } from "@/components/charts";
import { inputClass } from "@/components/form-field";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { ProjectForm } from "@/components/project-form";
import { SectionCard } from "@/components/section-card";
import { sumBy } from "@/lib/finance";
import { inputDate, money, ratio } from "@/lib/format";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjetosPage() {
  const user = await requireUser();
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    include: { monthlyResults: { orderBy: { month: "desc" } } }
  });

  const invested = sumBy(projects, (item) => item.investedAmount);
  const revenue = sumBy(projects, (item) =>
    sumBy(item.monthlyResults, (result) => result.revenue)
  );
  const profit = sumBy(projects, (item) =>
    sumBy(item.monthlyResults, (result) => result.profit)
  );
  const roi = invested > 0 ? profit / invested : 0;

  return (
    <>
      <PageHeader
        eyebrow="Portfólio"
        title="Projetos"
        description="Investido acumulado, faturamento, lucro, projeção mensal e ROI."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Investido" value={money(invested)} icon={TrendingDown} tone="rose" />
        <MetricCard title="Faturamento" value={money(revenue)} icon={TrendingUp} />
        <MetricCard title="Lucro" value={money(profit)} icon={FolderKanban} tone={profit >= 0 ? "brand" : "gold"} />
        <MetricCard title="ROI" value={ratio(roi)} icon={FolderKanban} tone="cyan" />
      </div>

      <SectionCard className="mt-6" title="Novo projeto">
        <ProjectForm action={createProject} />
      </SectionCard>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Lucro por projeto">
          <MoneyBarChart
            data={projects.map((project) => ({
              name: project.name,
              value: sumBy(project.monthlyResults, (result) => result.profit)
            }))}
          />
        </SectionCard>
        <SectionCard title="Projetos ativos">
          <div className="grid gap-3">
            {projects.map((project) => {
              const projectRevenue = sumBy(project.monthlyResults, (result) => result.revenue);
              const projectCost = sumBy(project.monthlyResults, (result) => result.cost);
              const projectProfit = sumBy(project.monthlyResults, (result) => result.profit);
              const projectProjection = sumBy(
                project.monthlyResults,
                (result) => result.projection
              );
              const projectRoi =
                project.investedAmount > 0 ? projectProfit / project.investedAmount : 0;

              return (
                <div key={project.id} className="rounded-lg border border-line bg-panelSoft p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{project.name}</h3>
                      <p className="mt-1 text-sm text-textSoft">
                        {project.category} · {project.status}
                      </p>
                      {project.notes ? (
                        <p className="mt-2 text-sm leading-6 text-textSoft">{project.notes}</p>
                      ) : null}
                    </div>
                    <div className="grid min-w-72 grid-cols-3 gap-2 text-right text-sm">
                      <Mini label="Investido" value={money(project.investedAmount)} />
                      <Mini label="Faturamento" value={money(projectRevenue)} />
                      <Mini label="Lucro" value={money(projectProfit)} />
                      <Mini label="Custo" value={money(projectCost)} />
                      <Mini label="Projeção" value={money(projectProjection)} />
                      <Mini label="ROI" value={ratio(projectRoi)} />
                    </div>
                  </div>

                  <form
                    action={createProjectMonthlyResult}
                    className="mt-4 grid gap-2 rounded-lg border border-line bg-slate-950/40 p-3 md:grid-cols-6"
                  >
                    <input type="hidden" name="projectId" value={project.id} />
                    <label>
                      <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-textSoft">
                        Mês
                      </span>
                      <input
                        name="month"
                        type="date"
                        defaultValue={inputDate(new Date())}
                        className={inputClass}
                      />
                    </label>
                    <SmallNumber name="revenue" label="Faturamento" />
                    <SmallNumber name="cost" label="Custo" />
                    <SmallNumber name="profit" label="Lucro" />
                    <SmallNumber name="projection" label="Projeção" />
                    <button
                      type="submit"
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-brand/40 px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10"
                    >
                      <Plus className="size-4" />
                      Lançar
                    </button>
                  </form>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <details className="relative">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-textSoft transition hover:text-white">
                        <Pencil className="size-4" />
                        Editar
                      </summary>
                      <div className="fixed inset-0 z-20 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
                        <div className="mx-auto mt-8 max-w-5xl rounded-lg border border-line bg-panel p-5 shadow-2xl">
                          <h3 className="mb-4 text-lg font-semibold text-white">
                            Editar projeto
                          </h3>
                          <ProjectForm action={updateProject} project={project} />
                          <p className="mt-4 text-sm text-textSoft">
                            Clique novamente em Editar para fechar.
                          </p>
                        </div>
                      </div>
                    </details>
                    <form action={deleteProject}>
                      <input type="hidden" name="id" value={project.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg border border-danger/30 px-3 py-2 text-sm text-danger transition hover:bg-danger/10"
                      >
                        <Trash2 className="size-4" />
                        Excluir projeto
                      </button>
                    </form>
                  </div>

                  {project.monthlyResults.length ? (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[760px] text-sm">
                        <thead className="text-left text-xs uppercase tracking-[0.14em] text-textSoft">
                          <tr>
                            <th className="px-3 py-2">Mês</th>
                            <th className="px-3 py-2 text-right">Faturamento</th>
                            <th className="px-3 py-2 text-right">Custo</th>
                            <th className="px-3 py-2 text-right">Lucro</th>
                            <th className="px-3 py-2 text-right">Projeção</th>
                            <th className="px-3 py-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {project.monthlyResults.map((result) => (
                            <tr key={result.id}>
                              <td className="px-3 py-3 text-textSoft">
                                {inputDate(result.month).slice(0, 7)}
                              </td>
                              <td className="px-3 py-3 text-right text-white">
                                {money(result.revenue)}
                              </td>
                              <td className="px-3 py-3 text-right text-textSoft">
                                {money(result.cost)}
                              </td>
                              <td className="px-3 py-3 text-right text-white">
                                {money(result.profit)}
                              </td>
                              <td className="px-3 py-3 text-right text-textSoft">
                                {money(result.projection)}
                              </td>
                              <td className="px-3 py-3 text-right">
                                <form action={deleteProjectMonthlyResult}>
                                  <input type="hidden" name="id" value={result.id} />
                                  <button className="text-danger hover:underline">
                                    Excluir
                                  </button>
                                </form>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-textSoft">{label}</p>
      <p className="font-semibold text-white">{value}</p>
    </div>
  );
}

function SmallNumber({ name, label }: { name: string; label: string }) {
  return (
    <label>
      <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-textSoft">
        {label}
      </span>
      <input
        name={name}
        type="number"
        step="0.01"
        min="0"
        placeholder="0,00"
        className={inputClass}
      />
    </label>
  );
}
