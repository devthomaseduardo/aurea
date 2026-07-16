import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculatorStore } from '@/stores/calculator.store';
import { FormActions } from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import ResultadoOrcamentoComponent from '../ResultadoOrcamento';
import { useCreateProposalFromCalculation } from '@/hooks/use-proposals';
import { toast } from '@/shared/components/ui/use-toast';
import { ROUTES } from '@/core/config/app.config';
import { Save, RotateCcw } from 'lucide-react';
import { contractsService } from '@/services/contracts.service';
import { gerarContrato } from '../../domain/calculadora';
import { activitiesService } from '@/services/activities.service';

interface Props {
  onBack: () => void;
}

export function StepResumo({ onBack }: Props) {
  const navigate = useNavigate();
  const { projeto, resultado, recalculate, reset } = useCalculatorStore();
  const createProposal = useCreateProposalFromCalculation();
  useEffect(() => {
    recalculate();
  }, [recalculate]);

  if (!resultado) {
    return (
      <div className="py-12 text-center text-muted-foreground text-sm">
        Gerando orçamento…
      </div>
    );
  }

  const saveProposal = async (andContract = false) => {
    const proposal = await createProposal.mutateAsync({
      projeto,
      resultado,
      extras: { status: 'draft' },
    });

    if (andContract) {
      await contractsService.createAsync({
        proposalId: proposal.id,
        title: projeto.nome,
        clientName: projeto.contratante.nome,
        status: 'draft',
        currency: projeto.moeda,
        totalValue:
          resultado.valoresPropostas[projeto.modeloProposta] ?? resultado.custoTotal,
        content: gerarContrato(projeto, resultado),
      });
      await activitiesService.addAsync({
        type: 'contract',
        title: 'Contrato gerado',
        description: projeto.nome,
      });
    }

    toast({
      title: andContract ? 'Proposta e contrato salvos' : 'Proposta salva',
      description: 'Disponível no módulo de propostas.',
    });
    navigate(ROUTES.app.proposalDetail(proposal.id));
  };

  return (
    <div className="space-y-6">
      <ResultadoOrcamentoComponent resultado={resultado} projeto={projeto} />

      <FormActions>
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            toast({ title: 'Calculadora reiniciada' });
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Novo cálculo
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => saveProposal(true)}
          disabled={createProposal.isPending}
        >
          Salvar + contrato
        </Button>
        <Button
          type="button"
          className="btn-primary"
          onClick={() => saveProposal(false)}
          disabled={createProposal.isPending}
        >
          <Save className="w-4 h-4" />
          Salvar proposta
        </Button>
      </FormActions>
    </div>
  );
}
