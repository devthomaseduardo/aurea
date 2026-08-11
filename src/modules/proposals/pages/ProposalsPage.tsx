import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Copy, FileText, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { PageContainer, SearchBar, EmptyState, LoadingState, StatusBadge } from '@/design-system/patterns';
import { useProposals, useDeleteProposal, useDuplicateProposal, useUpdateProposal } from '@/hooks/use-proposals';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { ROUTES } from '@/core/config/app.config';
import { formatCurrency, formatDate } from '@/shared/utils/utils';
import { toast } from '@/shared/components/ui/use-toast';
import type { ProposalStatus } from '@/types/domain';

const STATUS_OPTIONS: Array<{ value: ProposalStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todas' }, { value: 'draft', label: 'Rascunhos' }, { value: 'sent', label: 'Enviadas' }, { value: 'viewed', label: 'Visualizadas' }, { value: 'accepted', label: 'Aceitas' }, { value: 'rejected', label: 'Recusadas' }, { value: 'expired', label: 'Expiradas' },
];

export default function ProposalsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProposalStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const filters = useMemo(() => ({ search, status, page, pageSize: 10, sortBy: 'updatedAt' as const, sortDir: 'desc' as const }), [search, status, page]);
  const { data, isLoading } = useProposals(filters);
  const remove = useDeleteProposal();
  const duplicate = useDuplicateProposal();
  const update = useUpdateProposal();

  return (
    <PageContainer>
      <section className="mb-9 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-black/32">Pipeline comercial</p>
          <h1 className="max-w-[12ch] text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-[#171614]">Propostas que precisam avançar.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/45">Veja onde cada negociação está, quanto vale e qual movimento faz sentido agora.</p>
        </div>
        <Button asChild className="rounded-full bg-[#171614] px-5 text-xs font-semibold text-white shadow-none hover:bg-[#f26522]">
          <Link to={ROUTES.app.calculator}><Plus className="mr-1.5 size-3.5" />Precificar projeto</Link>
        </Button>
      </section>

      <section className="mb-6 flex flex-col gap-3 rounded-[22px] border border-black/[0.06] bg-white/58 p-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Buscar proposta ou cliente" className="flex-1" />
        <Select value={status} onValueChange={(value) => { setStatus(value as ProposalStatus | 'all'); setPage(1); }}>
          <SelectTrigger className="w-full rounded-full bg-white/70 sm:w-48"><SelectValue placeholder="Etapa comercial" /></SelectTrigger>
          <SelectContent>{STATUS_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
        </Select>
      </section>

      {isLoading ? <LoadingState /> : !data || data.data.length === 0 ? (
        <EmptyState icon={FileText} title={search || status !== 'all' ? 'Nenhuma proposta encontrada' : 'Sua próxima venda começa na precificação'} description={search || status !== 'all' ? 'Ajuste a busca ou o filtro para encontrar outra negociação.' : 'Calcule o projeto primeiro. O Áurea transforma a precificação em uma proposta pronta para apresentar ao cliente.'} action={!search && status === 'all' ? <Button asChild className="rounded-full bg-[#171614] text-white hover:bg-[#f26522]"><Link to={ROUTES.app.calculator}>Precificar primeiro projeto</Link></Button> : undefined} />
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {data.data.map((proposal) => (
              <article key={proposal.id} className="group rounded-[26px] border border-black/[0.06] bg-white/68 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_60px_rgba(35,29,22,.07)] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">Atualizada {formatDate(proposal.updatedAt)}</p>
                    <Link to={ROUTES.app.proposalDetail(proposal.id)} className="mt-2 inline-flex max-w-full items-center gap-2 text-xl font-semibold tracking-[-0.035em] text-[#171614] transition group-hover:text-[#f26522] sm:text-2xl">
                      <span className="truncate">{proposal.title}</span><ArrowUpRight className="size-4 shrink-0" />
                    </Link>
                    <p className="mt-1 truncate text-xs text-black/40">{proposal.clientName || 'Cliente não vinculado'}</p>
                  </div>
                  <StatusBadge kind="proposal" status={proposal.status} />
                </div>

                <div className="mt-8 grid grid-cols-2 gap-2">
                  <div className="rounded-[18px] bg-[#ece7df] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/30">Investimento</p>
                    <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#171614]">{formatCurrency(proposal.totalValue, proposal.currency)}</p>
                  </div>
                  <div className="rounded-[18px] bg-[#ece7df] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/30">Estimativa</p>
                    <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#171614]">{proposal.totalHours}h</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <Link to={ROUTES.app.proposalDetail(proposal.id)} className="text-xs font-semibold text-black/58 transition hover:text-black">Ver proposta</Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-9 rounded-full" aria-label={`Ações da proposta ${proposal.title}`}><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild><Link to={ROUTES.app.proposalDetail(proposal.id)}><ArrowUpRight className="mr-2 size-4" />Ver proposta</Link></DropdownMenuItem>
                      <DropdownMenuItem onClick={async () => { await duplicate.mutateAsync(proposal.id); toast({ title: 'Proposta duplicada' }); }}><Copy className="mr-2 size-4" />Criar nova versão</DropdownMenuItem>
                      {proposal.status === 'draft' && <DropdownMenuItem onClick={async () => { await update.mutateAsync({ id: proposal.id, patch: { status: 'sent', sentAt: new Date().toISOString() } }); toast({ title: 'Proposta marcada como enviada' }); }}><FileText className="mr-2 size-4" />Marcar como enviada</DropdownMenuItem>}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={async () => { await remove.mutateAsync(proposal.id); toast({ title: 'Proposta excluída' }); }}><Trash2 className="mr-2 size-4" />Excluir proposta</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 text-xs text-black/38 sm:flex-row sm:items-center sm:justify-between">
            <span>{data.total} proposta{data.total !== 1 ? 's' : ''} · página {data.page} de {data.totalPages}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="rounded-full bg-white/55" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Anterior</Button>
              <Button variant="ghost" size="sm" className="rounded-full bg-white/55" disabled={page >= data.totalPages} onClick={() => setPage((current) => current + 1)}>Próxima</Button>
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
}
