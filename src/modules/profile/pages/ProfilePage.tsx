import { useForm } from 'react-hook-form';
import {
  PageContainer,
  PageHeader,
  FormSection,
  FormGroup,
  FormActions,
} from '@/design-system/patterns';
import { profileService } from '@/services/profile.service';
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
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { toast } from '@/shared/components/ui/use-toast';
import type { UserProfile } from '@/types/domain';

export default function ProfilePage() {
  const profile = profileService.get();
  const form = useForm<UserProfile>({ defaultValues: profile });

  const onSubmit = (values: UserProfile) => {
    profileService.update(values);
    toast({ title: 'Perfil atualizado' });
  };

  const initials = form
    .watch('name')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <PageContainer size="md">
      <PageHeader
        title="Perfil"
        description="Dados usados em contratos, propostas e valores padrão da calculadora."
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="glass-card rounded-2xl p-6 md:p-8 space-y-8"
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-primary/30">
            <AvatarFallback className="bg-primary/20 text-violet-200 text-lg font-bold">
              {initials || 'CF'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{form.watch('name')}</p>
            <p className="text-sm text-muted-foreground">{form.watch('email')}</p>
          </div>
        </div>

        <FormSection title="Identidade">
          <FormGroup columns={2}>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input className="bg-black/20 border-white/10" {...form.register('name')} />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                className="bg-black/20 border-white/10"
                {...form.register('email')}
              />
            </div>
          </FormGroup>
          <FormGroup columns={2}>
            <div className="space-y-2">
              <Label>Documento</Label>
              <Input className="bg-black/20 border-white/10" {...form.register('document')} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input className="bg-black/20 border-white/10" {...form.register('phone')} />
            </div>
          </FormGroup>
          <div className="space-y-2">
            <Label>Empresa / marca</Label>
            <Input className="bg-black/20 border-white/10" {...form.register('companyName')} />
          </div>
          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input className="bg-black/20 border-white/10" {...form.register('address')} />
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              className="bg-black/20 border-white/10 min-h-[100px]"
              {...form.register('bio')}
            />
          </div>
        </FormSection>

        <FormSection title="Comercial">
          <FormGroup columns={3}>
            <div className="space-y-2">
              <Label>Valor/hora</Label>
              <Input
                type="number"
                className="bg-black/20 border-white/10"
                {...form.register('hourlyRate', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>Moeda</Label>
              <Select
                value={form.watch('currency')}
                onValueChange={(v) => form.setValue('currency', v as 'BRL' | 'USD')}
              >
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Regime tributário</Label>
              <Select
                value={form.watch('taxRegime')}
                onValueChange={(v) =>
                  form.setValue('taxRegime', v as UserProfile['taxRegime'])
                }
              >
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pf">Pessoa Física</SelectItem>
                  <SelectItem value="mei">MEI</SelectItem>
                  <SelectItem value="pj_simples">PJ Simples</SelectItem>
                  <SelectItem value="pj_lucro_presumido">PJ Lucro Presumido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FormGroup>
        </FormSection>

        <FormActions>
          <Button type="submit" className="btn-primary text-white">
            Salvar perfil
          </Button>
        </FormActions>
      </form>
    </PageContainer>
  );
}
