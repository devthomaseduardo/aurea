import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
import { BrandLogo } from '@/design-system/components/BrandLogo';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#171614] px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <BrandLogo className="[&_span]:text-white" />
            <p className="mt-5 max-w-md text-sm leading-7 text-white/38">Precificação, proposta e contrato conectados ao mesmo contexto comercial.</p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-white/48">
            <Link to={`${ROUTES.home}#recursos`} className="transition hover:text-white">Produto</Link>
            <Link to={`${ROUTES.home}#como-funciona`} className="transition hover:text-white">Fluxo</Link>
            <Link to={ROUTES.about} className="transition hover:text-white">Sobre</Link>
            <Link to={ROUTES.auth.login} className="inline-flex items-center gap-1.5 text-[#f6a576] transition hover:text-white">Entrar <ArrowUpRight className="size-3" /></Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 text-[10px] uppercase tracking-[0.11em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {APP_CONFIG.legalName}</p>
          <p>{APP_CONFIG.tagline}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
