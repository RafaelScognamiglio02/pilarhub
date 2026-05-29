import { cn } from "@/lib/ui";

type PilarLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
};

export function PilarLogo({
  className,
  markClassName,
  textClassName,
  showText = true
}: PilarLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex size-11 items-center justify-center rounded-lg border border-brand/35 bg-brand/10 shadow-glow",
          markClassName
        )}
      >
        <svg
          viewBox="0 0 40 40"
          aria-hidden="true"
          className="size-7 text-brand"
          fill="none"
        >
          <path
            d="M10 31V12.5C10 10.6 11.6 9 13.5 9h7.2c5.9 0 9.8 3.4 9.8 8.6 0 5.1-3.9 8.5-9.8 8.5h-4.2V31H10Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 20.8h4.1c2.5 0 4.1-1.2 4.1-3.2s-1.6-3.1-4.1-3.1h-4.1v6.3Z"
            fill="currentColor"
          />
          <path
            d="M8 32h24"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText ? (
        <div className={cn("leading-none", textClassName)}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            Pilar
          </p>
          <p className="mt-1 text-lg font-black text-white">PilarHub</p>
        </div>
      ) : null}
    </div>
  );
}
