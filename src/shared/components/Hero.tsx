import { Link } from 'react-router-dom';
import { KoboyoIcon } from '@/design-system/icons';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';

const workflow = [
  { label: 'Cliente', detail: 'TechCorp Brasil', state: 'Contexto centralizado' },
  { label: 'Precificacao', detail: 'R$ 28.400', state: 'Margem calculada' },
  { label: 'Proposta', detail: 'Landing + Dashboard', state: 'Enviada' },
  { label: 'Contrato', detail: 'Aguardando aceite', state: 'Proximo passo' },
];

const Hero = () => {
  return (
    <section id="inicio" className="relative overflow-hidden bg-white border-b border-gray-200">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 50% -20%, rgb(79 70 229 / 0.12), transparent 60%), radial-gradient(ellipse 40% 40% at 100% 50%, rgb(212 160 23 / 0.08), transparent)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-xs font-medium text-indigo-700">
              <span className="size-1.5 rounded-full bg-indigo-500" />
              Operacao comercial para servicos B2B
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 tracking-tight leading-[1.15]">
              Do escopo ao contrato, sem perder margem nem contexto.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {APP_CONFIG.name} conecta cliente, precificacao, proposta e contrato em um unico fluxo
              para freelancers, consultores e pequenas agencias.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to={ROUTES.auth.register}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-sm shadow-indigo-600/20 transition-colors"
              >
                Criar workspace
                <KoboyoIcon name="arrow-right" size={16} />
              </Link>
              <Link
                to={ROUTES.auth.login}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-slate-800 text-sm font-semibold transition-colors"
              >
                Explorar demo
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              Use localmente para demonstracao ou conecte Firebase para persistencia em nuvem.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-transparent to-amber-400/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Fluxo comercial</p>
                    <p className="text-[11px] text-slate-500">Projeto Website B2B</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                    Em negociacao
                  </span>
                </div>

                <div className="p-4 sm:p-5 space-y-2.5">
                  {workflow.map((item, index) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-xl border border-slate-200 px-3 py-3"
                    >
                      <span className="flex size-7 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-slate-500">{item.label}</p>
                        <p className="truncate text-sm font-semibold text-slate-900">{item.detail}</p>
                      </div>
                      <span className="hidden sm:block text-[10px] font-medium text-slate-500">
                        {item.state}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 border-t border-slate-200 bg-slate-50/70">
                  <div className="px-4 py-3 border-r border-slate-200">
                    <p className="text-[10px] text-slate-500">Valor</p>
                    <p className="text-sm font-semibold text-slate-900">R$ 28,4 mil</p>
                  </div>
                  <div className="px-4 py-3 border-r border-slate-200">
                    <p className="text-[10px] text-slate-500">Margem</p>
                    <p className="text-sm font-semibold text-slate-900">32%</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[10px] text-slate-500">Prazo</p>
                    <p className="text-sm font-semibold text-slate-900">19 dias</p>
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
