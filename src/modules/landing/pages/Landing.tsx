import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import Hero from '@/shared/components/Hero';
import {
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

// Lista de Aparelhos Atendidos (Fotos Reais de /public/img/celulares/)
const supportedDevices = [
  // Apple
  { brand: 'Apple', model: 'iPhone 13 Pro', img: '/img/celulares/apple-iphone-13-preto.jpg', services: ['Tela', 'Bateria', 'Conector', 'Câmera'], time: '40 a 90 minutos', parts: 'Consulte disponibilidade' },
  { brand: 'Apple', model: 'iPhone 16 Pro Max', img: '/img/celulares/apple-iphone-16-preto.jpg', services: ['Tela OLED', 'Vidro Traseiro', 'Bateria', 'Câmera'], time: '45 a 90 minutos', parts: 'Consulte disponibilidade' },
  { brand: 'Apple', model: 'iPhone 16', img: '/img/celulares/apple-iphone-16-rosa.jpg', services: ['Tela', 'Bateria', 'Conector USB-C'], time: '35 a 60 minutos', parts: 'Consulte disponibilidade' },
  { brand: 'Apple', model: 'iPhone SE 2ª Gen', img: '/img/celulares/apple-iphone-se.jpg', services: ['Tela LCD', 'Bateria', 'Botão Home', 'Carga'], time: '30 a 45 minutos', parts: 'Consulte disponibilidade' },
  // Samsung
  { brand: 'Samsung', model: 'Galaxy S25 5G', img: '/img/celulares/samsung-galaxy-s25.jpg', services: ['Tela Dynamic AMOLED', 'Bateria', 'Carga'], time: '45 a 90 minutos', parts: 'Consulte disponibilidade' },
  { brand: 'Samsung', model: 'Galaxy S24 Ultra', img: '/img/celulares/samsung-galaxy-s24-ultra.jpg', services: ['Display AMOLED', 'Vidro Traseiro', 'Placa'], time: '50 a 90 minutos', parts: 'Consulte disponibilidade' },
  { brand: 'Samsung', model: 'Galaxy A26 5G', img: '/img/celulares/samsung-galaxy-a26.jpg', services: ['Tela Super AMOLED', 'Bateria', 'Conector'], time: '40 a 60 minutos', parts: 'Consulte disponibilidade' },
  { brand: 'Samsung', model: 'Galaxy A16', img: '/img/celulares/samsung-galaxy-a16.jpg', services: ['Tela trincada', 'Conector de carga', 'Bateria'], time: '40 a 60 minutos', parts: 'Consulte disponibilidade' },
  // Xiaomi
  { brand: 'Xiaomi', model: 'Xiaomi 17 Pro 5G', img: '/img/celulares/xiaomi-17-pro.jpg', services: ['Tela 144Hz', 'Bateria', 'Placa', 'Carga'], time: '45 a 90 minutos', parts: 'Consulte disponibilidade' },
  { brand: 'Xiaomi', model: 'Xiaomi 14', img: '/img/celulares/xiaomi-14.jpg', services: ['Tela', 'Bateria 5000mAh', 'Câmera'], time: '40 a 60 minutos', parts: 'Consulte disponibilidade' },
  { brand: 'Xiaomi', model: 'Redmi Note 15 Pro', img: '/img/celulares/xiaomi-redmi-note-15-pro.jpg', services: ['Tela', 'Conector USB-C', 'Desoxidação'], time: '40 a 60 minutos', parts: 'Consulte disponibilidade' },
  // Motorola
  { brand: 'Motorola', model: 'Motorola Signature', img: '/img/celulares/motorola-signature.jpg', services: ['Tela pOLED', 'Bateria', 'Placa Mãe'], time: '50 a 90 minutos', parts: 'Consulte disponibilidade' },
  { brand: 'Motorola', model: 'Motorola Edge 70', img: '/img/celulares/motorola-edge-70.png', services: ['Tela curva', 'Conector TurboPower', 'Câmera'], time: '45 a 90 minutos', parts: 'Consulte disponibilidade' },
  { brand: 'Motorola', model: 'Moto G86 5G', img: '/img/celulares/motorola-moto-g86.png', services: ['Tela', 'Conector', 'Bateria'], time: '40 a 60 minutos', parts: 'Consulte disponibilidade' },
];

const brandIcons = {
  Apple: '/brands/apple.svg',
  Samsung: '/brands/samsung.svg',
  Xiaomi: '/brands/xiaomi.svg',
  Motorola: '/brands/motorola.svg',
};

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

  const filteredDevices = supportedDevices.filter((d) => d.brand === selectedBrand);

  return (
    <LandingLayout>
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. SEÇÃO CONSULTA DE OS (Fundo Azul Escuro #0A1833) */}
      <section id="status" className="bg-[#0A1833] text-white py-14 lg:py-16 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Lado Esquerdo - Campo de Consulta de OS */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFD100] bg-blue-950/80 px-3 py-1 rounded border border-blue-800/60 inline-block">
                Acompanhamento de Reparo Online
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Acompanhe o reparo do seu aparelho
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Digite o número da Ordem de Serviço impresso no comprovante recebido no balcão da loja para verificar o andamento em tempo real.
              </p>

              <form onSubmit={handleSearchOS} className="space-y-3 pt-2">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Número da Ordem de Serviço (Ex: CM-2026-0184)"
                    value={osInput}
                    onChange={(e) => setOsInput(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-lg bg-white text-[#0A1833] placeholder:text-slate-400 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-12 rounded-lg bg-[#0055FF] hover:bg-[#0044CC] font-extrabold text-sm text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Search className="w-4 h-4 text-[#FFD100]" /> Consultar status
                </button>
              </form>
            </div>

            {/* Lado Direito - Registro de OS com Timeline Conectada */}
            <div className="lg:col-span-6">
              <div className="bg-white text-[#0A1833] rounded-xl p-6 border border-slate-200 shadow-xl space-y-5">
                
                {/* Dados da OS */}
                <div className="border-b border-slate-200 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0055FF] tracking-wider uppercase">OS CM-2026-0184</span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Entrada: 12/08/2026</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                    <div><span className="text-slate-500 font-normal">Cliente:</span> <strong>Marcos Oliveira</strong></div>
                    <div><span className="text-slate-500 font-normal">Aparelho:</span> <strong>iPhone 13 Pro</strong></div>
                    <div><span className="text-slate-500 font-normal">Serviço:</span> <strong>Troca de tela</strong></div>
                    <div><span className="text-slate-500 font-normal">Previsão:</span> <strong>13/08/2026</strong></div>
                  </div>
                </div>

                {/* Timeline de 6 Etapas */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#667085] uppercase block mb-1">Status Atual: <strong className="text-[#0055FF]">Em reparo</strong></span>
                  {[
                    { step: 'Recebido', done: true },
                    { step: 'Diagnóstico', done: true },
                    { step: 'Orçamento aprovado', done: true },
                    { step: 'Em reparo', done: true, active: true },
                    { step: 'Testes', done: false },
                    { step: 'Pronto para retirada', done: false },
                  ].map((st, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-2.5 rounded-lg text-xs font-bold transition-all ${
                        st.active
                          ? 'bg-blue-50 border-2 border-[#0055FF] text-[#0055FF]'
                          : st.done
                          ? 'bg-emerald-50/60 border border-emerald-200 text-emerald-800'
                          : 'bg-slate-50 border border-slate-200 text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                          st.active
                            ? 'bg-[#0055FF] text-white'
                            : st.done
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="flex-1">{st.step}</span>
                      {st.active && (
                        <span className="text-[10px] font-black uppercase text-[#0055FF] bg-blue-100 px-2 py-0.5 rounded">
                          Em execução na bancada
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

      {/* 3. SEÇÃO APARELHOS ATENDIDOS (Logos Reais SVGs + Fotos Reais) */}
      <section id="aparelhos" className="py-14 bg-[#F4F6F8] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-6">
          
          <div className="text-left space-y-1">
            <span className="text-xs font-bold uppercase text-[#0055FF]">Modelos Atendidos</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1833] tracking-tight">Atendemos celulares das principais marcas</h2>
          </div>

          {/* Filtros por Marca com Logos SVGs Oficiais */}
          <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] pb-3">
            {(['Apple', 'Samsung', 'Xiaomi', 'Motorola'] as const).map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-2 ${
                  selectedBrand === brand
                    ? 'bg-[#0055FF] text-white'
                    : 'bg-white text-[#0A1833] border border-[#E5E7EB] hover:bg-slate-100'
                }`}
              >
                <img src={brandIcons[brand]} alt={`Logo ${brand}`} className="w-4 h-4 object-contain" />
                {brand === 'Apple' ? 'Atendemos Apple iPhone' : `Atendemos ${brand}`}
              </button>
            ))}
          </div>

          {/* Lista Compacta de Aparelhos com Imagens Reais de /public/img/celulares/ */}
          <div className="divide-y divide-[#E5E7EB] bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
            {filteredDevices.map((item, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-[#F4F6F8] p-1.5 shrink-0 flex items-center justify-center border border-[#E5E7EB]">
                    <img src={item.img} alt={item.model} className="max-h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0A1833]">{item.model}</h3>
                    <p className="text-xs text-[#667085] mt-0.5">
                      <strong>Serviços frequentes:</strong> {item.services.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 text-xs font-semibold text-[#0A1833] w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#E5E7EB] pt-2 sm:pt-0">
                  <div className="text-left">
                    <span className="text-[#667085] block text-[11px]">Prazo médio:</span>
                    <strong>{item.time}</strong>
                  </div>
                  <div className="text-left">
                    <span className="text-[#667085] block text-[11px]">Peças:</span>
                    <strong className="text-emerald-700">{item.parts}</strong>
                  </div>
                  <a
                    href={`https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20o%20${encodeURIComponent(item.model)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-4 rounded bg-[#0055FF] hover:bg-[#0044CC] text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <img src="/brands/whatsapp.svg" alt="WhatsApp" className="w-3.5 h-3.5 filter brightness-0 invert" />
                    Solicitar orçamento
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. SEÇÃO SERVIÇOS (Área Editorial: Fotografia Real da Bancada + Lista Técnica) */}
      <section id="servicos" className="py-14 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-6">
          
          <div className="text-left space-y-1">
            <span className="text-xs font-bold uppercase text-[#0055FF]">Serviços Executados na Bancada</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1833] tracking-tight">Manutenção Técnica Especializada</h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Esquerda: Fotografia Real do Reparo (/brand/product.jpg) */}
            <div className="lg:col-span-5 border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm bg-[#F4F6F8]">
              <img
                src="/brand/product.jpg"
                alt="Fotografia de reparo profissional de tela de smartphone na bancada"
                className="w-full h-80 lg:h-[480px] object-cover"
              />
              <div className="p-4 bg-white border-t border-[#E5E7EB] space-y-1 text-left">
                <h3 className="font-extrabold text-sm text-[#0A1833]">Bancada Equipada para Troca de Telas & Touch</h3>
                <p className="text-xs text-[#667085]">Manutenção com regulagem de brilho, biometria preservada e calibração de touch.</p>
              </div>
            </div>

            {/* Direita: Lista Técnica com Destaque para Troca de Tela */}
            <div className="lg:col-span-7 space-y-3 text-left">
              
              {/* Servicio Destaque: Troca de Tela */}
              <div className="p-5 rounded-xl border-2 border-[#0055FF] bg-blue-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-[#0A1833]">Troca de Tela</h3>
                  <span className="text-[10px] font-black uppercase text-[#0055FF] bg-blue-100 px-2.5 py-1 rounded">
                    Mais procurado no balcão
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                  <div>
                    <span className="text-[#667085] block text-[11px] font-normal">Problemas atendidos:</span>
                    <strong>Tela quebrada · Sem imagem · Touch falhando · Manchas no display</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block text-[11px] font-normal">Prazo de bancada:</span>
                    <strong>A partir de 40 minutos</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-extrabold">Garantia legal de 90 dias inclusa</span>
                  <a
                    href="https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20orçamento%20para%20Troca%20de%20Tela"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-3 rounded bg-[#0055FF] hover:bg-[#0044CC] text-white font-extrabold text-xs flex items-center gap-1.5"
                  >
                    <img src="/brands/whatsapp.svg" alt="WhatsApp" className="w-3.5 h-3.5 filter brightness-0 invert" />
                    Consultar disponibilidade
                  </a>
                </div>
              </div>

              {/* Demais Serviços em Linhas Menores */}
              {[
                { title: 'Troca de bateria', issues: 'Bateria viciada, descarregando rápido ou estufada', time: 'A partir de 30 min', warranty: '90 dias' },
                { title: 'Conector de carga', issues: 'Mau contato, cabo solto ou não carrega', time: 'A partir de 40 min', warranty: '90 dias' },
                { title: 'Reparo de placa', issues: 'Curto-circuito, oxidação e micro-soldagem CIs', time: '24h a 48h', warranty: '90 dias' },
                { title: 'Câmera e Vidro Traseiro', issues: 'Lente riscada, vidro traseiro quebrado a laser', time: 'A partir de 1h', warranty: '90 dias' },
                { title: 'Desoxidação', issues: 'Banho ultrassônico para aparelhos molhados', time: '2h a 4h', warranty: '90 dias' },
              ].map((srv, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F4F6F8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-extrabold text-[#0A1833] text-xs">{srv.title}</h4>
                    <p className="text-[11px] text-[#667085]">{srv.issues}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#E5E7EB] pt-2 sm:pt-0">
                    <span className="text-[#667085] font-semibold">{srv.time}</span>
                    <a
                      href={`https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20orçamento%20para%20${encodeURIComponent(srv.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0055FF] hover:underline font-extrabold text-xs flex items-center gap-1"
                    >
                      <img src="/brands/whatsapp.svg" alt="WhatsApp" className="w-3.5 h-3.5" />
                      Orçamento WhatsApp
                    </a>
                  </div>
                </div>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* 5. SEÇÃO COMO FUNCIONA (Timeline Conectada 1 a 7) */}
      <section id="como-funciona" className="py-14 bg-[#F4F6F8] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-8">
          
          <div className="text-left space-y-1">
            <span className="text-xs font-bold uppercase text-[#0055FF]">Transparência Operacional</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1833] tracking-tight">Como funciona o reparo</h2>
          </div>

          <div className="relative pt-4">
            <div className="hidden md:block absolute top-[28px] left-[40px] right-[40px] h-1 bg-[#0055FF]/20 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 text-left relative z-10">
              {[
                { num: '1', title: 'Recebimento', desc: 'Aparelho entregue no balcão da loja.' },
                { num: '2', title: 'Checklist', desc: 'Vistoria física na presença do cliente.' },
                { num: '3', title: 'Diagnóstico', desc: 'Testes de bancada para identificar a falha.' },
                { num: '4', title: 'Orçamento', desc: 'Apresentação prévia de valores e peças.' },
                { num: '5', title: 'Reparo', desc: 'Execução do serviço técnico autorizado.' },
                { num: '6', title: 'Testes', desc: 'Validação de touch, câmera, som e carga.' },
                { num: '7', title: 'Entrega', desc: 'Retirada do aparelho com garantia.' },
              ].map((st, idx) => (
                <div key={idx} className="space-y-1 bg-[#F4F6F8] md:bg-transparent p-3 md:p-0 rounded-lg border md:border-0 border-[#E5E7EB]">
                  <span className="w-8 h-8 rounded-full bg-[#0055FF] text-[#FFD100] font-black text-sm flex items-center justify-center border-2 border-white shadow-sm mb-2">
                    {st.num}
                  </span>
                  <h3 className="font-extrabold text-[#0A1833] text-xs">{st.title}</h3>
                  <p className="text-[11px] text-[#667085] leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 6. SEÇÃO GARANTIA (Layout Assimétrico com Documento Técnico Impresso) */}
      <section id="garantia" className="py-14 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-4 text-left">
              <span className="text-xs font-bold uppercase text-[#0055FF]">Garantia Legal CDC Art. 26</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A1833] tracking-tight leading-tight">
                90 dias de garantia em peças e serviços realizados
              </h2>
              
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed font-medium">
                Cada serviço concluído no balcão da Cambuci Mobile acompanha comprovante físico contendo a discriminação completa da peça substituída, mão de obra e vigência da garantia legal.
              </p>

              <div className="space-y-2 text-xs text-[#0A1833] font-semibold pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Comprovante impresso com código da Ordem de Serviço
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Peça substituída discriminada com especificações
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Data exata de início e término dos 90 dias de garantia
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-[#F4F6F8] border-2 border-slate-300 p-5 rounded-xl space-y-3 font-mono text-xs text-[#0A1833] shadow-sm">
                <div className="border-b border-slate-300 pb-3 flex justify-between items-center font-sans font-bold">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Comprovante de Retirada & Garantia</span>
                    <strong className="text-xs text-[#0A1833]">Cambuci Mobile LTDA · SP</strong>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#0055FF] bg-white px-2 py-0.5 rounded border border-slate-300">
                    OS CM-2026-0184
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-500 block">CLIENTE:</span> <strong>Marcos Oliveira</strong></div>
                  <div><span className="text-slate-500 block">APARELHO:</span> <strong>iPhone 13 Pro</strong></div>
                  <div><span className="text-slate-500 block">DATA SERVIÇO:</span> <strong>12/08/2026</strong></div>
                  <div><span className="text-slate-500 block">VIGÊNCIA GARANTIA:</span> <strong className="text-emerald-700">Até 10/11/2026</strong></div>
                </div>

                <div className="border-t border-b border-slate-300 py-2 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Serviço executado: Troca de Display OLED Premium</span>
                    <strong>R$ 550,00</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mão de obra técnica de bancada</span>
                    <strong>R$ 150,00</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center font-sans text-xs pt-1">
                  <span className="text-slate-500 text-[10px]">Garantia legal de 90 dias assegurada</span>
                  <span className="font-black text-[#0055FF]">Valor Total: R$ 700,00</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. SEÇÃO BANCADA TÉCNICA (Fotografia Real da Bancada + Indicadores) */}
      <section id="bancada" className="py-14 bg-[#F4F6F8] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-6">
          
          <div className="text-left space-y-1">
            <span className="text-xs font-bold uppercase text-[#0055FF]">Estrutura Técnica</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1833] tracking-tight">Nossa bancada técnica</h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Foto Real da Bancada */}
            <div className="lg:col-span-7 relative rounded-xl overflow-hidden border border-[#E5E7EB] shadow-md bg-slate-900">
              <img
                src="/brand/hero.jpg"
                alt="Fotografia real da bancada com microscópio, estação de solda e ferramentas"
                className="w-full h-72 md:h-[380px] object-cover opacity-95"
              />
            </div>

            {/* Informações da Bancada em Lista Técnica (Sem Cards Grandes) */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <h3 className="font-extrabold text-lg text-[#0A1833]">Equipamentos de Precisão</h3>
              <p className="text-xs text-[#667085] leading-relaxed font-medium">
                Nossa bancada é equipada para diagnósticos elétricos, recondicionamento e substituição de componentes micro-soldados.
              </p>

              <div className="space-y-3 pt-2 text-xs font-semibold text-[#0A1833]">
                <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-between">
                  <div>
                    <strong className="block text-sm">Microscopia Binocular</strong>
                    <span className="text-slate-500 font-normal">Inspeção de trilhas e componentes SMD</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0055FF]" />
                </div>

                <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-between">
                  <div>
                    <strong className="block text-sm">Solda de Precisão & BGA</strong>
                    <span className="text-slate-500 font-normal">Estações de solda e soprador térmico regulado</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0055FF]" />
                </div>

                <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-between">
                  <div>
                    <strong className="block text-sm">Diagnóstico de Placa & Multímetro</strong>
                    <span className="text-slate-[#667085] font-normal">Mapeamento de curto-circuito e fuga de corrente</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0055FF]" />
                </div>

                <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-between">
                  <div>
                    <strong className="block text-sm">Testes Elétricos & Carga</strong>
                    <span className="text-slate-[#667085] font-normal">Medição de amperagem e consumo de bateria</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0055FF]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. SEÇÃO AVALIAÇÕES (Estrutura Preparada para Avaliações do Google com Logo Oficial) */}
      <section id="avaliacoes" className="py-12 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-5 md:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 border border-[#E5E7EB] text-slate-800 text-xs font-extrabold">
            <img src="/brands/google.svg" alt="Google" className="w-4 h-4 object-contain" />
            <span>Avaliações no Google</span>
            <span className="text-amber-600 font-black ml-1">4.9 ★★★★★</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#0A1833]">Baseado em avaliações reais de clientes</h2>
          <p className="text-xs text-[#667085] max-w-md mx-auto font-medium">
            Atendimento presencial com Ordem de Serviço emitida e acompanhada online no balcão da Cambuci Mobile em São Paulo.
          </p>
        </div>
      </section>

      {/* 9. SEÇÃO LOJA FÍSICA (Layout Comercial com Foto da Fachada e WhatsApp Official SVG) */}
      <section id="loja" className="py-14 bg-[#F4F6F8]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 space-y-6">
          
          <div className="text-left space-y-1">
            <span className="text-xs font-bold uppercase text-[#0055FF]">Atendimento Presencial</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1833] tracking-tight">Visite a Cambuci Mobile</h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center bg-white border border-[#E5E7EB] p-6 rounded-xl shadow-sm">
            
            <div className="lg:col-span-6 space-y-4 text-left">
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-[#0A1833]">Loja Física & Balcão de Atendimento</h3>
                <p className="text-xs text-[#667085] font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0055FF]" /> Av. Lins de Vasconcelos, 1200 — Cambuci, São Paulo SP
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
                  <img src="/brands/whatsapp.svg" alt="WhatsApp" className="w-4 h-4" /> WhatsApp Direct: (11) 98765-4321
                </div>
              </div>

              <a
                href="https://wa.me/5511987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cambuci-whatsapp inline-flex items-center text-xs gap-2"
              >
                <img src="/brands/whatsapp.svg" alt="WhatsApp" className="w-4 h-4 filter brightness-0 invert" />
                Solicitar orçamento pelo WhatsApp
              </a>
            </div>

            <div className="lg:col-span-6 h-64 rounded-lg overflow-hidden border border-[#E5E7EB] bg-slate-200">
              <img src="/brand/hero.jpg" alt="Entrada da Loja Cambuci Mobile em São Paulo" className="w-full h-full object-cover" />
            </div>

          </div>

        </div>
      </section>
    </LandingLayout>
  );
}
