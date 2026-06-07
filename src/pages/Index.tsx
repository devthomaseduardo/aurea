
import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import ProjetoForm from '../components/ProjetoForm';
import Footer from '../components/Footer';
import {
  FileText,
  Clock,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  Layers,
  Rocket,
} from 'lucide-react';

/* ── Feature steps data ── */
const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Defina os requisitos',
    description:
      'Detalhe cada funcionalidade, módulo e integração do projeto. Quanto mais preciso você for, mais assertivo será o orçamento gerado.',
  },
  {
    number: '02',
    icon: Clock,
    title: 'Estime o tempo',
    description:
      'A ferramenta converte automaticamente a complexidade de cada requisito em horas de desenvolvimento com precisão cirúrgica.',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Receba a proposta',
    description:
      'Obtenha um documento estruturado com breakdown detalhado de custos, cronograma e lista de entregas pronto para apresentar.',
  },
];

/* ── Benefits data ── */
const benefits = [
  { icon: Target,   text: 'Propostas com breakdown granular por módulo e funcionalidade' },
  { icon: Clock,    text: 'Estimativa de tempo validada com base na complexidade real' },
  { icon: Layers,   text: 'Inclui serviços extras: hospedagem, domínio, manutenção' },
  { icon: Sparkles, text: 'Cálculo automático de impostos e margem de lucro' },
  { icon: Rocket,   text: 'Exportação de proposta profissional para o cliente' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <Hero />

      {/* ═══════════════════════════════
          Section: Como Funciona
      ═══════════════════════════════ */}
      <section id="como-funciona" className="relative px-6 md:px-12 py-32">

        {/* Section ambient light */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none opacity-[0.07]"
          style={{
            background: 'radial-gradient(ellipse, hsl(243,75%,66%) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Header */}
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
              Da ideia ao documento finalizado em minutos — sem planilhas, sem adivinhações, sem margem de erro.
            </p>
          </div>

          {/* Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="glass-card-hover rounded-2xl p-8"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Step number + connector line */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="step-number">{step.number}</div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-px hidden md:block"
                      style={{ background: 'linear-gradient(90deg, rgba(120,100,255,0.3), transparent)' }}
                    />
                  )}
                </div>

                <div className="feature-icon mb-5">
                  <step.icon className="w-5 h-5" style={{ color: '#a78bfa' }} />
                </div>

                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Benefits Bento */}
          <div
            className="glass-card rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(120,100,255,0.06) 0%, rgba(30,30,60,0.3) 100%)',
              borderColor: 'rgba(120,100,255,0.12)',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Left: Benefits list */}
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
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'rgba(120,100,255,0.12)', border: '1px solid rgba(120,100,255,0.2)' }}>
                        <Icon className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                      <span className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#calcular"
                  className="inline-flex items-center gap-2 mt-10 text-violet-400 font-semibold text-sm hover:text-violet-300 transition-colors group"
                >
                  Comece a calcular agora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Right: Visual card */}
              <div className="relative flex items-center justify-center p-10 md:p-14 border-t lg:border-t-0 lg:border-l border-white/[0.05]">
                {/* Mock proposal card */}
                <div className="w-full max-w-xs">
                  <div
                    className="rounded-2xl p-6 space-y-4"
                    style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs text-white/30 uppercase tracking-widest mb-1">Proposta</div>
                        <div className="text-white font-bold text-sm">#2024-042</div>
                      </div>
                      <div className="badge-pill text-xs">Aprovado</div>
                    </div>

                    <div className="section-divider" />

                    {/* Line items */}
                    {[
                      { label: 'Frontend', hours: '80h', value: 'R$ 9.600' },
                      { label: 'Backend API', hours: '60h', value: 'R$ 7.200' },
                      { label: 'Design UI/UX', hours: '40h', value: 'R$ 4.800' },
                      { label: 'Deploy & Infra', hours: '20h', value: 'R$ 2.400' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div>
                          <div className="text-white/70 text-xs font-medium">{item.label}</div>
                          <div className="text-white/25 text-[10px]">{item.hours}</div>
                        </div>
                        <div className="text-white/60 text-xs font-mono">{item.value}</div>
                      </div>
                    ))}

                    <div className="section-divider" />

                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-xs font-medium uppercase tracking-wide">Total</span>
                      <span className="gradient-text font-bold text-lg font-mono">R$ 24.000</span>
                    </div>
                  </div>
                </div>

                {/* Glow behind card */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(120,100,255,0.08) 0%, transparent 70%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjetoForm />
      <Footer />
    </div>
  );
};

export default Index;
