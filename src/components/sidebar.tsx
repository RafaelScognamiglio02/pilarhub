"use client";

import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  Settings,
  LogOut,
  Target,
  Wallet
} from "lucide-react";
import { PilarLogo } from "@/components/pilar-logo";
import { cn } from "@/lib/ui";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lancamentos", label: "Lançamentos", icon: Wallet },
  { href: "/cartoes", label: "Cartões", icon: CreditCard },
  { href: "/investimentos", label: "Investimentos", icon: BarChart3 },
  { href: "/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/configuracoes", label: "Configurações", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-line/80 bg-panel/90 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <PilarLogo className="px-2" />

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-brand text-slate-950"
                  : "text-textSoft hover:bg-panelSoft hover:text-white"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="mt-8 hidden rounded-lg border border-line bg-panelSoft p-4 lg:block">
        <p className="text-sm font-medium text-white">Conta privada</p>
        <p className="mt-1 text-sm leading-6 text-textSoft">
          Dados separados por conta em banco Postgres.
        </p>
      </div>

      <a
        href="/logout"
        className="mt-4 hidden items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-textSoft transition hover:bg-panelSoft hover:text-white lg:flex"
      >
        <LogOut className="size-4" />
        Sair
      </a>
    </aside>
  );
}
