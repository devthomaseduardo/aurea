import { Link } from 'react-router-dom';
import { PhoneCall, Instagram, Mail, ShieldCheck, Lock } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
import { BrandLogo } from '@/design-system/components/BrandLogo';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E5E7EB] bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Logo e Resumo */}
          <div className="md:col-span-4 space-y-3">
            <BrandLogo />
            <p className="text-xs text-slate-600 leading-relaxed font-medium max-w-sm">
              Assistência técnica multimarcas especializada em smartphones e tablets. Orçamentos sem compromisso e acompanhamento digital de ordens de serviço.
            </p>
            <p className="text-xs text-slate-500 font-semibold">
              São Paulo - SP · CNPJ: 42.189.902/0001-88
            </p>
          </div>

          {/* Links Principais */}
          <div className="md:col-span-3">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#0B1633] mb-3">
              Navegação
            </p>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li><a href="#servicos" className="hover:text-[#0055FF]">Serviços</a></li>
              <li><a href="#status" className="hover:text-[#0055FF]">Consultar OS</a></li>
              <li><a href="#garantia" className="hover:text-[#0055FF]">Garantia 90 Dias</a></li>
              <li><a href="#loja" className="hover:text-[#0055FF]">Contato & Loja Física</a></li>
              <li><a href="#garantia" className="hover:text-[#0055FF]">Política de Privacidade</a></li>
              <li><a href="#garantia" className="hover:text-[#0055FF]">Termos de Serviço</a></li>
            </ul>
          </div>

          {/* Contato Direct */}
          <div className="md:col-span-3">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#0B1633] mb-3">
              Contato & Redes
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              <li>
                <a
                  href="https://wa.me/5511987654321"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#0055FF]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp: (11) 98765-4321
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#0055FF]">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" /> @cambuci.mobile
                </a>
              </li>
              <li>
                <a href="mailto:contato@cambucimobile.com.br" className="flex items-center gap-2 hover:text-[#0055FF]">
                  <Mail className="w-3.5 h-3.5 text-[#0055FF]" /> contato@cambucimobile.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Entrada Discreta Área da Equipe */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0B1633] mb-3">
                Acesso Restrito
              </p>
              <Link
                to={ROUTES.auth.login}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B1633] font-bold text-xs transition-colors border border-[#E5E7EB]"
              >
                <Lock className="w-3.5 h-3.5 text-[#0055FF]" /> Área da Equipe
              </Link>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <p>© {year} {APP_CONFIG.legalName}. Todos os direitos reservados.</p>
          <p>Cambuci Mobile — Sistema da Assistência Técnica</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
