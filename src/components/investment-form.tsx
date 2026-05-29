import type { Investment } from "@prisma/client";
import { Save } from "lucide-react";
import { Field, inputClass } from "@/components/form-field";
import { labelize } from "@/lib/format";

const categories = [
  "Reserva",
  "Renda_Fixa",
  "ETF",
  "Acoes",
  "FII",
  "Cripto",
  "Caixa"
];

type InvestmentFormProps = {
  action: (formData: FormData) => Promise<void>;
  investment?: Investment;
};

export function InvestmentForm({ action, investment }: InvestmentFormProps) {
  return (
    <form action={action} className="space-y-4">
      {investment ? <input type="hidden" name="id" value={investment.id} /> : null}

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Ativo">
          <input
            required
            name="asset"
            defaultValue={investment?.asset ?? ""}
            placeholder="Ex: BTC, MXRF11, Tesouro Selic"
            className={inputClass}
          />
        </Field>
        <Field label="Categoria">
          <select
            name="category"
            defaultValue={investment?.category ?? "Caixa"}
            className={inputClass}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {labelize(item)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <Field label="Quantidade">
          <input
            required
            type="number"
            step="0.00000001"
            min="0"
            name="quantity"
            defaultValue={investment?.quantity ?? 1}
            className={inputClass}
          />
        </Field>
        <Field label="Preço médio">
          <input
            required
            type="number"
            step="0.00000001"
            min="0"
            name="averagePrice"
            defaultValue={investment?.averagePrice ?? 0}
            className={inputClass}
          />
        </Field>
        <Field label="Valor investido">
          <input
            type="number"
            step="0.01"
            min="0"
            name="investedAmount"
            defaultValue={investment?.investedAmount ?? 0}
            className={inputClass}
          />
        </Field>
        <Field label="Preço atual">
          <input
            required
            type="number"
            step="0.00000001"
            min="0"
            name="currentPrice"
            defaultValue={investment?.currentPrice ?? 0}
            className={inputClass}
          />
        </Field>
        <Field label="Valor atual">
          <input
            type="number"
            step="0.01"
            min="0"
            name="currentValue"
            defaultValue={investment?.currentValue ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Observações">
        <input
          name="notes"
          defaultValue={investment?.notes ?? ""}
          placeholder="Opcional"
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
      >
        <Save className="size-4" />
        {investment ? "Salvar investimento" : "Cadastrar investimento"}
      </button>
    </form>
  );
}
