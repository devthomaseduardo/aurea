import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { ROUTES } from '@/core/config/app.config';
import { BrandLogo } from '@/design-system/components/BrandLogo';

const navLinks = [
  { to: `${ROUTES.home}#recursos`, label: 'Produto' },
  { to: `${ROUTES.home}#como-funciona`, label: 'Fluxo' },
  { to: ROUTES.about, label: 'Sobre' },
];

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 rounded-full border border-black/[0.06] bg-white/88 p-1.5 shadow-[0_10px_35px_rgba(24,22,19,.07)] backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-6">
          <div className="flex h-10 items-center rounded-full px-3">
            <BrandLogo to={ROUTES.home} size="sm" />
          </div>
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-[13px] font-medium text-black/58 transition-colors duration-300 hover:text-black">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to={ROUTES.auth.login} className="px-3 text-[13px] font-medium text-black/48 transition hover:text-black">Entrar</Link>
          <Link to={ROUTES.auth.register} className="group inline-flex h-10 items-center gap-3 rounded-full bg-[#171614] pl-5 pr-1.5 text-[13px] font-medium text-white transition hover:bg-[#f26522]">
            Comecar agora
            <span className="flex size-7 items-center justify-center rounded-full bg-white text-black">
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </Link>
        </div>

        <button type="button" onClick={() => setIsMenuOpen((open) => !open)} className="flex size-10 items-center justify-center rounded-full bg-[#171614] text-white md:hidden" aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}>
          {isMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-black/35 p-3 backdrop-blur-sm md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="mt-auto rounded-[28px] bg-[#f8f6f1] p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/35">Navegacao</p>
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className="block py-2 font-medium text-[28px] leading-tight tracking-[-0.04em] text-[#171614]">{link.label}</Link>
              ))}
            </div>
            <div className="mt-7 grid grid-cols-2 gap-2">
              <Link to={ROUTES.auth.login} onClick={() => setIsMenuOpen(false)} className="inline-flex h-11 items-center justify-center rounded-full bg-black/[0.05] text-sm font-semibold text-black">Entrar</Link>
              <Link to={ROUTES.auth.register} onClick={() => setIsMenuOpen(false)} className="inline-flex h-11 items-center justify-center rounded-full bg-[#f26522] text-sm font-semibold text-white">Criar conta</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
