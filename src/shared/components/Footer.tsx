import { Link } from 'react-router-dom';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
import { BrandLogo } from '@/design-system/components/BrandLogo';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <BrandLogo />

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
            <Link to={ROUTES.services} className="hover:text-indigo-600">
              Recursos
            </Link>
            <Link to={ROUTES.about} className="hover:text-indigo-600">
              Sobre
            </Link>
            <Link to={ROUTES.catalog} className="hover:text-indigo-600">
              Como funciona
            </Link>
            <Link to={ROUTES.auth.login} className="hover:text-indigo-600">
              Entrar
            </Link>
          </div>

          <Link
            to={ROUTES.auth.login}
            className="text-xs text-slate-500 hover:text-indigo-600 font-semibold shrink-0"
          >
            Área do profissional
          </Link>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
          <p>
            © {year} {APP_CONFIG.legalName}. Todos os direitos reservados.
          </p>
          <p>{APP_CONFIG.tagline}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
