import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, FileText, Users } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';

const Hero = () => {
  return (
    <section id="inicio" className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgb(79 70 229 / 0.12), transparent)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 md:px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 text-left space-y-7">
            <span className="badge-aurea">Plataforma comercial B2B</span>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-slate-900 tracking-tight leading-[1.08]">
              Precifique projetos, gere propostas e{' '}
              <span className="text-indigo-600">feche contratos</span> com clareza.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
              {APP_CONFIG.name} é o SaaS para freelancers, consultores e agências saírem da
              planilha: orçamento estruturado, proposta profissional e pipeline comercial em um só
              lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link to={ROUTES.auth.register} className="btn-aurea-primary">
                Começar grátis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={ROUTES.auth.login} className="btn-aurea-secondary">
                Entrar na conta
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              Demo local sem Firebase · Auth Google / GitHub em produção
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-[var(--elevation-lg)]">
              <img
                src={APP_CONFIG.brand.hero}
                alt="Escritório moderno — foto real Unsplash"
                className="w-full h-64 sm:h-80 lg:h-[360px] object-cover"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-5 pt-16">
                <p className="text-sm font-semibold text-white">Do escopo ao contrato</p>
                <p className="text-xs text-slate-200 mt-1">
                  Calculadora · PDF de proposta · status e histórico por cliente
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Calculator,
              title: 'Precificação',
              desc: 'Wizard com escopo, horas, custos e margem',
            },
            {
              icon: FileText,
              title: 'Propostas',
              desc: 'PDF profissional, status e assinatura',
            },
            {
              icon: Users,
              title: 'Clientes & pipeline',
              desc: 'CRM leve, contratos e analytics',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm p-4 shadow-[var(--elevation-sm)]"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 ring-1 ring-indigo-100">
                <item.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
