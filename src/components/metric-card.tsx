import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/ui";

type MetricCardProps = {
  title: string;
  value: string;
  helper?: string;
  icon: LucideIcon;
  tone?: "brand" | "gold" | "rose" | "cyan";
};

const tones = {
  brand: "border-brand/25 bg-brand/10 text-brand",
  gold: "border-gold/25 bg-gold/10 text-gold",
  rose: "border-danger/25 bg-danger/10 text-danger",
  cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
};

export function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = "brand"
}: MetricCardProps) {
  return (
    <div className="rounded-lg border border-line bg-panel/90 p-4 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-textSoft">{title}</p>
          <p className="mt-2 truncate text-2xl font-semibold text-white">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg border",
            tones[tone]
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
      {helper ? <p className="mt-3 text-sm text-textSoft">{helper}</p> : null}
    </div>
  );
}
