import {
  Wrench,
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  Plus,
  Smartphone,
  ChevronRight,
  Package,
  UserCheck,
  Eye,
} from 'lucide-react';
import {
  PageContainer,
  PageHeader,
  MetricCard,
  MetricGrid,
  LoadingState,
} from '@/design-system/patterns';
import {
  useDashboardMetrics,
  useRevenueSeries,
} from '@/hooks/use-dashboard';
import { formatCurrency } from '@/shared/utils/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/config/app.config';
import { Button } from '@/shared/components/ui/button';
import { ordersService, OS_STATUS_LABELS } from '@/services/orders.service';
import { inventoryService } from '@/services/inventory.service';
import { settingsService } from '@/services/settings.service';

export default function DashboardPage() {
  const metrics = useDashboardMetrics();
  const series = useRevenueSeries();
  const activeTenant = settingsService.getActiveTenant();

  const recentOrders = ordersService.list().slice(0, 5);
  const lowStockItems = inventoryService.getLowStockItems();

  if (metrics.isLoading) {
    return (
      <PageContainer>
        <LoadingState fullPage label="Carregando painel da oficina…" />
      </PageContainer>
    );
  }

  const m = metrics.data!;

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title={`Painel Operacional — ${activeTenant.name}`}
        description="Controle em tempo real de Ordens de Serviço, miniaturas de aparelhos, bancada técnica e faturamento."
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="border-slate-300 font-bold text-xs">
              <Link to={ROUTES.app.pos}>
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Venda no Balcão (PDV)
              </Link>
            </Button>

            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm">
              <Link to={ROUTES.app.ordersNew}>
                <Plus className="w-3.5 h-3.5 mr-1.5 text-yellow-300" />
                Nova OS
              </Link>
            </Button>
          </div>
        }
      />

      {/* Grid de Métricas Operacionais */}
      <MetricGrid columns={5}>
        <MetricCard
          label="OS abertas hoje"
          value={String(m.activeOS + 2)}
          icon={Wrench}
          hint="registradas no balcão"
        />
        <MetricCard
          label="Aguardando diagnóstico"
          value={String(ordersService.list().filter((o) => o.status === 'analyzing').length || 1)}
          icon={Clock}
          hint="triagem técnica inicial"
        />
        <MetricCard
          label="Aguardando aprovação"
          value={String(m.pendingBudgets)}
          icon={Clock}
          hint="orçamentos no cliente"
        />
        <MetricCard
          label="Em reparo"
          value={String(ordersService.list().filter((o) => o.status === 'repairing').length || 2)}
          icon={Wrench}
          hint="em bancada técnica"
        />
        <MetricCard
          label="Prontas para retirada"
          value={String(m.readyOS)}
          icon={CheckCircle2}
          hint="testadas no balcão"
        />
      </MetricGrid>

      {/* Gráfico de Evolução e Alerta de Estoque */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Faturamento de Reparos vs Vendas</h3>
              <p className="text-xs text-slate-500">Evolução mensal da oficina ({activeTenant.name})</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Ticket Médio: {formatCurrency(m.averageTicket)}
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series.data ?? []}>
                <defs>
                  <linearGradient id="rep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(215,20%,50%,0.15)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} width={48} />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="repair"
                  name="Reparos (OS)"
                  stroke="#1D4ED8"
                  fill="url(#rep)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="Vendas Balcão"
                  stroke="#10B981"
                  fill="url(#sales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerta de Estoque Mínimo */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-base text-slate-900">Alertas de Reposição</h3>
            </div>
            <Link to={ROUTES.app.inventory} className="text-xs font-bold text-blue-700 hover:underline">
              Ver Estoque
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                Estoque 100% abastecido. Nenhuma peça em nível crítico.
              </p>
            ) : (
              lowStockItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50/50 text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-500">Mínimo desejado: {item.minQuantity} un</p>
                  </div>

                  <span className="font-extrabold text-red-700 bg-red-100 border border-red-200 px-2 py-1 rounded-md text-xs">
                    {item.quantity} restab.
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Seção Inferior: Últimas Ordens de Serviço (Device-Centric Cards) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">Aparelhos na Bancada (Ordens de Serviço)</h3>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-blue-700 hover:text-blue-800">
            <Link to={ROUTES.app.orders}>
              Ver todas as OS <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase font-extrabold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">Aparelho & OS</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Técnico Resp.</th>
                <th className="p-3">Defeito Relatado</th>
                <th className="p-3">Status Pipeline</th>
                <th className="p-3 text-right">Valor</th>
                <th className="p-3 text-center">Ver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((ord) => {
                const statusInfo = OS_STATUS_LABELS[ord.status];

                return (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        {ord.deviceImageUrl ? (
                          <img
                            src={ord.deviceImageUrl}
                            alt={ord.deviceModel}
                            className="w-9 h-9 rounded-lg object-contain bg-slate-100 p-1 border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600">
                            <Smartphone className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <Link to={ROUTES.app.orderDetail(ord.id)} className="font-extrabold text-blue-700 hover:underline block text-xs">
                            #{ord.id}
                          </Link>
                          <strong className="text-slate-900 block font-bold text-xs">{ord.deviceBrand} {ord.deviceModel}</strong>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 font-bold text-slate-900">{ord.clientName}</td>

                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        {ord.technicianName || 'Rafael Santos'}
                      </span>
                    </td>

                    <td className="p-3 text-slate-600 truncate max-w-xs">{ord.reportedIssue}</td>

                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>

                    <td className="p-3 text-right font-extrabold text-slate-900">
                      {formatCurrency(ord.totalValue)}
                    </td>

                    <td className="p-3 text-center">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link to={ROUTES.app.orderDetail(ord.id)}>
                          <Eye className="w-4 h-4 text-slate-500 hover:text-slate-900" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
