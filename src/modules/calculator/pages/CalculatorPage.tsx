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
  const { step, setStep, nextStep, prevStep, loadDemo } = useCalculatorStore();

  return (
    <PageContainer size="lg">
      <PageHeader
        title="Calculadora de orçamento"
        description="Wizard profissional com validação por etapa e geração de propostas."
        actions={
          <Button variant="outline" size="sm" onClick={loadDemo}>
            <Sparkles className="w-4 h-4" />
            Carregar demo
          </Button>
        }
      />

      <div
        className="glass-card rounded-3xl p-6 md:p-10"
        style={{ borderColor: 'rgba(120,100,255,0.1)' }}
      >
        <WizardStepper current={step} onStepClick={(i) => i <= step && setStep(i)} />

        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Etapa {step + 1} de {WIZARD_STEPS.length}
          </p>
          <h2 className="text-xl font-bold">{WIZARD_STEPS[step].label}</h2>
          <p className="text-sm text-muted-foreground">{WIZARD_STEPS[step].description}</p>
        </div>

        {step === 0 && <StepInfo onNext={nextStep} />}
        {step === 1 && <StepEscopo onNext={nextStep} onBack={prevStep} />}
        {step === 2 && <StepTecnologias onNext={nextStep} onBack={prevStep} />}
        {step === 3 && <StepCustos onNext={nextStep} onBack={prevStep} />}
        {step === 4 && <StepCronograma onNext={nextStep} onBack={prevStep} />}
        {step === 5 && <StepResumo onBack={prevStep} />}
      </div>
    </PageContainer>
  );
}
