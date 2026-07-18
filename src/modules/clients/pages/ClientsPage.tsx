import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Users, ArrowUpDown } from 'lucide-react';
import {
  PageContainer,
  PageHeader,
  SearchBar,
  FilterPanel,
  EmptyState,
  LoadingState,
  StatusBadge,
} from '@/design-system/patterns';
import { useClients, useDeleteClient } from '@/hooks/use-clients';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { ROUTES } from '@/core/config/app.config';
import { formatDate } from '@/shared/utils/utils';
import { toast } from '@/shared/components/ui/use-toast';
import type { ClientStatus } from '@/types/domain';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ClientStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'updatedAt'>('updatedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const filters = useMemo(
    () => ({ search, status, sortBy, sortDir, page, pageSize: 10 }),
    [search, status, sortBy, sortDir, page]
  );

  const { data, isLoading } = useClients(filters);
  const remove = useDeleteClient();
  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await remove.mutateAsync(deleteId);
    toast({ title: 'Cliente removido' });
    setDeleteId(null);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Clientes"
        description="Gerencie sua base de clientes e leads."
        actions={
          <Button asChild variant="brand">
            <Link to={ROUTES.app.clientsNew}>
              <Plus className="w-4 h-4" />
              Novo cliente
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
          placeholder="Buscar por nome, e-mail, empresa…"
          className="flex-1"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as ClientStatus | 'all');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="lead">Leads</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </FilterPanel>

      {isLoading ? (
        <LoadingState />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente encontrado"
          description="Ajuste os filtros ou cadastre seu primeiro cliente."
          action={
            <Button asChild variant="brand">
              <Link to={ROUTES.app.clientsNew}>Cadastrar cliente</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="app-panel overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead>
                    <button
                      className="inline-flex items-center gap-1 hover:text-foreground"
                      onClick={() => toggleSort('name')}
                    >
                      Nome <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Empresa</TableHead>
                  <TableHead className="hidden sm:table-cell">E-mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <button
                      className="inline-flex items-center gap-1"
                      onClick={() => toggleSort('updatedAt')}
                    >
                      Atualizado <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((client) => (
                  <TableRow key={client.id} className="border-white/[0.04]">
                    <TableCell className="font-medium">
                      <Link
                        to={ROUTES.app.clientDetail(client.id)}
                        className="hover:text-violet-300 transition-colors"
                      >
                        {client.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {client.company || '-'}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {client.email}
                    </TableCell>
                    <TableCell>
                      <StatusBadge kind="client" status={client.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                      {formatDate(client.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button asChild variant="ghost" size="icon">
                          <Link to={ROUTES.app.clientDetail(client.id)}>
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(client.id)}
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>
              {data.total} cliente{data.total !== 1 ? 's' : ''} · página {data.page} de{' '}
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

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cliente será removido da sua base local.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
