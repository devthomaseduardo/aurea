import {
  DollarSign,
  Users,
  FolderKanban,
  Clock,
  TrendingUp,
  FileText,
  FileSignature,
  Activity,
  ArrowUpRight,
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
  useRecentProposals,
  useContractStatuses,
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
import type { ProposalStatus, ContractStatus } from '@/types/domain';

const contractLabels: Record<ContractStatus, string> = {
  draft: 'Rascunho',
  pending_signature: 'Assinatura',
  active: 'Ativos',
  completed: 'Concluídos',
  cancelled: 'Cancelados',
};

export default function DashboardPage() {
  const metrics = useDashboardMetrics();
  const series = useRevenueSeries();
  const activities = useRecentActivities();
  const proposals = useRecentProposals();
  const contracts = useContractStatuses();
  if (metrics.isLoading) {
    return (
      <PageContainer>
        <LoadingState fullPage label="Carregando dashboard…" />
      </PageContainer>
    );
  }

  const m = metrics.data!;
  return (
    <PageContainer>
      <PageHeader
        title="Visão geral executiva"
        description="Indicadores comerciais, pipeline e atividade operacional."
        actions={
          <Button asChild variant="brand" size="sm">
            <Link to={ROUTES.app.calculator}>
              Nova proposta
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        }
      />

      <MetricGrid columns={5} className="mb-6">
        <MetricCard
          label="Receita"
          value={formatCurrency(m.revenue)}
          icon={DollarSign}
          trend={{ value: 12, label: 'vs. mês ant.' }}
        />
        <MetricCard
          label="Clientes"
          value={String(m.clients)}
          icon={Users}
          hint="ativos e leads"
        />
        <MetricCard
          label="Projetos"
          value={String(m.projects)}
          icon={FolderKanban}
          hint="em andamento"
        />
        <MetricCard
          label="Horas"
          value={`${m.hours}h`}
          icon={Clock}
          hint="aceitas"
        />
        <MetricCard
          label="Lucro est."
          value={formatCurrency(m.profit)}
          icon={TrendingUp}
          trend={{ value: 8, label: 'margem ~72%' }}
        />
      </MetricGrid>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <div className="xl:col-span-2 app-panel">
          <div className="app-panel-header">
            <div>
              <p className="text-sm font-semibold">Receita × Lucro</p>
              <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
            </div>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series.data ?? []}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(239,84%,57%)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="hsl(239,84%,57%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(152,60%,36%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(152,60%,36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(215,20%,50%,0.15)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="hsla(215,16%,42%,0.75)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsla(215,16%,42%,0.75)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(0,0%,100%)',
                    border: '1px solid hsl(214,28%,88%)',
                    borderRadius: 10,
                    fontSize: 12,
                    color: 'hsl(222,47%,11%)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Receita"
                  stroke="hsl(239,84%,57%)"
                  fill="url(#rev)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Lucro"
                  stroke="hsl(152,60%,36%)"
                  fill="url(#prof)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="app-panel">
          <div className="app-panel-header">
            <div>
              <p className="text-sm font-semibold">Contratos</p>
              <p className="text-xs text-muted-foreground">Por status</p>
            </div>
          </div>
          <div className="p-4 space-y-1">
            {(contracts.data ?? []).map((row) => (
              <div
                key={row.status}
                className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-2.5">
                  <FileSignature className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-foreground/85">
                    {contractLabels[row.status as ContractStatus]}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums w-6 text-right">
                  {row.count}
                </span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Taxa de aceitação</span>
              <span className="text-emerald-600 font-semibold tabular-nums">
                {m.acceptanceRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="app-panel">
          <div className="app-panel-header">
            <p className="text-sm font-semibold">Últimas propostas</p>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link to={ROUTES.app.proposals}>Ver todas</Link>
            </Button>
          </div>
          <div className="p-2">
            {(proposals.data ?? []).map((p) => (
              <Link
                key={p.id}
                to={ROUTES.app.proposalDetail(p.id)}
                className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                <div className="min-w-0 flex items-center gap-3">
                  <div className="feature-icon !w-8 !h-8 shrink-0">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.clientName}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCurrency(p.totalValue, p.currency)}
                  </p>
                  <StatusBadge kind="proposal" status={p.status as ProposalStatus} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="app-panel">
          <div className="app-panel-header">
            <p className="text-sm font-semibold">Atividade recente</p>
          </div>
          <div className="p-4 space-y-4">
            {(activities.data ?? []).map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="mt-0.5 feature-icon !w-8 !h-8 shrink-0">
                  <Activity className="w-3 h-3 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  {a.description && (
                    <p className="text-xs text-muted-foreground truncate">{a.description}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                    {formatRelativeDate(a.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
