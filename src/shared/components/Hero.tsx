import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Wrench, ShieldCheck, Smartphone, ArrowRight, PhoneCall, CheckCircle2, Star, Award } from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

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
    <section id="inicio" className="relative bg-white text-slate-900 border-b border-slate-200 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Lado Esquerdo: Chamada e Busca de OS */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Assistência Técnica Multimarcas & Venda de Acessórios
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-extrabold leading-[1.1] tracking-tight text-slate-900">
              Conserto de Celulares com <span className="text-blue-600 underline decoration-yellow-400 decoration-4">Garantia de 90 Dias</span> e Peças Originais
            </h1>

            <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Especialistas em Apple iPhone, Samsung Galaxy, Xiaomi e Motorola. Troca de tela, bateria, conector de carga e reparos de placa com laudo transparente e acompanhamento em tempo real.
            </p>

            {/* Widget de Consulta da OS */}
            <div className="bg-slate-50 border-2 border-blue-600/30 rounded-2xl p-4.5 shadow-md max-w-lg mx-auto lg:mx-0 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-blue-600" />
                  Consultar Ordem de Serviço (OS)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
                  Online 24h
                </span>
              </div>

              <form onSubmit={handleSearchOS} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite a OS (Ex: OS-2026-001) ou seu WhatsApp"
                  value={osSearch}
                  onChange={(e) => setOsSearch(e.target.value)}
                  className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white transition-colors shrink-0 shadow-md flex items-center gap-1.5"
                >
                  Consultar OS
                  <ArrowRight className="w-3.5 h-3.5 text-yellow-300" />
                </button>
              </form>
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
              <a
                href="#servicos"
                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-sm flex items-center gap-2 transition-colors"
              >
                <Wrench className="w-4 h-4 text-yellow-300" /> Ver Tabela de Serviços
              </a>
              <a
                href="https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20meu%20celular"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" /> Orçamento Rápido no WhatsApp
              </a>
            </div>

            {/* Selos de Confiança */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-left max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">90 Dias</strong>
                  <span className="text-[10px] text-slate-500">Garantia legal em nota</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 shrink-0" />
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">4.9 / 5.0</strong>
                  <span className="text-[10px] text-slate-500">+1.200 Clientes satisfeitos</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">Sem Custo</strong>
                  <span className="text-[10px] text-slate-500">Avaliação no balcão</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Card Ilustrativo de Aparelhos Atendidos */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span className="font-extrabold text-sm text-slate-900">Oficina Técnica Especializada</span>
                </div>
                <span className="text-xs font-bold text-yellow-700 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded">
                  Bancada Aberta
                </span>
              </div>

              {/* Lista de Aparelhos Populares */}
              <div className="space-y-3">
                {[
                  { brand: 'Apple iPhone', models: 'iPhone 11 / 12 / 13 / 14 / 15 Pro Max', time: 'Pronta Entrega (40 min)' },
                  { brand: 'Samsung Galaxy', models: 'Linha S20 / S21 / S22 / S23 / Linha A e M', time: 'Pronta Entrega (45 min)' },
                  { brand: 'Xiaomi / Poco', models: 'Redmi Note 10 / 11 / 12 / Poco X3 / X5 Pro', time: 'Peças em Estoque' },
                  { brand: 'Motorola Moto', models: 'Moto G30 / G50 / G60 / Edge 20 / Edge 30', time: 'Reparo Express' },
                ].map((dev, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">{dev.brand}</strong>
                      <span className="text-[11px] text-slate-500">{dev.models}</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded shrink-0">
                      {dev.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Laudo e Checklist na Hora
                </span>
                <span className="font-bold text-blue-700">{APP_CONFIG.name}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
