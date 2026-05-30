import { Database, ShieldCheck, SlidersHorizontal, Trash2 } from "lucide-react";
import {
  clearCurrentMonthTransactions,
  updateTemplateSettings
} from "@/app/configuracoes/actions";
import { Field, inputClass } from "@/components/form-field";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { currentMonthRange } from "@/lib/finance";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ConfiguracoesPage() {
  const user = await requireUser();
  const { start, end } = currentMonthRange();
  const settings = await getSettings(user.id);
  const [
    transactions,
    investments,
    projects,
    goals,
    currentMonthTransactions,
    recurringTransactions,
    installmentTransactions
  ] = await Promise.all([
    prisma.transaction.count({ where: { userId: user.id } }),
    prisma.investment.count({ where: { userId: user.id } }),
    prisma.project.count({ where: { userId: user.id } }),
    prisma.goal.count({ where: { userId: user.id } }),
    prisma.transaction.count({
      where: {
        userId: user.id,
        date: { gte: start, lte: end },
        isRecurring: false,
        installmentGroupId: null
      }
    }),
    prisma.transaction.count({ where: { userId: user.id, isRecurring: true } }),
    prisma.transaction.count({ where: { userId: user.id, installmentGroupId: { not: null } } })
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Local"
        title="Configurações"
        description="Resumo do site local, banco SQLite e manutenção mensal."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Banco" value="SQLite local" icon={Database} />
        <MetricCard title="Autenticação" value="Desativada" icon={ShieldCheck} tone="gold" />
        <MetricCard title="Backend externo" value="Nenhum" icon={SlidersHorizontal} tone="cyan" />
      </div>

      <SectionCard className="mt-6" title="Dados locais">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Lançamentos" value={transactions} />
          <Info label="Investimentos" value={investments} />
          <Info label="Projetos" value={projects} />
          <Info label="Metas" value={goals} />
        </div>
      </SectionCard>

      <SectionCard
        className="mt-6"
        title="Personalização do template"
        description="Altere os nomes, cartões e projetos para adaptar este template a outra pessoa."
      >
        <form action={updateTemplateSettings} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Nome do controle">
              <input
                name="brandName"
                defaultValue={settings.brandName}
                className={inputClass}
              />
            </Field>
            <Field label="Pessoa principal">
              <input
                name="ownerName"
                defaultValue={settings.ownerName}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Pessoa parceira">
              <input
                name="partnerName"
                defaultValue={settings.partnerName}
                className={inputClass}
              />
            </Field>
            <Field label="Nome para contas divididas">
              <input
                name="sharedName"
                defaultValue={settings.sharedName}
                className={inputClass}
              />
            </Field>
            <Field label="Nome para terceiros">
              <input
                name="thirdPartyName"
                defaultValue={settings.thirdPartyName}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Cartões, separados por vírgula">
              <input
                name="cardsCsv"
                defaultValue={settings.cardsCsv}
                placeholder="Nubank,Inter,Itaú,Outro"
                className={inputClass}
              />
            </Field>
            <Field label="Projetos, separados por vírgula">
              <input
                name="projectsCsv"
                defaultValue={settings.projectsCsv}
                placeholder="Nenhum,Projeto A,Projeto B"
                className={inputClass}
              />
            </Field>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
          >
            Salvar personalização
          </button>
        </form>
      </SectionCard>

      <SectionCard
        className="mt-6"
        title="Limpar mês"
        description="Remove apenas lançamentos comuns do mês atual. Recorrências e parcelas futuras ficam preservadas."
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <Info label="Lançamentos comuns do mês" value={currentMonthTransactions} />
          <Info label="Recorrentes preservados" value={recurringTransactions} />
          <Info label="Parcelas preservadas" value={installmentTransactions} />
        </div>
        <form action={clearCurrentMonthTransactions} className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="block max-w-sm">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-textSoft">
              Digite LIMPAR para confirmar
            </span>
            <input
              name="confirm"
              placeholder="LIMPAR"
              className="w-full rounded-lg border border-line bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-danger/30 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/10"
          >
            <Trash2 className="size-4" />
            Limpar lançamentos do mês
          </button>
        </form>
      </SectionCard>

      <SectionCard
        className="mt-6"
        title="Abrir o site"
        description="O site foi preparado para inicializar Prisma, banco e seed pelo script de desenvolvimento."
      >
        <div className="space-y-2 rounded-lg border border-line bg-slate-950/70 p-4 font-mono text-sm text-textSoft">
          <p>npm install</p>
          <p>npm run dev</p>
          <p>http://localhost:3000</p>
          <p>npx prisma studio</p>
        </div>
      </SectionCard>
    </>
  );
}

function Info({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-panelSoft p-4">
      <p className="text-sm text-textSoft">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
