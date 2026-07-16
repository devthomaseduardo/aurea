
import React, { useRef, useState } from 'react';
import { Pen, Trash2, Save } from 'lucide-react';

interface AssinaturaEletronicaProps {
  onChange: (assinatura: string) => void;
  label?: string;
}

const AssinaturaEletronica: React.FC<AssinaturaEletronicaProps> = ({ onChange, label = "Sua assinatura" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasEmpty, setCanvasEmpty] = useState(true);
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    setCanvasEmpty(false);
    ctx.beginPath();
    
    // Para mouse
    if ('clientX' in e) {
      const rect = canvas.getBoundingClientRect();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    } 
    // Para touch
    else if (e.touches && e.touches[0]) {
      const rect = canvas.getBoundingClientRect();
      ctx.moveTo(
        e.touches[0].clientX - rect.left,
        e.touches[0].clientY - rect.top
      );
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Para mouse
    if ('clientX' in e) {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    } 
    // Para touch
    else if (e.touches && e.touches[0]) {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(
        e.touches[0].clientX - rect.left,
        e.touches[0].clientY - rect.top
      );
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
    
    // Salvar a assinatura como data URL
    const assinaturaDataUrl = canvas.toDataURL('image/png');
    onChange(assinaturaDataUrl);
  };

  const limparAssinatura = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasEmpty(true);
    onChange('');
  };

  const salvarAssinatura = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const assinaturaDataUrl = canvas.toDataURL('image/png');
    
    // Criar um link para download
    const downloadLink = document.createElement('a');
    downloadLink.href = assinaturaDataUrl;
    downloadLink.download = 'assinatura.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Configurar o canvas quando o componente for montado
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Definir estilo de linha
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Ajustar tamanho do canvas
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 150;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="relative border border-gray-300 rounded-xl bg-white p-1">
        <canvas
          ref={canvasRef}
          className="w-full rounded-lg border border-dashed border-gray-300 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            type="button"
            onClick={limparAssinatura}
            className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
            title="Limpar assinatura"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={salvarAssinatura}
            disabled={canvasEmpty}
            className={`p-2 rounded-full transition-colors ${
              canvasEmpty
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-50 text-green-500 hover:bg-green-100'
            }`}
            title="Salvar assinatura"
          >
            <Save className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center text-gray-500 text-xs">
          <Pen className="h-3 w-3 mr-1" />
          <span>Assine aqui</span>
        </div>
      </div>
    </div>
  );
};

export default AssinaturaEletronica;
