import { create } from 'zustand';
import {
  DadosProjeto,
  ResultadoOrcamento,
  tecnologiasPadrao,
  calcularOrcamento,
  ModeloProposta,
} from '@/modules/calculator/domain/calculadora';
import { profileService } from '@/services/profile.service';

function createDefaultProjeto(): DadosProjeto {
  const profile = profileService.get();
  return {
    nome: '',
    descricao: '',
    requisitos: [],
    tecnologias: tecnologiasPadrao.map((t) => ({ ...t })),
    configuracao: {
      dominio: false,
      hospedagem: false,
      autenticacao: false,
      pagamentos: false,
      apis: false,
      outrosServicos: [],
      bufferSeguranca: 20,
      regimeTributario: profile.taxRegime,
    },
    valorHora: profile.hourlyRate,
    moeda: profile.currency,
    contratante: { nome: '', documento: '', endereco: '' },
    contratado: {
      nome: profile.name,
      documento: profile.document ?? '',
      endereco: profile.address ?? '',
    },
    modeloProposta: 'padrao',
  };
}

interface CalculatorState {
  step: number;
  projeto: DadosProjeto;
  resultado: ResultadoOrcamento | null;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProjeto: (patch: Partial<DadosProjeto>) => void;
  setProjeto: (projeto: DadosProjeto) => void;
  recalculate: () => ResultadoOrcamento;
  reset: () => void;
  loadDemo: () => void;
}

const demoProjeto = (): DadosProjeto => {
  const profile = profileService.get();
  return {
    nome: 'Landing Page + Dashboard SaaS',
    descricao:
      'Desenvolvimento de uma landing page institucional de alto padrão com seção de preços e dashboard administrativo para gestão de usuários e métricas em tempo real.',
    requisitos: [
      {
        id: '1',
        descricao: 'Design e implementação da Landing Page responsiva',
        complexidade: 'alta',
        estimativaDias: 5,
        estimativaHoras: 40,
      },
      {
        id: '2',
        descricao: 'Sistema de autenticação com login social (Google/GitHub)',
        complexidade: 'alta',
        estimativaDias: 3,
        estimativaHoras: 24,
      },
      {
        id: '3',
        descricao: 'Dashboard com gráficos e métricas em tempo real',
        complexidade: 'alta',
        estimativaDias: 4,
        estimativaHoras: 32,
      },
      {
        id: '4',
        descricao: 'Painel de gestão de usuários (CRUD)',
        complexidade: 'media',
        estimativaDias: 2,
        estimativaHoras: 16,
      },
      {
        id: '5',
        descricao: 'Integração com API de pagamentos (Stripe)',
        complexidade: 'alta',
        estimativaDias: 3,
        estimativaHoras: 24,
      },
      {
        id: '6',
        descricao: 'Deploy em Cloud com CI/CD configurado',
        complexidade: 'media',
        estimativaDias: 2,
        estimativaHoras: 16,
      },
    ],
    tecnologias: tecnologiasPadrao.map((t) => ({
      ...t,
      selecionada: ['1', '4', '17', '18'].includes(t.id),
    })),
    configuracao: {
      dominio: true,
      hospedagem: true,
      autenticacao: true,
      pagamentos: true,
      apis: true,
      outrosServicos: ['SEO técnico e otimização de performance'],
      bufferSeguranca: 20,
      regimeTributario: profile.taxRegime,
    },
    valorHora: profile.hourlyRate,
    moeda: profile.currency,
    contratante: {
      nome: 'Empresa Exemplo Ltda',
      documento: '12.345.678/0001-99',
      endereco: 'Av. Paulista, 1000 — São Paulo, SP',
    },
    contratado: {
      nome: profile.name,
      documento: profile.document ?? '',
      endereco: profile.address ?? '',
    },
    modeloProposta: 'padrao' as ModeloProposta,
  };
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  step: 0,
  projeto: createDefaultProjeto(),
  resultado: null,

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 5) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),

  updateProjeto: (patch) =>
    set((s) => ({
      projeto: { ...s.projeto, ...patch },
    })),

  setProjeto: (projeto) => set({ projeto }),

  recalculate: () => {
    const resultado = calcularOrcamento(get().projeto);
    set({ resultado });
    return resultado;
  },

  reset: () =>
    set({
      step: 0,
      projeto: createDefaultProjeto(),
      resultado: null,
    }),

  loadDemo: () => {
    const projeto = demoProjeto();
    set({ projeto, resultado: calcularOrcamento(projeto), step: 0 });
  },
}));
