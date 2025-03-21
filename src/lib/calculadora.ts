
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
};

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
  
  // Calcular custo total
  const custoTotal = custoBase + custoTecnologias + custoServicos;
  
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
    moeda: dados.moeda
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
  
  return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS
==========================================

Entre as partes:

CONTRATANTE: [Nome do Cliente]
CNPJ/CPF: [Número do Documento]
Endereço: [Endereço do Cliente]

CONTRATADO: [Nome do Freelancer]
CNPJ/CPF: [Número do Documento]
Endereço: [Endereço do Freelancer]

As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.

OBJETO DO CONTRATO
------------------

Cláusula 1ª. O presente contrato tem como objeto a prestação de serviços de desenvolvimento para o projeto "${dados.nome}", conforme detalhado abaixo:

Descrição do Projeto: ${dados.descricao}

Requisitos:
${dados.requisitos.map((req, i) => `${i+1}. ${req.descricao} (${req.estimativaHoras} horas)`).join('\n')}

OBRIGAÇÕES DO CONTRATADO
------------------------

Cláusula 2ª. O CONTRATADO se compromete a:
- Desenvolver o projeto conforme os requisitos especificados
- Cumprir os prazos estipulados
- Realizar ajustes e correções necessárias
- Manter confidencialidade sobre todas as informações do projeto

OBRIGAÇÕES DO CONTRATANTE
-------------------------

Cláusula 3ª. O CONTRATANTE se compromete a:
- Fornecer todas as informações necessárias para o desenvolvimento
- Realizar os pagamentos conforme estipulado
- Realizar a aprovação dos entregáveis em tempo hábil
- Fornecer os seguintes itens:
${resultado.requisitosCliente.map((req, i) => `  ${i+1}. ${req}`).join('\n')}

VALOR E FORMA DE PAGAMENTO
--------------------------

Cláusula 4ª. Pelos serviços prestados, o CONTRATANTE pagará ao CONTRATADO o valor total de ${formatarMoeda(resultado.custoTotal)}, a ser pago da seguinte forma:
- 40% (${formatarMoeda(resultado.custoTotal * 0.4)}) na assinatura do contrato
- 30% (${formatarMoeda(resultado.custoTotal * 0.3)}) na entrega parcial
- 30% (${formatarMoeda(resultado.custoTotal * 0.3)}) na entrega final

PRAZO
-----

Cláusula 5ª. O prazo para conclusão dos serviços é de ${resultado.totalDias} dias úteis, contados a partir da data de assinatura deste contrato e do recebimento de todos os requisitos necessários.

RESCISÃO
-------

Cláusula 6ª. O presente contrato poderá ser rescindido por qualquer uma das partes, mediante notificação expressa, com 10 dias de antecedência.

CONSIDERAÇÕES FINAIS
-------------------

E por estarem assim justos e contratados, firmam o presente instrumento, em duas vias de igual teor.

Local e data: ________________, ${hoje}


_________________________________
CONTRATANTE

_________________________________
CONTRATADO
`;
};
