import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Lock, LineChart } from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

const Hero = () => {
  return (
    <section id="inicio" className="relative bg-white border-b border-border overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(214_28%_92%/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(214_28%_92%/0.5)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 pt-16 md:pt-20 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-6 text-center lg:text-left">
            <p className="animate-fade-up inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary mb-5">
              <Building2 className="w-3.5 h-3.5" />
              Plataforma comercial empresarial
            </p>

            <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.08] tracking-tight text-slate-900 mb-5 text-balance">
              Operação comercial com
              <span className="text-primary"> padrão enterprise</span>
              {' '}para profissionais independentes
            </h1>

            <p className="animate-fade-up delay-200 text-[15px] md:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Centralize precificação, propostas, clientes e contratos em um único workspace.
              Padronize o ciclo comercial com a disciplina de um software B2B corporativo.
            </p>

            <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <Link to={ROUTES.app.dashboard} className="btn-primary text-sm h-11 px-6">
                Acessar a plataforma
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#plataforma"
                className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Conhecer a plataforma
              </a>
            </div>

            <div className="animate-fade-up delay-400 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 border-t border-border pt-6">
              {[
                { value: '6', label: 'Etapas de precificação' },
                { value: '100%', label: 'Rastreabilidade' },
                { value: 'B2B', label: 'Fluxo corporativo' },
              ].map((item) => (
                <div key={item.label} className="text-left">
                  <p className="text-lg font-semibold text-slate-900 tabular-nums">{item.value}</p>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 animate-fade-up delay-200">
            <div className="relative">
              <div className="rounded-xl border border-slate-200 bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="ml-2 text-[11px] font-medium text-slate-500">
                    app.aurea · operations console
                  </span>
                </div>
                <img
                  src={APP_CONFIG.brand.product}
                  alt="Console operacional Aurea"
                  className="w-full h-auto object-cover max-h-[360px]"
                  loading="eager"
                />
              </div>

              <div className="absolute -bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-64 rounded-lg border border-slate-200 bg-white p-3.5 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    <LineChart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      Pipeline
                    </p>
                    <p className="text-sm font-semibold text-slate-900">Taxa de aceitação 67%</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Auditoria de propostas ativa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
