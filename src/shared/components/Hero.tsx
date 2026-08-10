import { Link } from 'react-router-dom';
import { KoboyoIcon } from '@/design-system/icons';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';

const Hero = () => {
  return (
    <section id="inicio" className="border-b border-[rgba(55,53,47,0.09)] bg-white pt-14 pb-16">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <span className="badge-aurea">Plataforma comercial</span>
            <h1 className="text-[2rem] sm:text-[2.5rem] font-semibold text-[#37352f] tracking-tight leading-[1.15]">
              Precifique projetos, gere propostas e feche contratos com clareza.
            </h1>
            <p className="text-[15px] text-[#787774] leading-relaxed max-w-lg">
              {APP_CONFIG.name} organiza orçamento, proposta e pipeline em um só lugar — com a calma visual de um workspace limpo.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link to={ROUTES.auth.register} className="btn-aurea-primary">
                Começar grátis
                <KoboyoIcon name="arrow-right" size={16} />
              </Link>
              <Link to={ROUTES.auth.login} className="btn-aurea-secondary">
                Entrar
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-md overflow-hidden border border-[rgba(55,53,47,0.09)] bg-[#f7f6f3]">
              <img src={APP_CONFIG.brand.hero} alt="Workspace" className="w-full h-56 sm:h-64 object-cover" loading="eager" />
            </div>
          </div>
        </div>
        <div className="mt-14 grid sm:grid-cols-3 gap-3">
          {[
            { icon: 'calculator', title: 'Precificação', desc: 'Escopo, horas, custos e margem' },
            { icon: 'file-text', title: 'Propostas', desc: 'PDF, status e histórico' },
            { icon: 'users', title: 'Clientes', desc: 'CRM leve e contratos' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-md border border-[rgba(55,53,47,0.09)] p-4 notion-hover transition-colors">
              <KoboyoIcon name={item.icon} size={20} className="text-[#37352f] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#37352f]">{item.title}</p>
                <p className="text-xs text-[#787774] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
