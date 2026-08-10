import { Link } from 'react-router-dom';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import {
  Calculator,
  FileText,
  Users,
  FileSignature,
  BarChart3,
  Plug,
  ArrowRight,
} from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

const resources = [
  {
    icon: Calculator,
    title: 'Calculadora de orçamento',
    desc: 'Wizard com escopo, tecnologias, custos, horas e margem. Validação com Zod e react-hook-form.',
  },
  {
    icon: FileText,
    title: 'Propostas comerciais',
    desc: 'Gere PDF, acompanhe status, duplique propostas e mantenha o histórico por cliente.',
  },
  {
    icon: FileSignature,
    title: 'Contratos',
    desc: 'Pipeline de contratos vinculados às propostas aprovadas, com status e acompanhamento.',
  },
  {
    icon: Users,
    title: 'Clientes (CRM leve)',
    desc: 'Cadastro, busca, filtros e vínculo com orçamentos e propostas do mesmo cliente.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard e analytics',
    desc: 'Receita, horas, lucro e breakdown de status para enxergar o funil comercial.',
  },
  {
    icon: Plug,
    title: 'Integrações',
    desc: 'Conectores (Google, GitHub, Stripe, Slack, Notion, WhatsApp) com teste direto na interface.',
  },
];

export default function ServicesPage() {
  return (
    <LandingLayout>
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-5 md:px-6 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-slate-800 px-3.5 py-1 rounded-full border border-slate-700 inline-block">
            Recursos
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            O que a {APP_CONFIG.name} oferece
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto">
            Do orçamento ao fechamento: módulos pensados para o dia a dia de quem vende serviço.
          </p>
        </div>
      </section>

      <section className="py-14 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 md:px-6 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{r.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-indigo-100 p-6 rounded-2xl text-center space-y-4 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">Teste o fluxo completo</h3>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              Crie uma conta, monte um orçamento na calculadora e gere sua primeira proposta.
            </p>
            <Link
              to={ROUTES.auth.register}
              className="inline-flex h-10 items-center gap-2 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold"
            >
              Começar grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
