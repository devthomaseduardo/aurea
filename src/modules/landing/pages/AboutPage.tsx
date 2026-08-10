import { Link } from 'react-router-dom';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

export default function AboutPage() {
  return (
    <LandingLayout>
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-5 md:px-6 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-slate-800 px-3.5 py-1 rounded-full border border-slate-700 inline-block">
            Sobre
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Por que existe a {APP_CONFIG.name}
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto">
            Um SaaS comercial pensado para quem vende serviço e ainda precifica no improviso ou na planilha.
          </p>
        </div>
      </section>

      <section className="py-14 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 md:px-6 space-y-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-left">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Missão</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Clareza do orçamento ao contrato
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {APP_CONFIG.name} nasceu para freelancers, consultores e pequenas equipes que precisam
                precificar projetos com método, enviar propostas profissionais e manter o histórico de
                cada cliente organizado — sem depender de planilhas soltas ou documentos perdidos.
              </p>
              <ul className="space-y-2 text-sm text-slate-700 pt-2">
                {[
                  'Orçamento estruturado (escopo, horas, custos e margem)',
                  'Propostas em PDF com status e histórico',
                  'Clientes e contratos no mesmo fluxo',
                  'Modo local para demo e Firebase para produção',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
              <div className="h-72 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={APP_CONFIG.brand.hero}
                  alt={`${APP_CONFIG.name} — plataforma comercial`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-600 text-center font-medium">
                {APP_CONFIG.tagline}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-4 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">Pronto para organizar o comercial?</h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              Crie uma conta e teste a calculadora, as propostas e o pipeline de clientes.
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
