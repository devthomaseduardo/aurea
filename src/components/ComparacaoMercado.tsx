
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ComparacaoMercado as TipoComparacaoMercado } from '../lib/calculadora';

interface ComparacaoMercadoProps {
  comparacoes: TipoComparacaoMercado[];
  valorHora: number;
  moeda: 'BRL' | 'USD';
}

const ComparacaoMercado: React.FC<ComparacaoMercadoProps> = ({ comparacoes, valorHora, moeda }) => {
  const formatarMoeda = (valor: number) => {
    return moeda === 'BRL' 
      ? `R$ ${valor.toFixed(2)}`
      : `$ ${valor.toFixed(2)}`;
  };

  const simboloMoeda = moeda === 'BRL' ? 'R$' : '$';

  // Preparar dados para o gráfico
  const dadosGrafico = comparacoes.map(comp => ({
    plataforma: comp.plataforma,
    mínimo: comp.valorMinimo,
    médio: comp.valorMedio,
    máximo: comp.valorMaximo,
    seuValor: valorHora
  }));

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-6">
      <h5 className="font-semibold mb-4">Comparação com o Mercado</h5>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dadosGrafico}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="plataforma" />
            <YAxis label={{ value: `Valor/Hora (${simboloMoeda})`, angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
            <Legend />
            <Bar dataKey="mínimo" fill="#8884d8" name={`Valor Mínimo (${simboloMoeda})`} />
            <Bar dataKey="médio" fill="#82ca9d" name={`Valor Médio (${simboloMoeda})`} />
            <Bar dataKey="máximo" fill="#ffc658" name={`Valor Máximo (${simboloMoeda})`} />
            <Bar dataKey="seuValor" fill="#ff8042" name={`Seu Valor (${simboloMoeda})`} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6">
        <h6 className="font-medium mb-2">Análise de Competitividade</h6>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comparacoes.map((comp, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-4 rounded-xl border border-gray-100"
            >
              <h6 className="font-medium mb-2">{comp.plataforma}</h6>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Mínimo:</span>
                  <span className="font-medium">{formatarMoeda(comp.valorMinimo)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Médio:</span>
                  <span className="font-medium">{formatarMoeda(comp.valorMedio)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Máximo:</span>
                  <span className="font-medium">{formatarMoeda(comp.valorMaximo)}</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                  <span>Sua taxa:</span>
                  <span className={`font-bold ${
                    valorHora < comp.valorMedio ? 'text-green-600' : 
                    valorHora > comp.valorMaximo ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {formatarMoeda(valorHora)}
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    valorHora < comp.valorMedio ? 'bg-green-100 text-green-800' : 
                    valorHora > comp.valorMaximo ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {valorHora < comp.valorMedio 
                      ? 'Competitivo' 
                      : valorHora > comp.valorMaximo 
                        ? 'Acima do mercado' 
                        : 'Na média do mercado'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparacaoMercado;
