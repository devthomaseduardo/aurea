
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, Clock, PlusCircle, MinusCircle } from 'lucide-react';
import { DadosProjeto, Requisito, tecnologiasPadrao, calcularOrcamento, ResultadoOrcamento, Moeda } from '../lib/calculadora';
import ResultadoOrcamentoComponent from './ResultadoOrcamento';
import AssinaturaEletronica from './AssinaturaEletronica';

const ProjetoForm = () => {
  const [projeto, setProjeto] = useState<DadosProjeto>({
    nome: '',
    descricao: '',
    requisitos: [],
    tecnologias: tecnologiasPadrao,
    configuracao: {
      dominio: false,
      hospedagem: false,
      autenticacao: false,
      pagamentos: false,
      apis: false,
      outrosServicos: [],
    },
    valorHora: 80, // Valor padrão
    moeda: 'BRL', // Moeda padrão
  });

  const [novoRequisito, setNovoRequisito] = useState({
    descricao: '',
    complexidade: 'media' as 'baixa' | 'media' | 'alta',
    estimativaDias: 1,
    estimativaHoras: 8,
  });

  const [outroServico, setOutroServico] = useState('');
  const [resultado, setResultado] = useState<ResultadoOrcamento | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [animateNext, setAnimateNext] = useState(false);

  const adicionarRequisito = () => {
    if (novoRequisito.descricao.trim() === '') return;
    
    const requisito: Requisito = {
      ...novoRequisito,
      id: Date.now().toString(),
    };
    
    setProjeto(prev => ({
      ...prev,
      requisitos: [...prev.requisitos, requisito],
    }));
    
    setNovoRequisito({
      descricao: '',
      complexidade: 'media',
      estimativaDias: 1,
      estimativaHoras: 8,
    });
  };

  const removerRequisito = (id: string) => {
    setProjeto(prev => ({
      ...prev,
      requisitos: prev.requisitos.filter(req => req.id !== id),
    }));
  };

  const adicionarOutroServico = () => {
    if (outroServico.trim() === '') return;
    
    setProjeto(prev => ({
      ...prev,
      configuracao: {
        ...prev.configuracao,
        outrosServicos: [...prev.configuracao.outrosServicos, outroServico],
      },
    }));
    
    setOutroServico('');
  };

  const removerOutroServico = (index: number) => {
    setProjeto(prev => ({
      ...prev,
      configuracao: {
        ...prev.configuracao,
        outrosServicos: prev.configuracao.outrosServicos.filter((_, i) => i !== index),
      },
    }));
  };

  const alternarTecnologia = (id: string) => {
    setProjeto(prev => ({
      ...prev,
      tecnologias: prev.tecnologias.map(tec => 
        tec.id === id ? { ...tec, selecionada: !tec.selecionada } : tec
      ),
    }));
  };

  const calcularResultado = () => {
    const resultadoCalculado = calcularOrcamento(projeto);
    setResultado(resultadoCalculado);
  };

  const handleNextStep = () => {
    setAnimateNext(true);
    setTimeout(() => {
      setFormStep(prev => prev + 1);
      setAnimateNext(false);
    }, 300);
  };

  const handlePrevStep = () => {
    setAnimateNext(true);
    setTimeout(() => {
      setFormStep(prev => prev - 1);
      setAnimateNext(false);
    }, 300);
  };

  useEffect(() => {
    if (formStep === 4) {
      calcularResultado();
    }
  }, [formStep]);

  const estimarTempoAutomatico = () => {
    // Estes são valores simplificados para o exemplo
    let estimativaDias = 1;
    let estimativaHoras = 8;
    
    switch (novoRequisito.complexidade) {
      case 'baixa':
        estimativaDias = 1;
        estimativaHoras = 8;
        break;
      case 'media':
        estimativaDias = 3;
        estimativaHoras = 24;
        break;
      case 'alta':
        estimativaDias = 5;
        estimativaHoras = 40;
        break;
    }
    
    setNovoRequisito(prev => ({
      ...prev,
      estimativaDias,
      estimativaHoras
    }));
  };

  useEffect(() => {
    estimarTempoAutomatico();
  }, [novoRequisito.complexidade]);

  // Atualizar a assinatura do freelancer
  const definirAssinaturaFreelancer = (assinatura: string) => {
    setProjeto(prev => ({
      ...prev,
      assinaturaFreelancer: assinatura,
    }));
  };

  // Atualizar a assinatura do cliente
  const definirAssinaturaCliente = (assinatura: string) => {
    setProjeto(prev => ({
      ...prev,
      assinaturaCliente: assinatura,
    }));
  };

  return (
    <section id="calcular" className="px-6 md:px-12 py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Calculadora de Orçamento</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Preencha os detalhes do seu projeto para gerar um orçamento personalizado e completo.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border transition-all ${
                      step === formStep
                        ? 'bg-primary text-white border-primary'
                        : step < formStep
                        ? 'bg-primary/20 text-primary border-primary/20'
                        : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-xs mt-2 text-gray-500">
                    {step === 1 && 'Básico'}
                    {step === 2 && 'Requisitos'}
                    {step === 3 && 'Tecnologias'}
                    {step === 4 && 'Resultado'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className={`${animateNext ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              {formStep === 1 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-6">Informações Básicas do Projeto</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium mb-2">
                        Nome do Projeto
                      </label>
                      <input
                        type="text"
                        id="nome"
                        value={projeto.nome}
                        onChange={(e) => setProjeto(prev => ({ ...prev, nome: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                        placeholder="Ex: Site Institucional da Empresa X"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="descricao" className="block text-sm font-medium mb-2">
                        Descrição do Projeto
                      </label>
                      <textarea
                        id="descricao"
                        value={projeto.descricao}
                        onChange={(e) => setProjeto(prev => ({ ...prev, descricao: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition h-32 resize-none"
                        placeholder="Descreva brevemente o objetivo e escopo do projeto..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="valorHora" className="block text-sm font-medium mb-2">
                          Valor por Hora
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            id="valorHora"
                            value={projeto.valorHora}
                            onChange={(e) => setProjeto(prev => ({ ...prev, valorHora: parseFloat(e.target.value) || 0 }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            placeholder="80"
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="moeda" className="block text-sm font-medium mb-2">
                          Moeda
                        </label>
                        <select
                          id="moeda"
                          value={projeto.moeda}
                          onChange={(e) => setProjeto(prev => ({ ...prev, moeda: e.target.value as Moeda }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition appearance-none bg-no-repeat"
                          style={{ backgroundPosition: 'right 1rem center', backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDYgMTEgMSIgc3Ryb2tlPSIjNjg3MDhEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==)' }}
                        >
                          <option value="BRL">Real (R$)</option>
                          <option value="USD">Dólar ($)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <p className="block text-sm font-medium mb-4">Serviços Adicionais</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="dominio"
                            checked={projeto.configuracao.dominio}
                            onChange={(e) => setProjeto(prev => ({
                              ...prev,
                              configuracao: {
                                ...prev.configuracao,
                                dominio: e.target.checked
                              }
                            }))}
                            className="h-5 w-5 text-primary rounded-md focus:ring-primary/20"
                          />
                          <label htmlFor="dominio" className="ml-2 text-sm">Domínio</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="hospedagem"
                            checked={projeto.configuracao.hospedagem}
                            onChange={(e) => setProjeto(prev => ({
                              ...prev,
                              configuracao: {
                                ...prev.configuracao,
                                hospedagem: e.target.checked
                              }
                            }))}
                            className="h-5 w-5 text-primary rounded-md focus:ring-primary/20"
                          />
                          <label htmlFor="hospedagem" className="ml-2 text-sm">Hospedagem</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="autenticacao"
                            checked={projeto.configuracao.autenticacao}
                            onChange={(e) => setProjeto(prev => ({
                              ...prev,
                              configuracao: {
                                ...prev.configuracao,
                                autenticacao: e.target.checked
                              }
                            }))}
                            className="h-5 w-5 text-primary rounded-md focus:ring-primary/20"
                          />
                          <label htmlFor="autenticacao" className="ml-2 text-sm">Sistema de Autenticação</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="pagamentos"
                            checked={projeto.configuracao.pagamentos}
                            onChange={(e) => setProjeto(prev => ({
                              ...prev,
                              configuracao: {
                                ...prev.configuracao,
                                pagamentos: e.target.checked
                              }
                            }))}
                            className="h-5 w-5 text-primary rounded-md focus:ring-primary/20"
                          />
                          <label htmlFor="pagamentos" className="ml-2 text-sm">Gateway de Pagamento</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="apis"
                            checked={projeto.configuracao.apis}
                            onChange={(e) => setProjeto(prev => ({
                              ...prev,
                              configuracao: {
                                ...prev.configuracao,
                                apis: e.target.checked
                              }
                            }))}
                            className="h-5 w-5 text-primary rounded-md focus:ring-primary/20"
                          />
                          <label htmlFor="apis" className="ml-2 text-sm">Integração de APIs</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="block text-sm font-medium mb-3">Outros Serviços</p>
                      
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={outroServico}
                          onChange={(e) => setOutroServico(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                          placeholder="Ex: Integração CRM"
                        />
                        <button
                          type="button"
                          onClick={adicionarOutroServico}
                          className="px-4 py-2 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {projeto.configuracao.outrosServicos.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {projeto.configuracao.outrosServicos.map((servico, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                              <span className="text-sm">{servico}</span>
                              <button
                                type="button"
                                onClick={() => removerOutroServico(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {formStep === 2 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-6">Requisitos do Projeto</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="descricao-requisito" className="block text-sm font-medium mb-2">
                          Descrição do Requisito
                        </label>
                        <input
                          type="text"
                          id="descricao-requisito"
                          value={novoRequisito.descricao}
                          onChange={(e) => setNovoRequisito(prev => ({ ...prev, descricao: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                          placeholder="Ex: Página de login com autenticação"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="complexidade" className="block text-sm font-medium mb-2">
                          Complexidade
                        </label>
                        <select
                          id="complexidade"
                          value={novoRequisito.complexidade}
                          onChange={(e) => setNovoRequisito(prev => ({ 
                            ...prev, 
                            complexidade: e.target.value as 'baixa' | 'media' | 'alta'
                          }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition appearance-none bg-no-repeat"
                          style={{ backgroundPosition: 'right 1rem center', backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDYgMTEgMSIgc3Ryb2tlPSIjNjg3MDhEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==)' }}
                        >
                          <option value="baixa">Baixa</option>
                          <option value="media">Média</option>
                          <option value="alta">Alta</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="estimativa-dias" className="block text-sm font-medium mb-2">
                            Estimativa (Dias)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="estimativa-dias"
                              value={novoRequisito.estimativaDias}
                              onChange={(e) => setNovoRequisito(prev => ({ 
                                ...prev, 
                                estimativaDias: parseInt(e.target.value) || 0
                              }))}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                              min="0"
                            />
                            <div className="absolute right-0 top-0 h-full flex">
                              <button
                                type="button"
                                onClick={() => setNovoRequisito(prev => ({ 
                                  ...prev, 
                                  estimativaDias: Math.max(0, prev.estimativaDias - 1)
                                }))}
                                className="h-full px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                              >
                                <MinusCircle className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setNovoRequisito(prev => ({ 
                                  ...prev, 
                                  estimativaDias: prev.estimativaDias + 1
                                }))}
                                className="h-full px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                              >
                                <PlusCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="estimativa-horas" className="block text-sm font-medium mb-2">
                            Estimativa (Horas)
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              id="estimativa-horas"
                              value={novoRequisito.estimativaHoras}
                              onChange={(e) => setNovoRequisito(prev => ({ 
                                ...prev, 
                                estimativaHoras: parseInt(e.target.value) || 0
                              }))}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={adicionarRequisito}
                          disabled={!novoRequisito.descricao.trim()}
                          className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Adicionar Requisito
                        </button>
                      </div>
                    </div>
                    
                    {projeto.requisitos.length > 0 && (
                      <div className="border rounded-xl overflow-hidden mt-6">
                        <div className="bg-gray-50 py-3 px-4 border-b">
                          <h4 className="font-medium">Requisitos Adicionados</h4>
                        </div>
                        <div className="divide-y">
                          {projeto.requisitos.map((requisito) => (
                            <div key={requisito.id} className="p-4 flex justify-between items-center">
                              <div>
                                <p className="font-medium">{requisito.descricao}</p>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                    requisito.complexidade === 'baixa' ? 'bg-green-500' : 
                                    requisito.complexidade === 'media' ? 'bg-yellow-500' : 
                                    'bg-red-500'
                                  }`}></span>
                                  <span className="capitalize mr-4">{requisito.complexidade}</span>
                                  <span className="flex items-center mr-2"><Clock className="h-3 w-3 mr-1" /> {requisito.estimativaHoras}h</span>
                                  <span>({requisito.estimativaDias} {requisito.estimativaDias === 1 ? 'dia' : 'dias'})</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removerRequisito(requisito.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {formStep === 3 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-6">Tecnologias Utilizadas</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {projeto.tecnologias.map((tec) => (
                      <div
                        key={tec.id}
                        onClick={() => alternarTecnologia(tec.id)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          tec.selecionada 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={tec.selecionada}
                            onChange={() => {}}
                            className="h-5 w-5 text-primary rounded-md focus:ring-primary/20"
                          />
                          <label className="ml-2 font-medium">{tec.nome}</label>
                        </div>
                        {tec.multiplicador && (
                          <div className="mt-2 text-xs text-gray-500">
                            Multiplicador: +{tec.multiplicador}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {formStep === 4 && resultado && (
                <>
                  <ResultadoOrcamentoComponent 
                    resultado={resultado} 
                    projeto={projeto}
                  />
                  
                  <div className="mt-10 space-y-6">
                    <h3 className="text-xl font-semibold">Assinaturas</h3>
                    <p className="text-sm text-gray-600">
                      As assinaturas serão incluídas nos documentos de contrato e orçamento.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AssinaturaEletronica 
                        onChange={definirAssinaturaFreelancer}
                        label="Sua assinatura (Freelancer)"
                      />
                      
                      <AssinaturaEletronica 
                        onChange={definirAssinaturaCliente}
                        label="Assinatura do Cliente"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-8 flex justify-between">
              {formStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
              )}
              
              {formStep < 4 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={`px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors ${
                    formStep === 1 && (!projeto.nome || !projeto.descricao) ? 'opacity-50 cursor-not-allowed' : ''
                  } ${formStep === 2 && projeto.requisitos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} ml-auto`}
                  disabled={(formStep === 1 && (!projeto.nome || !projeto.descricao)) || 
                           (formStep === 2 && projeto.requisitos.length === 0)}
                >
                  Próximo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjetoForm;
