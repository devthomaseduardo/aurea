import { Link } from 'react-router-dom';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import Hero from '@/shared/components/Hero';
import {
  Calculator,
  FileText,
  Users,
  BarChart3,
  Plug,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

const features = [
  {
    icon: Calculator,
    title: 'Calculadora de orçamento',
    desc: 'Wizard multi-etapas: escopo, tecnologias, custos, horas e margem com validação Zod.',
  },
  {
    icon: FileText,
    title: 'Propostas profissionais',
    desc: 'Gere PDF, acompanhe status, duplique e envie propostas com carta e assinatura.',
  },
  {
    icon: Users,
    title: 'Clientes e contratos',
    desc: 'CRM leve com histórico por cliente e pipeline de contratos vinculados às propostas.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard e analytics',
    desc: 'Receita, horas, lucro e breakdown de status para enxergar o funil comercial.',
  },
  {
    icon: Plug,
    title: 'Integrações',
    desc: 'Conectores para Google, GitHub, Stripe, Slack, Notion e WhatsApp com teste na UI.',
  },
  {
    icon: Shield,
    title: 'Auth e dados seguros',
    desc: 'Firebase Auth (e-mail, Google, GitHub) + Firestore multi-usuário, ou modo local para demo.',
  },
];

const steps = [
  { num: '1', title: 'Defina o escopo', desc: 'Informações do projeto, tecnologias e complexidade.' },
  { num: '2', title: 'Calcule o orçamento', desc: 'Horas, custos indiretos e margem de forma transparente.' },
  { num: '3', title: 'Gere a proposta', desc: 'PDF profissional pronto para enviar ao cliente.' },
  { num: '4', title: 'Feche e acompanhe', desc: 'Status, contratos e histórico no mesmo painel.' },
];

export default function Landing() {
  return (
    <LandingLayout>
      <Hero />

      <section id="recursos" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="badge-aurea">Recursos</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Tudo para operar o comercial sem planilha
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Da precificação ao fechamento: {APP_CONFIG.name} centraliza o fluxo que freelancers e
              consultores precisam no dia a dia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card-aurea p-6 space-y-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="badge-aurea">Fluxo</span>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Como funciona</h2>
              </div>
              <div className="space-y-6">
                {steps.map((s) => (
                  <div key={s.num} className="flex gap-4">
                    <span className="w-9 h-9 rounded-full bg-indigo-600 text-amber-300 font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                      {s.num}
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{s.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-[var(--elevation-md)]">
                <img
                  src={APP_CONFIG.brand.product}
                  alt="Workspace com laptop e analytics — Unsplash"
                  className="w-full h-72 sm:h-96 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden border border-slate-200 shadow-[var(--elevation-md)]">
              <img
                src={APP_CONFIG.brand.team}
                alt="Equipe em colaboração — Unsplash"
                className="w-full h-72 sm:h-80 object-cover"
                loading="lazy"
              />
            </div>

            <div className="order-1 lg:order-2 space-y-5 text-left">
              <span className="badge-aurea">Para quem</span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Feito para quem vende serviço e precisa de clareza no preço
              </h2>
              <ul className="space-y-3 text-sm text-slate-700">
                {[
                  'Freelancers de desenvolvimento, design e consultoria',
                  'Agências e estúdios com pipeline de propostas',
                  'Consultores que precificam por projeto ou hora',
                  'Times pequenos que querem sair do Excel',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden bg-slate-900 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 80% at 80% 50%, rgb(79 70 229 / 0.35), transparent)',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-5 md:px-6 text-center space-y-7">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Pare de precificar no improviso
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            Use {APP_CONFIG.name} para orçar com método, enviar propostas profissionais e manter o
            histórico de cada cliente organizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={ROUTES.auth.register}
              className="h-11 px-6 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              Começar grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={ROUTES.auth.login}
              className="h-11 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm inline-flex items-center justify-center border border-white/20 transition-colors"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
