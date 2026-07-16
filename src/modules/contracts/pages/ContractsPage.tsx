import { useMemo, useState } from 'react';
import {
  PageContainer,
  PageHeader,
  SearchBar,
  FilterPanel,
  EmptyState,
  LoadingState,
  StatusBadge,
} from '@/design-system/patterns';
import { useQuery } from '@tanstack/react-query';
import { contractsService } from '@/services/contracts.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { formatCurrency, formatDate } from '@/shared/utils/utils';
import { FileSignature } from 'lucide-react';
import type { ContractStatus } from '@/types/domain';

export default function ContractsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContractStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({ search, status, page, pageSize: 10 }),
    [search, status, page]
  );

  const { data, isLoading } = useQuery({
    queryKey: ['contracts', filters],
    queryFn: () => contractsService.list(filters),
  });

  return (
    <PageContainer>
      <PageHeader
        title="Contratos"
        description="Acompanhe contratos ativos, pendentes e concluídos."
      />

      <FilterPanel>
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Buscar contratos…"
          className="flex-1"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as ContractStatus | 'all');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-52 bg-black/20 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="pending_signature">Aguardando assinatura</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </FilterPanel>

      {isLoading ? (
        <LoadingState />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          icon={FileSignature}
          title="Nenhum contrato"
          description="Contratos aparecem aqui após propostas aceitas ou criação manual."
        />
      ) : (
        <>
          <div className="glass-card rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead>Contrato</TableHead>
                  <TableHead className="hidden md:table-cell">Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Atualizado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((c) => (
                  <TableRow key={c.id} className="border-white/[0.04]">
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {c.clientName}
                    </TableCell>
                    <TableCell className="font-semibold tabular-nums">
                      {formatCurrency(c.totalValue, c.currency)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge kind="contract" status={c.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                      {formatDate(c.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>
              {data.total} contrato{data.total !== 1 ? 's' : ''}
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
