import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { KoboyoIcon } from '@/design-system/icons';
import { ROUTES } from '@/core/config/app.config';
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
    { to: ROUTES.home, label: 'Inicio' },
    { to: `${ROUTES.home}#recursos`, label: 'Recursos' },
    { to: `${ROUTES.home}#como-funciona`, label: 'Como funciona' },
    { to: ROUTES.about, label: 'Sobre' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
      <nav
        className={cn(
          'w-full border-b border-gray-200 transition-shadow',
          scrolled && 'shadow-sm'
        )}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <BrandLogo to={ROUTES.home} size="sm" />

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.to === ROUTES.home
                  ? location.pathname === ROUTES.home && !location.hash
                  : location.pathname + location.hash === link.to ||
                    (link.to.includes('#') && location.hash === link.to.split('#')[1]);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'px-3 py-1.5 text-[13px] rounded-lg transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
              className="hidden sm:inline-flex h-9 items-center px-3 text-[13px] font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Entrar
            </Link>
            <Link
              to={ROUTES.auth.register}
              className="hidden sm:inline-flex h-9 items-center px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold transition-colors"
            >
              Comecar
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden size-9 flex items-center justify-center rounded-lg text-slate-800 hover:bg-slate-50 transition-colors"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMenuOpen}
            >
              <KoboyoIcon name={isMenuOpen ? 'x' : 'menu'} size={18} />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-5 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2.5 px-3 text-[13px] text-slate-800 rounded-lg hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to={ROUTES.auth.login}
                onClick={() => setIsMenuOpen(false)}
                className="h-10 inline-flex items-center justify-center rounded-xl border border-gray-200 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Entrar
              </Link>
              <Link
                to={ROUTES.auth.register}
                onClick={() => setIsMenuOpen(false)}
                className="h-10 inline-flex items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Comecar gratis
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
