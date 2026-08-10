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

      {/* Recursos */}
      <section id="recursos" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-10">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Recursos</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tudo para operar o comercial sem planilha
            </h2>
            <p className="text-sm text-slate-600">
              Da precificação ao fechamento: {APP_CONFIG.name} centraliza o fluxo que freelancers e
              consultores precisam no dia a dia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-10">
          <div className="text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Fluxo</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Como funciona
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="space-y-3">
                <span className="w-9 h-9 rounded-full bg-indigo-600 text-amber-300 font-black text-sm flex items-center justify-center">
                  {s.num}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quem */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Para quem</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Feito para quem vende serviço e precisa de clareza no preço
              </h2>
              <ul className="space-y-2 text-sm text-slate-700">
                {[
                  'Freelancers de desenvolvimento, design e consultoria',
                  'Agências e estúdios com pipeline de propostas',
                  'Consultores que precificam por projeto ou hora',
                  'Times pequenos que querem sair do Excel',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
              <p className="text-sm font-bold text-slate-900">Modo demo sem Firebase</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rode localmente com dados em localStorage. Quando estiver pronto, configure
                Firebase Auth + Firestore e use o mesmo app em produção.
              </p>
              <Link
                to={ROUTES.auth.register}
                className="inline-flex h-10 items-center gap-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
              >
                Criar conta
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-5 md:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Pare de precificar no improviso
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Use {APP_CONFIG.name} para orçar com método, enviar propostas profissionais e manter o
            histórico de cada cliente organizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={ROUTES.auth.register}
              className="h-11 px-6 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm inline-flex items-center justify-center gap-2"
            >
              Começar grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={ROUTES.auth.login}
              className="h-11 px-6 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-sm inline-flex items-center justify-center border border-white/20"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
