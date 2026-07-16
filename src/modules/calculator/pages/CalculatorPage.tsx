import { PageContainer, PageHeader } from '@/design-system/patterns';
import { WizardStepper } from '../components/WizardStepper';
import { useCalculatorStore } from '@/stores/calculator.store';
import { StepInfo } from '../components/steps/StepInfo';
import { StepEscopo } from '../components/steps/StepEscopo';
import { StepTecnologias } from '../components/steps/StepTecnologias';
import { StepCustos } from '../components/steps/StepCustos';
import { StepCronograma } from '../components/steps/StepCronograma';
import { StepResumo } from '../components/steps/StepResumo';
import { Button } from '@/shared/components/ui/button';
import { Sparkles } from 'lucide-react';
import { WIZARD_STEPS } from '../schemas/wizard.schemas';

export default function CalculatorPage() {
  const { step, setStep, nextStep, prevStep, loadDemo, projeto } = useCalculatorStore();
  const formKey = `${projeto.nome}|${projeto.valorHora}|${projeto.requisitos.length}`;
  return (
    <PageContainer size="lg">
      <PageHeader
        title="Precificação de projetos"
        description="Fluxo corporativo em 6 etapas: escopo, custos, cronograma e proposta formal."
        actions={
          <Button variant="outline" size="sm" onClick={loadDemo}>
            <Sparkles className="w-3.5 h-3.5" />
            Carregar cenário demo
          </Button>
        }
      />

      <div className="app-panel overflow-hidden">
        <div className="px-5 md:px-8 pt-6 md:pt-8 pb-2 border-b border-border bg-[hsl(var(--surface-sunken))]/50">
          <WizardStepper current={step} onStepClick={(i) => i <= step && setStep(i)} />
        </div>

        <div className="p-5 md:p-8">
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5 font-medium">
              Etapa {step + 1} de {WIZARD_STEPS.length}
            </p>
            <h2 className="text-lg font-semibold tracking-tight">
              {WIZARD_STEPS[step].label}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {WIZARD_STEPS[step].description}
            </p>
          </div>

          {step === 0 && <StepInfo key={formKey} onNext={nextStep} />}
          {step === 1 && <StepEscopo key={formKey} onNext={nextStep} onBack={prevStep} />}
          {step === 2 && (
            <StepTecnologias key={formKey} onNext={nextStep} onBack={prevStep} />
          )}
          {step === 3 && <StepCustos key={formKey} onNext={nextStep} onBack={prevStep} />}
          {step === 4 && (
            <StepCronograma key={formKey} onNext={nextStep} onBack={prevStep} />
          )}
          {step === 5 && <StepResumo key={formKey} onBack={prevStep} />}
        </div>
      </div>
    </PageContainer>
  );
}
