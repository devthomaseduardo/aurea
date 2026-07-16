import { useEffect } from 'react';
import { useCalculatorStore } from '@/stores/calculator.store';
import { FormSection, FormActions } from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { formatCurrency } from '@/shared/utils/utils';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function StepCronograma({ onNext, onBack }: Props) {
  const { projeto, resultado, recalculate } = useCalculatorStore();
  useEffect(() => {
    recalculate();
  }, [recalculate]);

  if (!resultado) {
    return (
      <div className="py-12 text-center text-muted-foreground text-sm">
        Calculando cronograma…
      </div>
    );
  }

  const valor =
    resultado.valoresPropostas[projeto.modeloProposta] ?? resultado.custoTotal;
  return (
    <div className="space-y-6">
      <FormSection
        title="Cronograma e entregas"
        description="Prazos e parcelas gerados automaticamente a partir do escopo."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Prazo total</p>
            <p className="text-xl font-bold">{resultado.totalDias} dias</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Horas</p>
            <p className="text-xl font-bold">{resultado.totalHoras}h</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Investimento</p>
            <p className="text-xl font-bold gradient-text">
              {formatCurrency(valor, projeto.moeda)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {resultado.entregas.map((e) => (
            <div
              key={e.numero}
              className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] bg-black/15"
            >
              <div className="step-number !w-9 !h-9 text-xs shrink-0">{e.numero}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{e.descricao}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {e.prazoEmDias === 0
                    ? 'Na assinatura'
                    : `Em até ${e.prazoEmDias} dias úteis`}
                  <span className="mx-1">·</span>
                  {e.percentual}%
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums shrink-0">
                {formatCurrency(e.valor, projeto.moeda)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/15 text-sm text-emerald-300/90">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            Score de complexidade: <strong>{resultado.scoreComplexidade}</strong> —
            modelo recomendado: <strong>{resultado.recomendacaoModelo}</strong>
          </p>
        </div>
      </FormSection>

      <FormActions>
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button type="button" className="btn-primary" onClick={onNext}>
          Ver resumo
        </Button>
      </FormActions>
    </div>
  );
}
