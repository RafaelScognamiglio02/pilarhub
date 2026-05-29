import type { Transaction } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";
import { deleteTransaction, updateTransaction } from "@/app/lancamentos/actions";
import { inputDate, labelize, money } from "@/lib/format";
import { TransactionForm } from "./transaction-form";

type TransactionTableProps = {
  transactions: Transaction[];
  editable?: boolean;
  responsibles?: string[];
  cards?: string[];
  projects?: string[];
};

export function TransactionTable({
  transactions,
  editable = false,
  responsibles,
  cards,
  projects
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line p-8 text-center text-sm text-textSoft">
        Nenhum lançamento encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.14em] text-textSoft">
            <th className="px-3 py-2">Data</th>
            <th className="px-3 py-2">Descrição</th>
            <th className="px-3 py-2">Tipo</th>
            <th className="px-3 py-2">Responsável</th>
            <th className="px-3 py-2">Cartão</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 text-right">Valor</th>
            {editable ? <th className="px-3 py-2">Ações</th> : null}
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item.id} className="align-top">
              <td className="rounded-l-lg border-y border-l border-line bg-panelSoft px-3 py-3 text-sm text-textSoft">
                {inputDate(item.date).split("-").reverse().join("/")}
              </td>
              <td className="border-y border-line bg-panelSoft px-3 py-3">
                <p className="font-medium text-white">{item.description}</p>
                <p className="mt-1 text-xs text-textSoft">{item.category}</p>
              </td>
              <td className="border-y border-line bg-panelSoft px-3 py-3 text-sm text-textSoft">
                {labelize(item.type)}
              </td>
              <td className="border-y border-line bg-panelSoft px-3 py-3 text-sm text-textSoft">
                {item.responsible}
              </td>
              <td className="border-y border-line bg-panelSoft px-3 py-3 text-sm text-textSoft">
                {labelize(item.card)}
              </td>
              <td className="border-y border-line bg-panelSoft px-3 py-3">
                <span className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-white">
                  {labelize(item.status)}
                </span>
              </td>
              <td className="border-y border-line bg-panelSoft px-3 py-3 text-right font-semibold text-white">
                {money(item.amount)}
              </td>
              {editable ? (
                <td className="rounded-r-lg border-y border-r border-line bg-panelSoft px-3 py-3">
                  <div className="flex items-center gap-2">
                    <details className="group relative">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-textSoft transition hover:text-white">
                        <Pencil className="size-4" />
                        Editar
                      </summary>
                      <div className="fixed inset-0 z-20 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
                        <div className="mx-auto mt-8 max-w-5xl rounded-lg border border-line bg-panel p-5 shadow-2xl">
                          <h3 className="mb-4 text-lg font-semibold text-white">
                            Editar lançamento
                          </h3>
                          <TransactionForm
                            action={updateTransaction}
                            transaction={item}
                            responsibles={responsibles}
                            cards={cards}
                            projects={projects}
                          />
                          <p className="mt-4 text-sm text-textSoft">
                            Clique novamente em Editar para fechar.
                          </p>
                        </div>
                      </div>
                    </details>
                    <form action={deleteTransaction}>
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
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
