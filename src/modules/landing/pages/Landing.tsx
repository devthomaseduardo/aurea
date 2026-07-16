import { Link } from 'react-router-dom';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import Hero from '@/shared/components/Hero';
import {
  FileText,
  Clock,
  BarChart3,
  ArrowRight,
  Sparkles,
  Target,
  Layers,
  Rocket,
  LayoutDashboard,
  Users,
  Calculator,
} from 'lucide-react';
import { ROUTES } from '@/core/config/app.config';

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Defina os requisitos',
    description:
      'Detalhe cada funcionalidade, módulo e integração do projeto. Quanto mais preciso, mais assertivo o orçamento.',
  },
  {
    number: '02',
    icon: Clock,
    title: 'Estime o tempo',
    description:
      'A ferramenta converte complexidade em horas com buffer, impostos e modelos comercial.',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Gere a proposta',
    description:
      'Salve propostas, exporte contratos e acompanhe status no pipeline do SaaS.',
  },
];

const benefits = [
  { icon: Target, text: 'Propostas com breakdown granular por módulo e funcionalidade' },
  { icon: Clock, text: 'Estimativa de tempo validada com base na complexidade real' },
  { icon: Layers, text: 'Inclui serviços extras: hospedagem, domínio, manutenção' },
  { icon: Sparkles, text: 'Cálculo automático de impostos e margem de lucro' },
  { icon: Rocket, text: 'CRM leve: clientes, propostas, contratos e analytics' },
];

const modules = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'Receita, horas, lucro e pipeline em um só lugar.',
  },
  {
    icon: Users,
    title: 'Clientes',
    description: 'CRUD completo com busca, filtros e paginação.',
  },
  {
    icon: Calculator,
    title: 'Calculadora',
    description: 'Wizard em 6 etapas com validação Zod por step.',
  },
];

export default function Landing() {
  return (
    <LandingLayout>
      <Hero />

      <section id="como-funciona" className="relative px-6 md:px-12 py-32">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none opacity-[0.07]"
          style={{
            background: 'radial-gradient(ellipse, hsl(243,75%,66%) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="badge-pill mb-5 inline-flex">
              <Sparkles className="w-3 h-3" />
              Simples e poderoso
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight gradient-text-subtle mb-5">
              Três passos para o <br />
              <span className="gradient-text">orçamento perfeito</span>
            </h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto font-light">
              Da ideia ao documento finalizado em minutos — sem planilhas, sem adivinhações.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {steps.map((step, i) => (
              <div key={step.number} className="glass-card-hover rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="step-number">{step.number}</div>
                  {i < steps.length - 1 && (
                    <div
                      className="flex-1 h-px hidden md:block"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(120,100,255,0.3), transparent)',
                      }}
                    />
                  )}
                </div>
                <div className="feature-icon mb-5">
                  <step.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Product modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {modules.map((m) => (
              <div key={m.title} className="glass-card rounded-2xl p-6">
                <div className="feature-icon mb-4">
                  <m.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-bold mb-2">{m.title}</h3>
                <p className="text-sm text-white/45">{m.description}</p>
              </div>
            ))}
          </div>

          <div
            className="glass-card rounded-3xl overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(120,100,255,0.06) 0%, rgba(30,30,60,0.3) 100%)',
              borderColor: 'rgba(120,100,255,0.12)',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-10 md:p-14">
                <h3 className="text-3xl font-black tracking-tight mb-2 gradient-text-subtle">
                  Tudo que um freelancer
                </h3>
                <h3 className="text-3xl font-black tracking-tight mb-8 gradient-text">
                  de sucesso precisa
                </h3>
                <ul className="space-y-4">
                  {benefits.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3 group">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: 'rgba(120,100,255,0.12)',
                          border: '1px solid rgba(120,100,255,0.2)',
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                      <span className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={ROUTES.app.calculator}
                  className="inline-flex items-center gap-2 mt-10 text-violet-400 font-semibold text-sm hover:text-violet-300 transition-colors group"
                >
                  Abrir a plataforma
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="relative flex items-center justify-center p-10 md:p-14 border-t lg:border-t-0 lg:border-l border-white/[0.05]">
                <div className="w-full max-w-xs">
                  <div
                    className="rounded-2xl p-6 space-y-4"
                    style={{
                      background: 'rgba(0,0,0,0.35)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs text-white/30 uppercase tracking-widest mb-1">
                          Proposta
                        </div>
                        <div className="text-white font-bold text-sm">#2026-042</div>
                      </div>
                      <div className="badge-pill text-xs">Aprovado</div>
                    </div>
                    <div className="section-divider" />
                    {[
                      { label: 'Frontend', hours: '80h', value: 'R$ 9.600' },
                      { label: 'Backend API', hours: '60h', value: 'R$ 7.200' },
                      { label: 'Design UI/UX', hours: '40h', value: 'R$ 4.800' },
                      { label: 'Deploy & Infra', hours: '20h', value: 'R$ 2.400' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div>
                          <div className="text-white/70 text-xs font-medium">{item.label}</div>
                          <div className="text-white/25 text-[10px]">{item.hours}</div>
                        </div>
                        <div className="text-white/60 text-xs font-mono">{item.value}</div>
                      </div>
                    ))}
                    <div className="section-divider" />
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-xs font-medium uppercase tracking-wide">
                        Total
                      </span>
                      <span className="gradient-text font-bold text-lg font-mono">R$ 24.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div id="calcular" className="text-center mt-24">
            <h2 className="text-3xl md:text-4xl font-black mb-4 gradient-text-subtle">
              Pronto para fechar mais contratos?
            </h2>
            <p className="text-white/45 mb-8 max-w-lg mx-auto">
              Entre na plataforma, calcule o próximo projeto e salve a proposta em segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={ROUTES.app.dashboard} className="btn-primary text-white px-8 py-4">
                Entrar no app
              </Link>
              <Link to={ROUTES.app.calculator} className="btn-ghost px-8 py-4">
                Ir para calculadora
              </Link>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
