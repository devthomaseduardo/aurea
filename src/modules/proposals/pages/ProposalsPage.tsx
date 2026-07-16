import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Copy,
  Trash2,
  FileText,
  MoreHorizontal,
  Download,
} from 'lucide-react';
import {
  PageContainer,
  PageHeader,
  SearchBar,
  FilterPanel,
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
      <PageHeader
        title="Propostas"
        description="Propostas geradas pela calculadora e seu pipeline comercial."
        actions={
          <Button asChild className="btn-primary text-white">
            <Link to={ROUTES.app.calculator}>
              <Plus className="w-4 h-4" />
              Nova proposta
            </Link>
          </Button>
        }
      />

      <FilterPanel>
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Buscar por título, cliente ou tecnologia…"
          className="flex-1"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as ProposalStatus | 'all');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-44 bg-black/20 border-white/10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="sent">Enviada</SelectItem>
            <SelectItem value="viewed">Visualizada</SelectItem>
            <SelectItem value="accepted">Aceita</SelectItem>
            <SelectItem value="rejected">Recusada</SelectItem>
            <SelectItem value="expired">Expirada</SelectItem>
          </SelectContent>
        </Select>
      </FilterPanel>

      {isLoading ? (
        <LoadingState />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhuma proposta ainda"
          description="Use a calculadora para gerar sua primeira proposta profissional."
          action={
            <Button asChild className="btn-primary text-white">
              <Link to={ROUTES.app.calculator}>Abrir calculadora</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="glass-card rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead>Proposta</TableHead>
                  <TableHead className="hidden md:table-cell">Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="hidden sm:table-cell">Horas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Atualizado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((p) => (
                  <TableRow key={p.id} className="border-white/[0.04]">
                    <TableCell>
                      <Link
                        to={ROUTES.app.proposalDetail(p.id)}
                        className="font-medium hover:text-violet-300 transition-colors"
                      >
                        {p.title}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">
                        {p.technologies.slice(0, 3).join(', ') || '—'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {p.clientName}
                    </TableCell>
                    <TableCell className="font-semibold tabular-nums">
                      {formatCurrency(p.totalValue, p.currency)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {p.totalHours}h
                    </TableCell>
                    <TableCell>
                      <StatusBadge kind="proposal" status={p.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                      {formatDate(p.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={ROUTES.app.proposalDetail(p.id)}>
                              <FileText className="w-4 h-4 mr-2" />
                              Abrir
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              await duplicate.mutateAsync(p.id);
                              toast({ title: 'Proposta duplicada' });
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          {p.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={async () => {
                                await update.mutateAsync({
                                  id: p.id,
                                  patch: {
                                    status: 'sent',
                                    sentAt: new Date().toISOString(),
                                  },
                                });
                                toast({ title: 'Marcada como enviada' });
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Marcar enviada
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-rose-400"
                            onClick={async () => {
                              await remove.mutateAsync(p.id);
                              toast({ title: 'Proposta excluída' });
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>
              {data.total} proposta{data.total !== 1 ? 's' : ''} · página {data.page} de{' '}
              {data.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
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
