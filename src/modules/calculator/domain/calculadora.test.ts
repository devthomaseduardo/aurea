import { describe, expect, it } from 'vitest';
import {
  calcularOrcamento,
  converterMoeda,
  gerarContrato,
  modelosPropostas,
  tecnologiasPadrao,
} from './calculadora';
import { createProjeto } from '@/test/fixtures/projeto';

describe('converterMoeda', () => {
  it('retorna o mesmo valor quando as moedas são iguais', () => {
    expect(converterMoeda(100, 'BRL', 'BRL')).toBe(100);
    expect(converterMoeda(50, 'USD', 'USD')).toBe(50);
  });

  it('converte BRL para USD com taxa 5.5', () => {
    expect(converterMoeda(55, 'BRL', 'USD')).toBeCloseTo(10, 5);
  });

  it('converte USD para BRL com taxa 5.5', () => {
    expect(converterMoeda(10, 'USD', 'BRL')).toBeCloseTo(55, 5);
  });
});

describe('calcularOrcamento', () => {
  it('soma horas e dias dos requisitos', () => {
    const resultado = calcularOrcamento(createProjeto());
    expect(resultado.totalHoras).toBe(64);
    expect(resultado.totalDias).toBe(8);
  });

  it('calcula custo base como horas × valorHora', () => {
    const resultado = calcularOrcamento(createProjeto({ valorHora: 100 }));
    expect(resultado.custoBase).toBe(6400);
  });

  it('aplica multiplicadores apenas das tecnologias selecionadas', () => {
    const resultado = calcularOrcamento(createProjeto());
    // React 5% + Node 6% = 11% de 6400
    expect(resultado.custoTecnologias).toBeCloseTo(6400 * 0.11, 5);
  });

  it('inclui custos de serviços adicionais', () => {
    const comServicos = calcularOrcamento(
      createProjeto({
        configuracao: {
          dominio: true, // 80
          hospedagem: true, // 600
          autenticacao: true, // 350
          pagamentos: true, // 600
          apis: true, // 300
          outrosServicos: ['SEO'], // 250
          bufferSeguranca: 0,
          regimeTributario: 'mei',
        },
      })
    );

    expect(comServicos.custoServicos).toBe(80 + 600 + 350 + 600 + 300 + 250);
  });

  it('aplica buffer de segurança sobre base + tecnologias', () => {
    const resultado = calcularOrcamento(
      createProjeto({
        configuracao: {
          dominio: false,
          hospedagem: false,
          autenticacao: false,
          pagamentos: false,
          apis: false,
          outrosServicos: [],
          bufferSeguranca: 20,
          regimeTributario: 'mei',
        },
      })
    );

    const expectedBuffer = (resultado.custoBase + resultado.custoTecnologias) * 0.2;
    expect(resultado.custoBuffer).toBeCloseTo(expectedBuffer, 5);
  });

  it('aplica alíquota correta por regime tributário', () => {
    const mei = calcularOrcamento(
      createProjeto({
        configuracao: {
          dominio: false,
          hospedagem: false,
          autenticacao: false,
          pagamentos: false,
          apis: false,
          outrosServicos: [],
          bufferSeguranca: 0,
          regimeTributario: 'mei',
        },
      })
    );
    const pf = calcularOrcamento(
      createProjeto({
        configuracao: {
          dominio: false,
          hospedagem: false,
          autenticacao: false,
          pagamentos: false,
          apis: false,
          outrosServicos: [],
          bufferSeguranca: 0,
          regimeTributario: 'pf',
        },
      })
    );

    expect(mei.aliquotaImpostos).toBe(0.05);
    expect(pf.aliquotaImpostos).toBe(0.275);
    expect(pf.custoImpostos).toBeGreaterThan(mei.custoImpostos);
  });

  it('gera valores basico/padrao/premium com multiplicadores corretos', () => {
    const resultado = calcularOrcamento(createProjeto());
    expect(resultado.valoresPropostas.basico).toBeCloseTo(resultado.custoTotal * 0.85, 5);
    expect(resultado.valoresPropostas.padrao).toBeCloseTo(resultado.custoTotal, 5);
    expect(resultado.valoresPropostas.premium).toBeCloseTo(resultado.custoTotal * 1.25, 5);
  });

  it('gera 3 entregas com percentuais 40/30/30', () => {
    const resultado = calcularOrcamento(createProjeto());
    expect(resultado.entregas).toHaveLength(3);
    expect(resultado.entregas.map((e) => e.percentual)).toEqual([40, 30, 30]);

    const totalParcelas = resultado.entregas.reduce((acc, e) => acc + e.valor, 0);
    expect(totalParcelas).toBeCloseTo(resultado.valoresPropostas.padrao, 5);
  });

  it('recomenda modelo premium para escopo de alta complexidade', () => {
    const resultado = calcularOrcamento(
      createProjeto({
        requisitos: [
          {
            id: '1',
            descricao: 'A',
            complexidade: 'alta',
            estimativaDias: 5,
            estimativaHoras: 40,
          },
          {
            id: '2',
            descricao: 'B',
            complexidade: 'alta',
            estimativaDias: 5,
            estimativaHoras: 40,
          },
          {
            id: '3',
            descricao: 'C',
            complexidade: 'alta',
            estimativaDias: 5,
            estimativaHoras: 40,
          },
        ],
      })
    );

    expect(resultado.scoreComplexidade).toBeGreaterThan(70);
    expect(resultado.recomendacaoModelo).toBe('premium');
  });

  it('recomenda modelo basico para escopo simples', () => {
    const resultado = calcularOrcamento(
      createProjeto({
        requisitos: [
          {
            id: '1',
            descricao: 'Tarefa simples',
            complexidade: 'baixa',
            estimativaDias: 1,
            estimativaHoras: 8,
          },
        ],
      })
    );

    expect(resultado.scoreComplexidade).toBeLessThanOrEqual(40);
    expect(resultado.recomendacaoModelo).toBe('basico');
  });

  it('converte comparações de mercado para a moeda do projeto', () => {
    const brl = calcularOrcamento(createProjeto({ moeda: 'BRL' }));
    const usd = calcularOrcamento(createProjeto({ moeda: 'USD' }));

    expect(brl.comparacoesMercado.every((c) => c.moeda === 'BRL')).toBe(true);
    expect(usd.comparacoesMercado.every((c) => c.moeda === 'USD')).toBe(true);
  });

  it('inclui requisitos do cliente conforme configuração', () => {
    const resultado = calcularOrcamento(
      createProjeto({
        configuracao: {
          dominio: true,
          hospedagem: true,
          autenticacao: true,
          pagamentos: false,
          apis: false,
          outrosServicos: [],
          bufferSeguranca: 20,
          regimeTributario: 'mei',
        },
      })
    );

    expect(resultado.requisitosCliente.length).toBeGreaterThan(3);
    expect(
      resultado.requisitosCliente.some((r) => r.toLowerCase().includes('domínio'))
    ).toBe(true);
  });

  it('custo total é consistente com a soma dos componentes', () => {
    const r = calcularOrcamento(createProjeto());
    const subtotal = r.custoBase + r.custoTecnologias + r.custoServicos + r.custoBuffer;
    expect(r.custoTotal).toBeCloseTo(subtotal + r.custoImpostos, 5);
  });
});

describe('gerarContrato', () => {
  it('inclui nomes das partes e valor total', () => {
    const projeto = createProjeto();
    const resultado = calcularOrcamento(projeto);
    const contrato = gerarContrato(projeto, resultado);

    expect(contrato).toContain('CONTRATO DE PRESTAÇÃO DE SERVIÇOS');
    expect(contrato).toContain(projeto.contratante.nome);
    expect(contrato).toContain(projeto.contratado.nome);
    expect(contrato).toContain(projeto.nome);
    expect(contrato).toContain('VALOR TOTAL');
  });

  it('usa garantia conforme modelo da proposta', () => {
    const basico = createProjeto({ modeloProposta: 'basico' });
    const premium = createProjeto({ modeloProposta: 'premium' });

    expect(gerarContrato(basico, calcularOrcamento(basico))).toContain('GARANTIA: 30');
    expect(gerarContrato(premium, calcularOrcamento(premium))).toContain('GARANTIA: 90');
  });
});

describe('constantes do domínio', () => {
  it('expõe 3 modelos de proposta', () => {
    expect(modelosPropostas).toHaveLength(3);
    expect(modelosPropostas.map((m) => m.modelo)).toEqual(['basico', 'padrao', 'premium']);
  });

  it('expõe tecnologias padrão com multiplicadores', () => {
    expect(tecnologiasPadrao.length).toBeGreaterThan(10);
    expect(tecnologiasPadrao.every((t) => t.multiplicador && t.multiplicador > 0)).toBe(true);
  });
});
