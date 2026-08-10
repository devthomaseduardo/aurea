import type { ReactNode } from 'react';
import { BrandLogo } from '@/design-system/components/BrandLogo';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const flow = [
  ['01', 'Cliente', 'Centralize contexto e histórico comercial.'],
  ['02', 'Precificação', 'Transforme escopo em preço com margem.'],
  ['03', 'Proposta', 'Apresente valor e acompanhe a decisão.'],
  ['04', 'Contrato', 'Formalize o fechamento no mesmo fluxo.'],
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-svh flex bg-slate-50">
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-slate-950 text-white p-10 xl:p-14 flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsla(239,84%,57%,0.32),transparent_52%)]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 bg-amber-400/10 blur-3xl rounded-full" />

        <div className="relative z-10">
          <BrandLogo to={ROUTES.home} className="[&_span]:text-white" />
        </div>

        <div className="relative z-10 max-w-md space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300 mb-3">
              Workspace comercial para serviços B2B
            </p>
            <h2 className="text-3xl xl:text-4xl font-semibold tracking-tight leading-tight mb-4">
              Do primeiro contato ao contrato, sem perder contexto no caminho.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              O Áurea conecta clientes, precificação, propostas e contratos em um processo único para quem vende projetos e serviços profissionais.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {flow.map(([number, label, description]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <span className="text-[10px] font-semibold tracking-wider text-amber-300">{number}</span>
                <p className="mt-2 text-sm font-semibold text-white">{label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          {APP_CONFIG.legalName} · v{APP_CONFIG.version}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <BrandLogo to={ROUTES.home} />
          </div>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>}
          </div>
          <div className="app-panel p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
