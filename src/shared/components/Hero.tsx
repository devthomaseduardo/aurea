import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, FileText, Users } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';

const Hero = () => {
  return (
    <section id="inicio" className="bg-slate-50 border-b border-slate-200 pt-10 pb-14">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block">
              Plataforma comercial B2B
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Precifique projetos, gere propostas e feche contratos com clareza.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {APP_CONFIG.name} é o SaaS para freelancers, consultores e agências saírem da planilha:
              orçamento estruturado, proposta profissional e pipeline comercial em um só lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                to={ROUTES.auth.register}
                className="h-11 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                Começar grátis
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={ROUTES.auth.login}
                className="h-11 px-6 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200 shadow-sm"
              >
                Entrar na conta
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md">
              <img
                src={APP_CONFIG.brand.hero}
                alt="Áurea — plataforma de precificação e propostas comerciais"
                className="w-full h-72 sm:h-80 lg:h-[340px] object-cover"
              />
              <div className="p-4 bg-white border-t border-slate-200 space-y-2">
                <p className="text-sm font-bold text-slate-900">Do escopo ao contrato</p>
                <p className="text-xs text-slate-500">
                  Calculadora multi-etapas · PDF de proposta · status e histórico por cliente
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 grid sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Precificação</p>
              <p className="text-xs text-slate-500 mt-0.5">Wizard com escopo, horas, custos e margem</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Propostas</p>
              <p className="text-xs text-slate-500 mt-0.5">PDF profissional, status e assinatura</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Clientes & pipeline</p>
              <p className="text-xs text-slate-500 mt-0.5">CRM leve, contratos e analytics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
