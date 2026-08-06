import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Plus,
  Search,
  MessageCircle,
  Eye,
  Printer,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Filter,
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
        description="Gestão completa do fluxo de manutenção de celulares, tablets e dispositivos."
        actions={
          <Button asChild variant="brand">
            <Link to={ROUTES.app.ordersNew}>
              <Plus className="w-4 h-4 mr-1.5" />
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

      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por código de OS, nome do cliente, telefone, modelo do celular ou IMEI..."
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
                { key: 'analyzing', label: 'Em Análise' },
                { key: 'budget_pending', label: 'Orçamento' },
                { key: 'repairing', label: 'Em Reparo' },
                { key: 'ready', label: 'Prontas' },
                { key: 'delivered', label: 'Entregues' },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setStatusFilter(item.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  statusFilter === item.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de OS */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-border text-xs uppercase font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-3">OS / Data</th>
                <th className="px-4 py-3">Cliente / Contato</th>
                <th className="px-4 py-3">Dispositivo / IMEI</th>
                <th className="px-4 py-3">Defeito Relatado</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Valor Total</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <Wrench className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="font-medium text-base text-foreground">Nenhuma Ordem de Serviço encontrada</p>
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
                    <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3.5 align-top">
                        <Link
                          to={ROUTES.app.orderDetail(order.id)}
                          className="font-bold text-primary hover:underline block"
                        >
                          {order.id}
                        </Link>
                        <span className="text-[11px] text-muted-foreground">
                          {formatRelativeDate(order.createdAt)}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <p className="font-medium text-foreground">{order.clientName}</p>
                        {order.clientPhone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            {order.clientPhone}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="font-semibold text-foreground">
                            {order.deviceBrand} {order.deviceModel}
                          </span>
                        </div>
                        {order.serialNumber && (
                          <span className="text-[11px] text-muted-foreground font-mono block mt-0.5">
                            SN: {order.serialNumber}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 align-top max-w-xs">
                        <p className="text-xs text-foreground/90 line-clamp-2" title={order.reportedIssue}>
                          {order.reportedIssue}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OSStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer ${statusInfo.color}`}
                        >
                          {Object.entries(OS_STATUS_LABELS).map(([key, val]) => (
                            <option key={key} value={key}>
                              {val.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3.5 align-top text-right">
                        <span className="font-semibold tabular-nums text-foreground block">
                          {formatCurrency(order.totalValue)}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase mt-0.5 ${
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
                              <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
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
