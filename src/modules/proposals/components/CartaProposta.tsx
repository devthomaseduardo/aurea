
import { DadosProjeto, ResultadoOrcamento, modelosPropostas } from '@/modules/calculator/domain/calculadora';

export const gerarCartaProposta = (dados: DadosProjeto, resultado: ResultadoOrcamento): string => {
  const formatarMoeda = (valor: number) => {
    return dados.moeda === 'BRL' 
      ? `R$ ${valor.toFixed(2)}`
      : `$ ${valor.toFixed(2)}`;
  };

  const hoje = new Date().toLocaleDateString('pt-BR');
  const modeloSelecionado = modelosPropostas.find(modelo => modelo.modelo === dados.modeloProposta) || modelosPropostas[1];
  const valorProposta = resultado.valoresPropostas[dados.modeloProposta] || resultado.custoTotal;
  
  // Lista de tecnologias selecionadas
  const tecnologiasSelecionadas = dados.tecnologias
    .filter(tec => tec.selecionada)
    .map(tec => tec.nome)
    .join(', ');
  
  // Lista de serviços adicionais
  const servicos = [];
  if (dados.configuracao.dominio) servicos.push('Domínio');
  if (dados.configuracao.hospedagem) servicos.push('Hospedagem');
  if (dados.configuracao.autenticacao) servicos.push('Sistema de Autenticação');
  if (dados.configuracao.pagamentos) servicos.push('Gateway de Pagamento');
  if (dados.configuracao.apis) servicos.push('Integração com APIs');
  dados.configuracao.outrosServicos.forEach(servico => servicos.push(servico));
  
  return `
PROPOSTA DE DESENVOLVIMENTO
==========================

Data: ${hoje}

Prezado(a) ${dados.contratante.nome || 'Cliente'},

Olá! Meu nome é ${dados.contratado.nome || '[Seu Nome]'} e agradeço pelo seu interesse em meus serviços de desenvolvimento. Tive o prazer de analisar sua solicitação para o projeto "${dados.nome}" e gostaria de apresentar uma proposta personalizada que atenda às suas necessidades.

Sobre Mim:
----------
Sou um desenvolvedor especializado com experiência em criar soluções digitais de alta qualidade. Minha abordagem combina excelência técnica com um profundo entendimento das necessidades do cliente, garantindo resultados que superam expectativas.

Entendimento do Projeto:
-----------------------
Conforme discutimos, seu projeto "${dados.nome}" envolve os seguintes aspectos:

${dados.descricao}

Requisitos Identificados:
-----------------------
${dados.requisitos.map((req, i) => `${i+1}. ${req.descricao}`).join('\n')}

Solução Proposta:
----------------
Após uma análise cuidadosa dos requisitos, proponho uma solução que atenderá todas as suas necessidades, oferecendo:

- Desenvolvimento completo de todas as funcionalidades solicitadas
- Interface intuitiva e responsiva
- Código bem estruturado e documentado
- Ênfase em segurança e performance
${tecnologiasSelecionadas ? `- Implementação utilizando: ${tecnologiasSelecionadas}` : ''}
${servicos.length > 0 ? `- Serviços adicionais inclusos: ${servicos.join(', ')}` : ''}

Modelo de Serviço Proposto: ${modeloSelecionado.descricao}
--------------------
Benefícios inclusos neste modelo:
${modeloSelecionado.beneficios.map(b => `- ${b}`).join('\n')}

Cronograma Estimado:
------------------
A estimativa para conclusão do projeto é de ${resultado.totalDias} dias úteis (${resultado.totalHoras} horas de desenvolvimento), considerando:

- 1ª Entrega (30% do projeto): em até ${Math.ceil(resultado.totalDias * 0.3)} dias úteis
- 2ª Entrega (60% do projeto): em até ${Math.ceil(resultado.totalDias * 0.6)} dias úteis
- Entrega Final (100% do projeto): em até ${resultado.totalDias} dias úteis

Investimento:
-----------
O valor para o desenvolvimento completo do projeto no modelo ${dados.modeloProposta === 'basico' ? 'Básico' : dados.modeloProposta === 'padrao' ? 'Padrão' : 'Premium'} é de ${formatarMoeda(valorProposta)}.

Condições de Pagamento:
---------------------
- 40% (${formatarMoeda(valorProposta * 0.4)}) na assinatura do contrato
- 30% (${formatarMoeda(valorProposta * 0.3)}) na entrega parcial
- 30% (${formatarMoeda(valorProposta * 0.3)}) na entrega final

Garantia e Suporte:
-----------------
Ofereço garantia de ${dados.modeloProposta === 'basico' ? '30' : dados.modeloProposta === 'padrao' ? '60' : '90'} dias sobre o funcionamento do software após a entrega final, com suporte técnico dedicado para resolver qualquer questão que possa surgir.

Próximos Passos:
--------------
Se esta proposta atender às suas expectativas, podemos prosseguir com a assinatura do contrato e o início imediato do desenvolvimento. Estou disponível para esclarecer qualquer dúvida ou ajustar aspectos específicos desta proposta conforme suas necessidades.

Agradeço novamente pela oportunidade e estou entusiasmado com a possibilidade de transformar sua visão em realidade!

Atenciosamente,

${dados.contratado.nome || '[Seu Nome]'}
${dados.contratado.documento ? `Documento: ${dados.contratado.documento}` : ''}
${dados.contratado.endereco ? `Endereço: ${dados.contratado.endereco}` : ''}
`;
};

export default gerarCartaProposta;
