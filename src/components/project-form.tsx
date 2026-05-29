import type { Project } from "@prisma/client";
import { Save } from "lucide-react";
import { Field, inputClass } from "@/components/form-field";

const statuses = ["Planejamento", "Ativo", "Pausado", "Validando", "Concluído", "Cancelado"];

type ProjectFormProps = {
  action: (formData: FormData) => Promise<void>;
  project?: Project;
};

export function ProjectForm({ action, project }: ProjectFormProps) {
  return (
    <form action={action} className="space-y-4">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <input type="hidden" name="revenueAmount" value={project?.revenueAmount ?? 0} />

      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Projeto">
          <input
            required
            name="name"
            defaultValue={project?.name ?? ""}
            placeholder="Ex: ChurchConnect"
            className={inputClass}
          />
        </Field>
        <Field label="Categoria">
          <input
            required
            name="category"
            defaultValue={project?.category ?? ""}
            placeholder="Produto digital, e-commerce..."
            className={inputClass}
          />
        </Field>
        <Field label="Status">
          <select
            required
            name="status"
            defaultValue={project?.status ?? "Ativo"}
            className={inputClass}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Investido acumulado">
        <input
          required
          type="number"
          step="0.01"
          min="0"
          name="investedAmount"
          defaultValue={project?.investedAmount ?? 0}
          className={inputClass}
        />
      </Field>

      <Field label="Observações">
        <input
          name="notes"
          defaultValue={project?.notes ?? ""}
          placeholder="Opcional"
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
      >
        <Save className="size-4" />
        {project ? "Salvar projeto" : "Cadastrar projeto"}
      </button>
    </form>
  );
}
