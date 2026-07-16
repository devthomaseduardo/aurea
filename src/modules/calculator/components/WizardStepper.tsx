import { cn } from '@/shared/utils/utils';
import { WIZARD_STEPS } from '../schemas/wizard.schemas';
import { Check } from 'lucide-react';

interface WizardStepperProps {
  current: number;
  onStepClick?: (index: number) => void;
}

export function WizardStepper({ current, onStepClick }: WizardStepperProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between relative">
        <div
          className="absolute top-5 left-0 right-0 h-px hidden sm:block"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
        {WIZARD_STEPS.map((step, index) => {
          const active = index === current;
          const done = index < current;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick?.(index)}
              className="flex flex-col items-center relative z-10 flex-1 min-w-0 group"
              disabled={index > current}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  active && 'text-white',
                  done && 'text-violet-400',
                  !active && !done && 'text-white/20'
                )}
                style={{
                  background: active
                    ? 'linear-gradient(135deg, hsl(243,75%,66%), hsl(213,90%,60%))'
                    : done
                      ? 'rgba(120,100,255,0.15)'
                      : 'rgba(255,255,255,0.04)',
                  border: active
                    ? 'none'
                    : done
                      ? '1px solid rgba(120,100,255,0.3)'
                      : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: active ? '0 0 20px rgba(120,100,255,0.4)' : 'none',
                }}
              >
                {done ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  'text-[10px] sm:text-xs mt-2 font-medium truncate max-w-full px-0.5',
                  active ? 'text-white/70' : done ? 'text-violet-400/60' : 'text-white/15'
                )}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
