import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Search,
  Wrench,
  Smartphone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { ordersService, OS_STATUS_LABELS } from '@/services/orders.service';
import { APP_CONFIG } from '@/core/config/app.config';
import { formatCurrency } from '@/shared/utils/utils';
import type { ServiceOrder, OSStatus } from '@/types/domain';
import { BrandLogo } from '@/design-system/components/BrandLogo';

const STEPS: { status: OSStatus; label: string }[] = [
  { status: 'received', label: 'Recebido' },
  { status: 'analyzing', label: 'Em Análise' },
  { status: 'budget_pending', label: 'Orçamento' },
  { status: 'repairing', label: 'Em Reparo' },
  { status: 'ready', label: 'Pronto' },
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header Público */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <BrandLogo to="/" />

          <Link
            to="/login"
            className="text-xs font-bold text-blue-700 hover:text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 transition-colors"
          >
            Área do Técnico / Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-10">
        {/* Banner de Busca */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            Acompanhamento Online
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Status da sua Ordem de Serviço
          </h1>
          <p className="text-sm text-slate-600">
            Digite o código da sua OS (Ex: OS-2026-001) ou o seu telefone para acompanhar o conserto.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: OS-2026-001 ou (11) 98765-4321"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shrink-0 shadow-md flex items-center gap-1.5"
            >
              Consultar OS
              <ArrowRight className="w-3.5 h-3.5 text-yellow-300" />
            </button>
          </form>
        </div>

        {/* Resultados */}
        {hasSearched && (
          <div className="space-y-8">
            {foundOrders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3 shadow-sm">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Nenhuma Ordem de Serviço encontrada</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Não encontramos ordens para "<strong>{searchTerm}</strong>". Por favor,
                  verifique o código impresso em seu comprovante.
                </p>
              </div>
            ) : (
              foundOrders.map((order) => {
                const currentIdx = STEPS.findIndex((s) => s.status === order.status);
                const statusInfo = OS_STATUS_LABELS[order.status];

                return (
                  <div
                    key={order.id}
                    className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md"
                  >
                    {/* Topo do Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                            Ordem de Serviço
                          </span>
                          <span className="text-xl font-extrabold text-slate-900">{order.id}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">Cliente: {order.clientName}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          {statusInfo.label}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Entrada: {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {/* Stepper de Progresso Visual */}
                    <div className="py-2">
                      <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-4">
                        Linha do Tempo da Manutenção
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                        {STEPS.map((step, idx) => {
                          const isPassed = currentIdx >= idx;
                          const isCurrent = currentIdx === idx;

                          return (
                            <div
                              key={step.status}
                              className={`p-3 rounded-xl border text-center transition-all ${
                                isCurrent
                                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                                  : isPassed
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-medium'
                                  : 'border-slate-200 bg-slate-100 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center justify-center mb-1.5">
                                {isPassed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                              <span className="text-xs block truncate">{step.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detalhes do Celular */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                          <Smartphone className="w-4 h-4 text-blue-600" /> Dispositivo em Reparo
                        </div>
                        <p className="text-base font-bold text-slate-900">
                          {order.deviceBrand} {order.deviceModel}
                        </p>
                        {order.serialNumber && (
                          <p className="text-xs text-slate-500 font-mono">IMEI/SN: {order.serialNumber}</p>
                        )}
                        <p className="text-xs text-slate-600">
                          <strong>Defeito Relatado:</strong> {order.reportedIssue}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                          <FileText className="w-4 h-4 text-blue-600" /> Diagnóstico Técnico
                        </div>
                        <p className="text-xs text-slate-700">
                          {order.technicalReport || 'Técnico efetuando testes na bancada...'}
                        </p>
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-xs text-slate-600 font-semibold">Valor Total:</span>
                          <span className="text-lg font-extrabold text-blue-700">
                            {formatCurrency(order.totalValue)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Informações da Loja */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-slate-800 font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Garantia legal de 90 dias inclusa em todas as manutenções.</span>
                      </div>
                      <a
                        href={`https://api.whatsapp.com/send?phone=5511987654321&text=Olá,%20gostaria%20de%20dúvidas%20sobre%20a%20OS%20${order.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 font-bold hover:underline flex items-center gap-1 shrink-0"
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
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2026 {APP_CONFIG.name} — Assistência Técnica Especializada em Celulares & Eletrônicos.</p>
      </footer>
    </div>
  );
}
