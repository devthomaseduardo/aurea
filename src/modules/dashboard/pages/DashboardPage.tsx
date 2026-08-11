import {
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Clock3,
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
  useCommercialPipeline,
  useDashboardActions,
  useDashboardMetrics,
  useRevenueSeries,
} from '@/hooks/use-dashboard';
import { formatCurrency } from '@/shared/utils/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/config/app.config';
import { Button } from '@/shared/components/ui/button';
import { settingsService } from '@/services/settings.service';
import { cn } from '@/shared/utils/utils';

const priorityStyle = {
  high: 'bg-[#f26522] text-white',
  medium: 'bg-[#f2c7aa] text-[#7d3514]',
  low: 'bg-[#e7e1d8] text-black/55',
};

const priorityLabel = {
  high: 'Agora',
  medium: 'Hoje',
  low: 'Depois',
};

export default function DashboardPage() {
  const metrics = useDashboardMetrics();
  const series = useRevenueSeries();
  const actions = useDashboardActions();
  const pipeline = useCommercialPipeline();
  const activeTenant = settingsService.getActiveTenant();

  if (metrics.isLoading) {
    return (
      <PageContainer>
        <LoadingState fullPage label="Carregando visão comercial..." />
      </PageContainer>
    );
  }

  const data = metrics.data!;
  const actionItems = actions.data ?? [];
  const pipelineItems = pipeline.data ?? [];
  const pipelineTotal = pipelineItems.reduce((total, item) => total + item.value, 0);

  return (
    <PageContainer className="space-y-6 pb-24 sm:space-y-7 lg:pb-8">
      <PageHeader
        title={`Visão comercial | ${activeTenant.name}`}
        description={
          actionItems.length > 0
            ? `Você tem ${actionItems.length} ponto${actionItems.length > 1 ? 's' : ''} que merece${actionItems.length > 1 ? 'm' : ''} atenção antes de olhar os números.`
            : 'Nenhuma pendência comercial importante agora. Continue alimentando o pipeline.'
        }
        actions={
          <div className="flex w-full gap-2 sm:w-auto">
            <Button asChild variant="ghost" size="sm" className="flex-1 rounded-full bg-white/60 px-4 text-xs font-semibold text-black/55 hover:bg-white hover:text-black sm:flex-none">
              <Link to={ROUTES.app.clientsNew}>
                <Users className="mr-1.5 size-3.5" />
                Novo cliente
              </Link>
            </Button>
            <Button asChild size="sm" className="flex-1 rounded-full bg-[#171614] px-4 text-xs font-semibold text-white shadow-none hover:bg-[#f26522] sm:flex-none">
              <Link to={ROUTES.app.calculator}>
                <Plus className="mr-1.5 size-3.5" />
                Precificar
              </Link>
            </Button>
          </div>
        }
      />

      <section className="overflow-hidden rounded-[30px] bg-[#171614] text-white">
        <div className="grid gap-0 xl:grid-cols-[1.15fr_.85fr]">
          <div className="p-5 sm:p-7 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f6a576]">Próximas ações</p>
                <h2 className="mt-2 max-w-[12ch] text-2xl font-semibold tracking-[-0.045em] text-white sm:text-3xl">
                  O portal mostra o que precisa acontecer agora.
                </h2>
              </div>
              <Clock3 className="mt-1 size-5 text-white/25" />
            </div>

            <div className="mt-7 space-y-2">
              {actionItems.length === 0 ? (
                <div className="rounded-[22px] bg-white/[0.06] p-5">
                  <p className="text-sm font-semibold text-white">Tudo em dia.</p>
                  <p className="mt-1 text-xs leading-6 text-white/40">
                    Continue registrando propostas, contratos e clientes. O Áurea vai destacar atrasos e oportunidades aqui.
                  </p>
                </div>
              ) : (
                actionItems.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="group flex items-start gap-3 rounded-[22px] bg-white/[0.055] p-4 transition hover:bg-white/[0.09] sm:items-center"
                  >
                    <span className={cn('mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] sm:mt-0', priorityStyle[item.priority])}>
                      {priorityLabel[item.priority]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/38">{item.description}</p>
                    </div>
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#f6a576] sm:mt-0" />
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#f26522] p-5 text-white sm:p-7 lg:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Pipeline aberto</p>
            <p className="mt-3 text-[clamp(2.3rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.06em]">
              {formatCurrency(pipelineTotal)}
            </p>
            <p className="mt-3 max-w-xs text-xs leading-6 text-white/65">
              Valor distribuído entre preparação, envio, negociação e aceite.
            </p>

            <div className="mt-8 space-y-2">
              {pipelineItems.map((item) => (
                <div key={item.status} className="rounded-[18px] bg-black/10 px-4 py-3.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/60">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold">{item.count} oportunidade{item.count === 1 ? '' : 's'}</p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums">{formatCurrency(item.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MetricGrid columns={4}>
        <MetricCard label="Receita contratada" value={formatCurrency(data.revenue)} icon={CircleDollarSign} hint="contratos ativos e concluídos" />
        <MetricCard label="Clientes ativos" value={String(data.clients)} icon={Users} hint="relacionamentos em carteira" />
        <MetricCard label="Pipeline em aberto" value={formatCurrency(data.salesRevenue)} icon={FileText} hint={`${data.pendingProposals ?? data.pendingBudgets} propostas em movimento`} />
        <MetricCard label="Taxa de aceite" value={`${data.acceptanceRate ?? 0}%`} icon={TrendingUp} hint="sobre propostas decididas" />
      </MetricGrid>

      <section className="rounded-[30px] border border-black/[0.06] bg-white/70 p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">Receita</p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#171614] sm:text-2xl">Evolução dos últimos seis meses</h2>
            <p className="mt-1 text-xs text-black/40">Calculado com os contratos registrados no workspace.</p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-full bg-[#ece7df]"><BarChart3 className="size-4 text-[#f26522]" /></span>
        </div>

        <div className="mt-6 h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series.data ?? []} margin={{ left: -18, right: 6, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F26522" stopOpacity={0.32} /><stop offset="100%" stopColor="#F26522" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="rgba(23,22,20,.3)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(23,22,20,.25)" fontSize={10} tickLine={false} axisLine={false} width={56} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#171614', border: 0, borderRadius: 14, color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" name="Receita" stroke="#F26522" fill="url(#revenue)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </PageContainer>
  );
}
