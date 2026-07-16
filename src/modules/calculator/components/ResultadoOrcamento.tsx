
import React, { useRef } from 'react';
import {
  Clock, DollarSign, Download, Clipboard, Check, FileText,
  FileSignature, ShieldCheck, TrendingUp, AlertCircle, Zap,
  Calendar, ArrowRight, Star, Award, BarChart2,
} from 'lucide-react';
import { ResultadoOrcamento, DadosProjeto, gerarContrato, modelosPropostas } from '../domain/calculadora';
import { toast } from '@/shared/components/ui/use-toast';
import ComparacaoMercado from './ComparacaoMercado';
import { gerarCartaProposta } from '@/modules/proposals/components/CartaProposta';

interface Props {
  resultado: ResultadoOrcamento;
  projeto: DadosProjeto;
}

const REGIME_LABELS: Record<string, string> = {
  pf:                  'Pessoa Física',
  mei:                 'MEI',
  pj_simples:          'PJ Simples Nacional',
  pj_lucro_presumido:  'PJ Lucro Presumido',
};

const MODELO_BADGE: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  basico:  { color: 'text-sky-400 border-sky-400/30 bg-sky-400/10',     icon: ShieldCheck, label: 'Básico'   },
  padrao:  { color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', icon: Award,       label: 'Padrão'   },
  premium: { color: 'text-violet-400 border-violet-400/30 bg-violet-400/10',   icon: Star,        label: 'Premium'  },
};

const ResultadoOrcamentoComponent: React.FC<Props> = ({ resultado, projeto }) => {
  const resultadoRef = useRef<HTMLDivElement>(null);
  const [copiado, setCopiado] = React.useState(false);

  const fmt = (valor: number) =>
    resultado.moeda === 'BRL'
      ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : valor.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const valorProposta = resultado.valoresPropostas[projeto.modeloProposta] ?? resultado.custoTotal;
  const modeloSelecionado = modelosPropostas.find(m => m.modelo === projeto.modeloProposta) ?? modelosPropostas[1];
  const badge = MODELO_BADGE[projeto.modeloProposta] ?? MODELO_BADGE.padrao;
  const BadgeIcon = badge.icon;

  const gerarPDF = async () => {
    if (!resultadoRef.current) return;
    const opt = {
      margin: 10,
      filename: `orcamento-${projeto.nome.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    toast({ title: 'Gerando PDF…', description: 'Aguarde um momento.' });
    const clone = resultadoRef.current.cloneNode(true) as HTMLElement;
    const tmp = document.createElement('div');
    tmp.style.position = 'absolute';
    tmp.style.left = '-9999px';
    tmp.appendChild(clone);
    document.body.appendChild(tmp);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().from(clone).set(opt).save();
      toast({ title: 'PDF gerado!', description: 'O arquivo foi baixado com sucesso.' });
    } catch {
      toast({ title: 'Erro ao gerar PDF', variant: 'destructive' });
    } finally {
      document.body.removeChild(tmp);
    }
  };

  const copiarOrcamento = () => {
    const texto = `ORÇAMENTO: ${projeto.nome}\n\nValor Total: ${fmt(valorProposta)}\nTempo: ${resultado.totalDias} dias (${resultado.totalHoras}h)\nModelo: ${modeloSelecionado.descricao}`;
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
    toast({ title: 'Copiado!', description: 'Orçamento copiado para a área de transferência.' });
  };

  const baixarContrato = () => {
    const blob = new Blob([gerarContrato(projeto, resultado)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contrato-${projeto.nome.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Contrato baixado!' });
  };

  const baixarCartaProposta = () => {
    const blob = new Blob([gerarCartaProposta(projeto, resultado)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposta-${projeto.nome.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Carta proposta baixada!' });
  };

  // Breakdown bars
  const breakdownItems = [
    { label: 'Desenvolvimento', value: resultado.custoBase,          color: 'from-violet-500 to-indigo-500' },
    { label: 'Tecnologias',     value: resultado.custoTecnologias,   color: 'from-blue-500 to-cyan-500'    },
    { label: 'Serviços',        value: resultado.custoServicos,       color: 'from-emerald-500 to-teal-500' },
    { label: 'Buffer segurança',value: resultado.custoBuffer,         color: 'from-amber-500 to-orange-500' },
    { label: 'Impostos',        value: resultado.custoImpostos,       color: 'from-rose-500 to-pink-500'    },
  ];
  const totalBreakdown = breakdownItems.reduce((a, i) => a + i.value, 0);

  return (
    <div className="animate-fade-in space-y-6" ref={resultadoRef}>

      {/* ── Header Card ── */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(120,100,255,0.12) 0%, rgba(30,30,80,0.5) 100%)',
          border: '1px solid rgba(120,100,255,0.2)',
        }}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(252,87%,67%) 0%, transparent 70%)', filter: 'blur(40px)', transform: 'translate(30%,-30%)' }} />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border mb-3 ${badge.color}`}>
                <BadgeIcon className="w-3.5 h-3.5" />
                Proposta {badge.label}
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">{projeto.nome}</h3>
              <p className="text-white/40 text-sm mt-1 max-w-lg">{projeto.descricao}</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0">
              {[
                { Icon: copiado ? Check : Clipboard, fn: copiarOrcamento, title: 'Copiar', active: copiado },
                { Icon: Download,      fn: gerarPDF,           title: 'PDF'     },
                { Icon: FileText,      fn: baixarContrato,     title: 'Contrato'},
                { Icon: FileSignature, fn: baixarCartaProposta,title: 'Proposta'},
              ].map(({ Icon, fn, title, active }) => (
                <button
                  key={title}
                  onClick={fn}
                  title={title}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all text-sm ${
                    active ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' : 'text-white/50 hover:text-white'
                  }`}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Clock,     label: 'Duração',      value: `${resultado.totalDias}d`,      sub: `${resultado.totalHoras} horas` },
              { icon: DollarSign,label: 'Valor Total',  value: fmt(valorProposta),              sub: modeloSelecionado.descricao.split(' — ')[0] },
              { icon: BarChart2, label: 'Complexidade', value: `${resultado.scoreComplexidade}%`, sub: resultado.scoreComplexidade > 70 ? 'Alta' : resultado.scoreComplexidade > 40 ? 'Média' : 'Baixa' },
              { icon: TrendingUp,label: 'Recomendado',  value: MODELO_BADGE[resultado.recomendacaoModelo].label, sub: 'pelo sistema' },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Icon className="w-4 h-4 text-violet-400 mx-auto mb-2" />
                <div className="text-white font-bold text-sm leading-tight">{value}</div>
                <div className="text-white/35 text-xs mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cost Breakdown ── */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-5">Composição do Orçamento</h4>
        <div className="space-y-3">
          {breakdownItems.map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/60">{item.label}</span>
                <span className="text-white font-medium font-mono">{fmt(item.value)}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                  style={{ width: `${totalBreakdown > 0 ? (item.value / totalBreakdown) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-between text-base font-bold pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <span className="text-white">Total do Projeto</span>
            <span className="gradient-text font-mono">{fmt(valorProposta)}</span>
          </div>
          <p className="text-white/25 text-xs">
            Regime tributário: {REGIME_LABELS[projeto.configuracao.regimeTributario ?? 'mei']} · Alíquota {(resultado.aliquotaImpostos * 100).toFixed(1)}% · Buffer {projeto.configuracao.bufferSeguranca ?? 20}%
          </p>
        </div>
      </div>

      {/* ── Tier Comparison ── */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-5">Opções de Proposta</h4>
        <div className="grid grid-cols-3 gap-3">
          {(['basico', 'padrao', 'premium'] as const).map(key => {
            const b = MODELO_BADGE[key];
            const Icon = b.icon;
            const selected = projeto.modeloProposta === key;
            const recommended = resultado.recomendacaoModelo === key;
            return (
              <div
                key={key}
                className={`rounded-xl p-4 text-center transition-all ${selected ? b.color + ' border' : ''}`}
                style={selected
                  ? {}
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                {recommended && (
                  <div className="text-[10px] text-violet-400 font-bold uppercase tracking-widest mb-1">✦ Recomendado</div>
                )}
                <Icon className={`w-4 h-4 mx-auto mb-2 ${selected ? '' : 'text-white/30'}`} />
                <div className={`text-xs font-semibold mb-1 ${selected ? '' : 'text-white/40'}`}>{b.label}</div>
                <div className={`font-bold text-sm font-mono ${selected ? '' : 'text-white/60'}`}>
                  {fmt(resultado.valoresPropostas[key])}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Payment Schedule ── */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-5 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Cronograma de Pagamento
        </h4>
        <div className="space-y-3">
          {resultado.entregas.map((entrega, i) => (
            <div key={i} className="flex items-center gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, hsl(243,75%,66%), hsl(213,90%,60%))' }}
              >
                {entrega.numero}
              </div>
              <div className="flex-1">
                <div className="text-white/70 text-sm">{entrega.descricao}</div>
                <div className="text-white/30 text-xs">
                  {entrega.prazoEmDias === 0 ? 'Na assinatura' : `Dia ${entrega.prazoEmDias} útil`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-sm font-mono">{fmt(entrega.valor)}</div>
                <div className="text-white/30 text-xs">{entrega.percentual}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Benefits ── */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-5 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Incluído no Plano {badge.label}
        </h4>
        <ul className="space-y-2.5">
          {modeloSelecionado.beneficios.map((b, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-white/60">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Requisitos Detalhados ── */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-5">Escopo Detalhado</h4>
        <div className="space-y-2">
          {projeto.requisitos.map((req, i) => {
            const complexColors: Record<string, string> = {
              alta:  'text-rose-400 bg-rose-400/10 border-rose-400/20',
              media: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
              baixa: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
            };
            return (
              <div key={req.id}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-xs text-white/20 font-mono w-4 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-white/70 text-sm flex-1">{req.descricao}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${complexColors[req.complexidade]}`}>
                  {req.complexidade.charAt(0).toUpperCase() + req.complexidade.slice(1)}
                </span>
                <span className="text-white/30 text-xs font-mono flex-shrink-0">{req.estimativaHoras}h</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Client Requirements ── */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-5 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> O que o cliente precisa fornecer
        </h4>
        <ul className="space-y-2">
          {resultado.requisitosCliente.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-white/50">
              <ArrowRight className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Market comparison ── */}
      <ComparacaoMercado
        comparacoes={resultado.comparacoesMercado}
        valorHora={projeto.valorHora}
        moeda={resultado.moeda}
      />
    </div>
  );
};

export default ResultadoOrcamentoComponent;
