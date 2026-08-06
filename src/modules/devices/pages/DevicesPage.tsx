import { useState } from 'react';
import { Smartphone, Wrench, Search, Plus, Filter, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { devicesService } from '@/services/devices.service';
import { formatCurrency } from '@/shared/utils/utils';
import { Button } from '@/shared/components/ui/button';

export default function DevicesPage() {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [search, setSearch] = useState('');
  const devices = devicesService.list(selectedBrand);

  const filtered = devices.filter((d) =>
    d.model.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase">
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            Modelos Homologados
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Aparelhos & Modelos Atendidos
          </h1>
          <p className="text-xs text-slate-500">
            Catálogo técnico de celulares e tablets com estimativa média de custos de peças e telas.
          </p>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-sm">
          <Plus className="w-4 h-4 text-yellow-300" /> Cadastrar Novo Aparelho
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar modelo (Ex: iPhone 13 Pro, S22)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'Apple', 'Samsung', 'Xiaomi', 'Motorola'].map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedBrand === brand
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {brand === 'all' ? 'Todas as Marcas' : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Modelos com Imagens Reais */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((device) => (
          <div
            key={device.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={device.imageUrl}
                  alt={device.model}
                  className="max-h-full object-contain hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-800 border border-slate-200 shadow-sm">
                  {device.brand}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{device.model}</h3>
                  <span className="text-[11px] text-slate-500">Ano: {device.releaseYear || '2022'}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px]">Tela OLED Média:</span>
                    <strong className="text-slate-900 font-bold">{formatCurrency(device.screenCostAvg)}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px]">Bateria Média:</span>
                    <strong className="text-slate-900 font-bold">{formatCurrency(device.batteryCostAvg)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 mt-2">
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Peças em Estoque
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
