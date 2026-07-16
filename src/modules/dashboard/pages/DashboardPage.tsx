import {
  DollarSign,
  Users,
  FolderKanban,
  Clock,
  TrendingUp,
  FileText,
  FileSignature,
  Activity,
} from 'lucide-react';
import {
  PageContainer,
  PageHeader,
  MetricCard,
  MetricGrid,
  SectionTitle,
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
        title="Dashboard"
        description="Visão geral do seu negócio como freelancer."
        actions={
          <Button asChild className="btn-primary text-white">
            <Link to={ROUTES.app.calculator}>Nova proposta</Link>
          </Button>
        }
      />

      <MetricGrid columns={5} className="mb-8">
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
          hint="em projetos aceitos"
        />
        <MetricCard
          label="Lucro est."
          value={formatCurrency(m.profit)}
          icon={TrendingUp}
          trend={{ value: 8, label: 'margem ~72%' }}
        />
      </MetricGrid>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-5">
          <SectionTitle
            title="Receita x Lucro"
            description="Últimos 6 meses (demonstrativo)"
          />
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series.data ?? []}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(243,75%,66%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(243,75%,66%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160,70%,45%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(160,70%,45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(222,47%,7%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Receita"
                  stroke="hsl(243,75%,66%)"
                  fill="url(#rev)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Lucro"
                  stroke="hsl(160,70%,45%)"
                  fill="url(#prof)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contract status */}
        <div className="glass-card rounded-2xl p-5">
          <SectionTitle title="Status dos contratos" />
          <div className="space-y-3 mt-2">
            {(contracts.data ?? []).map((row) => (
              <div
                key={row.status}
                className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
              >
                <div className="flex items-center gap-2">
                  <FileSignature className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-foreground/80">
                    {contractLabels[row.status as ContractStatus]}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums">{row.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Taxa de aceitação</span>
            <span className="text-emerald-400 font-semibold">{m.acceptanceRate}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent proposals */}
        <div className="glass-card rounded-2xl p-5">
          <SectionTitle
            title="Últimas propostas"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to={ROUTES.app.proposals}>Ver todas</Link>
              </Button>
            }
          />
          <div className="space-y-2">
            {(proposals.data ?? []).map((p) => (
              <Link
                key={p.id}
                to={ROUTES.app.proposalDetail(p.id)}
                className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                <div className="min-w-0 flex items-center gap-3">
                  <div className="feature-icon !w-9 !h-9 shrink-0">
                    <FileText className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.clientName}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCurrency(p.totalValue, p.currency)}
                  </p>
                  <StatusBadge kind="proposal" status={p.status as ProposalStatus} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="glass-card rounded-2xl p-5">
          <SectionTitle title="Últimas atividades" />
          <div className="space-y-3">
            {(activities.data ?? []).map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="mt-0.5 feature-icon !w-8 !h-8 shrink-0">
                  <Activity className="w-3 h-3 text-violet-400" />
                </div>
                <div className="min-w-0">
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
