import type { DadosProjeto } from '@/modules/calculator/domain/calculadora';

export function createProjeto(overrides: Partial<DadosProjeto> = {}): DadosProjeto {
  return {
    nome: 'Projeto Teste',
    descricao: 'Descrição completa do projeto de teste para orçamento.',
    requisitos: [
      {
        id: '1',
        descricao: 'Landing page responsiva',
        complexidade: 'media',
        estimativaDias: 3,
        estimativaHoras: 24,
      },
      {
        id: '2',
        descricao: 'API REST',
        complexidade: 'alta',
        estimativaDias: 5,
        estimativaHoras: 40,
      },
    ],
    tecnologias: [
      { id: '1', nome: 'React', selecionada: true, multiplicador: 5 },
      { id: '2', nome: 'Node.js', selecionada: true, multiplicador: 6 },
      { id: '3', nome: 'Vue', selecionada: false, multiplicador: 5 },
    ],
    configuracao: {
      dominio: true,
      hospedagem: true,
      autenticacao: false,
      pagamentos: false,
      apis: false,
      outrosServicos: [],
      bufferSeguranca: 20,
      regimeTributario: 'mei',
    },
    valorHora: 100,
    moeda: 'BRL',
    contratante: {
      nome: 'Cliente Teste',
      documento: '12.345.678/0001-99',
      endereco: 'São Paulo, SP',
    },
    contratado: {
      nome: 'Freelancer Teste',
      documento: '000.000.000-00',
      endereco: 'Rio de Janeiro, RJ',
    },
    modeloProposta: 'padrao',
    ...overrides,
  };
}
