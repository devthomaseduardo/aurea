import { Link } from 'react-router-dom';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

const steps = [
  {
    num: '01',
    title: 'Cadastre-se ou use o modo local',
    desc: 'Crie conta com e-mail, Google ou GitHub. Sem Firebase configurado, o app roda em modo demo com localStorage.',
  },
  {
    num: '02',
    title: 'Monte o orçamento',
    desc: 'Na calculadora, defina escopo, tecnologias, custos e margem. O resultado vira base da proposta.',
  },
  {
    num: '03',
    title: 'Gere e envie a proposta',
    desc: 'Exporte PDF, acompanhe status e mantenha o histórico vinculado ao cliente.',
  },
  {
    num: '04',
    title: 'Feche contratos e acompanhe',
    desc: 'Use o pipeline de contratos, o dashboard e o analytics para ver o funil comercial.',
  },
];

export default function CatalogPage() {
  return (
    <LandingLayout>
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-5 md:px-6 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-slate-800 px-3.5 py-1 rounded-full border border-slate-700 inline-block">
            Como funciona
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Do escopo ao contrato em quatro passos
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto">
            Fluxo pensado para o dia a dia de freelancers e consultores que vendem por projeto.
          </p>
        </div>
      </section>

      <section className="py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-5 md:px-6 space-y-8">
          <div className="space-y-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex gap-5 items-start"
              >
                <span className="text-2xl font-black text-indigo-600 tabular-nums shrink-0">{s.num}</span>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-3">
            <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Stack aberta e documentada
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              React, TypeScript, Vite, Tailwind, Zustand, TanStack Query, Firebase Auth + Firestore.
              Deploy em Vercel ou Docker. Veja o README do repositório para instalação local.
            </p>
          </div>

          <div className="text-center space-y-4 pt-2">
            <p className="text-sm text-slate-600">
              Pronto para experimentar a {APP_CONFIG.name}?
            </p>
            <Link
              to={ROUTES.auth.register}
              className="inline-flex h-11 items-center gap-2 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold"
            >
              Criar conta grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
