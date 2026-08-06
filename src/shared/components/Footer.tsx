import { Link } from 'react-router-dom';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
import { BrandLogo } from '@/design-system/components/BrandLogo';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E5E7EB] bg-white py-10">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#E5E7EB]">
          
          <BrandLogo />

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-[#667085]">
            <a href="#servicos" className="hover:text-[#0055FF]">Serviços</a>
            <a href="#status" className="hover:text-[#0055FF]">Consultar OS</a>
            <a href="#garantia" className="hover:text-[#0055FF]">Garantia</a>
            <a href="#loja" className="hover:text-[#0055FF]">Contato</a>
            <a href="#garantia" className="hover:text-[#0055FF]">Política de Privacidade</a>
            <a href="#garantia" className="hover:text-[#0055FF]">Termos</a>
          </div>

          <Link
            to={ROUTES.auth.login}
            className="text-xs text-[#667085] hover:text-[#0055FF] font-semibold flex items-center gap-1 shrink-0"
          >
            • Área da equipe
          </Link>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#667085] font-medium">
          <p>© {year} {APP_CONFIG.legalName}. Todos os direitos reservados.</p>
          <p>Av. Lins de Vasconcelos, 1200 — Cambuci, São Paulo SP</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
