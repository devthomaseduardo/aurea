import { PageContainer, PageHeader, MetricCard, MetricGrid, SectionTitle } from '@/design-system/patterns';
import { useDashboardMetrics, useRevenueSeries } from '@/hooks/use-dashboard';
import { useQuery } from '@tanstack/react-query';
import { proposalsService } from '@/services/proposals.service';
import { formatCurrency } from '@/shared/utils/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { LoadingState } from '@/design-system/patterns';

const COLORS = [
  'hsl(243,75%,66%)',
  'hsl(213,90%,60%)',
  'hsl(160,70%,45%)',
  'hsl(38,90%,55%)',
  'hsl(0,70%,60%)',
  'hsl(280,60%,60%)',
];

export default function AnalyticsPage() {
  const metrics = useDashboardMetrics();
  const series = useRevenueSeries();
  const status = useQuery({
    queryKey: ['analytics', 'proposal-status'],
    queryFn: () => {
      const all = proposalsService.getAll();
      const map = new Map<string, number>();
      all.forEach((p) => map.set(p.status, (map.get(p.status) ?? 0) + 1));
      return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    },
  });

  if (metrics.isLoading) {
    return (
      <PageContainer>
        <LoadingState fullPage />
      </PageContainer>
    );
  }

  const m = metrics.data!;
  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="Indicadores de performance comercial e operacional."
      />

      <MetricGrid columns={4} className="mb-8">
        <MetricCard label="Receita total" value={formatCurrency(m.revenue)} />
        <MetricCard label="Lucro estimado" value={formatCurrency(m.profit)} />
        <MetricCard label="Taxa de aceitação" value={`${m.acceptanceRate}%`} />
        <MetricCard label="Propostas pendentes" value={String(m.pendingProposals)} />
      </MetricGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5">
          <SectionTitle title="Receita mensal" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series.data ?? []}>
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
                <Bar dataKey="revenue" name="Receita" fill="hsl(243,75%,66%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <SectionTitle title="Propostas por status" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={status.data ?? []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {(status.data ?? []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(222,47%,7%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
