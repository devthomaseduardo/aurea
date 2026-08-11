import { DadosProjeto, ResultadoOrcamento, modelosPropostas } from '@/modules/calculator/domain/calculadora';

export const gerarCartaProposta = (dados: DadosProjeto, resultado: ResultadoOrcamento): string => {
  const formatarMoeda = (valor: number) =>
    dados.moeda === 'BRL'
      ? `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$ ${valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const hoje = new Date().toLocaleDateString('pt-BR');
  const modeloSelecionado = modelosPropostas.find((modelo) => modelo.modelo === dados.modeloProposta) || modelosPropostas[1];
  const valorProposta = resultado.valoresPropostas[dados.modeloProposta] || resultado.custoTotal;
  const tecnologiasSelecionadas = dados.tecnologias.filter((tec) => tec.selecionada).map((tec) => tec.nome);
  const servicos: string[] = [];

  if (dados.configuracao.dominio) servicos.push('Domínio');
  if (dados.configuracao.hospedagem) servicos.push('Hospedagem');
  if (dados.configuracao.autenticacao) servicos.push('Autenticação');
  if (dados.configuracao.pagamentos) servicos.push('Pagamentos');
  if (dados.configuracao.apis) servicos.push('Integrações com APIs');
  dados.configuracao.outrosServicos.forEach((servico) => servicos.push(servico));

  const requisitos = dados.requisitos.length
    ? dados.requisitos.map((req) => `• ${req.descricao}`).join('\n')
    : '• Escopo a ser validado em conjunto antes do início.';

  const entregaveis = [
    '• Implementação das funcionalidades previstas no escopo aprovado',
    '• Interface responsiva e preparada para os principais dispositivos',
    '• Validação dos fluxos críticos antes da entrega',
    '• Código organizado para manutenção e evolução do produto',
    tecnologiasSelecionadas.length ? `• Stack prevista: ${tecnologiasSelecionadas.join(', ')}` : '',
    servicos.length ? `• Inclui: ${servicos.join(', ')}` : '',
  ].filter(Boolean).join('\n');

  return `
PROPOSTA COMERCIAL · ${dados.nome.toUpperCase()}
${'='.repeat(Math.max(28, dados.nome.length + 21))}

Preparada em ${hoje}
Para: ${dados.contratante.nome || 'Cliente'}
Por: ${dados.contratado.nome || 'Profissional responsável'}

1. CONTEXTO

${dados.descricao || 'Esta proposta organiza o escopo, o investimento e o plano de entrega definidos para o projeto.'}

O objetivo desta etapa é transformar o que foi discutido em uma entrega clara, com responsabilidade, prazo e investimento definidos antes do início.

2. ESCOPO VALIDADO

${requisitos}

3. O QUE SERÁ ENTREGUE

${entregaveis}

Modelo selecionado: ${modeloSelecionado.descricao}

Inclui neste modelo:
${modeloSelecionado.beneficios.map((beneficio) => `• ${beneficio}`).join('\n')}

4. PLANO DE ENTREGA

Prazo estimado: ${resultado.totalDias} dias úteis
Esforço estimado: ${resultado.totalHoras} horas

Marcos previstos:
• Primeira validação — aproximadamente ${Math.ceil(resultado.totalDias * 0.3)} dias úteis
• Entrega intermediária — aproximadamente ${Math.ceil(resultado.totalDias * 0.6)} dias úteis
• Entrega final — até ${resultado.totalDias} dias úteis

Os marcos existem para validar direção e reduzir retrabalho durante o desenvolvimento.

5. INVESTIMENTO

${formatarMoeda(valorProposta)}

Condição sugerida:
• 40% na assinatura — ${formatarMoeda(valorProposta * 0.4)}
• 30% na entrega intermediária — ${formatarMoeda(valorProposta * 0.3)}
• 30% na entrega final — ${formatarMoeda(valorProposta * 0.3)}

6. GARANTIA

Após a entrega final, o projeto conta com ${dados.modeloProposta === 'basico' ? '30' : dados.modeloProposta === 'padrao' ? '60' : '90'} dias de garantia para correções relacionadas ao escopo implementado.

Novas funcionalidades ou mudanças de escopo podem ser estimadas separadamente, mantendo previsibilidade para os dois lados.

7. PRÓXIMO PASSO

Com a aprovação desta proposta, seguimos para a formalização do contrato, confirmação do primeiro pagamento e início do projeto.

Se houver algum ponto de escopo, prazo ou condição que precise ser ajustado, ele pode ser alinhado antes da assinatura para que o projeto comece com expectativas claras.

${dados.contratado.nome || '[Seu Nome]'}
${dados.contratado.documento ? `Documento: ${dados.contratado.documento}` : ''}
${dados.contratado.endereco ? `Endereço: ${dados.contratado.endereco}` : ''}
`;
};

export default gerarCartaProposta;
