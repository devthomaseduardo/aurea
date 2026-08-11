import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '@/design-system/components/BrandLogo';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const flow = [
  ['01', 'Cliente'],
  ['02', 'Precificacao'],
  ['03', 'Proposta'],
  ['04', 'Contrato'],
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-svh bg-[#efede8] lg:grid lg:grid-cols-[1.04fr_.96fr]">
      <div className="relative hidden min-h-svh overflow-hidden bg-[#171614] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute -right-28 top-20 size-[36rem] rounded-full bg-[#f26522] opacity-90" />
        <div className="absolute right-6 top-28 size-[27rem] rounded-[43%_57%_54%_46%/46%_39%_61%_54%] bg-[#f0ece5] opacity-95 blur-[3px] [transform:rotate(18deg)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_38%,rgba(255,255,255,.08)_59%,transparent_74%)]" />

        <div className="relative z-10">
          <BrandLogo to={ROUTES.home} className="[&_span]:text-white" />
        </div>

        <div className="relative z-10 max-w-xl pb-8">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">Workspace comercial para servicos B2B</p>
          <h2 className="max-w-[10ch] text-[clamp(2.8rem,5vw,5.6rem)] font-medium leading-[0.9] tracking-[-0.055em] text-white">
            Feche melhor. Sem perder contexto no caminho.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/48">
            {APP_CONFIG.name} conecta cada etapa da venda para voce saber onde esta, quanto vale e qual e o proximo passo.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {flow.map(([number, label]) => (
              <div key={label}>
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#f6a576]">{number}</span>
                <p className="mt-1.5 text-xs font-medium text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-white/22">
          <span>{APP_CONFIG.legalName}</span>
          <span>v{APP_CONFIG.version}</span>
        </div>
      </div>

      <div className="flex min-h-svh items-center justify-center px-4 py-10 sm:px-6 lg:min-h-0">
        <div className="w-full max-w-[460px]">
          <div className="mb-9 flex items-center justify-between lg:hidden">
            <BrandLogo to={ROUTES.home} />
            <a href={ROUTES.home} className="flex size-10 items-center justify-center rounded-full bg-[#171614] text-white"><ArrowUpRight className="size-4" /></a>
          </div>

          <div className="mb-7">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/35">Acesse seu workspace</p>
            <h1 className="text-[clamp(2.2rem,6vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[#171614]">{title}</h1>
            {subtitle && <p className="mt-3 max-w-sm text-sm leading-6 text-black/46">{subtitle}</p>}
          </div>

          <div className="rounded-[28px] border border-black/[0.06] bg-white/76 p-5 shadow-[0_24px_70px_rgba(38,31,24,.07)] backdrop-blur-sm sm:p-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
