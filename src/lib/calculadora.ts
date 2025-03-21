
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

export type DadosProjeto = {
  nome: string;
  descricao: string;
  requisitos: Requisito[];
  tecnologias: Tecnologia[];
  configuracao: ConfiguracaoProjeto;
  valorHora: number;
};

export type ResultadoOrcamento = {
  totalHoras: number;
  totalDias: number;
  custoBase: number;
  custoTecnologias: number;
  custoServicos: number;
  custoTotal: number;
  requisitosCliente: string[];
};

// Valores fictícios para cálculo
const CUSTO_DOMINIO = 50;
const CUSTO_HOSPEDAGEM = 25 * 12; // Custo anual
const CUSTO_AUTENTICACAO = 300;
const CUSTO_PAGAMENTOS = 500;
const CUSTO_API = 250;
const CUSTO_OUTROS_SERVICOS = 200;

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
  
  return {
    totalHoras,
    totalDias,
    custoBase,
    custoTecnologias,
    custoServicos,
    custoTotal,
    requisitosCliente
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
