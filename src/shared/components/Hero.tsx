import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Wrench, ShieldCheck, PhoneCall, CheckCircle2, UserCheck, Clock, MapPin } from 'lucide-react';

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
    <section id="inicio" className="relative bg-[#F5F7FA] text-[#0B1633] border-b border-[#E5E7EB] py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Lado Esquerdo: Apresentação Comercial do Balcão */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0055FF] text-xs font-extrabold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD100]" />
              Assistência Técnica Multimarcas · São Paulo - SP
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black leading-[1.1] text-[#0B1633] tracking-tight">
              Conserto de celulares com <span className="text-[#0055FF] underline decoration-[#FFD100] decoration-4">garantia de 90 dias</span>
            </h1>

            <p className="text-base text-slate-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Especialistas em iPhone, Samsung Galaxy, Xiaomi e Motorola. Diagnóstico técnico na bancada, orçamento prévio e acompanhamento da sua ordem de serviço em tempo real.
            </p>

            {/* Form de Consulta de OS + Botão de WhatsApp */}
            <div className="space-y-3 pt-1">
              <form onSubmit={handleSearchOS} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto lg:mx-0">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Digite sua OS (Ex: CM-2026-00128)"
                    value={osSearch}
                    onChange={(e) => setOsSearch(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-[#0B1633] placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-[#0055FF] hover:bg-[#0044CC] font-extrabold text-sm text-white shadow-sm flex items-center justify-center gap-2 transition-all shrink-0"
                >
                  <Search className="w-4 h-4 text-[#FFD100]" /> Consultar OS
                </button>
              </form>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-1">
                <a
                  href="https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20um%20orçamento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] font-extrabold text-xs text-white shadow-sm flex items-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-white" /> WhatsApp Direct
                </a>
              </div>
            </div>

            {/* 4 Diferenciais Comerciais */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-[#E5E7EB] text-left">
              <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#0055FF]" />
                  <strong className="text-xs text-[#0B1633] font-extrabold block">90 Dias Garantia</strong>
                </div>
                <span className="text-[11px] text-slate-500 block">Peças e serviços</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <Wrench className="w-4 h-4 text-[#0055FF]" />
                  <strong className="text-xs text-[#0B1633] font-extrabold block">Avaliação Balcão</strong>
                </div>
                <span className="text-[11px] text-slate-500 block">Checklist imediato</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-4 h-4 text-[#0055FF]" />
                  <strong className="text-xs text-[#0B1633] font-extrabold block">Consulta Online</strong>
                </div>
                <span className="text-[11px] text-slate-500 block">Status 24 horas</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <UserCheck className="w-4 h-4 text-[#0055FF]" />
                  <strong className="text-xs text-[#0B1633] font-extrabold block">Equipe Técnica</strong>
                </div>
                <span className="text-[11px] text-slate-500 block">Técnicos de bancada</span>
              </div>
            </div>

          </div>

          {/* Lado Direito: Foto da Oficina Física Cambuci + Informações Reais */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-[#E5E7EB] rounded-2xl p-4 shadow-md space-y-4">
              
              {/* Foto Real da Bancada / Loja */}
              <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden bg-slate-100 border border-[#E5E7EB]">
                <img
                  src="/brand/hero.jpg"
                  alt="Bancada Técnica em Operação da Cambuci Mobile"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 bg-[#0B1633]/90 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm border border-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFD100] animate-pulse" />
                  Bancada Técnica em Operação
                </span>
              </div>

              {/* Informações da Oficina Pedidas pelo Usuário */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#0B1633]">Oficina Física Cambuci</h3>
                    <p className="text-xs text-slate-600 font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0055FF]" /> Av. Lins de Vasconcelos, 1200 — São Paulo SP
                    </p>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#0055FF] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 shrink-0">
                    Cambuci Mobile
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bancada Equipada com Laser & Solda</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
