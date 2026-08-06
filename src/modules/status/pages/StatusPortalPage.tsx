import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Search,
  Smartphone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import { ordersService, OS_STATUS_LABELS } from '@/services/orders.service';
import { APP_CONFIG } from '@/core/config/app.config';
import { formatCurrency } from '@/shared/utils/utils';
import type { ServiceOrder, OSStatus } from '@/types/domain';
import { BrandLogo } from '@/design-system/components/BrandLogo';

const STEPS: { status: OSStatus; label: string }[] = [
  { status: 'received', label: 'Recebido' },
  { status: 'analyzing', label: 'Em diagnóstico' },
  { status: 'budget_pending', label: 'Aguardando aprovação' },
  { status: 'repairing', label: 'Em reparo' },
  { status: 'testing', label: 'Em testes' },
  { status: 'ready', label: 'Pronto para retirada' },
  { status: 'delivered', label: 'Entregue' },
];

export default function StatusPortalPage() {
  const { id } = useParams<{ id?: string }>();
  const [searchTerm, setSearchTerm] = useState(id || '');
  const [foundOrders, setFoundOrders] = useState<ServiceOrder[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (id) {
      const results = ordersService.getByPhoneOrCode(id);
      setFoundOrders(results);
      setHasSearched(true);
    }
  }, [id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const results = ordersService.getByPhoneOrCode(searchTerm);
    setFoundOrders(results);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1633] flex flex-col font-sans">
      {/* Header Público */}
      <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <BrandLogo to="/" />

          <Link
            to="/login"
            className="text-xs font-bold text-[#0055FF] hover:text-blue-800 px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 transition-colors"
          >
            Área da Equipe
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-10">
        {/* Banner de Busca */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0055FF] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
            Acompanhamento em Tempo Real
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1633]">
            Acompanhe seu aparelho
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Consulte gratuitamente o andamento do seu reparo digitando a Ordem de Serviço (Ex: CM-2026-00128).
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: CM-2026-00128 ou seu telefone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-[#0B1633] placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055FF] font-medium shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white font-bold text-sm transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
            >
              Consultar Status
              <ArrowRight className="w-4 h-4 text-[#FFD100]" />
            </button>
          </form>
        </div>

        {/* Resultados */}
        {hasSearched && (
          <div className="space-y-8">
            {foundOrders.length === 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center space-y-3 shadow-sm">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-lg font-bold text-[#0B1633]">Nenhuma Ordem de Serviço encontrada</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
                  Não encontramos ordens para "<strong>{searchTerm}</strong>". Verifique o comprovante entregue no balcão.
                </p>
              </div>
            ) : (
              foundOrders.map((order) => {
                const currentIdx = STEPS.findIndex((s) => s.status === order.status);
                const statusInfo = OS_STATUS_LABELS[order.status];

                return (
                  <div
                    key={order.id}
                    className="bg-white border-2 border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6 shadow-md"
                  >
                    {/* Topo do Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0055FF]">
                            Ordem de Serviço
                          </span>
                          <span className="text-xl font-black text-[#0B1633]">#{order.id}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-bold mt-1">Cliente: {order.clientName}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-[#0055FF] border border-blue-200">
                          {statusInfo.label}
                        </span>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          Entrada: {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Visual com 7 Etapas */}
                    <div className="py-2">
                      <p className="text-xs font-extrabold text-[#0B1633] uppercase tracking-wider mb-4">
                        Linha do Tempo da Manutenção
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                        {STEPS.map((step, idx) => {
                          const isPassed = currentIdx >= idx;
                          const isCurrent = currentIdx === idx;

                          return (
                            <div
                              key={step.status}
                              className={`p-2.5 rounded-xl border text-center transition-all ${
                                isCurrent
                                  ? 'border-[#0055FF] bg-blue-50 text-[#0055FF] font-black shadow-sm'
                                  : isPassed
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-bold'
                                  : 'border-[#E5E7EB] bg-slate-100 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center justify-center mb-1">
                                {isPassed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </div>
                              <span className="text-[11px] leading-tight block">{step.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detalhes do Celular */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-[#F5F7FA] p-4 rounded-xl border border-[#E5E7EB] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0B1633] uppercase">
                          <Smartphone className="w-4 h-4 text-[#0055FF]" /> Aparelho & Defeito
                        </div>
                        <p className="text-base font-extrabold text-[#0B1633]">
                          {order.deviceBrand} {order.deviceModel}
                        </p>
                        {order.serialNumber && (
                          <p className="text-xs text-slate-500 font-mono">IMEI/SN: {order.serialNumber}</p>
                        )}
                        <p className="text-xs text-slate-700">
                          <strong>Defeito Relatado:</strong> {order.reportedIssue}
                        </p>
                      </div>

                      <div className="bg-[#F5F7FA] p-4 rounded-xl border border-[#E5E7EB] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0B1633] uppercase">
                          <FileText className="w-4 h-4 text-[#0055FF]" /> Diagnóstico & Valor
                        </div>
                        <p className="text-xs text-slate-700">
                          {order.technicalReport || 'Técnico efetuando diagnóstico e testes na bancada...'}
                        </p>
                        {order.technicianName && (
                          <p className="text-xs text-slate-600 flex items-center gap-1 font-semibold pt-1">
                            <UserCheck className="w-3.5 h-3.5 text-[#0055FF]" /> Técnico: {order.technicianName}
                          </p>
                        )}
                        <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                          <span className="text-xs text-slate-600 font-bold">Valor Aprovado:</span>
                          <span className="text-lg font-black text-[#0055FF]">
                            {formatCurrency(order.totalValue)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Informações de Garantia e Contato */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-[#0B1633] font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Garantia legal de 90 dias referente aos serviços e peças homologadas.</span>
                      </div>
                      <a
                        href={`https://api.whatsapp.com/send?phone=5511987654321&text=Olá,%20gostaria%20de%20dúvidas%20sobre%20a%20OS%20${order.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0055FF] font-black hover:underline flex items-center gap-1 shrink-0"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Falar com a Assistência
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2026 {APP_CONFIG.name} — Assistência Técnica Especializada Multimarcas em São Paulo.</p>
      </footer>
    </div>
  );
}
