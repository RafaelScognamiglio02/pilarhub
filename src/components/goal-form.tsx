import type { Goal } from "@prisma/client";
import { Save } from "lucide-react";
import { Field, inputClass } from "@/components/form-field";
import { inputDate } from "@/lib/format";

type GoalFormProps = {
  action: (formData: FormData) => Promise<void>;
  goal?: Goal;
};

export function GoalForm({ action, goal }: GoalFormProps) {
  return (
    <form action={action} className="space-y-4">
      {goal ? <input type="hidden" name="id" value={goal.id} /> : null}

      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Meta">
          <input
            required
            name="name"
            defaultValue={goal?.name ?? ""}
            placeholder="Ex: Reserva de emergência"
            className={inputClass}
          />
        </Field>
        <Field label="Categoria">
          <input
            required
            name="category"
            defaultValue={goal?.category ?? ""}
            placeholder="Segurança, projetos..."
            className={inputClass}
          />
        </Field>
        <Field label="Valor alvo">
          <input
            required
            type="number"
            step="0.01"
            min="0"
            name="targetAmount"
            defaultValue={goal?.targetAmount ?? 0}
            className={inputClass}
          />
        </Field>
        <Field label="Valor atual">
          <input
            required
            type="number"
            step="0.01"
            min="0"
            name="currentAmount"
            defaultValue={goal?.currentAmount ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-[220px_1fr]">
        <Field label="Prazo">
          <input
            type="date"
            name="deadline"
            defaultValue={inputDate(goal?.deadline)}
            className={inputClass}
          />
        </Field>
        <Field label="Observações">
          <input
            name="notes"
            defaultValue={goal?.notes ?? ""}
            placeholder="Opcional"
            className={inputClass}
          />
        </Field>
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
      >
        <Save className="size-4" />
        {goal ? "Salvar meta" : "Cadastrar meta"}
      </button>
    </form>
  );
}
