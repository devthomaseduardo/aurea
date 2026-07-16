import { useState } from 'react';
import { useCalculatorStore } from '@/stores/calculator.store';
import { FormSection, FormActions } from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/shared/utils/utils';
import type { Requisito } from '../../domain/calculadora';
import { escopoSchema } from '../../schemas/wizard.schemas';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function StepEscopo({ onNext, onBack }: Props) {
  const { projeto, updateProjeto } = useCalculatorStore();
  const [error, setError] = useState<string | null>(null);
  const [novo, setNovo] = useState({
    descricao: '',
    complexidade: 'media' as Requisito['complexidade'],
    estimativaDias: 3,
    estimativaHoras: 24,
  });

  const add = () => {
    if (!novo.descricao.trim()) return;
    const req: Requisito = { ...novo, id: generateId('req') };
    updateProjeto({ requisitos: [...projeto.requisitos, req] });
    setNovo({
      descricao: '',
      complexidade: 'media',
      estimativaDias: 3,
      estimativaHoras: 24,
    });
    setError(null);
  };

  const remove = (id: string) => {
    updateProjeto({
      requisitos: projeto.requisitos.filter((r) => r.id !== id),
    });
  };

  const onComplexidade = (c: Requisito['complexidade']) => {
    const map = {
      baixa: { estimativaDias: 1, estimativaHoras: 8 },
      media: { estimativaDias: 3, estimativaHoras: 24 },
      alta: { estimativaDias: 5, estimativaHoras: 40 },
    };
    setNovo((prev) => ({ ...prev, complexidade: c, ...map[c] }));
  };

  const submit = () => {
    const parsed = escopoSchema.safeParse({ requisitos: projeto.requisitos });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Escopo inválido');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Escopo e requisitos"
        description="Liste cada funcionalidade com complexidade e estimativa de tempo."
      >
        <div className="space-y-3">
          {projeto.requisitos.map((req) => (
            <div
              key={req.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-black/15"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{req.descricao}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {req.complexidade} · {req.estimativaDias}d · {req.estimativaHoras}h
                </p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(req.id)}>
                <Trash2 className="w-4 h-4 text-rose-400" />
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-dashed border-white/10 p-4 space-y-3">
          <div className="space-y-2">
            <Label>Novo requisito</Label>
            <Input

              placeholder="Ex: Dashboard com gráficos em tempo real"
              value={novo.descricao}
              onChange={(e) => setNovo((p) => ({ ...p, descricao: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Complexidade</Label>
              <Select
                value={novo.complexidade}
                onValueChange={(v) => onComplexidade(v as Requisito['complexidade'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dias</Label>
              <Input
                type="number"
                value={novo.estimativaDias}
                onChange={(e) =>
                  setNovo((p) => ({ ...p, estimativaDias: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Horas</Label>
              <Input
                type="number"
                value={novo.estimativaHoras}
                onChange={(e) =>
                  setNovo((p) => ({ ...p, estimativaHoras: Number(e.target.value) }))
                }
              />
            </div>
          </div>
          <Button type="button" variant="outline" onClick={add}>
            <Plus className="w-4 h-4" />
            Adicionar requisito
          </Button>
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
