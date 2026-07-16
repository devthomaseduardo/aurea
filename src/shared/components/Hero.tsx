import { Link } from 'react-router-dom';
import { ArrowDown, Zap, TrendingUp, Shield } from 'lucide-react';
import { ROUTES } from '@/core/config/app.config';

const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 md:px-12 py-32 overflow-hidden"
    >
      <div
        className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-30 animate-pulse-glow pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(100,80,255,0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20 animate-pulse-glow pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(56,120,255,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="animate-fade-up flex justify-center mb-8">
          <span className="badge-pill">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Versão 2.0 — Plataforma SaaS para freelancers
          </span>
        </div>

        <h1 className="animate-fade-up delay-100 text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
          <span className="gradient-text-subtle">Orçamentos que</span>
          <br />
          <span className="gradient-text">vencem contratos</span>
        </h1>

        <p className="animate-fade-up delay-200 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light mb-10">
          Calcule, gere propostas, gerencie clientes e acompanhe analytics — tudo em um
          software B2B com identidade premium.
        </p>

        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to={ROUTES.app.dashboard} className="btn-primary text-white px-8 py-4 text-base">
            <Zap className="w-4 h-4" />
            Abrir plataforma
          </Link>
          <a href="#como-funciona" className="btn-ghost px-8 py-4 text-base">
            Ver como funciona
          </a>
        </div>

        <div className="animate-fade-up delay-400 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { icon: Zap, value: '2× mais rápido', label: 'para fechar propostas' },
            { icon: TrendingUp, value: '40% mais', label: 'precisão nos valores' },
            { icon: Shield, value: '100% local', label: 'dados no seu browser' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-1.5">
                <Icon className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-white font-bold text-sm">{value}</div>
              <div className="text-white/35 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#como-funciona"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 hover:text-white/60 transition-colors animate-float"
        aria-label="Rolar para baixo"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
};

export default Hero;
