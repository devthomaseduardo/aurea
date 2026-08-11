import { useForm } from 'react-hook-form';
import { PageContainer, PageHeader } from '@/design-system/patterns';
import { profileService } from '@/services/profile.service';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
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

  const initials = form.watch('name').split(' ').map((name) => name[0]).slice(0, 2).join('').toUpperCase();
  const fieldClass = 'h-11 rounded-[14px] border-black/[0.08] bg-white/72 focus-visible:ring-[#f26522]/20';

  return (
    <PageContainer size="lg">
      <PageHeader title="Seu perfil também faz parte da proposta." description="Dados profissionais, condições comerciais e informações que o Áurea reutiliza durante a precificação e geração de documentos." />

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-[28px] bg-[#171614] p-6 text-white xl:sticky xl:top-24">
          <Avatar className="size-20 border-0">
            <AvatarFallback className="bg-[#f26522] text-xl font-semibold text-white">{initials || 'AU'}</AvatarFallback>
          </Avatar>
          <p className="mt-5 text-xl font-semibold tracking-[-0.035em] text-white">{form.watch('name') || 'Seu nome'}</p>
          <p className="mt-1 truncate text-xs text-white/36">{form.watch('email')}</p>
          <p className="mt-5 text-sm leading-6 text-white/45">Essas informações ajudam a manter propostas e contratos consistentes sem preencher os mesmos dados em cada projeto.</p>
          <div className="mt-7 rounded-[20px] bg-white/[0.06] p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#f6a576]">Referência comercial</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-white">{form.watch('currency')} {Number(form.watch('hourlyRate') || 0).toLocaleString('pt-BR')}</p>
            <p className="mt-1 text-[11px] text-white/30">valor/hora padrão</p>
          </div>
        </aside>

        <div className="space-y-5">
          <section className="rounded-[28px] border border-black/[0.06] bg-white/68 p-5 sm:p-7">
            <div className="mb-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/30">Identidade</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#171614]">Quem assina a entrega</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2"><Label>Nome</Label><Input {...form.register('name')} className={fieldClass} /></label>
              <label className="space-y-2"><Label>E-mail</Label><Input type="email" {...form.register('email')} className={fieldClass} /></label>
              <label className="space-y-2"><Label>Documento</Label><Input {...form.register('document')} className={fieldClass} /></label>
              <label className="space-y-2"><Label>Telefone</Label><Input {...form.register('phone')} className={fieldClass} /></label>
              <label className="space-y-2 sm:col-span-2"><Label>Empresa / marca</Label><Input {...form.register('companyName')} className={fieldClass} /></label>
              <label className="space-y-2 sm:col-span-2"><Label>Endereço</Label><Input {...form.register('address')} className={fieldClass} /></label>
              <label className="space-y-2 sm:col-span-2"><Label>Apresentação curta</Label><Textarea className="min-h-[120px] rounded-[16px] border-black/[0.08] bg-white/72 focus-visible:ring-[#f26522]/20" {...form.register('bio')} /></label>
            </div>
          </section>

          <section className="rounded-[28px] border border-black/[0.06] bg-white/68 p-5 sm:p-7">
            <div className="mb-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/30">Comercial</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#171614]">Base para os próximos cálculos</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <label className="space-y-2"><Label>Valor/hora</Label><Input type="number" {...form.register('hourlyRate', { valueAsNumber: true })} className={fieldClass} /></label>
              <label className="space-y-2"><Label>Moeda</Label><Select value={form.watch('currency')} onValueChange={(value) => form.setValue('currency', value as 'BRL' | 'USD')}><SelectTrigger className={fieldClass}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="BRL">BRL</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></label>
              <label className="space-y-2"><Label>Regime tributário</Label><Select value={form.watch('taxRegime')} onValueChange={(value) => form.setValue('taxRegime', value as UserProfile['taxRegime'])}><SelectTrigger className={fieldClass}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pf">Pessoa Física</SelectItem><SelectItem value="mei">MEI</SelectItem><SelectItem value="pj_simples">PJ Simples</SelectItem><SelectItem value="pj_lucro_presumido">PJ Lucro Presumido</SelectItem></SelectContent></Select></label>
            </div>
          </section>

          <div className="flex justify-end">
            <Button type="submit" className="rounded-full bg-[#171614] px-5 text-xs font-semibold text-white shadow-none hover:bg-[#f26522]">Salvar perfil</Button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
