import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { ROUTES } from '@/core/config/app.config';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#inicio', label: 'Início' },
    { href: '#como-funciona', label: 'Como Funciona' },
    { href: ROUTES.app.calculator, label: 'Calculadora', isRoute: true },
    { href: ROUTES.designSystem, label: 'Design System', isRoute: true },
  ];

  return (
    <nav
      className={`w-full py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[hsl(222,84%,4.9%)]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_40px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <a href="#inicio" className="flex items-center gap-2 group">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(243,75%,66%), hsl(213,90%,60%))',
          }}
        >
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          <span className="gradient-text-subtle">Calcula</span>
          <span className="gradient-text">Freela</span>
        </span>
      </a>

      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) =>
          link.isRoute ? (
            <Link
              key={link.href}
              to={link.href}
              className="relative px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.05]"
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.05]"
            >
              {link.label}
            </a>
          )
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link
          to={ROUTES.app.dashboard}
          className="hidden md:inline-flex btn-primary text-white text-sm px-5 py-2.5"
        >
          <Zap className="w-3.5 h-3.5" />
          Entrar no app
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="animate-slide-down absolute top-full left-0 right-0 glass-card border-t border-b border-white/[0.06] py-6 px-6 flex flex-col gap-2 md:hidden">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-3 text-base font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/[0.05] transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-base font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/[0.05] transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            )
          )}
          <Link
            to={ROUTES.app.dashboard}
            className="btn-primary text-white text-sm px-5 py-3 mt-2 justify-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <Zap className="w-4 h-4" />
            Entrar no app
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
