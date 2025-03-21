
import React, { useRef } from 'react';
import { Clock, DollarSign, Download, Clipboard, Share2, Check } from 'lucide-react';
import { ResultadoOrcamento, DadosProjeto } from '../lib/calculadora';
import { toast } from "@/components/ui/use-toast";

interface ResultadoOrcamentoProps {
  resultado: ResultadoOrcamento;
  projeto: DadosProjeto;
}

const ResultadoOrcamentoComponent: React.FC<ResultadoOrcamentoProps> = ({ resultado, projeto }) => {
  const resultadoRef = useRef<HTMLDivElement>(null);
  const [copiado, setCopiado] = React.useState(false);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const gerarPDF = () => {
    // Este é um placeholder para a funcionalidade de geração de PDF
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O download do PDF estará disponível em breve!",
    });
  };

  const copiarOrcamento = () => {
    const tecnologiasSelecionadas = projeto.tecnologias
      .filter(tec => tec.selecionada)
      .map(tec => tec.nome)
      .join(', ');
    
    const servicos = [];
    if (projeto.configuracao.dominio) servicos.push('Domínio');
    if (projeto.configuracao.hospedagem) servicos.push('Hospedagem');
    if (projeto.configuracao.autenticacao) servicos.push('Sistema de Autenticação');
    if (projeto.configuracao.pagamentos) servicos.push('Gateway de Pagamento');
    if (projeto.configuracao.apis) servicos.push('Integração com APIs');
    projeto.configuracao.outrosServicos.forEach(servico => servicos.push(servico));
    
    const textoOrcamento = `
ORÇAMENTO: ${projeto.nome}
-----------------------------------------
${projeto.descricao}

TEMPO ESTIMADO:
- ${resultado.totalDias} dias (${resultado.totalHoras} horas)

TECNOLOGIAS:
${tecnologiasSelecionadas || 'Nenhuma tecnologia específica informada'}

SERVIÇOS INCLUÍDOS:
${servicos.length > 0 ? servicos.join('\n') : 'Nenhum serviço adicional'}

CUSTOS:
- Custo base: ${formatarMoeda(resultado.custoBase)}
- Tecnologias: ${formatarMoeda(resultado.custoTecnologias)}
- Serviços: ${formatarMoeda(resultado.custoServicos)}

VALOR TOTAL: ${formatarMoeda(resultado.custoTotal)}

REQUISITOS DO CLIENTE:
${resultado.requisitosCliente.map((req, i) => `${i+1}. ${req}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(textoOrcamento);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
    
    toast({
      title: "Orçamento copiado!",
      description: "O texto foi copiado para sua área de transferência.",
    });
  };

  const compartilharOrcamento = () => {
    // Este é um placeholder para a funcionalidade de compartilhamento
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O compartilhamento estará disponível em breve!",
    });
  };

  return (
    <div className="animate-fade-in" ref={resultadoRef}>
      <h3 className="text-xl font-semibold mb-6">Orçamento Gerado</h3>
      
      <div className="space-y-8">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">{projeto.nome}</h4>
            <div className="flex space-x-2">
              <button 
                onClick={gerarPDF}
                className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                title="Baixar PDF"
              >
                <Download className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={copiarOrcamento}
                className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                title="Copiar para área de transferência"
              >
                {copiado ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Clipboard className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <button 
                onClick={compartilharOrcamento}
                className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                title="Compartilhar"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">{projeto.descricao}</p>
          
          <div className="flex flex-col md:flex-row md:divide-x divide-blue-200 gap-6">
            <div className="flex-1 flex items-center">
              <Clock className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Tempo Estimado</p>
                <p className="text-2xl font-bold">{resultado.totalDias} dias</p>
                <p className="text-sm text-gray-500">({resultado.totalHoras} horas)</p>
              </div>
            </div>
            
            <div className="flex-1 flex items-center md:pl-6">
              <DollarSign className="h-10 w-10 text-green-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="text-2xl font-bold">{formatarMoeda(resultado.custoTotal)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
            <h5 className="font-semibold mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs">1</span>
              Custo Base
            </h5>
            <p className="text-2xl font-bold">{formatarMoeda(resultado.custoBase)}</p>
            <p className="text-sm text-gray-500 mt-1">Baseado nas horas estimadas</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
            <h5 className="font-semibold mb-4 flex items-center">
              <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs">2</span>
              Tecnologias
            </h5>
            <p className="text-2xl font-bold">{formatarMoeda(resultado.custoTecnologias)}</p>
            <p className="text-sm text-gray-500 mt-1">
              {projeto.tecnologias.filter(t => t.selecionada).length} tecnologias selecionadas
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
            <h5 className="font-semibold mb-4 flex items-center">
              <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs">3</span>
              Serviços Adicionais
            </h5>
            <p className="text-2xl font-bold">{formatarMoeda(resultado.custoServicos)}</p>
            <p className="text-sm text-gray-500 mt-1">
              {(projeto.configuracao.dominio ? 1 : 0) +
               (projeto.configuracao.hospedagem ? 1 : 0) +
               (projeto.configuracao.autenticacao ? 1 : 0) +
               (projeto.configuracao.pagamentos ? 1 : 0) +
               (projeto.configuracao.apis ? 1 : 0) +
               projeto.configuracao.outrosServicos.length} serviços incluídos
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h5 className="font-semibold mb-4">Requisitos do Cliente</h5>
          <ul className="space-y-2">
            {resultado.requisitosCliente.map((requisito, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-gray-100 text-gray-700 min-w-6 h-6 rounded-full inline-flex items-center justify-center mr-3 text-xs mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700">{requisito}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h5 className="font-semibold mb-4">Requisitos Detalhados</h5>
          <div className="divide-y">
            {projeto.requisitos.map((requisito, index) => (
              <div key={requisito.id} className="py-3">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <span className="bg-primary text-white min-w-6 h-6 rounded-full inline-flex items-center justify-center mr-3 text-xs">
                      {index + 1}
                    </span>
                    <span className="font-medium">{requisito.descricao}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 text-sm">{requisito.estimativaHoras} horas</span>
                  </div>
                </div>
                <div className="ml-9 mt-1">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    requisito.complexidade === 'baixa' ? 'bg-green-100 text-green-700' : 
                    requisito.complexidade === 'media' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {requisito.complexidade === 'baixa' ? 'Baixa complexidade' : 
                     requisito.complexidade === 'media' ? 'Média complexidade' : 
                     'Alta complexidade'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadoOrcamentoComponent;
