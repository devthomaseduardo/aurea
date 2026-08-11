import { PageContainer, PageHeader, MetricCard, MetricGrid, LoadingState } from '@/design-system/patterns';
import { useDashboardMetrics, useRevenueSeries } from '@/hooks/use-dashboard';
import { useQuery } from '@tanstack/react-query';
import { proposalsService } from '@/services/proposals.service';
import { formatCurrency } from '@/shared/utils/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#F26522', '#171614', '#D8A07D', '#E0C9B8', '#A74717', '#8D8379'];

export default function AnalyticsPage() {
  const metrics = useDashboardMetrics();
  const series = useRevenueSeries();
  const status = useQuery({
    queryKey: ['analytics', 'proposal-status'],
    queryFn: async () => {
      const all = await proposalsService.getAllAsync();
      const map = new Map<string, number>();
      all.forEach((proposal) => map.set(proposal.status, (map.get(proposal.status) ?? 0) + 1));
      return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    },
  });

  if (metrics.isLoading) return <PageContainer><LoadingState fullPage /></PageContainer>;
  const data = metrics.data!;

  return (
    <PageContainer>
      <PageHeader title="Números que ajudam a decidir." description="Acompanhe receita, margem e comportamento das propostas sem transformar o painel em uma coleção de gráficos." />

      <MetricGrid columns={4} className="mb-6">
        <MetricCard label="Receita total" value={formatCurrency(data.revenue)} />
        <MetricCard label="Lucro estimado" value={formatCurrency(data.profit)} />
        <MetricCard label="Taxa de aceitação" value={`${data.acceptanceRate}%`} />
        <MetricCard label="Propostas pendentes" value={String(data.pendingProposals)} />
      </MetricGrid>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-[28px] bg-[#171614] p-5 text-white sm:p-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/30">Receita</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-white">Evolução mensal</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series.data ?? []}>
                <XAxis dataKey="month" stroke="rgba(255,255,255,.28)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,.28)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#f5f0e8', border: 0, borderRadius: 16, color: '#171614', fontSize: 12 }} />
                <Bar dataKey="revenue" name="Receita" fill="#F26522" radius={[8, 8, 3, 3]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/[0.06] bg-white/68 p-5 sm:p-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/30">Pipeline</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#171614]">Propostas por status</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={status.data ?? []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={98} paddingAngle={3}>
                  {(status.data ?? []).map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#171614', color: '#fff', border: 0, borderRadius: 16, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(status.data ?? []).map((item, index) => <span key={item.name} className="inline-flex items-center gap-1.5 rounded-full bg-[#ece7df] px-2.5 py-1 text-[10px] font-medium text-black/55"><span className="size-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />{item.name}: {item.value}</span>)}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
