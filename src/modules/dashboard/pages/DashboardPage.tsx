import {
  Wrench,
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowUpRight,
  Smartphone,
  ChevronRight,
  Package,
} from 'lucide-react';
import {
  PageContainer,
  PageHeader,
  MetricCard,
  MetricGrid,
  LoadingState,
  StatusBadge,
} from '@/design-system/patterns';
import {
  useDashboardMetrics,
  useRevenueSeries,
  useRecentActivities,
} from '@/hooks/use-dashboard';
import { formatCurrency, formatRelativeDate } from '@/shared/utils/utils';
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
import type { OSStatus } from '@/types/domain';

export default function DashboardPage() {
  const metrics = useDashboardMetrics();
  const series = useRevenueSeries();
  const activities = useRecentActivities();

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
        title="Painel de Controle da Oficina"
        description="Acompanhamento em tempo real de Ordens de Serviço, faturamento e peças em estoque."
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={ROUTES.app.pos}>
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                Venda no Balcão (PDV)
              </Link>
            </Button>

            <Button asChild variant="brand" size="sm">
              <Link to={ROUTES.app.ordersNew}>
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Nova OS
              </Link>
            </Button>
          </div>
        }
      />

      {/* Grid de Métricas Principais */}
      <MetricGrid columns={5}>
        <MetricCard
          label="Faturamento Total"
          value={formatCurrency(m.revenue)}
          icon={DollarSign}
          trend={{ value: 18, label: 'reparos + vendas' }}
        />
        <MetricCard
          label="OS em Andamento"
          value={String(m.activeOS)}
          icon={Wrench}
          hint="na bancada ou análise"
        />
        <MetricCard
          label="Prontos p/ Retirada"
          value={String(m.readyOS)}
          icon={CheckCircle2}
          hint="aguardando cliente"
        />
        <MetricCard
          label="Orçamentos Pendentes"
          value={String(m.pendingBudgets)}
          icon={Clock}
          hint="aguardando aprovação"
        />
        <MetricCard
          label="Estoque Baixo"
          value={String(m.lowStockItemsCount)}
          icon={AlertTriangle}
          hint="peças p/ reposição"
        />
      </MetricGrid>

      {/* Gráfico de Evolução e Alerta de Estoque */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-bold text-base text-foreground">Faturamento de Reparos vs Vendas</h3>
              <p className="text-xs text-muted-foreground">Evolução dos últimos 6 meses</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Ticket Médio: {formatCurrency(m.averageTicket)}
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series.data ?? []}>
                <defs>
                  <linearGradient id="rep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(239,84%,57%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(239,84%,57%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(152,60%,36%)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(152,60%,36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(215,20%,50%,0.15)" vertical={false} />
                <XAxis dataKey="month" stroke="hsla(215,16%,42%,0.75)" fontSize={11} tickLine={false} />
                <YAxis stroke="hsla(215,16%,42%,0.75)" fontSize={11} tickLine={false} width={48} />
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
                  stroke="hsl(239,84%,57%)"
                  fill="url(#rep)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="Vendas Balcão"
                  stroke="hsl(152,60%,36%)"
                  fill="url(#sales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerta de Estoque Mínimo */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-foreground">Alertas de Reposição</h3>
            </div>
            <Link to={ROUTES.app.inventory} className="text-xs font-semibold text-primary hover:underline">
              Ver Tudo
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                Estoque 100% abastecido. Nenhuma peça em nível crítico.
              </p>
            ) : (
              lowStockItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-amber-200/60 bg-amber-50/50 text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-500">Mínimo desejado: {item.minQuantity} un</p>
                  </div>

                  <span className="font-extrabold text-red-600 bg-red-100 border border-red-200 px-2 py-1 rounded-md text-xs">
                    {item.quantity} restab.
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Seção Inferior: Últimas Ordens de Serviço */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base text-foreground">Últimas Ordens de Serviço</h3>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link to={ROUTES.app.orders}>
              Ver todas as OS <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 border-b border-border">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Aparelho</th>
                <th className="p-3">Defeito</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((ord) => {
                const statusInfo = OS_STATUS_LABELS[ord.status];

                return (
                  <tr key={ord.id} className="hover:bg-muted/40 transition-colors text-xs">
                    <td className="p-3 font-bold text-primary">
                      <Link to={ROUTES.app.orderDetail(ord.id)}>{ord.id}</Link>
                    </td>
                    <td className="p-3 font-medium text-foreground">{ord.clientName}</td>
                    <td className="p-3">
                      {ord.deviceBrand} {ord.deviceModel}
                    </td>
                    <td className="p-3 text-muted-foreground truncate max-w-xs">{ord.reportedIssue}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-foreground">
                      {formatCurrency(ord.totalValue)}
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
