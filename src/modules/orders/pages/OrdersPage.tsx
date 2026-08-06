import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Plus,
  Search,
  MessageCircle,
  Eye,
  Smartphone,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  UserCheck,
} from 'lucide-react';
import {
  PageContainer,
  PageHeader,
  MetricCard,
  MetricGrid,
} from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { ordersService, OS_STATUS_LABELS } from '@/services/orders.service';
import { ROUTES } from '@/core/config/app.config';
import { formatCurrency, formatRelativeDate } from '@/shared/utils/utils';
import type { OSStatus, ServiceOrder } from '@/types/domain';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OSStatus | 'all'>('all');
  const [orders, setOrders] = useState<ServiceOrder[]>(() => ordersService.list());

  const filteredOrders = useMemo(() => {
    return ordersService.list(searchTerm, statusFilter);
  }, [searchTerm, statusFilter, orders]);

  const stats = useMemo(() => {
    const all = ordersService.list();
    return {
      total: all.length,
      active: all.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length,
      ready: all.filter((o) => o.status === 'ready').length,
      pendingBudget: all.filter((o) => o.status === 'budget_pending').length,
    };
  }, [orders]);

  const handleStatusChange = (id: string, newStatus: OSStatus) => {
    ordersService.update(id, { status: newStatus });
    setOrders(ordersService.list());
  };

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title="Ordens de Serviço (OS)"
        description="Gestão completa do fluxo de manutenção de celulares, aparelhos e técnicos de bancada."
        actions={
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-sm">
            <Link to={ROUTES.app.ordersNew}>
              <Plus className="w-4 h-4 text-yellow-300" />
              Nova Ordem de Serviço
            </Link>
          </Button>
        }
      />

      <MetricGrid columns={4}>
        <MetricCard
          label="Total de OS"
          value={String(stats.total)}
          icon={FileText}
          hint="cadastradas no sistema"
        />
        <MetricCard
          label="Em Andamento"
          value={String(stats.active)}
          icon={Wrench}
          hint="em triagem, teste ou reparo"
        />
        <MetricCard
          label="Aguardando Aprovação"
          value={String(stats.pendingBudget)}
          icon={Clock}
          hint="orçamento enviado ao cliente"
        />
        <MetricCard
          label="Prontos p/ Retirada"
          value={String(stats.ready)}
          icon={CheckCircle2}
          hint="prontos no balcão"
        />
      </MetricGrid>

      <div className="bg-card rounded-2xl border border-border p-4 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por código de OS (Ex: #CM-1048), cliente, telefone, modelo ou IMEI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
            <span className="text-xs font-semibold text-muted-foreground shrink-0 hidden sm:block">Status:</span>
            {(
              [
                { key: 'all', label: 'Todas' },
                { key: 'received', label: 'Recebidas' },
                { key: 'analyzing', label: 'Em Diagnóstico' },
                { key: 'budget_pending', label: 'Orçamento' },
                { key: 'repairing', label: 'Em Reparo' },
                { key: 'testing', label: 'Em Testes' },
                { key: 'ready', label: 'Prontas' },
                { key: 'delivered', label: 'Entregues' },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setStatusFilter(item.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                  statusFilter === item.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de OS com Imagens de Aparelhos */}
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border uppercase text-[10px] font-extrabold text-slate-500">
              <tr>
                <th className="px-4 py-3">Aparelho & OS</th>
                <th className="px-4 py-3">Cliente / Contato</th>
                <th className="px-4 py-3">Técnico Bancada</th>
                <th className="px-4 py-3">Defeito Relatado</th>
                <th className="px-4 py-3">Status Pipeline</th>
                <th className="px-4 py-3 text-right">Valor Total</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <Wrench className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="font-bold text-base text-foreground">Nenhuma Ordem de Serviço encontrada</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tente alterar os termos de busca ou cadastrar uma nova OS.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = OS_STATUS_LABELS[order.status];
                  const whatsappLink = ordersService.generateWhatsAppLink(order);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex items-center gap-3">
                          {order.deviceImageUrl ? (
                            <img
                              src={order.deviceImageUrl}
                              alt={order.deviceModel}
                              className="w-10 h-10 rounded-lg object-contain bg-slate-100 p-1 border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600">
                              <Smartphone className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <Link
                              to={ROUTES.app.orderDetail(order.id)}
                              className="font-extrabold text-blue-700 hover:underline block text-xs"
                            >
                              #{order.id}
                            </Link>
                            <strong className="text-slate-900 block font-bold text-xs">{order.deviceBrand} {order.deviceModel}</strong>
                            <span className="text-[10px] text-slate-400">{formatRelativeDate(order.createdAt)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <p className="font-bold text-slate-900">{order.clientName}</p>
                        {order.clientPhone && (
                          <p className="text-[11px] text-slate-500 font-medium">{order.clientPhone}</p>
                        )}
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{order.technicianName || 'Rafael Santos'}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 align-top max-w-xs">
                        <p className="text-xs text-slate-700 line-clamp-2" title={order.reportedIssue}>
                          {order.reportedIssue}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OSStatus)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${statusInfo.color}`}
                        >
                          {Object.entries(OS_STATUS_LABELS).map(([key, val]) => (
                            <option key={key} value={key}>
                              {val.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3.5 align-top text-right">
                        <span className="font-extrabold text-slate-900 block text-xs">
                          {formatCurrency(order.totalValue)}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-bold mt-0.5 ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </td>

                      <td className="px-4 py-3.5 align-top text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button asChild variant="ghost" size="icon" className="h-8 w-8" title="Ver Detalhes">
                            <Link to={ROUTES.app.orderDetail(order.id)}>
                              <Eye className="w-4 h-4 text-slate-600 hover:text-slate-900" />
                            </Link>
                          </Button>

                          {order.clientPhone && (
                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="Notificar via WhatsApp"
                            >
                              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
