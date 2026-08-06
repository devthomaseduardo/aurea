import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import { ShieldCheck, MapPin, PhoneCall, Clock, Wrench, UserCheck, Award, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '@/core/config/app.config';

export default function AboutPage() {
  return (
    <LandingLayout>
      <section className="bg-[#0B1633] text-white py-14 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 text-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FFD100] bg-blue-900/60 px-3.5 py-1 rounded-full border border-blue-700/50 inline-block">
            Nossa Loja & Bancada Técnica
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white">
            Conheça a Cambuci Mobile
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto font-medium">
            Estrutura física completa de assistência técnica multimarcas em São Paulo - SP.
          </p>
        </div>
      </section>

      <section className="py-14 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto px-5 md:px-6 space-y-12">
          
          {/* Fotos e História */}
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-[#0055FF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
                Desde 2019 em São Paulo
              </span>
              <h2 className="text-3xl font-black text-[#0B1633] tracking-tight">
                Transparência e Qualidade no Conserto do seu Celular
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Fundada para transformar o atendimento de assistências técnicas em São Paulo, a Cambuci Mobile combina um atendimento transparente no balcão com bancadas técnicas modernas equipadas com microscópios de alta precisão, estações de solda profissional e separadoras a laser.
              </p>
              <div className="space-y-2 pt-2 text-xs font-bold text-[#0B1633]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Vistoria com checklist físico na entrada do celular
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Testes pós-reparo com garantia legal de 90 dias
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Acompanhamento digital da OS pelo cliente
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl shadow-sm space-y-3">
              <div className="h-72 rounded-xl overflow-hidden bg-slate-200">
                <img
                  src="/brand/hero.jpg"
                  alt="Nossa Bancada Técnica"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-600 text-center font-bold">
                Bancada de Micro-soldagem e Reparo de Placa — Cambuci Mobile SP
              </p>
            </div>
          </div>

          {/* Equipe Técnica */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-[#0B1633]">Nossa Equipe de Bancada</h2>
              <p className="text-xs text-slate-600">Técnicos certificados com vasta experiência em iPhone, Samsung, Xiaomi e Motorola.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Rafael Santos', role: 'Técnico Senior / Placa', exp: '8 anos de bancada' },
                { name: 'Matheus Lima', role: 'Técnico Pleno / Android', exp: '5 anos de bancada' },
                { name: 'Ana Clara', role: 'Atendimento & Checklist', exp: 'Especialista Balcão' },
                { name: 'Thiago Silva', role: 'Gerente Operacional', exp: 'Gestão de Peças & OS' },
              ].map((m, i) => (
                <div key={i} className="bg-white border border-[#E5E7EB] p-5 rounded-2xl text-center space-y-2 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-[#0055FF] text-[#FFD100] font-black text-lg flex items-center justify-center mx-auto">
                    {m.name.charAt(0)}
                  </div>
                  <h3 className="font-extrabold text-[#0B1633] text-sm">{m.name}</h3>
                  <p className="text-xs font-bold text-[#0055FF]">{m.role}</p>
                  <span className="text-[11px] text-slate-500 block">{m.exp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Endereço e Contato */}
          <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-4 shadow-sm text-center">
            <h3 className="text-lg font-black text-[#0B1633]">Venha nos visitar no Cambuci</h3>
            <p className="text-xs text-slate-600 font-medium">Av. Lins de Vasconcelos, 1200 — Cambuci, São Paulo - SP</p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a
                href="https://wa.me/5511987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cambuci-whatsapp text-xs"
              >
                <PhoneCall className="w-4 h-4" /> (11) 98765-4321
              </a>
            </div>
          </div>

        </div>
      </section>
    </LandingLayout>
  );
}
