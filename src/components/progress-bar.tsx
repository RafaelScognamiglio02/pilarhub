import { ratio } from "@/lib/format";

type ProgressBarProps = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(value, 1));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-textSoft">{label}</span>
        <span className="font-medium text-white">{ratio(safeValue)}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${safeValue * 100}%` }}
        />
      </div>
    </div>
  );
}
