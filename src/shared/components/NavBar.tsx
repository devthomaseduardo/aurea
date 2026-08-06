import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, PhoneCall, ArrowRight, Wrench } from 'lucide-react';
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
    { href: '#inicio', label: 'Início' },
    { href: '#servicos', label: 'Serviços' },
    { href: '#aparelhos', label: 'Aparelhos' },
    { href: '#status', label: 'Consultar OS' },
    { href: '#garantia', label: 'Garantia' },
    { href: '#loja', label: 'Nossa Loja' },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Utility Top Bar */}
      <div className="hidden md:block border-b border-[#E5E7EB] bg-[#0B1633] text-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between text-[11px] font-medium">
          <p>{APP_CONFIG.name} · Assistência Técnica Especializada Multimarcas em São Paulo</p>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/5511987654321"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFD100] transition-colors flex items-center gap-1 font-bold"
            >
              <PhoneCall className="w-3 h-3 text-[#25D366]" /> WhatsApp: (11) 98765-4321
            </a>
          </div>
        </div>
      </div>

      <nav
        className={cn(
          'w-full border-b transition-all duration-200 bg-white border-[#E5E7EB]',
          scrolled && 'shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-6 h-[4.25rem] flex items-center justify-between">
          {/* Logo Esquerda */}
          <BrandLogo to={ROUTES.home} />

          {/* Links Centro */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-[13px] font-bold text-[#0B1633] hover:text-[#0055FF] hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Botões Direita */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20um%20orçamento"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex h-9 items-center px-3.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl shadow-sm transition-colors gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white" />
              WhatsApp
            </a>

            <a
              href="#status"
              className="hidden sm:inline-flex h-9 items-center px-3.5 text-xs font-bold text-white bg-[#0055FF] hover:bg-[#0044CC] rounded-xl shadow-sm transition-colors gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-[#FFD100]" />
              Consultar OS
            </a>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#0B1633]"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[#E5E7EB] bg-white px-5 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm font-bold text-[#0B1633] hover:text-[#0055FF]"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
              <a
                href="https://wa.me/5511987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cambuci-whatsapp justify-center text-xs"
              >
                <PhoneCall className="w-4 h-4" /> WhatsApp: (11) 98765-4321
              </a>
              <a
                href="#status"
                onClick={() => setIsMenuOpen(false)}
                className="btn-cambuci-primary justify-center text-xs"
              >
                <Search className="w-4 h-4 text-[#FFD100]" /> Consultar Minha OS
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
