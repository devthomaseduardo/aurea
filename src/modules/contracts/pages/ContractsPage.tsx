import { useMemo, useState } from 'react';
import { PageContainer, PageHeader, SearchBar, EmptyState, LoadingState, StatusBadge } from '@/design-system/patterns';
import { useQuery } from '@tanstack/react-query';
import { contractsService } from '@/services/contracts.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { formatCurrency, formatDate } from '@/shared/utils/utils';
import { ArrowUpRight, FileSignature } from 'lucide-react';
import type { ContractStatus } from '@/types/domain';

export default function ContractsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContractStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const filters = useMemo(() => ({ search, status, page, pageSize: 10 }), [search, status, page]);
  const { data, isLoading } = useQuery({ queryKey: ['contracts', filters], queryFn: () => contractsService.listAsync(filters) });

  return (
    <PageContainer>
      <PageHeader title="Do aceite à entrega." description="Contratos organizados pelo que está esperando assinatura, em execução e concluído." />

      <div className="mb-6 flex flex-col gap-3 rounded-[22px] border border-black/[0.06] bg-white/58 p-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Buscar contrato ou cliente" className="flex-1" />
        <Select value={status} onValueChange={(value) => { setStatus(value as ContractStatus | 'all'); setPage(1); }}>
          <SelectTrigger className="w-full rounded-full bg-white/70 sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem><SelectItem value="draft">Rascunho</SelectItem><SelectItem value="pending_signature">Aguardando assinatura</SelectItem><SelectItem value="active">Ativos</SelectItem><SelectItem value="completed">Concluídos</SelectItem><SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <LoadingState /> : !data || data.data.length === 0 ? (
        <EmptyState icon={FileSignature} title="Nenhum contrato por aqui" description="Quando uma proposta avançar para fechamento, o contrato entra neste fluxo." />
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {data.data.map((contract) => (
              <article key={contract.id} className="group rounded-[26px] border border-black/[0.06] bg-white/68 p-5 transition-all duration-300 hover:bg-white hover:shadow-[0_22px_55px_rgba(35,29,22,.07)] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">Atualizado {formatDate(contract.updatedAt)}</p>
                    <h2 className="mt-2 truncate text-xl font-semibold tracking-[-0.035em] text-[#171614] sm:text-2xl">{contract.title}</h2>
                    <p className="mt-1 truncate text-xs text-black/40">{contract.clientName}</p>
                  </div>
                  <StatusBadge kind="contract" status={contract.status} />
                </div>

                <div className="mt-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-black/30">Valor contratado</p>
                    <p className="mt-1 text-[clamp(1.7rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.05em] text-[#171614]">{formatCurrency(contract.totalValue, contract.currency)}</p>
                  </div>
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#ece7df] text-[#f26522] transition group-hover:bg-[#171614] group-hover:text-white"><ArrowUpRight className="size-4" /></span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 text-xs text-black/38 sm:flex-row sm:items-center sm:justify-between">
            <span>{data.total} contrato{data.total !== 1 ? 's' : ''}</span>
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
