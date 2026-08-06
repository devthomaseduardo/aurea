import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Search, Wrench } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
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
    { href: '#status', label: 'Consultar OS' },
    { href: '#servicos', label: 'Serviços Técnico' },
    { href: '#garantia', label: 'Garantia 90 Dias' },
    { href: '#contato', label: 'Contato & Endereço' },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden md:block border-b border-border bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between text-[11px]">
          <p>{APP_CONFIG.name} · Assistência Técnica Especializada em Celulares, Tablets & Venda de Acessórios</p>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/5511987654321" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              WhatsApp: (11) 98765-4321
            </a>
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
                className="nav-link px-3.5 py-2 text-[13px] font-medium rounded-md text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.statusPortal}
              className="hidden sm:inline-flex h-9 items-center px-3 text-[13px] font-semibold text-primary border border-primary/30 rounded-md hover:bg-primary/5 transition-colors gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Consultar OS
            </Link>

            <Link
              to={ROUTES.auth.login}
              className="hidden sm:inline-flex btn-primary h-9 text-[13px] px-4 gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              Painel do Técnico
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
          <div className="lg:hidden border-t border-border bg-white px-5 py-4 flex flex-col gap-2 animate-slide-down">
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
              to={ROUTES.statusPortal}
              className="btn-outline text-sm px-4 py-2 mt-1 justify-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="w-4 h-4" /> Consultar Status da OS
            </Link>
            <Link
              to={ROUTES.app.dashboard}
              className="btn-primary text-sm px-4 py-2 justify-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Wrench className="w-4 h-4" /> Acessar Sistema
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
