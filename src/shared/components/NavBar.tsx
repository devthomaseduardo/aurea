import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/core/config/app.config';
import { BrandLogo } from '@/design-system/components/BrandLogo';
import { cn } from '@/shared/utils/utils';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#plataforma', label: 'Plataforma' },
    { href: '#solucoes', label: 'Soluções' },
    { href: '#processo', label: 'Processo' },
    { href: '#seguranca', label: 'Governança' },
    { href: '#resultados', label: 'Resultados' },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Enterprise utility bar */}
      <div className="hidden md:block border-b border-border bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between text-[11px] text-muted-foreground">
          <p>Aurea Enterprise · Precificação · Propostas · Pipeline comercial</p>
          <div className="flex items-center gap-4">
            <a href="mailto:enterprise@aurea.app" className="hover:text-foreground transition-colors">
              enterprise@aurea.app
            </a>
            <Link to={ROUTES.designSystem} className="hover:text-foreground transition-colors">
              Design System
            </Link>
          </div>
        </div>
      </div>

      <nav
        className={cn(
          'w-full border-b transition-all duration-200',
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-border shadow-sm'
            : 'bg-white border-border'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-6 h-[4.25rem] flex items-center justify-between">
          <BrandLogo to={ROUTES.home} />

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link px-3.5 py-2 text-[13px] font-medium rounded-md"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.auth.login}
              className="hidden sm:inline-flex h-9 items-center px-3.5 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
            >
              Acessar conta
            </Link>
            <Link
              to={ROUTES.auth.register}
              className="hidden sm:inline-flex btn-primary h-9 text-[13px] px-4"
            >
              Criar workspace
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md border border-border bg-white text-slate-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-white px-5 py-4 flex flex-col gap-1 animate-slide-down">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              to={ROUTES.app.dashboard}
              className="btn-primary text-sm px-4 py-2.5 mt-2 justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Acessar plataforma
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
