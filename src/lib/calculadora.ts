
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
  custoTotal: number;
  requisitosCliente: string[];
  comparacoesMercado: ComparacaoMercado[];
  moeda: Moeda;
  valoresPropostas: {
    basico: number;
    padrao: number;
    premium: number;
  };
};

// Definição dos modelos de proposta
export const modelosPropostas: ValoresProposta[] = [
  {
    modelo: 'basico',
    multiplicador: 0.85,
    descricao: 'Modelo Básico - Funcionalidades essenciais para o seu projeto',
    beneficios: [
      'Entrega das funcionalidades essenciais',
      'Suporte básico por 30 dias',
      'Uma revisão após a entrega'
    ]
  },
  {
    modelo: 'padrao',
    multiplicador: 1,
    descricao: 'Modelo Padrão - Equilíbrio entre custo e benefícios',
    beneficios: [
      'Todas as funcionalidades planejadas',
      'Suporte por 60 dias',
      'Três revisões após a entrega',
      'Treinamento básico para uso do sistema'
    ]
  },
  {
    modelo: 'premium',
    multiplicador: 1.25,
    descricao: 'Modelo Premium - Experiência completa e suporte estendido',
    beneficios: [
      'Todas as funcionalidades com prioridade máxima',
      'Suporte por 90 dias',
      'Revisões ilimitadas por 30 dias',
      'Treinamento completo para toda equipe',
      'Documentação detalhada do sistema',
      'Otimização de performance'
    ]
  }
];

// Valores fictícios para cálculo
const CUSTO_DOMINIO = 50;
const CUSTO_HOSPEDAGEM = 25 * 12; // Custo anual
const CUSTO_AUTENTICACAO = 300;
const CUSTO_PAGAMENTOS = 500;
const CUSTO_API = 250;
const CUSTO_OUTROS_SERVICOS = 200;

// Taxa de conversão (exemplo, em produção usaria uma API)
const TAXA_CONVERSAO_USD_BRL = 5.5;

// Valores de referência em diferentes plataformas freelancer
export const valoresPlataformas: ComparacaoMercado[] = [
  {
    plataforma: "Workana",
    valorMinimo: 30,
    valorMedio: 60,
    valorMaximo: 150,
    moeda: "BRL"
  },
  {
    plataforma: "Freelancer.com",
    valorMinimo: 10,
    valorMedio: 25,
    valorMaximo: 50,
    moeda: "USD"
  },
  {
    plataforma: "Upwork",
    valorMinimo: 15,
    valorMedio: 30,
    valorMaximo: 80,
    moeda: "USD"
  },
  {
    plataforma: "99Freelas",
    valorMinimo: 50,
    valorMedio: 85,
    valorMaximo: 150,
    moeda: "BRL"
  },
  {
    plataforma: "Fiverr",
    valorMinimo: 5,
    valorMedio: 25,
    valorMaximo: 100,
    moeda: "USD"
  }
];

// Função para converter valores entre moedas
export const converterMoeda = (valor: number, deMoeda: Moeda, paraMoeda: Moeda): number => {
  if (deMoeda === paraMoeda) return valor;
  
  if (deMoeda === 'BRL' && paraMoeda === 'USD') {
    return valor / TAXA_CONVERSAO_USD_BRL;
  } else {
    return valor * TAXA_CONVERSAO_USD_BRL;
  }
};

// Calcular o orçamento com base nos dados do projeto
export const calcularOrcamento = (dados: DadosProjeto): ResultadoOrcamento => {
  // Calcular horas totais
  const totalHoras = dados.requisitos.reduce((total, req) => total + req.estimativaHoras, 0);
  
  // Calcular dias totais
  const totalDias = dados.requisitos.reduce((total, req) => total + req.estimativaDias, 0);
  
  // Calcular custo base (horas * valor/hora)
  const custoBase = totalHoras * dados.valorHora;
  
  // Calcular custo adicional de tecnologias (usando multiplicadores)
  const custoTecnologias = dados.tecnologias
    .filter(tec => tec.selecionada && tec.multiplicador)
    .reduce((total, tec) => total + (custoBase * (tec.multiplicador || 0) / 100), 0);
  
  // Calcular custo de serviços adicionais
  let custoServicos = 0;
  if (dados.configuracao.dominio) custoServicos += CUSTO_DOMINIO;
  if (dados.configuracao.hospedagem) custoServicos += CUSTO_HOSPEDAGEM;
  if (dados.configuracao.autenticacao) custoServicos += CUSTO_AUTENTICACAO;
  if (dados.configuracao.pagamentos) custoServicos += CUSTO_PAGAMENTOS;
  if (dados.configuracao.apis) custoServicos += CUSTO_API;
  
  custoServicos += dados.configuracao.outrosServicos.length * CUSTO_OUTROS_SERVICOS;
  
  // Calcular custo total padrão
  const custoTotal = custoBase + custoTecnologias + custoServicos;
  
  // Calcular variações de preço para os três modelos
  const valoresPropostas = {
    basico: custoTotal * 0.85,
    padrao: custoTotal,
    premium: custoTotal * 1.25
  };
  
  // Gerar lista de requisitos para o cliente
  const requisitosCliente = gerarRequisitosCliente(dados);
  
  // Obter comparações de mercado
  const comparacoesMercado = valoresPlataformas.map(plataforma => {
    // Converter valores para a moeda do projeto se necessário
    if (plataforma.moeda !== dados.moeda) {
      return {
        ...plataforma,
        valorMinimo: converterMoeda(plataforma.valorMinimo, plataforma.moeda, dados.moeda),
        valorMedio: converterMoeda(plataforma.valorMedio, plataforma.moeda, dados.moeda),
        valorMaximo: converterMoeda(plataforma.valorMaximo, plataforma.moeda, dados.moeda),
        moeda: dados.moeda
      };
    }
    return plataforma;
  });
  
  return {
    totalHoras,
    totalDias,
    custoBase,
    custoTecnologias,
    custoServicos,
    custoTotal,
    requisitosCliente,
    comparacoesMercado,
    moeda: dados.moeda,
    valoresPropostas
  };
};

// Gerar lista de coisas que o cliente precisa fornecer
const gerarRequisitosCliente = (dados: DadosProjeto): string[] => {
  const requisitos: string[] = [
    "Detalhamento completo dos requisitos do projeto",
    "Aprovação do escopo e cronograma"
  ];
  
  if (dados.configuracao.dominio) {
    requisitos.push("Informações para registro de domínio ou acesso ao domínio existente");
  }
  
  if (dados.configuracao.hospedagem) {
    requisitos.push("Credenciais do serviço de hospedagem (se já existente)");
  }
  
  if (dados.configuracao.autenticacao) {
    requisitos.push("Definição dos níveis de acesso e perfis de usuário");
  }
  
  if (dados.configuracao.pagamentos) {
    requisitos.push("Credenciais da conta de gateway de pagamento");
    requisitos.push("Documentação fiscal e comercial necessária");
  }
  
  if (dados.configuracao.apis) {
    requisitos.push("Documentação das APIs de terceiros");
    requisitos.push("Chaves de acesso para as APIs");
  }
  
  // Adicionar requisitos comuns
  requisitos.push("Logo e identidade visual (em formatos de alta qualidade)");
  requisitos.push("Conteúdo textual para o projeto");
  requisitos.push("Imagens e mídias para o site/aplicativo");
  
  return requisitos;
};

// Lista padrão de tecnologias
export const tecnologiasPadrao: Tecnologia[] = [
  { id: "1", nome: "React", selecionada: false, multiplicador: 5 },
  { id: "2", nome: "Angular", selecionada: false, multiplicador: 7 },
  { id: "3", nome: "Vue", selecionada: false, multiplicador: 5 },
  { id: "4", nome: "Node.js", selecionada: false, multiplicador: 6 },
  { id: "5", nome: "Django", selecionada: false, multiplicador: 8 },
  { id: "6", nome: "Laravel", selecionada: false, multiplicador: 7 },
  { id: "7", nome: "WordPress", selecionada: false, multiplicador: 4 },
  { id: "8", nome: "Shopify", selecionada: false, multiplicador: 4 },
  { id: "9", nome: "AWS", selecionada: false, multiplicador: 10 },
  { id: "10", nome: "Firebase", selecionada: false, multiplicador: 5 },
  { id: "11", nome: "Docker", selecionada: false, multiplicador: 8 },
  { id: "12", nome: "GraphQL", selecionada: false, multiplicador: 7 },
  { id: "13", nome: "MongoDB", selecionada: false, multiplicador: 5 },
  { id: "14", nome: "MySQL", selecionada: false, multiplicador: 4 },
  { id: "15", nome: "PostgreSQL", selecionada: false, multiplicador: 5 }
];

// Gerar contrato em formato de texto
export const gerarContrato = (dados: DadosProjeto, resultado: ResultadoOrcamento): string => {
  const formatarMoeda = (valor: number) => {
    return dados.moeda === 'BRL' 
      ? `R$ ${valor.toFixed(2)}`
      : `$ ${valor.toFixed(2)}`;
  };

  const hoje = new Date().toLocaleDateString('pt-BR');
  const modeloSelecionado = modelosPropostas.find(modelo => modelo.modelo === dados.modeloProposta) || modelosPropostas[1];
  const valorProposta = resultado.valoresPropostas[dados.modeloProposta] || resultado.custoTotal;
  
  return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS
==========================================

Entre as partes:

CONTRATANTE: ${dados.contratante.nome || '[Nome do Cliente]'}
CNPJ/CPF: ${dados.contratante.documento || '[Número do Documento]'}
Endereço: ${dados.contratante.endereco || '[Endereço do Cliente]'}

CONTRATADO: ${dados.contratado.nome || '[Nome do Freelancer]'}
CNPJ/CPF: ${dados.contratado.documento || '[Número do Documento]'}
Endereço: ${dados.contratado.endereco || '[Endereço do Freelancer]'}

As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.

OBJETO DO CONTRATO
------------------

Cláusula 1ª. O presente contrato tem como objeto a prestação de serviços de desenvolvimento para o projeto "${dados.nome}", conforme detalhado abaixo:

Descrição do Projeto: ${dados.descricao}

Requisitos:
${dados.requisitos.map((req, i) => `${i+1}. ${req.descricao} (${req.estimativaHoras} horas)`).join('\n')}

MODELO DE PROPOSTA ESCOLHIDO
----------------------------

Modelo: ${modeloSelecionado.descricao}

Benefícios inclusos:
${modeloSelecionado.beneficios.map((beneficio, i) => `- ${beneficio}`).join('\n')}

OBRIGAÇÕES DO CONTRATADO
------------------------

Cláusula 2ª. O CONTRATADO se compromete a:
- Desenvolver o projeto conforme os requisitos especificados
- Cumprir os prazos estipulados
- Realizar ajustes e correções necessárias dentro do escopo do projeto
- Manter confidencialidade sobre todas as informações do projeto
- Fornecer suporte técnico conforme definido no modelo de proposta escolhido
- Transferir os direitos autorais do código-fonte ao CONTRATANTE após pagamento integral
- Documentar adequadamente o projeto para facilitar manutenções futuras

OBRIGAÇÕES DO CONTRATANTE
-------------------------

Cláusula 3ª. O CONTRATANTE se compromete a:
- Fornecer todas as informações necessárias para o desenvolvimento em tempo hábil
- Realizar os pagamentos conforme estipulado no presente contrato
- Realizar a aprovação dos entregáveis em tempo hábil
- Não modificar o código fonte sem prévia comunicação ao CONTRATADO durante o período de garantia
- Fornecer os seguintes itens:
${resultado.requisitosCliente.map((req, i) => `  ${i+1}. ${req}`).join('\n')}

VALOR E FORMA DE PAGAMENTO
--------------------------

Cláusula 4ª. Pelos serviços prestados, o CONTRATANTE pagará ao CONTRATADO o valor total de ${formatarMoeda(valorProposta)}, a ser pago da seguinte forma:
- 40% (${formatarMoeda(valorProposta * 0.4)}) na assinatura do contrato
- 30% (${formatarMoeda(valorProposta * 0.3)}) na entrega parcial
- 30% (${formatarMoeda(valorProposta * 0.3)}) na entrega final

DETALHAMENTO DOS CUSTOS
-----------------------

O valor total de ${formatarMoeda(valorProposta)} é composto por:
- Custo base do desenvolvimento: ${formatarMoeda(resultado.custoBase)}
- Custo adicional de tecnologias: ${formatarMoeda(resultado.custoTecnologias)}
- Custo de serviços adicionais: ${formatarMoeda(resultado.custoServicos)}
- Ajuste conforme modelo de proposta escolhido: ${formatarMoeda(valorProposta - resultado.custoTotal)}

PRAZO
-----

Cláusula 5ª. O prazo para conclusão dos serviços é de ${resultado.totalDias} dias úteis, contados a partir da data de assinatura deste contrato e do recebimento de todos os requisitos necessários listados na Cláusula 3ª.

ENTREGAS PARCIAIS
----------------

Para garantir a transparência e acompanhamento do projeto, serão realizadas entregas parciais conforme cronograma abaixo:
- 1ª Entrega (30% do projeto): em até ${Math.ceil(resultado.totalDias * 0.3)} dias úteis
- 2ª Entrega (60% do projeto): em até ${Math.ceil(resultado.totalDias * 0.6)} dias úteis
- Entrega Final (100% do projeto): em até ${resultado.totalDias} dias úteis

TESTES E HOMOLOGAÇÃO
-------------------

Após cada entrega, o CONTRATANTE terá o prazo de 5 dias úteis para realizar testes e solicitar ajustes. Esse período não será contabilizado no prazo total do projeto.

GARANTIA
-------

Cláusula 6ª. O CONTRATADO oferece garantia de ${dados.modeloProposta === 'basico' ? '30' : dados.modeloProposta === 'padrao' ? '60' : '90'} dias sobre o funcionamento do software, contados a partir da data de entrega final.

RESCISÃO
-------

Cláusula 7ª. O presente contrato poderá ser rescindido por qualquer uma das partes, mediante notificação expressa, com 10 dias de antecedência.

Em caso de rescisão, o CONTRATANTE deverá pagar pelos serviços já realizados e entregues, na proporção do valor total.

CONSIDERAÇÕES FINAIS
-------------------

E por estarem assim justos e contratados, firmam o presente instrumento, em duas vias de igual teor.

Local e data: ________________, ${hoje}


_________________________________
CONTRATANTE: ${dados.contratante.nome || '[Nome do Cliente]'}


_________________________________
CONTRATADO: ${dados.contratado.nome || '[Nome do Freelancer]'}
`;
};

