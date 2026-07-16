import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PageContainer,
  PageHeader,
  FormSection,
  FormGroup,
  FormActions,
  LoadingState,
} from '@/design-system/patterns';
import { clientSchema, type ClientFormValues } from '../schemas/client.schema';
import { useClient, useCreateClient, useUpdateClient } from '@/hooks/use-clients';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ROUTES } from '@/core/config/app.config';
import { toast } from '@/shared/components/ui/use-toast';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';

export default function ClientFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id) && id !== 'new';
  const navigate = useNavigate();
  const existing = useClient(isEdit ? id! : '');
  const create = useCreateClient();
  const update = useUpdateClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      document: '',
      address: '',
      notes: '',
      status: 'lead',
    },
  });

  useEffect(() => {
    if (existing.data) {
      form.reset({
        name: existing.data.name,
        email: existing.data.email,
        phone: existing.data.phone ?? '',
        company: existing.data.company ?? '',
        document: existing.data.document ?? '',
        address: existing.data.address ?? '',
        notes: existing.data.notes ?? '',
        status: existing.data.status,
      });
    }
  }, [existing.data, form]);

  const onSubmit = async (values: ClientFormValues) => {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, patch: values });
        toast({ title: 'Cliente atualizado' });
      } else {
        await create.mutateAsync(values);
        toast({ title: 'Cliente criado' });
      }
      navigate(ROUTES.app.clients);
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
  };

  if (isEdit && existing.isLoading) {
    return (
      <PageContainer size="md">
        <LoadingState />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="md">
      <PageHeader
        title={isEdit ? 'Editar cliente' : 'Novo cliente'}
        description="Mantenha os dados do cliente atualizados para gerar propostas mais rápidas."
        breadcrumbs={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={ROUTES.app.clients}>Clientes</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{isEdit ? 'Editar' : 'Novo'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="glass-card rounded-2xl p-6 md:p-8 space-y-8"
      >
        <FormSection title="Dados principais">
          <FormGroup columns={2}>
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" className="bg-black/20 border-white/10" {...form.register('name')} />
              {form.formState.errors.name && (
                <p className="text-xs text-rose-400">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                className="bg-black/20 border-white/10"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-rose-400">{form.formState.errors.email.message}</p>
              )}
            </div>
          </FormGroup>
          <FormGroup columns={2}>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" className="bg-black/20 border-white/10" {...form.register('phone')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                className="bg-black/20 border-white/10"
                {...form.register('company')}
              />
            </div>
          </FormGroup>
          <FormGroup columns={2}>
            <div className="space-y-2">
              <Label htmlFor="document">Documento</Label>
              <Input
                id="document"
                className="bg-black/20 border-white/10"
                {...form.register('document')}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(v) =>
                  form.setValue('status', v as ClientFormValues['status'])
                }
              >
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FormGroup>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              className="bg-black/20 border-white/10"
              {...form.register('address')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              className="bg-black/20 border-white/10 min-h-[100px]"
              {...form.register('notes')}
            />
          </div>
        </FormSection>

        <FormActions>
          <Button type="button" variant="outline" asChild>
            <Link to={ROUTES.app.clients}>Cancelar</Link>
          </Button>
          <Button
            type="submit"
            className="btn-primary text-white"
            disabled={create.isPending || update.isPending}
          >
            {isEdit ? 'Salvar alterações' : 'Criar cliente'}
          </Button>
        </FormActions>
      </form>
    </PageContainer>
  );
}
