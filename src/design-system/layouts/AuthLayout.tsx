import type { ReactNode } from 'react';
import { BrandLogo } from '@/design-system/components/BrandLogo';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-svh flex bg-slate-50">
      <div className="hidden lg:flex lg:w-[44%] relative overflow-hidden bg-slate-900 text-white p-10 flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsla(239,84%,57%,0.35),transparent_55%)]" />
        <div className="relative z-10">
          <BrandLogo to={ROUTES.home} className="[&_span]:text-white" />
        </div>
        <div className="relative z-10 max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300 mb-3">
            Aurea Enterprise
          </p>
          <h2 className="text-3xl font-semibold tracking-tight leading-tight mb-3">
            Seu workspace comercial, com dados reais por conta
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Clientes, propostas, contratos e plugins ficam isolados por usuário.
            Pronto para evoluir para SSO e OAuth reais.
          </p>
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
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>
            )}
          </div>
          <div className="app-panel p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
