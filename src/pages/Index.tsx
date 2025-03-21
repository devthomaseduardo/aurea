
import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import ProjetoForm from '../components/ProjetoForm';
import Footer from '../components/Footer';
import { CheckCircle2, Clock, ArrowRight, BarChart3, FileText } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Hero />
      
      <section id="como-funciona" className="px-6 md:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Crie orçamentos profissionais em minutos e impulsione seu negócio como freelancer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Defina os requisitos</h3>
              <p className="text-gray-600">
                Detalhe os requisitos do projeto, incluindo funcionalidades e complexidade de cada elemento.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Estime o tempo</h3>
              <p className="text-gray-600">
                Com base na complexidade, o sistema ajuda a estimar o tempo necessário para cada requisito.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Receba o orçamento</h3>
              <p className="text-gray-600">
                Obtenha um orçamento detalhado com custos, tempos e a lista de requisitos para o cliente.
              </p>
            </div>
          </div>
          
          <div className="mt-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Benefícios para freelancers</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Orçamentos profissionais e detalhados</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Estimativas de tempo mais precisas</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Lista de requisitos que o cliente deve fornecer</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Cálculo automático com base nas tecnologias utilizadas</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Inclusão de serviços adicionais como hospedagem e domínio</span>
                  </li>
                </ul>
                
                <a 
                  href="#calcular" 
                  className="inline-flex items-center mt-8 text-primary font-medium hover:underline"
                >
                  Comece agora mesmo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-center px-8">
                    Visualização da ferramenta<br/>
                    (a imagem de demonstração será exibida aqui)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <ProjetoForm />
      <Footer />
    </div>
  );
};

export default Index;
