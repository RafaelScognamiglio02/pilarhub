import Link from "next/link";
import { FileDown } from "lucide-react";

export function ReportButton() {
  return (
    <Link
      href="/relatorio-mensal"
      className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
    >
      <FileDown className="size-4" />
      Baixar PDF
    </Link>
  );
}
