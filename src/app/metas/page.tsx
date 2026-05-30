import { Pencil, Plus, Target, Trash2, Trophy, Wallet } from "lucide-react";
import { addGoalProgress, createGoal, deleteGoal, updateGoal } from "@/app/metas/actions";
import { inputClass } from "@/components/form-field";
import { GoalForm } from "@/components/goal-form";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { ProgressBar } from "@/components/progress-bar";
import { SectionCard } from "@/components/section-card";
import { sumBy } from "@/lib/finance";
import { inputDate, money } from "@/lib/format";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MetasPage() {
  const user = await requireUser();
  const goals = await prisma.goal.findMany({
    where: { userId: user.id },
    orderBy: { deadline: "asc" }
  });

  const target = sumBy(goals, (item) => item.targetAmount);
  const current = sumBy(goals, (item) => item.currentAmount);
  const progress = target > 0 ? current / target : 0;

  return (
    <>
      <PageHeader
        eyebrow="Planejamento"
        title="Metas"
        description="Progresso das metas financeiras e prazos principais."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Meta total" value={money(target)} icon={Target} tone="gold" />
        <MetricCard title="Acumulado" value={money(current)} icon={Wallet} />
        <MetricCard title="Progresso geral" value={`${Math.round(progress * 100)}%`} icon={Trophy} tone="cyan" />
      </div>

      <SectionCard className="mt-6" title="Nova meta">
        <GoalForm action={createGoal} />
      </SectionCard>

      <SectionCard className="mt-6" title="Metas cadastradas">
        <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((goal) => {
            const goalProgress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;

            return (
              <div key={goal.id} className="rounded-lg border border-line bg-panelSoft p-4">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">{goal.name}</h3>
                    <p className="mt-1 text-sm text-textSoft">{goal.category}</p>
                  </div>
                  <p className="text-right text-sm text-textSoft">
                    {goal.deadline ? inputDate(goal.deadline).split("-").reverse().join("/") : "Sem prazo"}
                  </p>
                </div>
                <ProgressBar value={goalProgress} label={`${money(goal.currentAmount)} de ${money(goal.targetAmount)}`} />
                {goal.notes ? (
                  <p className="mt-3 text-sm leading-6 text-textSoft">{goal.notes}</p>
                ) : null}
                <form action={addGoalProgress} className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input type="hidden" name="id" value={goal.id} />
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Adicionar valor"
                    className={inputClass}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand/40 px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10"
                  >
                    <Plus className="size-4" />
                    Atualizar
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
                          Editar meta
                        </h3>
                        <GoalForm action={updateGoal} goal={goal} />
                        <p className="mt-4 text-sm text-textSoft">
                          Clique novamente em Editar para fechar.
                        </p>
                      </div>
                    </div>
                  </details>
                  <form action={deleteGoal}>
                    <input type="hidden" name="id" value={goal.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg border border-danger/30 px-3 py-2 text-sm text-danger transition hover:bg-danger/10"
                    >
                      <Trash2 className="size-4" />
                      Excluir
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
