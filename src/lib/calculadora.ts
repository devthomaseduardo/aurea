
export type Requisito = {
  id: string;
  descricao: string;
  complexidade: 'baixa' | 'media' | 'alta';
  estimativaDias: number;
  estimativaHoras: number;
};

export type Tecnologia = {
  id: string;
  nome: string;
  selecionada: boolean;
  multiplicador?: number;
};

export type ConfiguracaoProjeto = {
  dominio: boolean;
  hospedagem: boolean;
  autenticacao: boolean;
  pagamentos: boolean;
  apis: boolean;
  outrosServicos: string[];
  bufferSeguranca?: number; // % extra (ex: 20 = 20%)
  regimeTributario?: 'pf' | 'mei' | 'pj_simples' | 'pj_lucro_presumido';
};

export type Moeda = 'BRL' | 'USD';

export type ComparacaoMercado = {
  plataforma: string;
  valorMinimo: number;
  valorMedio: number;
  valorMaximo: number;
  moeda: Moeda;
};

export type InformacaoContratante = {
  nome: string;
  documento: string;
  endereco: string;
};

export type InformacaoContratado = {
  nome: string;
  documento: string;
  endereco: string;
};

export type ModeloProposta = 'basico' | 'padrao' | 'premium';

export type ValoresProposta = {
  modelo: ModeloProposta;
  multiplicador: number;
  descricao: string;
  beneficios: string[];
};

export type EntregaParcial = {
  numero: number;
  percentual: number;
  prazoEmDias: number;
  descricao: string;
  valor: number;
};

export type DadosProjeto = {
  nome: string;
  descricao: string;
  requisitos: Requisito[];
  tecnologias: Tecnologia[];
  configuracao: ConfiguracaoProjeto;
  valorHora: number;
  moeda: Moeda;
  assinaturaCliente?: string;
  assinaturaFreelancer?: string;
  contratante: InformacaoContratante;
  contratado: InformacaoContratado;
  modeloProposta: ModeloProposta;
};

export type ResultadoOrcamento = {
  totalHoras: number;
  totalDias: number;
  custoBase: number;
  custoTecnologias: number;
  custoServicos: number;
  custoBuffer: number;
  custoImpostos: number;
  aliquotaImpostos: number;
  custoTotal: number;
  requisitosCliente: string[];
  comparacoesMercado: ComparacaoMercado[];
  moeda: Moeda;
  valoresPropostas: {
    basico: number;
    padrao: number;
    premium: number;
  };
  entregas: EntregaParcial[];
  scoreComplexidade: number; // 0–100
  recomendacaoModelo: ModeloProposta;
};

// ── Tax rates by regime ──
const ALIQUOTAS_IMPOSTO: Record<string, number> = {
  pf: 0.275,             // IR + INSS máximo PF
  mei: 0.05,             // MEI DAS simplificado
  pj_simples: 0.145,     // Simples Nacional faixa intermediária
  pj_lucro_presumido: 0.165, // IRPJ + CSLL + PIS + COFINS
};

// ── Service costs (BRL) ──
const CUSTO_DOMINIO = 80;
const CUSTO_HOSPEDAGEM = 50 * 12;
const CUSTO_AUTENTICACAO = 350;
const CUSTO_PAGAMENTOS = 600;
const CUSTO_API = 300;
const CUSTO_OUTROS_SERVICOS = 250;

const TAXA_CONVERSAO_USD_BRL = 5.5;

export const valoresPlataformas: ComparacaoMercado[] = [
  { plataforma: 'Workana',       valorMinimo: 30,  valorMedio: 65,  valorMaximo: 160, moeda: 'BRL' },
  { plataforma: 'Freelancer.com',valorMinimo: 10,  valorMedio: 28,  valorMaximo: 55,  moeda: 'USD' },
  { plataforma: 'Upwork',        valorMinimo: 15,  valorMedio: 35,  valorMaximo: 90,  moeda: 'USD' },
  { plataforma: '99Freelas',     valorMinimo: 50,  valorMedio: 90,  valorMaximo: 160, moeda: 'BRL' },
  { plataforma: 'Fiverr',        valorMinimo: 5,   valorMedio: 30,  valorMaximo: 100, moeda: 'USD' },
];

export const converterMoeda = (valor: number, deMoeda: Moeda, paraMoeda: Moeda): number => {
  if (deMoeda === paraMoeda) return valor;
  return deMoeda === 'BRL'
    ? valor / TAXA_CONVERSAO_USD_BRL
    : valor * TAXA_CONVERSAO_USD_BRL;
};

// ── Models ──
export const modelosPropostas: ValoresProposta[] = [
  {
    modelo: 'basico',
    multiplicador: 0.85,
    descricao: 'Básico — Funcionalidades essenciais',
    beneficios: [
      'Entrega das funcionalidades essenciais',
      'Suporte técnico por 30 dias',
      '1 revisão após a entrega final',
    ],
  },
  {
    modelo: 'padrao',
    multiplicador: 1,
    descricao: 'Padrão — Equilíbrio custo/benefício',
    beneficios: [
      'Todas as funcionalidades planejadas',
      'Suporte técnico por 60 dias',
      '3 rodadas de revisões',
      'Treinamento básico de uso',
      'Documentação técnica simplificada',
    ],
  },
  {
    modelo: 'premium',
    multiplicador: 1.25,
    descricao: 'Premium — Experiência completa',
    beneficios: [
      'Todas as funcionalidades com prioridade máxima',
      'Suporte dedicado por 90 dias',
      'Revisões ilimitadas por 30 dias pós-entrega',
      'Treinamento completo para a equipe',
      'Documentação técnica detalhada',
      'Otimização de performance e SEO técnico',
      'Monitoramento de erros no primeiro mês',
    ],
  },
];

// ── Score helper ──
const calcularScoreComplexidade = (dados: DadosProjeto): number => {
  const qtdAlta   = dados.requisitos.filter(r => r.complexidade === 'alta').length;
  const qtdMedia  = dados.requisitos.filter(r => r.complexidade === 'media').length;
  const qtdBaixa  = dados.requisitos.filter(r => r.complexidade === 'baixa').length;
  const total = dados.requisitos.length || 1;
  const score = ((qtdAlta * 3 + qtdMedia * 2 + qtdBaixa) / (total * 3)) * 100;
  return Math.round(score);
};

// ── Main calculation ──
export const calcularOrcamento = (dados: DadosProjeto): ResultadoOrcamento => {
  const totalHoras = dados.requisitos.reduce((acc, r) => acc + r.estimativaHoras, 0);
  const totalDias  = dados.requisitos.reduce((acc, r) => acc + r.estimativaDias,  0);

  const custoBase = totalHoras * dados.valorHora;

  const custoTecnologias = dados.tecnologias
    .filter(t => t.selecionada && t.multiplicador)
    .reduce((acc, t) => acc + custoBase * ((t.multiplicador || 0) / 100), 0);

  let custoServicos = 0;
  if (dados.configuracao.dominio)      custoServicos += CUSTO_DOMINIO;
  if (dados.configuracao.hospedagem)   custoServicos += CUSTO_HOSPEDAGEM;
  if (dados.configuracao.autenticacao) custoServicos += CUSTO_AUTENTICACAO;
  if (dados.configuracao.pagamentos)   custoServicos += CUSTO_PAGAMENTOS;
  if (dados.configuracao.apis)         custoServicos += CUSTO_API;
  custoServicos += dados.configuracao.outrosServicos.length * CUSTO_OUTROS_SERVICOS;

  // Safety buffer
  const bufferPct   = (dados.configuracao.bufferSeguranca ?? 20) / 100;
  const custoBuffer = (custoBase + custoTecnologias) * bufferPct;

  const subtotal    = custoBase + custoTecnologias + custoServicos + custoBuffer;

  // Taxes
  const regime        = dados.configuracao.regimeTributario ?? 'mei';
  const aliquota      = ALIQUOTAS_IMPOSTO[regime] ?? 0.05;
  const custoImpostos = subtotal * aliquota;

  const custoTotal = subtotal + custoImpostos;

  const valoresPropostas = {
    basico:  custoTotal * 0.85,
    padrao:  custoTotal,
    premium: custoTotal * 1.25,
  };

  // Auto-recommend model based on complexity
  const score = calcularScoreComplexidade(dados);
  const recomendacaoModelo: ModeloProposta =
    score > 70 ? 'premium' : score > 40 ? 'padrao' : 'basico';

  // Payment schedule
  const valorProposta = valoresPropostas[dados.modeloProposta] ?? custoTotal;
  const entregas: EntregaParcial[] = [
    { numero: 1, percentual: 40, prazoEmDias: 0,                              descricao: 'Sinal — assinatura do contrato', valor: valorProposta * 0.40 },
    { numero: 2, percentual: 30, prazoEmDias: Math.ceil(totalDias * 0.5),     descricao: 'Entrega parcial (50% do projeto)',valor: valorProposta * 0.30 },
    { numero: 3, percentual: 30, prazoEmDias: totalDias,                       descricao: 'Entrega final e aprovação',       valor: valorProposta * 0.30 },
  ];

  return {
    totalHoras,
    totalDias,
    custoBase,
    custoTecnologias,
    custoServicos,
    custoBuffer,
    custoImpostos,
    aliquotaImpostos: aliquota,
    custoTotal,
    requisitosCliente: gerarRequisitosCliente(dados),
    comparacoesMercado: valoresPlataformas.map(p =>
      p.moeda !== dados.moeda
        ? { ...p, valorMinimo: converterMoeda(p.valorMinimo, p.moeda, dados.moeda), valorMedio: converterMoeda(p.valorMedio, p.moeda, dados.moeda), valorMaximo: converterMoeda(p.valorMaximo, p.moeda, dados.moeda), moeda: dados.moeda }
        : p
    ),
    moeda: dados.moeda,
    valoresPropostas,
    entregas,
    scoreComplexidade: score,
    recomendacaoModelo,
  };
};

const gerarRequisitosCliente = (dados: DadosProjeto): string[] => {
  const lista: string[] = [
    'Aprovação formal do escopo e cronograma',
    'Detalhamento completo dos requisitos com exemplos',
  ];
  if (dados.configuracao.dominio)      lista.push('Dados para registro de domínio ou acesso ao painel atual');
  if (dados.configuracao.hospedagem)   lista.push('Credenciais do serviço de hospedagem (se existente)');
  if (dados.configuracao.autenticacao) lista.push('Definição de perfis de usuário e níveis de acesso');
  if (dados.configuracao.pagamentos)   lista.push('Credenciais do gateway de pagamento e documentação fiscal');
  if (dados.configuracao.apis)         lista.push('Documentação e chaves de acesso das APIs de terceiros');
  lista.push('Identidade visual completa (logo em alta resolução, paleta de cores, tipografia)');
  lista.push('Todos os conteúdos textuais e mídias do projeto');
  lista.push('Acesso ao ambiente de staging para testes durante o desenvolvimento');
  return lista;
};

export const tecnologiasPadrao: Tecnologia[] = [
  { id: '1',  nome: 'React',       selecionada: false, multiplicador: 5  },
  { id: '2',  nome: 'Angular',     selecionada: false, multiplicador: 7  },
  { id: '3',  nome: 'Vue',         selecionada: false, multiplicador: 5  },
  { id: '4',  nome: 'Next.js',     selecionada: false, multiplicador: 6  },
  { id: '5',  nome: 'Node.js',     selecionada: false, multiplicador: 6  },
  { id: '6',  nome: 'Django',      selecionada: false, multiplicador: 8  },
  { id: '7',  nome: 'Laravel',     selecionada: false, multiplicador: 7  },
  { id: '8',  nome: 'WordPress',   selecionada: false, multiplicador: 4  },
  { id: '9',  nome: 'Shopify',     selecionada: false, multiplicador: 4  },
  { id: '10', nome: 'AWS',         selecionada: false, multiplicador: 10 },
  { id: '11', nome: 'Firebase',    selecionada: false, multiplicador: 5  },
  { id: '12', nome: 'Docker',      selecionada: false, multiplicador: 8  },
  { id: '13', nome: 'GraphQL',     selecionada: false, multiplicador: 7  },
  { id: '14', nome: 'MongoDB',     selecionada: false, multiplicador: 5  },
  { id: '15', nome: 'PostgreSQL',  selecionada: false, multiplicador: 5  },
  { id: '16', nome: 'Supabase',    selecionada: false, multiplicador: 4  },
  { id: '17', nome: 'TypeScript',  selecionada: false, multiplicador: 3  },
  { id: '18', nome: 'Tailwind CSS',selecionada: false, multiplicador: 2  },
];

export const gerarContrato = (dados: DadosProjeto, resultado: ResultadoOrcamento): string => {
  const fmt = (v: number) => dados.moeda === 'BRL' ? `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : `$ ${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const hoje = new Date().toLocaleDateString('pt-BR');
  const modelo = modelosPropostas.find(m => m.modelo === dados.modeloProposta) ?? modelosPropostas[1];
  const valor  = resultado.valoresPropostas[dados.modeloProposta] ?? resultado.custoTotal;

  return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS
==========================================

CONTRATANTE: ${dados.contratante.nome || '[Nome do Cliente]'}
CNPJ/CPF: ${dados.contratante.documento || '[Documento]'}
Endereço: ${dados.contratante.endereco || '[Endereço]'}

CONTRATADO: ${dados.contratado.nome || '[Nome do Freelancer]'}
CNPJ/CPF: ${dados.contratado.documento || '[Documento]'}
Endereço: ${dados.contratado.endereco || '[Endereço]'}

OBJETO: Desenvolvimento do projeto "${dados.nome}"
${dados.descricao}

REQUISITOS:
${dados.requisitos.map((r, i) => `${i + 1}. ${r.descricao} (${r.estimativaHoras}h — complexidade ${r.complexidade})`).join('\n')}

MODELO CONTRATADO: ${modelo.descricao}
BENEFÍCIOS:
${modelo.beneficios.map(b => `- ${b}`).join('\n')}

DETALHAMENTO DE CUSTOS:
- Horas de desenvolvimento: ${fmt(resultado.custoBase)}
- Tecnologias e especialização: ${fmt(resultado.custoTecnologias)}
- Serviços adicionais: ${fmt(resultado.custoServicos)}
- Buffer de segurança (${Math.round((dados.configuracao.bufferSeguranca ?? 20))}%): ${fmt(resultado.custoBuffer)}
- Impostos (${(resultado.aliquotaImpostos * 100).toFixed(1)}%): ${fmt(resultado.custoImpostos)}
- VALOR TOTAL: ${fmt(valor)}

CRONOGRAMA DE PAGAMENTO:
${resultado.entregas.map(e => `- ${e.descricao}: ${fmt(e.valor)} (${e.percentual}%) ${e.prazoEmDias === 0 ? '— na assinatura' : `— em até ${e.prazoEmDias} dias úteis`}`).join('\n')}

PRAZO TOTAL: ${resultado.totalDias} dias úteis a partir da assinatura e recebimento de todos os materiais necessários.

GARANTIA: ${dados.modeloProposta === 'basico' ? '30' : dados.modeloProposta === 'padrao' ? '60' : '90'} dias após a entrega final.

Local e data: ________________, ${hoje}

_________________________________
CONTRATANTE: ${dados.contratante.nome || '[Nome do Cliente]'}

_________________________________
CONTRATADO: ${dados.contratado.nome || '[Nome do Freelancer]'}
`;
};
