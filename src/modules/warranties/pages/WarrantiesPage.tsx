import { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, Clock, PhoneCall } from 'lucide-react';
import { warrantiesService } from '@/services/warranties.service';

export default function WarrantiesPage() {
  const [search, setSearch] = useState('');
  const warranties = warrantiesService.list();

  const filtered = warranties.filter(
    (w) =>
      w.osId.toLowerCase().includes(search.toLowerCase().trim()) ||
      w.clientName.toLowerCase().includes(search.toLowerCase().trim()) ||
      w.deviceModel.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Garantias Ativas
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Controle de Garantias (90 Dias)
          </h1>
          <p className="text-xs text-slate-500">
            Acompanhamento de garantias legais vigentes para peças trocadas e serviços prestados.
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por OS, cliente ou aparelho..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          />
        </div>
      </div>

      {/* Tabela de Garantias */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-extrabold text-slate-500">
              <tr>
                <th className="px-5 py-3">OS</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Aparelho</th>
                <th className="px-5 py-3">Peças Substituídas</th>
                <th className="px-5 py-3">Início</th>
                <th className="px-5 py-3">Vencimento</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-extrabold text-blue-700">{w.osId}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{w.clientName}</td>
                  <td className="px-5 py-3.5 font-medium">{w.deviceModel}</td>
                  <td className="px-5 py-3.5 text-slate-600">{w.partsReplaced.join(', ')}</td>
                  <td className="px-5 py-3.5">{new Date(w.startDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    {new Date(w.endDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        w.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {w.status === 'active' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ativa (90d)
                        </>
                      ) : (
                        'Expirada'
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
