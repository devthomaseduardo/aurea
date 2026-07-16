
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ComparacaoMercado as Comparacao, Moeda } from '../domain/calculadora';

interface Props {
  comparacoes: Comparacao[];
  valorHora: number;
  moeda: Moeda;
}

const ComparacaoMercado: React.FC<Props> = ({ comparacoes, valorHora, moeda }) => {
  const fmt = (v: number) =>
    moeda === 'BRL'
      ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const getStatus = (valorMedio: number) => {
    if (valorHora > valorMedio * 1.1) return 'acima';
    if (valorHora < valorMedio * 0.9) return 'abaixo';
    return 'equivalente';
  };

  const statusConfig = {
    acima:       { icon: TrendingUp,   color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', label: 'Acima da média'   },
    abaixo:      { icon: TrendingDown, color: 'text-rose-400',    bg: 'bg-rose-400/10 border-rose-400/20',       label: 'Abaixo da média'  },
    equivalente: { icon: Minus,        color: 'text-amber-400',   bg: 'bg-amber-400/10 border-amber-400/20',     label: 'Na média'         },
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">
        Comparação com o Mercado
      </h4>
      <p className="text-white/30 text-xs mb-5">
        Seu valor/hora ({fmt(valorHora)}) comparado às principais plataformas freelancer.
      </p>

      <div className="space-y-3">
        {comparacoes.map(c => {
          const status = getStatus(c.valorMedio);
          const cfg = statusConfig[status];
          const StatusIcon = cfg.icon;
          const pct = Math.round(((valorHora - c.valorMedio) / c.valorMedio) * 100);

          return (
            <div
              key={c.plataforma}
              className="flex items-center gap-4 rounded-xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              {/* Platform */}
              <div className="w-28 flex-shrink-0">
                <div className="text-white/70 text-sm font-medium">{c.plataforma}</div>
                <div className="text-white/25 text-xs">
                  {fmt(c.valorMinimo)} – {fmt(c.valorMaximo)}
                </div>
              </div>

              {/* Range bar */}
              <div className="flex-1 relative h-5 flex items-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, rgba(120,100,255,0.3), rgba(100,180,255,0.3))',
                        width: '100%',
                      }}
                    />
                  </div>
                </div>
                {/* Marker for valor médio */}
                <div
                  className="absolute w-2 h-4 rounded-sm bg-violet-400 opacity-60"
                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                  title={`Médio: ${fmt(c.valorMedio)}`}
                />
              </div>

              {/* Status badge */}
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                <StatusIcon className="w-3 h-3" />
                {pct > 0 ? `+${pct}%` : `${pct}%`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparacaoMercado;
