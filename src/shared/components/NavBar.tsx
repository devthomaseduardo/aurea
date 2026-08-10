import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
import { BrandLogo } from '@/design-system/components/BrandLogo';
import { cn } from '@/shared/utils/utils';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: ROUTES.home, label: 'Início' },
    { to: ROUTES.services, label: 'Recursos' },
    { to: ROUTES.about, label: 'Sobre' },
    { to: ROUTES.catalog, label: 'Como funciona' },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden md:block border-b border-slate-800 bg-slate-900 text-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between text-[11px] font-medium">
          <p>{APP_CONFIG.name} · Precifique, proponha e feche contratos</p>
          <Link to={ROUTES.auth.login} className="hover:text-amber-300 transition-colors font-semibold">
            Área do profissional
          </Link>
        </div>
      </div>

      <nav
        className={cn(
          'w-full border-b transition-all duration-200 bg-white border-slate-200',
          scrolled && 'shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-6 h-[4.25rem] flex items-center justify-between">
          <BrandLogo to={ROUTES.home} />

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'px-3.5 py-2 text-[13px] font-bold rounded-lg transition-colors',
                    isActive
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-800 hover:text-indigo-600 hover:bg-slate-50'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.auth.login}
              className="hidden sm:inline-flex h-9 items-center px-3.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Entrar
            </Link>

            <Link
              to={ROUTES.auth.register}
              className="hidden sm:inline-flex h-9 items-center px-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
            >
              Começar grátis
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-5 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-800 hover:text-indigo-600"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <Link
                to={ROUTES.auth.login}
                onClick={() => setIsMenuOpen(false)}
                className="h-10 rounded-lg border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-800"
              >
                Entrar
              </Link>
              <Link
                to={ROUTES.auth.register}
                onClick={() => setIsMenuOpen(false)}
                className="h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold"
              >
                Começar grátis
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
