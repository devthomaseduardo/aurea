import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import Hero from '@/shared/components/Hero';
import {
  Search,
  PhoneCall,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  Wrench,
  Smartphone,
  Star,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

// 1. Aparelhos Atendidos (Lista Compacta / Grid Editorial)
const devicesList = [
  // Apple
  { brand: 'Apple', model: 'iPhone 13 Pro', img: '/img/celulares/apple-iphone-13-preto.jpg', issues: 'Tela, bateria e conector', time: '40 a 90 min', parts: 'Peças disponíveis' },
  { brand: 'Apple', model: 'iPhone 16 Pro Max', img: '/img/celulares/apple-iphone-16-preto.jpg', issues: 'Display OLED, vidro traseiro', time: '45 a 90 min', parts: 'Peças disponíveis' },
  { brand: 'Apple', model: 'iPhone 16', img: '/img/celulares/apple-iphone-16-rosa.jpg', issues: 'Tela, bateria, conector USB-C', time: '35 a 60 min', parts: 'Peças disponíveis' },
  { brand: 'Apple', model: 'iPhone SE 2ª Gen', img: '/img/celulares/apple-iphone-se.jpg', issues: 'Tela, bateria, botão home', time: '30 a 45 min', parts: 'Peças disponíveis' },
  // Samsung
  { brand: 'Samsung', model: 'Galaxy S25 5G', img: '/img/celulares/samsung-galaxy-s25.jpg', issues: 'Tela Dynamic AMOLED, carga', time: '45 a 90 min', parts: 'Peças disponíveis' },
  { brand: 'Samsung', model: 'Galaxy S24 Ultra', img: '/img/celulares/samsung-galaxy-s24-ultra.jpg', issues: 'Display AMOLED, vidro traseiro', time: '50 a 90 min', parts: 'Peças disponíveis' },
  { brand: 'Samsung', model: 'Galaxy A26 5G', img: '/img/celulares/samsung-galaxy-a26.jpg', issues: 'Tela, conector, bateria', time: '40 a 60 min', parts: 'Peças disponíveis' },
  { brand: 'Samsung', model: 'Galaxy A16', img: '/img/celulares/samsung-galaxy-a16.jpg', issues: 'Tela trincada, conector de carga', time: '40 a 60 min', parts: 'Peças disponíveis' },
  // Xiaomi
  { brand: 'Xiaomi', model: 'Xiaomi 17 Pro 5G', img: '/img/celulares/xiaomi-17-pro.jpg', issues: 'Tela AMOLED 144Hz, placa', time: '45 a 90 min', parts: 'Peças disponíveis' },
  { brand: 'Xiaomi', model: 'Xiaomi 14', img: '/img/celulares/xiaomi-14.jpg', issues: 'Tela, bateria, câmera', time: '40 a 60 min', parts: 'Peças disponíveis' },
  { brand: 'Xiaomi', model: 'Redmi Note 15 Pro', img: '/img/celulares/xiaomi-redmi-note-15-pro.jpg', issues: 'Tela, conector USB-C', time: '40 a 60 min', parts: 'Peças disponíveis' },
  // Motorola
  { brand: 'Motorola', model: 'Motorola Signature', img: '/img/celulares/motorola-signature.jpg', issues: 'Tela pOLED, bateria, placa', time: '50 a 90 min', parts: 'Peças disponíveis' },
  { brand: 'Motorola', model: 'Motorola Edge 70', img: '/img/celulares/motorola-edge-70.png', issues: 'Tela curva, conector TurboPower', time: '45 a 90 min', parts: 'Peças disponíveis' },
  { brand: 'Motorola', model: 'Moto G86 5G', img: '/img/celulares/motorola-moto-g86.png', issues: 'Tela, conector, bateria', time: '40 a 60 min', parts: 'Peças disponíveis' },
];

export default function Landing() {
  const [selectedBrand, setSelectedBrand] = useState<'Apple' | 'Samsung' | 'Xiaomi' | 'Motorola'>('Apple');
  const [osInput, setOsInput] = useState('');
  const navigate = useNavigate();

  const handleSearchOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (osInput.trim()) {
      navigate(`/status/${osInput.trim()}`);
    }
  };

  const filteredDevices = devicesList.filter((d) => d.brand === selectedBrand);

  return (
    <LandingLayout>
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. SEÇÃO CONSULTA DE OS (Fundo Azul Escuro #0A1833) */}
      <section id="status" className="bg-[#0A1833] text-white py-14 lg:py-16 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Lado Esquerdo - Campo Grande de Consulta */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FFD100] bg-blue-950/80 px-3 py-1 rounded border border-blue-800/60 inline-block">
                Consulta de Ordem de Serviço
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Acompanhe o reparo do seu aparelho
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Digite o número da sua Ordem de Serviço fornecido no comprovante do balcão para verificar o status em tempo real.
              </p>

              <form onSubmit={handleSearchOS} className="space-y-3 pt-2">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Número da Ordem de Serviço (Ex: CM-2026-00128)"
                    value={osInput}
                    onChange={(e) => setOsInput(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-lg bg-white text-[#0A1833] placeholder:text-slate-400 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-12 rounded-lg bg-[#0055FF] hover:bg-[#0044CC] font-extrabold text-sm text-white transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Search className="w-4 h-4 text-[#FFD100]" /> Consultar status
                </button>
              </form>
            </div>

            {/* Lado Direito - Exemplo Visual de OS Real com Timeline */}
            <div className="lg:col-span-6">
              <div className="bg-white text-[#0A1833] rounded-xl p-6 border border-slate-200 shadow-xl space-y-5">
                
                {/* Cabecalho da OS Exemplo */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#0055FF] uppercase block">Exemplo de Acompanhamento</span>
                    <h3 className="text-lg font-black text-[#0A1833]">OS CM-2026-0184</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">iPhone 13 Pro</span>
                    <span className="text-[11px] text-slate-500">Troca de display</span>
                  </div>
                </div>

                {/* Timeline Real das 6 Etapas */}
                <div className="space-y-2.5 text-xs font-semibold">
                  {[
                    { step: 'Recebido', done: true },
                    { step: 'Diagnóstico concluído', done: true },
                    { step: 'Orçamento aprovado', done: true },
                    { step: 'Em reparo', done: true, current: true },
                    { step: 'Em testes', done: false },
                    { step: 'Pronto para retirada', done: false },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
                        s.current
                          ? 'bg-blue-50 border-[#0055FF] text-[#0055FF] font-bold'
                          : s.done
                          ? 'bg-slate-50 border-slate-200 text-emerald-700'
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                          s.current
                            ? 'bg-[#0055FF] text-white'
                            : s.done
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-300 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="flex-1">{s.step}</span>
                      {s.current && (
                        <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-[#0055FF] px-2 py-0.5 rounded">
                          Em andamento
                        </span>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SEÇÃO APARELHOS QUE ATENDEMOS (Filtros + Lista Compacta Editorial) */}
      <section id="aparelhos" className="py-14 bg-[#F4F6F8] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-6">
          
          <div className="text-left space-y-1">
            <span className="text-xs font-extrabold uppercase text-[#0055FF]">Manutenção Multimarcas</span>
            <h2 className="text-3xl font-black text-[#0A1833] tracking-tight">Aparelhos que atendemos</h2>
          </div>

          {/* Filtros em Botões */}
          <div className="flex gap-2 border-b border-[#E5E7EB] pb-3">
            {(['Apple', 'Samsung', 'Xiaomi', 'Motorola'] as const).map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${
                  selectedBrand === brand
                    ? 'bg-[#0055FF] text-white'
                    : 'bg-white text-[#0A1833] border border-[#E5E7EB] hover:bg-slate-100'
                }`}
              >
                {brand === 'Apple' ? 'Apple iPhone' : brand}
              </button>
            ))}
          </div>

          {/* Lista Compacta Editorial (SEM CARDS GRANDES DE ECOMMERCE) */}
          <div className="divide-y divide-[#E5E7EB] bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
            {filteredDevices.map((item, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-[#F4F6F8] p-1 shrink-0 flex items-center justify-center border border-[#E5E7EB]">
                    <img src={item.img} alt={item.model} className="max-h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0A1833]">{item.model}</h3>
                    <p className="text-xs text-[#667085] mt-0.5">{item.issues}</p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 text-xs font-semibold text-[#0A1833] w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-[#667085]">{item.time}</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    {item.parts}
                  </span>
                  <a
                    href={`https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20${encodeURIComponent(item.model)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-3 rounded bg-[#0055FF] hover:bg-[#0044CC] text-white font-extrabold text-[11px] flex items-center gap-1 shrink-0"
                  >
                    Solicitar orçamento
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. SEÇÃO SERVIÇOS (Foto Grande à Esquerda + Lista Vertical à Direita com 1 Destaque) */}
      <section id="servicos" className="py-14 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-6">
          
          <div className="text-left space-y-1">
            <span className="text-xs font-extrabold uppercase text-[#0055FF]">Serviços de Bancada</span>
            <h2 className="text-3xl font-black text-[#0A1833] tracking-tight">Especialidades Técnicas</h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Esquerda: Fotografia Grande de Reparo de Tela */}
            <div className="lg:col-span-5 border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm bg-[#F4F6F8]">
              <img
                src="/brand/product.jpg"
                alt="Reparo profissional de tela de smartphone na bancada"
                className="w-full h-80 lg:h-[480px] object-cover"
              />
              <div className="p-4 bg-white border-t border-[#E5E7EB]">
                <h3 className="font-extrabold text-sm text-[#0A1833]">Substituição de Display & Telas OLED</h3>
                <p className="text-xs text-[#667085] mt-1">Serviço mais procurado. Peças testadas com regulagem de brilho e touch calibrado.</p>
              </div>
            </div>

            {/* Direita: Lista Vertical de Serviços */}
            <div className="lg:col-span-7 space-y-3">
              {[
                {
                  title: 'Troca de tela',
                  desc: 'Substituição de display quebrado, sem imagem ou touch falhando.',
                  time: '30 a 50 min',
                  highlight: true,
                },
                {
                  title: 'Troca de bateria',
                  desc: 'Baterias viciadas, descarregando rápido ou estufadas.',
                  time: '20 a 40 min',
                  highlight: false,
                },
                {
                  title: 'Conector de carga',
                  desc: 'Correção de mau contato e substituição de conectores USB-C ou Lightning.',
                  time: '40 a 60 min',
                  highlight: false,
                },
                {
                  title: 'Reparo de placa',
                  desc: 'Diagnóstico de curto, oxidação, falhas de iluminação e micro-soldagem.',
                  time: '24h a 48h',
                  highlight: false,
                },
                {
                  title: 'Câmera e Vidro Traseiro',
                  desc: 'Troca de lente de câmera e remoção a laser de vidro traseiro.',
                  time: '1h a 2h',
                  highlight: false,
                },
                {
                  title: 'Desoxidação',
                  desc: 'Limpeza química em banho ultrassônico para celulares molhados.',
                  time: '2h a 4h',
                  highlight: false,
                },
              ].map((srv, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    srv.highlight
                      ? 'bg-blue-50/70 border-[#0055FF]'
                      : 'bg-[#F4F6F8] border-[#E5E7EB]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-[#0A1833]">{srv.title}</h3>
                      {srv.highlight && (
                        <span className="text-[10px] font-black uppercase text-[#0055FF] bg-blue-100 px-2 py-0.5 rounded">
                          Mais procurado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#667085] font-medium">{srv.desc}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-[#0A1833] shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#E5E7EB] pt-2 sm:pt-0">
                    <span className="text-[#667085]">{srv.time} · 90 dias garantia</span>
                    <a
                      href={`https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20orçamento%20para%20${encodeURIComponent(srv.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0055FF] hover:underline font-extrabold text-xs"
                    >
                      Orçamento WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. SEÇÃO PROCESSO (Timeline Horizontal Desktop / Vertical Mobile - SEM CARDS) */}
      <section id="como-funciona" className="py-14 bg-[#F4F6F8] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-8">
          
          <div className="text-left space-y-1">
            <span className="text-xs font-extrabold uppercase text-[#0055FF]">Transparência</span>
            <h2 className="text-3xl font-black text-[#0A1833] tracking-tight">Como funciona o reparo</h2>
          </div>

          {/* Timeline com Números Grandes e Linhas (SEM CARDS) */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6 text-left border-t border-[#E5E7EB] pt-8">
            {[
              { num: '01', title: 'Recebimento', desc: 'Aparelho entregue no balcão com identificação.' },
              { num: '02', title: 'Checklist', desc: 'Conferência física na presença do cliente.' },
              { num: '03', title: 'Diagnóstico', desc: 'Testes na bancada para apurar a falha.' },
              { num: '04', title: 'Orçamento', desc: 'Valor e peças apresentados antes de reparar.' },
              { num: '05', title: 'Reparo', desc: 'Execução do serviço técnico autorizado.' },
              { num: '06', title: 'Testes', desc: 'Validação de touch, câmera e carga.' },
              { num: '07', title: 'Retirada', desc: 'Entrega com comprovante e garantia.' },
            ].map((st, i) => (
              <div key={i} className="relative space-y-1 pr-2">
                <span className="text-3xl font-black text-[#0055FF] block tracking-tighter">{st.num}</span>
                <h3 className="font-extrabold text-[#0A1833] text-sm">{st.title}</h3>
                <p className="text-xs text-[#667085] leading-snug">{st.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. SEÇÃO GARANTIA (Layout Assimétrico + Comprovante Impresso Realista à Direita) */}
      <section id="garantia" className="py-14 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Lado Esquerdo - Informações de Garantia */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <span className="text-xs font-extrabold uppercase text-[#0055FF]">Garantia Legal</span>
              <h2 className="text-3xl font-black text-[#0A1833] tracking-tight leading-tight">
                90 dias de garantia em peças e serviços realizados
              </h2>
              
              <p className="text-sm text-[#667085] leading-relaxed font-medium">
                Em conformidade com o Art. 26 do Código de Defesa do Consumidor. Cada manutenção executada na Cambuci Mobile acompanha comprovante com discriminativo das peças utilizadas e prazos de validade.
              </p>

              <div className="space-y-2 text-xs text-[#0A1833] font-semibold pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Comprovante impresso com número de Ordem de Serviço
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Peças utilizadas discriminadas com modelo e especificação
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Data de início e término exatos dos 90 dias de garantia
                </div>
              </div>
            </div>

            {/* Lado Direito - Representação Realista de Ordem de Serviço Impressa */}
            <div className="lg:col-span-6">
              <div className="bg-[#F4F6F8] border-2 border-slate-300 p-6 rounded-xl space-y-4 font-mono text-xs text-[#0A1833] shadow-md">
                <div className="border-b border-slate-300 pb-3 flex justify-between items-center font-sans font-bold">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase block">Comprovante de Serviço</span>
                    <strong className="text-sm text-[#0A1833]">Cambuci Mobile LTDA</strong>
                  </div>
                  <span className="text-xs font-extrabold text-[#0055FF] bg-white px-2.5 py-1 rounded border border-slate-300">
                    OS #CM-2026-0184
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">APARELHO:</span>
                    <strong>iPhone 13 Pro 128GB</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SERVIÇO:</span>
                    <strong>Troca de Tela OLED</strong>
                  </div>
                </div>

                <div className="border-t border-b border-slate-300 py-2 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Peça: Display OLED Premium iPhone 13 Pro</span>
                    <strong>R$ 550,00</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mão de obra técnica balcão</span>
                    <strong>R$ 150,00</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center font-sans pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Validade da Garantia</span>
                    <strong className="text-xs text-emerald-700">Garantia até 90 dias da entrega</strong>
                  </div>
                  <span className="text-sm font-black text-[#0055FF]">Total: R$ 700,00</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. SEÇÃO BANCADA (Foto Grande com Indicadores Técnicos Sobrepostos) */}
      <section id="bancada" className="py-14 bg-[#F4F6F8] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-6">
          
          <div className="text-left space-y-1">
            <span className="text-xs font-extrabold uppercase text-[#0055FF]">Estrutura Técnica</span>
            <h2 className="text-3xl font-black text-[#0A1833] tracking-tight">Equipamentos de Bancada</h2>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-[#E5E7EB] shadow-md bg-slate-900">
            <img
              src="/brand/hero.jpg"
              alt="Estação de solda, microscópio binocular e ferramentas de precisão na bancada"
              className="w-full h-80 md:h-[420px] object-cover opacity-90"
            />
            
            {/* Indicadores Técnicos Sobrepostos */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#0A1833]/90 text-white border border-slate-700 px-3 py-1 rounded text-xs font-extrabold">
                  Microscopia Binocular
                </span>
                <span className="bg-[#0A1833]/90 text-white border border-slate-700 px-3 py-1 rounded text-xs font-extrabold">
                  Solda SMD / BGA
                </span>
                <span className="bg-[#0A1833]/90 text-white border border-slate-700 px-3 py-1 rounded text-xs font-extrabold">
                  Diagnóstico de Placa
                </span>
                <span className="bg-[#0A1833]/90 text-white border border-slate-700 px-3 py-1 rounded text-xs font-extrabold">
                  Testes de Carga & Multímetro
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. SEÇÃO AVALIAÇÕES (Apenas Metrica 4.9/5 e +1.200 Atendimentos - SEM DEPOIMENTOS FALSOS) */}
      <section id="avaliacoes" className="py-12 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-5 md:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            4.9 de 5 estrelas
          </div>

          <h2 className="text-3xl font-black text-[#0A1833]">Mais de 1.200 atendimentos realizados</h2>
          <p className="text-xs text-[#667085] max-w-md mx-auto font-medium">
            Avaliações registradas de clientes atendidos no balcão da Cambuci Mobile com acompanhamento de Ordem de Serviço.
          </p>
        </div>
      </section>

      {/* 9. SEÇÃO LOJA FÍSICA (Layout Comercial com Fachada/Endereço - SEM 3 CARDS IGUAIS) */}
      <section id="loja" className="py-14 bg-[#F4F6F8]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-8">
          
          <div className="text-left space-y-1">
            <span className="text-xs font-extrabold uppercase text-[#0055FF]">Atendimento Presencial</span>
            <h2 className="text-3xl font-black text-[#0A1833] tracking-tight">Visite a Cambuci Mobile</h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center bg-white border border-[#E5E7EB] p-6 rounded-xl shadow-sm">
            
            <div className="lg:col-span-6 space-y-4 text-left">
              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-[#0A1833]">Loja Física & Balcão de Entrada</h3>
                <p className="text-xs text-[#667085] leading-relaxed font-medium">
                  Av. Lins de Vasconcelos, 1200 — Cambuci, São Paulo - SP
                </p>
              </div>

              <div className="space-y-2 text-xs text-[#0A1833] font-semibold">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0055FF]" /> Segunda a sexta: 08:00 às 19:00
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0055FF]" /> Sábado: 09:00 às 14:00
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#25D366]" /> WhatsApp: (11) 98765-4321
                </div>
              </div>

              <a
                href="https://wa.me/5511987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cambuci-whatsapp inline-flex items-center text-xs"
              >
                <PhoneCall className="w-4 h-4" /> Conversar no WhatsApp Direct
              </a>
            </div>

            <div className="lg:col-span-6 h-64 rounded-lg overflow-hidden border border-[#E5E7EB] bg-slate-200">
              <img src="/brand/hero.jpg" alt="Entrada da Loja Cambuci Mobile" className="w-full h-full object-cover" />
            </div>

          </div>

        </div>
      </section>
    </LandingLayout>
  );
}
