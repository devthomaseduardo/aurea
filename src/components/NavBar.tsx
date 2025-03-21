
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 animate-fade-in">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary">CalculaFreela</h1>
      </div>
      
      <div className="hidden md:flex space-x-8">
        <a href="#inicio" className="text-foreground hover:text-primary transition-colors">Início</a>
        <a href="#como-funciona" className="text-foreground hover:text-primary transition-colors">Como Funciona</a>
        <a href="#calcular" className="text-foreground hover:text-primary transition-colors">Calcular</a>
        <a href="#contato" className="text-foreground hover:text-primary transition-colors">Contato</a>
      </div>
      
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-foreground focus:outline-none">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-6 md:hidden flex flex-col space-y-4 animate-slide-in">
          <a href="#inicio" className="text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>Início</a>
          <a href="#como-funciona" className="text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>Como Funciona</a>
          <a href="#calcular" className="text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>Calcular</a>
          <a href="#contato" className="text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>Contato</a>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
