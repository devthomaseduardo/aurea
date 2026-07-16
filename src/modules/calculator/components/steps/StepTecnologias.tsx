import { useState } from 'react';
import { useCalculatorStore } from '@/stores/calculator.store';
import { FormSection, FormGroup, FormActions } from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { tecnologiasSchema } from '../../schemas/wizard.schemas';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function StepTecnologias({ onNext, onBack }: Props) {
  const { projeto, updateProjeto } = useCalculatorStore();
  const [error, setError] = useState<string | null>(null);
  const [outro, setOutro] = useState('');
  const toggleTech = (id: string) => {
    updateProjeto({
      tecnologias: projeto.tecnologias.map((t) =>
        t.id === id ? { ...t, selecionada: !t.selecionada } : t
      ),
    });
  };

  const toggleCfg = (key: 'dominio' | 'hospedagem' | 'autenticacao' | 'pagamentos' | 'apis') => {
    updateProjeto({
      configuracao: {
        ...projeto.configuracao,
        [key]: !projeto.configuracao[key],
      },
    });
  };

  const addOutro = () => {
    if (!outro.trim()) return;
    updateProjeto({
      configuracao: {
        ...projeto.configuracao,
        outrosServicos: [...projeto.configuracao.outrosServicos, outro.trim()],
      },
    });
    setOutro('');
  };

  const submit = () => {
    const parsed = tecnologiasSchema.safeParse({
      tecnologias: projeto.tecnologias,
      dominio: projeto.configuracao.dominio,
      hospedagem: projeto.configuracao.hospedagem,
      autenticacao: projeto.configuracao.autenticacao,
      pagamentos: projeto.configuracao.pagamentos,
      apis: projeto.configuracao.apis,
      outrosServicos: projeto.configuracao.outrosServicos,
    });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Inválido');
      return;
    }
    setError(null);
    onNext();
  };

  const services = [
    { key: 'dominio' as const, label: 'Domínio' },
    { key: 'hospedagem' as const, label: 'Hospedagem' },
    { key: 'autenticacao' as const, label: 'Autenticação' },
    { key: 'pagamentos' as const, label: 'Pagamentos' },
    { key: 'apis' as const, label: 'APIs externas' },
  ];

  return (
    <div className="space-y-6">
      <FormSection
        title="Tecnologias"
        description="Selecione a stack — cada tecnologia ajusta o multiplicador de custo."
      >
        <div className="flex flex-wrap gap-2">
          {projeto.tecnologias.map((tec) => (
            <button
              key={tec.id}
              type="button"
              onClick={() => toggleTech(tec.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                tec.selecionada
                  ? 'bg-primary/20 border-primary/40 text-violet-200'
                  : 'bg-white/[0.02] border-white/10 text-white/50 hover:border-white/20'
              )}
            >
              {tec.nome}
              {tec.multiplicador ? ` +${tec.multiplicador}%` : ''}
            </button>
          ))}
        </div>
      </FormSection>

      <FormSection title="Serviços adicionais">
        <FormGroup columns={2}>
          {services.map((s) => (
            <label
              key={s.key}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] cursor-pointer hover:bg-white/[0.02]"
            >
              <Checkbox
                checked={projeto.configuracao[s.key]}
                onCheckedChange={() => toggleCfg(s.key)}
              />
              <span className="text-sm">{s.label}</span>
            </label>
          ))}
        </FormGroup>

        <div className="space-y-2">
          <Label>Outros serviços</Label>
          <div className="flex gap-2">
            <Input

              value={outro}
              onChange={(e) => setOutro(e.target.value)}
              placeholder="Ex: SEO técnico"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOutro())}
            />
            <Button type="button" variant="outline" onClick={addOutro}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {projeto.configuracao.outrosServicos.map((s, i) => (
              <span
                key={`${s}-${i}`}
                className="inline-flex items-center gap-1 badge-pill"
              >
                {s}
                <button
                  type="button"
                  onClick={() =>
                    updateProjeto({
                      configuracao: {
                        ...projeto.configuracao,
                        outrosServicos: projeto.configuracao.outrosServicos.filter(
                          (_, idx) => idx !== i
                        ),
                      },
                    })
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </FormSection>

      <FormActions>
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button type="button" className="btn-primary" onClick={submit}>
          Continuar
        </Button>
      </FormActions>
    </div>
  );
}
