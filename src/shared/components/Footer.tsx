import { Link } from 'react-router-dom';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
import { BrandLogo } from '@/design-system/components/BrandLogo';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-12">
          <div className="col-span-2 md:col-span-5">
            <BrandLogo className="mb-4" />
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed mb-4">
              {APP_CONFIG.description}
            </p>
            <p className="text-xs text-slate-500">
              Contato empresarial:{' '}
              <a
                href={`mailto:${APP_CONFIG.supportEmail}`}
                className="text-primary font-medium hover:underline"
              >
                {APP_CONFIG.supportEmail}
              </a>
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-3">
              Plataforma
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.app.dashboard} className="text-hover">
                  Console
                </Link>
              </li>
              <li>
                <Link to={ROUTES.app.calculator} className="text-hover">
                  Precificação
                </Link>
              </li>
              <li>
                <Link to={ROUTES.app.proposals} className="text-hover">
                  Propostas
                </Link>
              </li>
              <li>
                <Link to={ROUTES.app.clients} className="text-hover">
                  Clientes
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-3">
              Empresa
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#plataforma" className="text-hover">
                  Sobre o produto
                </a>
              </li>
              <li>
                <a href="#seguranca" className="text-hover">
                  Governança
                </a>
              </li>
              <li>
                <Link to={ROUTES.designSystem} className="text-hover">
                  Design System
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-3">
              Legal
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Termos de uso</li>
              <li>Política de privacidade</li>
              <li>Segurança da informação</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {year} {APP_CONFIG.legalName}. Todos os direitos reservados.
          </p>
          <p>
            v{APP_CONFIG.version} · {APP_CONFIG.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
