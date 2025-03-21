
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  const scrollToCalculator = () => {
    const calculatorSection = document.getElementById('calcular');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 md:px-12 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10"></div>
      <div className="absolute top-40 left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20 -z-10"></div>
      
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Calcule o orçamento perfeito para seus projetos freelancer
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Uma ferramenta completa para analisar requisitos e criar orçamentos detalhados para seus clientes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button 
            onClick={scrollToCalculator}
            className="btn-hover-effect bg-primary text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Começar a calcular
          </button>
          
          <a 
            href="#como-funciona"
            className="btn-hover-effect bg-white text-foreground px-8 py-4 rounded-full text-lg font-medium shadow-md hover:shadow-lg border border-gray-100 transition-all"
          >
            Como funciona
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="text-primary w-6 h-6" />
      </div>
    </section>
  );
};

export default Hero;
