import { Link } from 'react-router-dom';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import Hero from '@/shared/components/Hero';
import { KoboyoIcon } from '@/design-system/icons';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

const features = [
  {
    icon: 'calculator',
    title: 'Calculadora de orcamento',
    desc: 'Wizard multi-etapas: escopo, tecnologias, custos, horas e margem com validacao.',
  },
  {
    icon: 'file-text',
    title: 'Propostas profissionais',
    desc: 'Gere PDF, acompanhe status, duplique e envie propostas com carta e assinatura.',
  },
  {
    icon: 'users',
    title: 'Clientes e contratos',
    desc: 'CRM leve com historico por cliente e pipeline de contratos vinculados as propostas.',
  },
  {
    icon: 'bar-chart',
    title: 'Dashboard e analytics',
    desc: 'Receita, horas, lucro e breakdown de status para enxergar o funil comercial.',
  },
  {
    icon: 'plug',
    title: 'Integracoes',
    desc: 'Conectores para Google, GitHub, Stripe, Slack, Notion e WhatsApp com teste na UI.',
  },
  {
    icon: 'shield',
    title: 'Auth e dados seguros',
    desc: 'Firebase Auth (e-mail, Google, GitHub) + Firestore multi-usuario, ou modo local para demo.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Defina o escopo',
    desc: 'Informacoes do projeto, tecnologias e complexidade.',
  },
  {
    num: '02',
    title: 'Calcule o orcamento',
    desc: 'Horas, custos indiretos e margem de forma transparente.',
  },
  {
    num: '03',
    title: 'Gere a proposta',
    desc: 'PDF profissional pronto para enviar ao cliente.',
  },
  {
    num: '04',
    title: 'Feche e acompanhe',
    desc: 'Status, contratos e historico no mesmo painel.',
  },
];

const audience = [
  'Freelancers de desenvolvimento, design e consultoria',
  'Agencias e estudios com pipeline de propostas',
  'Consultores que precificam por projeto ou hora',
  'Times pequenos que querem sair do Excel',
];

const stats = [
  { value: '4+', label: 'Modulos comerciais' },
  { value: 'PDF', label: 'Propostas prontas' },
  { value: 'B2B', label: 'Foco em servicos' },
  { value: 'Local', label: 'ou Firebase' },
];

export default function Landing() {
  return (
    <LandingLayout>
      <Hero />

      {/* Stats strip */}
      <section className="border-b border-gray-200 bg-slate-50/80">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{s.value}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="recursos" className="py-20 sm:py-24 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5 md:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Recursos
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Tudo para operar o comercial sem planilha
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Da precificacao ao fechamento: {APP_CONFIG.name} centraliza o fluxo que freelancers e
              consultores precisam no dia a dia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all space-y-4"
              >
                <span className="inline-flex items-center justify-center size-11 rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-colors">
                  <KoboyoIcon name={f.icon} size={20} />
                </span>
                <h3 className="font-semibold text-slate-900 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 sm:py-24 bg-slate-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  Fluxo
                </span>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Como funciona</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Quatro passos do escopo ao contrato, no mesmo workspace.
                </p>
              </div>
              <div className="space-y-5">
                {steps.map((s, i) => (
                  <div key={s.num} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="size-10 rounded-full bg-indigo-600 text-amber-200 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                        {s.num}
                      </span>
                      {i < steps.length - 1 && (
                        <span className="w-px flex-1 bg-indigo-200 mt-2 min-h-[1.25rem]" />
                      )}
                    </div>
                    <div className="pb-2">
                      <h3 className="font-semibold text-slate-900 text-sm">{s.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-amber-400/10 blur-xl" />
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg shadow-slate-900/5">
                  <img
                    src={APP_CONFIG.brand.product}
                    alt="Workspace com laptop e analytics"
                    className="w-full h-72 sm:h-96 object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-20 sm:py-24 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-bl from-indigo-500/10 to-transparent blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg shadow-slate-900/5">
                <img
                  src={APP_CONFIG.brand.team}
                  alt="Equipe em colaboracao"
                  className="w-full h-72 sm:h-80 object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Para quem
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Feito para quem vende servico e precisa de clareza no preco
              </h2>
              <ul className="space-y-3">
                {audience.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 inline-flex items-center justify-center size-5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                      <KoboyoIcon name="check" size={12} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={ROUTES.auth.register}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Criar conta gratis
                <KoboyoIcon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 relative overflow-hidden bg-slate-900 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 80% at 80% 40%, rgb(79 70 229 / 0.4), transparent 55%), radial-gradient(ellipse 40% 50% at 10% 80%, rgb(212 160 23 / 0.15), transparent)',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-5 md:px-8 text-center space-y-7">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Pare de precificar no improviso
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            Use {APP_CONFIG.name} para orcar com metodo, enviar propostas profissionais e manter o
            historico de cada cliente organizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
            <Link
              to={ROUTES.auth.register}
              className="h-11 px-6 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/25"
            >
              Comecar gratis
              <KoboyoIcon name="arrow-right" size={16} />
            </Link>
            <Link
              to={ROUTES.auth.login}
              className="h-11 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm inline-flex items-center justify-center border border-white/20 transition-colors"
            >
              Ja tenho conta
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
