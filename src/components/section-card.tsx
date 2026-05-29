import { cn } from "@/lib/ui";

type SectionCardProps = {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function SectionCard({
  title,
  description,
  className,
  children
}: SectionCardProps) {
  return (
    <section className={cn("rounded-lg border border-line bg-panel p-5", className)}>
      {title || description ? (
        <div className="mb-4">
          {title ? <h3 className="text-lg font-semibold text-white">{title}</h3> : null}
          {description ? (
            <p className="mt-1 text-sm leading-6 text-textSoft">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
