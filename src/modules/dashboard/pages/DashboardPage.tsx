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
import {
  PageContainer,
  PageHeader,
  MetricCard,
  MetricGrid,
  LoadingState,
} from '@/design-system/patterns';
import {
  useContractStatuses,
  useDashboardMetrics,
  useRecentProposals,
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
import { settingsService } from '@/services/settings.service';

const proposalStatusLabel: Record<string, string> = {
  draft: 'Rascunho',
  sent: 'Enviada',
  viewed: 'Visualizada',
  accepted: 'Aceita',
  rejected: 'Recusada',
  expired: 'Expirada',
};

const contractStatusLabel: Record<string, string> = {
  draft: 'Rascunhos',
  pending_signature: 'Aguardando assinatura',
  active: 'Ativos',
  completed: 'Concluidos',
  cancelled: 'Cancelados',
};

export default function DashboardPage() {
  const metrics = useDashboardMetrics();
  const series = useRevenueSeries();
  const recentProposals = useRecentProposals(5);
  const contractStatuses = useContractStatuses();
  const activeTenant = settingsService.getActiveTenant();

  if (metrics.isLoading) {
    return (
      <PageContainer>
        <LoadingState fullPage label="Carregando visao comercial..." />
      </PageContainer>
    );
  }

  const data = metrics.data!;

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title={`Visao comercial — ${activeTenant.name}`}
        description="Acompanhe clientes, propostas, contratos e receita sem perder o proximo passo do funil."
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="border-slate-300 font-semibold text-xs">
              <Link to={ROUTES.app.clientsNew}>
                <Users className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Novo cliente
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm">
              <Link to={ROUTES.app.calculator}>
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Nova precificacao
              </Link>
            </Button>
          </div>
        }
      />

      <MetricGrid columns={4}>
        <MetricCard
          label="Receita contratada"
          value={formatCurrency(data.revenue)}
          icon={CircleDollarSign}
          hint="contratos ativos e concluidos"
        />
        <MetricCard
          label="Clientes ativos"
          value={String(data.clients)}
          icon={Users}
          hint="relacionamentos em carteira"
        />
        <MetricCard
          label="Propostas em aberto"
          value={String(data.pendingProposals ?? data.pendingBudgets)}
          icon={FileText}
          hint={`${formatCurrency(data.salesRevenue)} no pipeline`}
        />
        <MetricCard
          label="Taxa de aceite"
          value={`${data.acceptanceRate ?? 0}%`}
          icon={TrendingUp}
          hint="propostas decididas"
        />
      </MetricGrid>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-semibold text-base text-slate-900">Evolucao comercial</h2>
              <p className="text-xs text-slate-500">Receita e margem estimada nos ultimos meses</p>
            </div>
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series.data ?? []}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A017" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#D4A017" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(215,20%,50%,0.14)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} width={54} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Receita"
                  stroke="#4F46E5"
                  fill="url(#revenue)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Margem estimada"
                  stroke="#D4A017"
                  fill="url(#profit)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-semibold text-base text-slate-900">Contratos</h2>
              <p className="text-xs text-slate-500">Situacao atual da carteira</p>
            </div>
            <BriefcaseBusiness className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="space-y-2.5">
            {(contractStatuses.data ?? []).map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5"
              >
                <span className="text-xs text-slate-600">{contractStatusLabel[item.status]}</span>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>

          <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold">
            <Link to={ROUTES.app.contracts}>
              Ver contratos <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </section>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="font-semibold text-base text-slate-900">Propostas recentes</h2>
            <p className="text-xs text-slate-500">O que precisa de acompanhamento comercial</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-indigo-700">
            <Link to={ROUTES.app.proposals}>
              Ver todas <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 pr-3">Projeto</th>
                <th className="py-2.5 px-3">Cliente</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 pl-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(recentProposals.data ?? []).map((proposal) => (
                <tr key={proposal.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-3">
                    <Link
                      to={ROUTES.app.proposalDetail(proposal.id)}
                      className="font-semibold text-slate-900 hover:text-indigo-700"
                    >
                      {proposal.title}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{proposal.clientName}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                      {proposalStatusLabel[proposal.status]}
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right font-semibold text-slate-900">
                    {formatCurrency(proposal.totalValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageContainer>
  );
}
