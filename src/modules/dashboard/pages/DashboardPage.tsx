import {
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react';
import { PageContainer, PageHeader, MetricCard, MetricGrid, LoadingState } from '@/design-system/patterns';
import { useContractStatuses, useDashboardMetrics, useRecentProposals, useRevenueSeries } from '@/hooks/use-dashboard';
import { formatCurrency } from '@/shared/utils/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/config/app.config';
import { Button } from '@/shared/components/ui/button';
import { settingsService } from '@/services/settings.service';

const proposalStatusLabel: Record<string, string> = {
  draft: 'Rascunho', sent: 'Enviada', viewed: 'Visualizada', accepted: 'Aceita', rejected: 'Recusada', expired: 'Expirada',
};

const contractStatusLabel: Record<string, string> = {
  draft: 'Rascunhos', pending_signature: 'Aguardando assinatura', active: 'Ativos', completed: 'Concluidos', cancelled: 'Cancelados',
};

export default function DashboardPage() {
  const metrics = useDashboardMetrics();
  const series = useRevenueSeries();
  const recentProposals = useRecentProposals(5);
  const contractStatuses = useContractStatuses();
  const activeTenant = settingsService.getActiveTenant();

  if (metrics.isLoading) return <PageContainer><LoadingState fullPage label="Carregando visao comercial..." /></PageContainer>;

  const data = metrics.data!;

  return (
    <PageContainer className="space-y-6 sm:space-y-7">
      <PageHeader
        title={`Comercial em movimento | ${activeTenant.name}`}
        description="Veja o que entrou, o que precisa de retorno e onde existe receita esperando decisao."
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-full bg-white/60 px-4 text-xs font-semibold text-black/55 hover:bg-white hover:text-black">
              <Link to={ROUTES.app.clientsNew}><Users className="mr-1.5 size-3.5" />Novo cliente</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full bg-[#171614] px-4 text-xs font-semibold text-white shadow-none hover:bg-[#f26522]">
              <Link to={ROUTES.app.calculator}><Plus className="mr-1.5 size-3.5" />Precificar projeto</Link>
            </Button>
          </div>
        }
      />

      <MetricGrid columns={4}>
        <MetricCard label="Receita contratada" value={formatCurrency(data.revenue)} icon={CircleDollarSign} hint="ativos e concluidos" />
        <MetricCard label="Clientes ativos" value={String(data.clients)} icon={Users} hint="relacionamentos em carteira" />
        <MetricCard label="Pipeline aberto" value={formatCurrency(data.salesRevenue)} icon={FileText} hint={`${data.pendingProposals ?? data.pendingBudgets} propostas em aberto`} />
        <MetricCard label="Taxa de aceite" value={`${data.acceptanceRate ?? 0}%`} icon={TrendingUp} hint="sobre propostas decididas" />
      </MetricGrid>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_.8fr]">
        <section className="rounded-[28px] bg-[#171614] p-5 text-white sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">Receita</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-white">Evolucao comercial</h2>
              <p className="mt-1 text-xs text-white/40">Receita e margem estimada nos ultimos meses</p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-full bg-white/[0.07]"><BarChart3 className="size-4 text-[#f6a576]" /></span>
          </div>

          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series.data ?? []}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F26522" stopOpacity={0.42} /><stop offset="100%" stopColor="#F26522" stopOpacity={0} /></linearGradient>
                  <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F4D7C2" stopOpacity={0.22} /><stop offset="100%" stopColor="#F4D7C2" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="rgba(255,255,255,.28)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,.28)" fontSize={10} tickLine={false} axisLine={false} width={54} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#f5f0e8', border: 0, borderRadius: 16, color: '#171614', fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" name="Receita" stroke="#F26522" fill="url(#revenue)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="profit" name="Margem estimada" stroke="#F4D7C2" fill="url(#profit)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/[0.06] bg-white/70 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">Carteira</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#171614]">Contratos</h2>
            </div>
            <span className="flex size-10 items-center justify-center rounded-full bg-[#ece7df]"><BriefcaseBusiness className="size-4 text-[#f26522]" /></span>
          </div>

          <div className="mt-6 space-y-1">
            {(contractStatuses.data ?? []).map((item) => (
              <div key={item.status} className="flex items-center justify-between rounded-[16px] px-3 py-3 transition hover:bg-black/[0.035]">
                <span className="text-xs text-black/48">{contractStatusLabel[item.status]}</span>
                <span className="text-sm font-semibold text-[#171614]">{item.count}</span>
              </div>
            ))}
          </div>

          <Button asChild variant="ghost" size="sm" className="mt-4 w-full rounded-full bg-[#ece7df] text-xs font-semibold text-black/65 hover:bg-[#e5ded4] hover:text-black">
            <Link to={ROUTES.app.contracts}>Ver contratos <ChevronRight className="ml-1 size-3.5" /></Link>
          </Button>
        </section>
      </div>

      <section className="rounded-[28px] border border-black/[0.06] bg-white/70 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">Acompanhamento</p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#171614]">Propostas que pedem atencao</h2>
            <p className="mt-1 text-xs text-black/40">O que vale acompanhar antes de perder o timing comercial.</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="self-start rounded-full px-3 text-xs font-semibold text-[#a74717] hover:bg-[#f26522]/10 sm:self-auto">
            <Link to={ROUTES.app.proposals}>Ver todas <ChevronRight className="ml-1 size-3.5" /></Link>
          </Button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead className="text-[9px] font-semibold uppercase tracking-[0.13em] text-black/30">
              <tr><th className="pb-3 pr-3">Projeto</th><th className="px-3 pb-3">Cliente</th><th className="px-3 pb-3">Status</th><th className="pb-3 pl-3 text-right">Valor</th></tr>
            </thead>
            <tbody>
              {(recentProposals.data ?? []).map((proposal) => (
                <tr key={proposal.id} className="group border-t border-black/[0.055]">
                  <td className="py-4 pr-3"><Link to={ROUTES.app.proposalDetail(proposal.id)} className="font-semibold text-[#171614] transition group-hover:text-[#f26522]">{proposal.title}</Link></td>
                  <td className="px-3 py-4 text-black/48">{proposal.clientName}</td>
                  <td className="px-3 py-4"><span className="inline-flex rounded-full bg-[#ece7df] px-2.5 py-1 text-[10px] font-semibold text-black/58">{proposalStatusLabel[proposal.status]}</span></td>
                  <td className="py-4 pl-3 text-right font-semibold text-[#171614]">{formatCurrency(proposal.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageContainer>
  );
}
