export const inputClass =
  "w-full rounded-lg border border-line bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand";

export function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-textSoft">
        {label}
      </span>
      {children}
    </label>
  );
}
