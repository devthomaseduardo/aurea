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
    { to: ROUTES.home, label: 'Início' },
    { to: ROUTES.services, label: 'Recursos' },
    { to: ROUTES.about, label: 'Sobre' },
    { to: ROUTES.catalog, label: 'Como funciona' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
      <nav className={cn('w-full border-b border-[rgba(55,53,47,0.09)]', scrolled && 'shadow-[var(--elevation-sm)]')}>
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-12 flex items-center justify-between">
          <BrandLogo to={ROUTES.home} size="sm" />
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'px-2.5 py-1 text-[13px] rounded-md transition-colors',
                    isActive
                      ? 'bg-[rgba(55,53,47,0.08)] text-[#37352f] font-medium'
                      : 'text-[#787774] hover:bg-[rgba(55,53,47,0.08)] hover:text-[#37352f]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-1.5">
            <Link to={ROUTES.auth.login} className="hidden sm:inline-flex h-8 items-center px-2.5 text-[13px] text-[#787774] hover:text-[#37352f] rounded-md notion-hover">
              Entrar
            </Link>
            <Link to={ROUTES.auth.register} className="hidden sm:inline-flex btn-aurea-primary h-8 text-[13px]">
              Começar
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md text-[#37352f] notion-hover"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMenuOpen}
            >
              <KoboyoIcon name={isMenuOpen ? 'x' : 'menu'} size={18} />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[rgba(55,53,47,0.09)] bg-white px-5 py-3 space-y-0.5">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 text-[13px] text-[#37352f] rounded-md notion-hover">
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-1.5">
              <Link to={ROUTES.auth.login} onClick={() => setIsMenuOpen(false)} className="btn-aurea-secondary h-9">Entrar</Link>
              <Link to={ROUTES.auth.register} onClick={() => setIsMenuOpen(false)} className="btn-aurea-primary h-9">Começar grátis</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
