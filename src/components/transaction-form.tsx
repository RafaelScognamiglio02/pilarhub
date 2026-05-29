import type { Transaction } from "@prisma/client";
import { Save } from "lucide-react";
import { Field, inputClass } from "@/components/form-field";
import { inputDate, labelize } from "@/lib/format";
import { cn } from "@/lib/ui";

const types = ["entrada", "saida", "a_receber", "investimento"];
const paymentMethods = ["conta", "cartao", "pix", "dinheiro", "debito"];
const statuses = ["pendente", "pago", "recebido", "cancelado"];

type TransactionFormProps = {
  action: (formData: FormData) => Promise<void>;
  transaction?: Transaction;
  compact?: boolean;
  responsibles?: string[];
  cards?: string[];
  projects?: string[];
};

export function TransactionForm({
  action,
  transaction,
  compact = false,
  responsibles = ["Rafael", "Siliane", "Ambos", "Terceiros"],
  cards = ["Caixa", "Itau", "PicPay", "Outro"],
  projects = ["Nenhum"]
}: TransactionFormProps) {
  const cardOptions = ["", ...cards.filter(Boolean)];
  const projectOptions = projects.includes("Nenhum") ? projects : ["Nenhum", ...projects];

  return (
    <form action={action} className="space-y-4">
      {transaction ? <input type="hidden" name="id" value={transaction.id} /> : null}

      <div
        className={cn(
          "grid gap-3",
          compact ? "md:grid-cols-3" : "md:grid-cols-4"
        )}
      >
        <Field label="Data">
          <input
            required
            type="date"
            name="date"
            defaultValue={inputDate(transaction?.date) || inputDate(new Date())}
            className={inputClass}
          />
        </Field>
        <Field label="Tipo">
          <select
            name="type"
            defaultValue={transaction?.type ?? "saida"}
            className={inputClass}
          >
            {types.map((item) => (
              <option key={item} value={item}>
                {labelize(item)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Categoria">
          <input
            required
            name="category"
            defaultValue={transaction?.category ?? ""}
            placeholder="Mercado, salário, cartão..."
            className={inputClass}
          />
        </Field>
        <Field label="Valor">
          <input
            required
            type="number"
            min="0"
            step="0.01"
            name="amount"
            defaultValue={transaction?.amount ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Descrição">
          <input
            required
            name="description"
            defaultValue={transaction?.description ?? ""}
            placeholder="Ex: salário, aluguel, fatura..."
            className={inputClass}
          />
        </Field>
        <Field label="Observações">
          <input
            name="notes"
            defaultValue={transaction?.notes ?? ""}
            placeholder="Opcional"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <Field label="Responsável">
          <select
            name="responsible"
            defaultValue={transaction?.responsible ?? responsibles[0] ?? ""}
            className={inputClass}
          >
            {responsibles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Pagamento">
          <select
            name="paymentMethod"
            defaultValue={transaction?.paymentMethod ?? "cartao"}
            className={inputClass}
          >
            {paymentMethods.map((item) => (
              <option key={item} value={item}>
                {labelize(item)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Cartão">
          <select
            name="card"
            defaultValue={transaction?.card ?? ""}
            className={inputClass}
          >
            {cardOptions.map((item) => (
              <option key={item || "none"} value={item}>
                {item ? labelize(item) : "Nenhum"}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Projeto">
          <select
            name="project"
            defaultValue={transaction?.project ?? "Nenhum"}
            className={inputClass}
          >
            {projectOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={transaction?.status ?? "pendente"}
            className={inputClass}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {labelize(item)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_160px_160px]">
        <label className="flex min-h-16 items-center gap-3 rounded-lg border border-line bg-slate-950/40 px-3 py-2">
          <input
            type="checkbox"
            name="isRecurring"
            defaultChecked={transaction?.isRecurring ?? false}
            className="size-4 accent-brand"
          />
          <span>
            <span className="block text-sm font-medium text-white">
              Despesa recorrente
            </span>
            <span className="text-xs text-textSoft">
              Preservada ao limpar o mês
            </span>
          </span>
        </label>
        <Field label="Parcela atual">
          <input
            type="number"
            min="1"
            step="1"
            name="installmentNumber"
            defaultValue={transaction?.installmentNumber ?? 1}
            className={inputClass}
          />
        </Field>
        <Field label="Total parcelas">
          <input
            type="number"
            min="1"
            step="1"
            name="installmentTotal"
            defaultValue={transaction?.installmentTotal ?? 1}
            className={inputClass}
          />
        </Field>
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
      >
        <Save className="size-4" />
        {transaction ? "Salvar alterações" : "Cadastrar lançamento"}
      </button>
    </form>
  );
}
