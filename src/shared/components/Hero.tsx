import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Wrench, ShieldCheck, PhoneCall, ArrowRight, CheckCircle2, UserCheck, Clock, Award } from 'lucide-react';
import { APP_CONFIG } from '@/core/config/app.config';

const Hero = () => {
  const [osSearch, setOsSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (osSearch.trim()) {
      navigate(`/status/${osSearch.trim()}`);
    }
  };

  return (
    <section id="inicio" className="relative bg-[#F5F7FA] text-[#0B1633] border-b border-[#E5E7EB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-6 pt-10 md:pt-14 pb-14 md:pb-16">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Lado Esquerdo: Textos & Ações */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0055FF] text-xs font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FFD100]" />
              Assistência Técnica Multimarcas
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black leading-[1.1] text-[#0B1633] tracking-tight">
              Conserto de celulares com <span className="text-[#0055FF] underline decoration-[#FFD100] decoration-4">garantia de 90 dias</span>
            </h1>

            <p className="text-base text-slate-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Especialistas em iPhone, Samsung Galaxy, Xiaomi e Motorola. Diagnóstico técnico, orçamento antes do reparo e acompanhamento da sua ordem de serviço.
            </p>

            {/* Ações principais */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
              <a
                href="#status"
                className="h-12 px-6 rounded-xl bg-[#0055FF] hover:bg-[#0044CC] font-bold text-sm text-white shadow-sm flex items-center gap-2 transition-all"
              >
                <Search className="w-4 h-4 text-[#FFD100]" /> Consultar minha OS
              </a>
              <a
                href="https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20um%20orçamento"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] font-bold text-sm text-white shadow-sm flex items-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-white" /> Solicitar orçamento
              </a>
            </div>

            {/* 4 Informações Objetivas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#E5E7EB] text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0055FF] shrink-0" />
                <div>
                  <strong className="text-xs text-[#0B1633] block font-extrabold">90 dias de garantia</strong>
                  <span className="text-[11px] text-slate-500">Nas peças e serviço</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#0055FF] shrink-0" />
                <div>
                  <strong className="text-xs text-[#0B1633] block font-extrabold">Avaliação no balcão</strong>
                  <span className="text-[11px] text-slate-500">Checklist imediato</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#0055FF] shrink-0" />
                <div>
                  <strong className="text-xs text-[#0B1633] block font-extrabold">Acompanhamento online</strong>
                  <span className="text-[11px] text-slate-500">Consulta 24h</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#0055FF] shrink-0" />
                <div>
                  <strong className="text-xs text-[#0B1633] block font-extrabold">Atendimento especializado</strong>
                  <span className="text-[11px] text-slate-500">Técnicos de bancada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Fotografia Real da Bancada Técnica */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-md space-y-3">
              <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
                  alt="Técnico em bancada de reparo profissional de celular"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 bg-[#0B1633]/90 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm border border-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFD100] animate-pulse" />
                  Bancada Técnica em Operação
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 px-1 pt-1">
                <span className="font-bold text-[#0B1633] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bancada Equipada com Microscópio & Solda
                </span>
                <span className="font-extrabold text-[#0055FF]">Cambuci Mobile</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
