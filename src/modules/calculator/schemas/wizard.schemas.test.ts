import { describe, expect, it } from 'vitest';
import {
  escopoSchema,
  infoSchema,
  partesSchema,
  tecnologiasSchema,
  WIZARD_STEPS,
} from './wizard.schemas';

describe('infoSchema', () => {
  const valid = {
    nome: 'App SaaS',
    descricao: 'Descrição com mais de dez caracteres',
    valorHora: 120,
    moeda: 'BRL' as const,
    regimeTributario: 'mei' as const,
    bufferSeguranca: 20,
  };

  it('aceita dados válidos', () => {
    expect(infoSchema.safeParse(valid).success).toBe(true);
  });

  it('rejeita nome curto', () => {
    const result = infoSchema.safeParse({ ...valid, nome: 'AB' });
    expect(result.success).toBe(false);
  });

  it('rejeita valorHora zero', () => {
    const result = infoSchema.safeParse({ ...valid, valorHora: 0 });
    expect(result.success).toBe(false);
  });

  it('rejeita buffer acima de 100', () => {
    const result = infoSchema.safeParse({ ...valid, bufferSeguranca: 120 });
    expect(result.success).toBe(false);
  });
});

describe('escopoSchema', () => {
  it('exige ao menos um requisito', () => {
    expect(escopoSchema.safeParse({ requisitos: [] }).success).toBe(false);
  });

  it('aceita lista com requisito válido', () => {
    const result = escopoSchema.safeParse({
      requisitos: [
        {
          id: '1',
          descricao: 'Dashboard',
          complexidade: 'media',
          estimativaDias: 2,
          estimativaHoras: 16,
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});

describe('tecnologiasSchema', () => {
  const base = {
    dominio: false,
    hospedagem: false,
    autenticacao: false,
    pagamentos: false,
    apis: false,
    outrosServicos: [] as string[],
  };

  it('exige ao menos uma tecnologia selecionada', () => {
    const result = tecnologiasSchema.safeParse({
      ...base,
      tecnologias: [{ id: '1', nome: 'React', selecionada: false, multiplicador: 5 }],
    });
    expect(result.success).toBe(false);
  });

  it('aceita quando há tecnologia selecionada', () => {
    const result = tecnologiasSchema.safeParse({
      ...base,
      tecnologias: [{ id: '1', nome: 'React', selecionada: true, multiplicador: 5 }],
    });
    expect(result.success).toBe(true);
  });
});

describe('partesSchema', () => {
  it('exige nomes de contratante e contratado', () => {
    const invalid = partesSchema.safeParse({
      contratante: { nome: 'A' },
      contratado: { nome: 'B' },
      modeloProposta: 'padrao',
    });
    expect(invalid.success).toBe(false);

    const valid = partesSchema.safeParse({
      contratante: { nome: 'Empresa X' },
      contratado: { nome: 'Dev Y' },
      modeloProposta: 'premium',
    });
    expect(valid.success).toBe(true);
  });
});

describe('WIZARD_STEPS', () => {
  it('possui 6 etapas na ordem correta', () => {
    expect(WIZARD_STEPS).toHaveLength(6);
    expect(WIZARD_STEPS.map((s) => s.id)).toEqual([
      'info',
      'escopo',
      'tech',
      'custos',
      'cronograma',
      'resumo',
    ]);
  });
});
