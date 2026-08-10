import { Link } from 'react-router-dom';
import { KoboyoIcon } from '@/design-system/icons';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';

const highlights = [
  { icon: 'calculator', title: 'Precificacao', desc: 'Escopo, horas, custos e margem' },
  { icon: 'file-text', title: 'Propostas', desc: 'PDF, status e historico' },
  { icon: 'users', title: 'Clientes', desc: 'CRM leve e contratos' },
];

const Hero = () => {
  return (
    <section id="inicio" className="relative overflow-hidden bg-white border-b border-gray-200">
      {/* soft gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 50% -20%, rgb(79 70 229 / 0.12), transparent 60%), radial-gradient(ellipse 40% 40% at 100% 50%, rgb(212 160 23 / 0.08), transparent)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="lg:col-span-6 space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-xs font-medium text-indigo-700">
              <span className="size-1.5 rounded-full bg-indigo-500" />
              Plataforma comercial B2B
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 tracking-tight leading-[1.15]">
              Precifique projetos, gere propostas e feche contratos com{' '}
              <span className="text-indigo-600">clareza</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {APP_CONFIG.name} organiza orcamento, proposta e pipeline em um so lugar. Menos
              planilha, mais fechamento.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to={ROUTES.auth.register}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-sm shadow-indigo-600/20 transition-colors"
              >
                Comecar gratis
                <KoboyoIcon name="arrow-right" size={16} />
              </Link>
              <Link
                to={ROUTES.auth.login}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-slate-800 text-sm font-semibold transition-colors"
              >
                Entrar
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              Sem cartao de credito. Demo local ou Firebase em minutos.
            </p>
          </div>

          {/* Visual */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-transparent to-amber-400/20 blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl shadow-slate-900/5 bg-white">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-100 bg-gray-50/80">
                  <span className="size-2.5 rounded-full bg-rose-400" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-[11px] font-medium text-slate-400 truncate">
                    {APP_CONFIG.name} / dashboard
                  </span>
                </div>
                <img
                  src={APP_CONFIG.brand.hero}
                  alt="Workspace profissional"
                  className="w-full h-56 sm:h-72 object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Highlight cards */}
        <div className="mt-16 grid sm:grid-cols-3 gap-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all"
            >
              <span className="inline-flex items-center justify-center size-10 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                <KoboyoIcon name={item.icon} size={18} />
              </span>
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
