import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Copy,
  FileText,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  PageContainer,
  SearchBar,
  EmptyState,
  LoadingState,
  StatusBadge,
} from '@/design-system/patterns';
import {
  useProposals,
  useDeleteProposal,
  useDuplicateProposal,
  useUpdateProposal,
} from '@/hooks/use-proposals';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ROUTES } from '@/core/config/app.config';
import { formatCurrency, formatDate } from '@/shared/utils/utils';
import { toast } from '@/shared/components/ui/use-toast';
import type { ProposalStatus } from '@/types/domain';

const STATUS_OPTIONS: Array<{ value: ProposalStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'draft', label: 'Rascunhos' },
  { value: 'sent', label: 'Enviadas' },
  { value: 'viewed', label: 'Visualizadas' },
  { value: 'accepted', label: 'Aceitas' },
  { value: 'rejected', label: 'Recusadas' },
  { value: 'expired', label: 'Expiradas' },
];

export default function ProposalsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProposalStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({ search, status, page, pageSize: 10, sortBy: 'updatedAt' as const, sortDir: 'desc' as const }),
    [search, status, page]
  );

  const { data, isLoading } = useProposals(filters);
  const remove = useDeleteProposal();
  const duplicate = useDuplicateProposal();
  const update = useUpdateProposal();

  return (
    <PageContainer>
      <section className="mb-8 grid gap-6 border-b border-border/70 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Comercial
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Propostas
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Acompanhe o que está em preparação, o que já chegou ao cliente e quais negociações estão mais próximas de virar contrato.
          </p>
        </div>

        <Button asChild className="btn-primary min-h-11 px-5">
          <Link to={ROUTES.app.calculator}>
            <Plus className="h-4 w-4" />
            Precificar projeto
          </Link>
        </Button>
      </section>

      <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-3 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Buscar proposta ou cliente"
          className="flex-1"
        />

        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as ProposalStatus | 'all');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Etapa comercial" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {isLoading ? (
        <LoadingState />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={search || status !== 'all' ? 'Nenhuma proposta encontrada' : 'Sua próxima venda começa na precificação'}
          description={
            search || status !== 'all'
              ? 'Ajuste a busca ou o filtro para encontrar outra negociação.'
              : 'Calcule o projeto primeiro. O Áurea transforma a precificação em uma proposta pronta para apresentar ao cliente.'
          }
          action={
            !search && status === 'all' ? (
              <Button asChild className="btn-primary">
                <Link to={ROUTES.app.calculator}>Precificar primeiro projeto</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70 bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-5">Negociação</TableHead>
                  <TableHead className="hidden md:table-cell">Cliente</TableHead>
                  <TableHead>Investimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Última atividade</TableHead>
                  <TableHead className="pr-4 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.data.map((proposal) => (
                  <TableRow key={proposal.id} className="group border-border/60">
                    <TableCell className="pl-5 py-4">
                      <Link
                        to={ROUTES.app.proposalDetail(proposal.id)}
                        className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {proposal.title}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                      </Link>
                      <div className="mt-1 max-w-[240px] truncate text-xs text-muted-foreground md:hidden">
                        {proposal.clientName || 'Cliente não vinculado'}
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {proposal.clientName || 'Não vinculado'}
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold tabular-nums text-foreground">
                        {formatCurrency(proposal.totalValue, proposal.currency)}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {proposal.totalHours}h estimadas
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusBadge kind="proposal" status={proposal.status} />
                    </TableCell>

                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDate(proposal.updatedAt)}
                    </TableCell>

                    <TableCell className="pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Ações da proposta ${proposal.title}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link to={ROUTES.app.proposalDetail(proposal.id)}>
                              <ArrowUpRight className="mr-2 h-4 w-4" />
                              Ver proposta
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={async () => {
                              await duplicate.mutateAsync(proposal.id);
                              toast({ title: 'Proposta duplicada' });
                            }}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Criar nova versão
                          </DropdownMenuItem>

                          {proposal.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={async () => {
                                await update.mutateAsync({
                                  id: proposal.id,
                                  patch: {
                                    status: 'sent',
                                    sentAt: new Date().toISOString(),
                                  },
                                });
                                toast({ title: 'Proposta marcada como enviada' });
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Marcar como enviada
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={async () => {
                              await remove.mutateAsync(proposal.id);
                              toast({ title: 'Proposta excluída' });
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir proposta
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              {data.total} proposta{data.total !== 1 ? 's' : ''} · página {data.page} de {data.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
}
