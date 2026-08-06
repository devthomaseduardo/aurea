import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import { devicesService } from '@/services/devices.service';
import { Search, Filter, Smartphone, CheckCircle2, PhoneCall, ShieldCheck, ArrowRight, Wrench } from 'lucide-react';
import { APP_CONFIG } from '@/core/config/app.config';

export default function CatalogPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);

  const allDevices = devicesService.list();

  const filteredDevices = allDevices.filter((dev) => {
    const matchesBrand = selectedBrand === 'all' || dev.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesSearch = dev.model.toLowerCase().includes(searchTerm.toLowerCase()) || dev.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <LandingLayout>
      {/* Header Banner */}
      <section className="bg-[#0B1633] text-white py-14 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 text-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FFD100] bg-blue-900/60 px-3.5 py-1 rounded-full border border-blue-700/50 inline-block">
            Catálogo Completo de Aparelhos
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Modelos Atendidos na Assistência
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto font-medium">
            Confira as peças homologadas em estoque, estimativa de orçamento e tempo de reparo no balcão da Cambuci Mobile.
          </p>
        </div>
      </section>

      {/* Main Catalog Content */}
      <section className="py-12 md:py-16 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-8">
          
          {/* Barra de Filtro e Busca */}
          <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Seletor de Marcas */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs font-extrabold text-[#0B1633] uppercase shrink-0 flex items-center gap-1">
                <Filter className="w-4 h-4 text-[#0055FF]" /> Marcas:
              </span>
              {[
                { id: 'all', label: 'Todas as Marcas' },
                { id: 'Apple', label: 'Apple iPhone' },
                { id: 'Samsung', label: 'Samsung' },
                { id: 'Motorola', label: 'Motorola' },
                { id: 'Xiaomi', label: 'Xiaomi' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrand(b.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedBrand === b.id
                      ? 'bg-[#0055FF] text-white shadow-sm'
                      : 'bg-[#F5F7FA] text-[#0B1633] border border-[#E5E7EB] hover:bg-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Busca por Modelo */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar modelo (ex: S25, iPhone 16)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] text-[#0B1633] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
              />
            </div>
          </div>

          {/* Grid de Dispositivos */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDevices.map((dev) => (
              <div
                key={dev.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:border-[#0055FF] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 rounded-xl bg-[#F5F7FA] p-3 mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={dev.imageUrl}
                      alt={dev.model}
                      className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase text-[#0055FF] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 inline-block mb-1">
                    {dev.brand}
                  </span>
                  <h3 className="text-lg font-black text-[#0B1633] mb-2">{dev.model}</h3>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-[#E5E7EB] pt-3 mb-4">
                    <div className="flex justify-between">
                      <span>Troca de Tela Média:</span>
                      <strong className="text-[#0B1633] font-extrabold">R$ {dev.screenCostAvg}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Troca de Bateria Média:</span>
                      <strong className="text-[#0B1633] font-extrabold">R$ {dev.batteryCostAvg}</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Ano de Lançamento:</span>
                      <span>{dev.releaseYear}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://api.whatsapp.com/send?phone=5511987654321&text=Olá,%20gostaria%20de%20um%20orçamento%20para%20o%20aparelho%20${encodeURIComponent(
                    `${dev.brand} ${dev.model}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#FFD100]" /> Solicitar Orçamento
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>
    </LandingLayout>
  );
}
