import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PhoneCall, ShieldCheck, Wrench, Clock, CheckCircle2 } from 'lucide-react';

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
    <section id="inicio" className="bg-[#F4F6F8] border-b border-[#E5E7EB] pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        
        {/* Composição Dividida */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Lado Esquerdo - Alinhado à Esquerda */}
          <div className="lg:col-span-7 text-left space-y-5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0055FF] bg-blue-50 px-3 py-1 rounded border border-blue-200 inline-block">
              Assistência Técnica Multimarcas
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1833] tracking-tight leading-[1.15]">
              Conserto de celulares com diagnóstico, orçamento aprovado antes do reparo e garantia de 90 dias.
            </h1>

            <p className="text-sm sm:text-base text-[#667085] leading-relaxed max-w-xl font-medium">
              Atendimento presencial no balcão no Cambuci em São Paulo. Manutenção de telas, baterias, conectores de carga e placa mãe com peças testadas.
            </p>

            {/* Ações / Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#status"
                className="h-11 px-6 rounded-lg bg-[#0055FF] hover:bg-[#0044CC] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Search className="w-4 h-4 text-[#FFD100]" /> Consultar minha OS
              </a>

              <a
                href="https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20um%20orçamento"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-white" /> Solicitar orçamento no WhatsApp
              </a>
            </div>
          </div>

          {/* Lado Direito - Fotografia Real de Bancada Técnica */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
              <img
                src="/brand/hero.jpg"
                alt="Técnico trabalhando em bancada de manutenção com microscópio e ferramentas de precisão"
                className="w-full h-72 sm:h-80 lg:h-[340px] object-cover"
              />
              <div className="p-3 bg-white border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#0A1833]">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bancada Técnica Cambuci Mobile
                </span>
                <span className="text-[#667085] text-[11px]">São Paulo - SP</span>
              </div>
            </div>
          </div>

        </div>

        {/* Logo Abaixo: Apenas 4 Informações Objetivas em uma Linha (SEM CARDS GRANDES) */}
        <div className="mt-10 pt-6 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#0A1833]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
            <span>90 dias de garantia</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
            <span>Avaliação no balcão</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
            <span>Acompanhamento online</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
            <span>Atendimento multimarcas</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
