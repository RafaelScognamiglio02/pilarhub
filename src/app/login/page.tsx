import { ArrowRight, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { login, register } from "@/app/login/actions";
import { PilarLogo } from "@/components/pilar-logo";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d0d26] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_50%,rgba(45,212,191,0.16),transparent_34rem),radial-gradient(circle_at_72%_24%,rgba(99,102,241,0.15),transparent_28rem)]" />
      <div className="absolute inset-y-0 right-0 w-px bg-brand/60" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <section className="flex min-h-[46rem] flex-col justify-center">
          <PilarLogo
            markClassName="size-10 bg-white/5"
            textClassName="[&_p:first-child]:text-white/60"
          />

          <div className="mt-24 max-w-3xl">
            <h1 className="text-5xl font-black leading-[1.05] tracking-normal text-white sm:text-6xl">
              Bem-vindo ao
              <span className="block text-brand">PilarHub.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-slate-400">
              Organize dinheiro, cartões, investimentos, metas e projetos em um
              painel financeiro claro, privado e pronto para decisões melhores.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-lg">
            <div className="rounded-lg border border-white/8 bg-[#11112d]/80 p-8 shadow-2xl backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
                Entrar
              </p>
              <h2 className="mt-3 text-4xl font-black text-white">Acesse sua conta</h2>
              <p className="mt-3 text-lg text-slate-400">
                Continue acompanhando seus indicadores financeiros.
              </p>

              <form action={login} className="mt-8 space-y-5">
                <Field label="Email" icon={<Mail className="size-5" />}>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="voce@email.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Senha" icon={<Lock className="size-5" />}>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </Field>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-slate-400">
                    <input type="checkbox" className="size-4 accent-brand" />
                    Lembrar de mim
                  </label>
                  <span className="text-brand">Esqueceu a senha?</span>
                </div>

                <button className="group flex w-full items-center justify-center gap-3 rounded-lg bg-brand px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-teal-300">
                  Entrar
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </button>
              </form>
            </div>

            <details className="mt-5 rounded-lg border border-white/8 bg-white/[0.03] p-5">
              <summary className="cursor-pointer list-none text-center text-sm text-slate-400">
                Não tem uma conta?{" "}
                <span className="font-semibold text-brand">Cadastre-se agora</span>
              </summary>
              <form action={register} className="mt-6 space-y-4">
                <Field label="Nome" icon={<UserRound className="size-5" />}>
                  <input
                    name="name"
                    required
                    placeholder="Seu nome"
                    className={inputClass}
                  />
                </Field>
                <Field label="Email" icon={<Mail className="size-5" />}>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="voce@email.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Senha" icon={<ShieldCheck className="size-5" />}>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="mínimo 6 caracteres"
                    className={inputClass}
                  />
                </Field>
                <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-brand/40 px-5 py-3 text-sm font-black text-brand transition hover:bg-brand/10">
                  Criar conta
                  <ArrowRight className="size-4" />
                </button>
              </form>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/8 bg-white/[0.03] px-12 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand";

function Field({
  label,
  icon,
  children
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>
        {children}
      </span>
    </label>
  );
}
