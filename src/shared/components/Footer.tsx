
import React from 'react';
import { Zap, Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    produto: [
      { label: 'Como Funciona', href: '#como-funciona' },
      { label: 'Dashboard', href: '/app/dashboard' },
      { label: 'Calculadora', href: '/app/calculator' },
      { label: 'Design System', href: '/design-system' },
    ],
    legal: [
      { label: 'Termos de Uso', href: '#' },
      { label: 'Privacidade', href: '#' },
    ],
  };

  const socials = [
    { label: 'GitHub', href: '#', icon: Github },
    { label: 'Twitter', href: '#', icon: Twitter },
    { label: 'LinkedIn', href: '#', icon: Linkedin },
    { label: 'Email', href: 'mailto:contato@calculafreela.com.br', icon: Mail },
  ];

  return (
    <footer
      id="contato"
      className="relative pt-20 pb-10 px-6 md:px-12 overflow-hidden"
    >
      {/* Top divider with glow */}
      <div className="absolute top-0 inset-x-0">
        <div className="section-divider" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(120,100,255,0.4) 50%, transparent)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-16">

          {/* Brand */}
          <div>
            <a href="#inicio" className="flex items-center gap-2 mb-5 group w-fit">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(243,75%,66%), hsl(213,90%,60%))' }}
              >
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="gradient-text-subtle">Calcula</span>
                <span className="gradient-text">Freela</span>
              </span>
            </a>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs mb-8">
              Ferramenta premium para freelancers calcularem orçamentos com precisão, profissionalismo e velocidade.
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(120,100,255,0.15)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(120,100,255,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Produto */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
              Produto
            </h4>
            <ul className="space-y-3">
              {links.produto.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/45 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              {links.legal.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/45 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="section-divider mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            &copy; {currentYear} CalculaFreela. Feito com dedicação para a comunidade freelancer.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/25 text-xs">Sistema operacional</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
