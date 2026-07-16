import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partesSchema, type PartesFormValues } from '../../schemas/wizard.schemas';
import { useCalculatorStore } from '@/stores/calculator.store';
import { FormSection, FormGroup, FormActions } from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { modelosPropostas } from '../../domain/calculadora';
import { cn } from '@/shared/utils/utils';
import { Award, ShieldCheck, Star } from 'lucide-react';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const icons = {
  basico: ShieldCheck,
  padrao: Award,
  premium: Star,
};

export function StepCustos({ onNext, onBack }: Props) {
  const { projeto, updateProjeto } = useCalculatorStore();
  const form = useForm<PartesFormValues>({
    resolver: zodResolver(partesSchema),
    defaultValues: {
      contratante: projeto.contratante,
      contratado: projeto.contratado,
      modeloProposta: projeto.modeloProposta,
    },
  });

  const submit = (values: PartesFormValues) => {
    updateProjeto({
      contratante: {
        nome: values.contratante.nome,
        documento: values.contratante.documento ?? '',
        endereco: values.contratante.endereco ?? '',
      },
      contratado: {
        nome: values.contratado.nome,
        documento: values.contratado.documento ?? '',
        endereco: values.contratado.endereco ?? '',
      },
      modeloProposta: values.modeloProposta,
    });
    onNext();
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
      <FormSection title="Modelo comercial" description="Escolha o pacote da proposta.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {modelosPropostas.map((m) => {
            const Icon = icons[m.modelo];
            const selected = form.watch('modeloProposta') === m.modelo;
            return (
              <button
                key={m.modelo}
                type="button"
                onClick={() => form.setValue('modeloProposta', m.modelo)}
                className={cn(
                  'text-left p-4 rounded-2xl border transition-all',
                  selected
                    ? 'border-primary/40 bg-primary/10 shadow-[0_0_24px_rgba(100,80,255,0.15)]'
                    : 'border-white/10 bg-black/15 hover:border-white/20'
                )}
              >
                <Icon className="w-5 h-5 text-violet-400 mb-2" />
                <p className="text-sm font-semibold mb-1">{m.descricao}</p>
                <p className="text-xs text-muted-foreground">
                  Multiplicador {m.multiplicador}x
                </p>
              </button>
            );
          })}
        </div>
      </FormSection>

      <FormSection title="Partes do contrato">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Contratante (cliente)
        </p>
        <FormGroup columns={2}>
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input

              {...form.register('contratante.nome')}
            />
            {form.formState.errors.contratante?.nome && (
              <p className="text-xs text-rose-400">
                {form.formState.errors.contratante.nome.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Documento</Label>
            <Input

              {...form.register('contratante.documento')}
            />
          </div>
        </FormGroup>
        <div className="space-y-2">
          <Label>Endereço</Label>
          <Input

            {...form.register('contratante.endereco')}
          />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-2">
          Contratado (você)
        </p>
        <FormGroup columns={2}>
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input

              {...form.register('contratado.nome')}
            />
            {form.formState.errors.contratado?.nome && (
              <p className="text-xs text-rose-400">
                {form.formState.errors.contratado.nome.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Documento</Label>
            <Input

              {...form.register('contratado.documento')}
            />
          </div>
        </FormGroup>
        <div className="space-y-2">
          <Label>Endereço</Label>
          <Input

            {...form.register('contratado.endereco')}
          />
        </div>
      </FormSection>

      <FormActions>
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" className="btn-primary">
          Continuar
        </Button>
      </FormActions>
    </form>
  );
}
