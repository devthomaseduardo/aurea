import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { infoSchema, type InfoFormValues } from '../../schemas/wizard.schemas';
import { useCalculatorStore } from '@/stores/calculator.store';
import { FormSection, FormGroup, FormActions } from '@/design-system/patterns';
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
import { DollarSign } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export function StepInfo({ onNext }: Props) {
  const { projeto, updateProjeto } = useCalculatorStore();
  const form = useForm<InfoFormValues>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      nome: projeto.nome,
      descricao: projeto.descricao,
      valorHora: projeto.valorHora,
      moeda: projeto.moeda,
      regimeTributario: projeto.configuracao.regimeTributario ?? 'mei',
      bufferSeguranca: projeto.configuracao.bufferSeguranca ?? 20,
    },
  });

  const submit = (values: InfoFormValues) => {
    updateProjeto({
      nome: values.nome,
      descricao: values.descricao,
      valorHora: values.valorHora,
      moeda: values.moeda,
      configuracao: {
        ...projeto.configuracao,
        regimeTributario: values.regimeTributario,
        bufferSeguranca: values.bufferSeguranca,
      },
    });
    onNext();
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
      <FormSection
        title="Informações do projeto"
        description="Defina os dados fundamentais e parâmetros comerciais."
      >
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do projeto</Label>
          <Input
            id="nome"
            placeholder="Ex: Site Institucional da Empresa X"
            {...form.register('nome')}
          />
          {form.formState.errors.nome && (
            <p className="text-xs text-rose-400">{form.formState.errors.nome.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            className="min-h-[120px]"
            placeholder="Descreva objetivo e escopo do projeto…"
            {...form.register('descricao')}
          />
          {form.formState.errors.descricao && (
            <p className="text-xs text-rose-400">{form.formState.errors.descricao.message}</p>
          )}
        </div>

        <FormGroup columns={2}>
          <div className="space-y-2">
            <Label htmlFor="valorHora">Valor por hora</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="valorHora"
                type="number"
                className="pl-9"
                {...form.register('valorHora', { valueAsNumber: true })}
              />
            </div>
            {form.formState.errors.valorHora && (
              <p className="text-xs text-rose-400">{form.formState.errors.valorHora.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Moeda</Label>
            <Select
              value={form.watch('moeda')}
              onValueChange={(v) => form.setValue('moeda', v as 'BRL' | 'USD')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real (R$)</SelectItem>
                <SelectItem value="USD">Dólar ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FormGroup>

        <FormGroup columns={2}>
          <div className="space-y-2">
            <Label>Regime tributário</Label>
            <Select
              value={form.watch('regimeTributario')}
              onValueChange={(v) =>
                form.setValue(
                  'regimeTributario',
                  v as InfoFormValues['regimeTributario']
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pf">Pessoa Física (27,5%)</SelectItem>
                <SelectItem value="mei">MEI (5%)</SelectItem>
                <SelectItem value="pj_simples">PJ Simples (14,5%)</SelectItem>
                <SelectItem value="pj_lucro_presumido">PJ Lucro Presumido (16,5%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="buffer">Buffer de segurança (%)</Label>
            <Input
              id="buffer"
              type="number"
              min={0}
              max={100}
              {...form.register('bufferSeguranca', { valueAsNumber: true })}
            />
          </div>
        </FormGroup>
      </FormSection>

      <FormActions>
        <Button type="submit" className="btn-primary">
          Continuar
        </Button>
      </FormActions>
    </form>
  );
}
