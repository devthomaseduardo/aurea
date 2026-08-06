import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import Hero from '@/shared/components/Hero';
import {
  Wrench,
  Smartphone,
  ShieldCheck,
  Search,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Clock,
  BatteryCharging,
  Zap,
  Camera,
  ArrowRight,
  Star,
  FileText,
  Lock,
  Cpu,
  Layers,
  ChevronRight,
  Instagram,
  Mail,
} from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';
import { BrandLogo } from '@/design-system/components/BrandLogo';

// 1. Catálogo de Aparelhos Atendidos com Imagens Reais
const deviceCatalog = [
  // Apple
  { brand: 'Apple', name: 'iPhone 11', img: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&auto=format&fit=crop&q=80', services: 'Tela, Bateria, Conector', time: '30 a 45 min' },
  { brand: 'Apple', name: 'iPhone 12', img: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&auto=format&fit=crop&q=80', services: 'Tela OLED, Bateria, Vidro Traseiro', time: '40 min' },
  { brand: 'Apple', name: 'iPhone 13', img: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&auto=format&fit=crop&q=80', services: 'Tela, Bateria, Placa, Câmera', time: '45 min' },
  { brand: 'Apple', name: 'iPhone 14', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80', services: 'Tela, Vidro Traseiro a Laser', time: '50 min' },
  { brand: 'Apple', name: 'iPhone 15', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80', services: 'Tela OLED, Conector USB-C', time: '45 min' },
  // Samsung
  { brand: 'Samsung', name: 'Galaxy S21', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=80', services: 'Tela Dynamic AMOLED, Bateria', time: '45 min' },
  { brand: 'Samsung', name: 'Galaxy S22', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=80', services: 'Tela, Conector USB-C, Câmera', time: '45 min' },
  { brand: 'Samsung', name: 'Galaxy S23', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=80', services: 'Tela AMOLED, Placa, Bateria', time: '50 min' },
  { brand: 'Samsung', name: 'Galaxy A54', img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&auto=format&fit=crop&q=80', services: 'Tela, Tampa Traseira, Carga', time: '40 min' },
  { brand: 'Samsung', name: 'Galaxy A55', img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&auto=format&fit=crop&q=80', services: 'Tela, Bateria, Conector', time: '40 min' },
  // Xiaomi
  { brand: 'Xiaomi', name: 'Redmi Note 11', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80', services: 'Tela, Bateria 5000mAh, Carga', time: '40 min' },
  { brand: 'Xiaomi', name: 'Redmi Note 12', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80', services: 'Tela AMOLED, Bateria, Desoxidação', time: '45 min' },
  { brand: 'Xiaomi', name: 'Redmi Note 13', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80', services: 'Tela, Conector USB-C', time: '45 min' },
  { brand: 'Xiaomi', name: 'Poco X5', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80', services: 'Tela 120Hz, Bateria, Placa', time: '50 min' },
  // Motorola
  { brand: 'Motorola', name: 'Moto G54', img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&auto=format&fit=crop&q=80', services: 'Tela, Bateria, Conector TurboPower', time: '40 min' },
  { brand: 'Motorola', name: 'Moto G84', img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&auto=format&fit=crop&q=80', services: 'Tela pOLED, Bateria, Câmera', time: '45 min' },
  { brand: 'Motorola', name: 'Edge 30', img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&auto=format&fit=crop&q=80', services: 'Tela OLED Curva, Conector', time: '50 min' },
  { brand: 'Motorola', name: 'Edge 40', img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&auto=format&fit=crop&q=80', services: 'Tela, Bateria, Tampa Traseira', time: '50 min' },
];

// 2. Serviços mais procurados
const servicesList = [
  {
    icon: Smartphone,
    title: 'Troca de Tela',
    description: 'Substituição de telas quebradas, sem imagem ou com falha no touch.',
    time: '30 a 50 min',
    warranty: '90 dias de garantia',
    brands: 'iPhone, Samsung, Xiaomi, Motorola',
  },
  {
    icon: BatteryCharging,
    title: 'Troca de Bateria',
    description: 'Baterias com baixa autonomia, desligamentos ou estufamento.',
    time: '20 a 40 min',
    warranty: '90 dias de garantia',
    brands: 'Todas as marcas',
  },
  {
    icon: Zap,
    title: 'Conector de Carga',
    description: 'Problemas para carregar, mau contato e substituição de conectores USB-C ou Lightning.',
    time: '40 a 60 min',
    warranty: '90 dias de garantia',
    brands: 'iPhone, Android',
  },
  {
    icon: Cpu,
    title: 'Reparo de Placa',
    description: 'Diagnóstico de curto, oxidação, falhas de energia e componentes internos.',
    time: '24h a 48h',
    warranty: '90 dias de garantia',
    brands: 'iPhone e Android',
  },
  {
    icon: Camera,
    title: 'Câmera e Vidro Traseiro',
    description: 'Troca de lente, câmera e vidro traseiro.',
    time: '1h a 2h',
    warranty: '90 dias de garantia',
    brands: 'iPhone, Samsung Galaxy',
  },
  {
    icon: Layers,
    title: 'Limpeza e Desoxidação',
    description: 'Tratamento técnico para aparelhos com contato com líquidos.',
    time: '2h a 4h',
    warranty: '90 dias de garantia',
    brands: 'Todas as marcas',
  },
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

  const filteredDevices = deviceCatalog.filter((d) => d.brand === selectedBrand);

  return (
    <LandingLayout>
      <Hero />

      {/* Seção: Aparelhos Atendidos (#aparelhos) */}
      <section id="aparelhos" className="py-16 md:py-20 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0055FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
              Modelos Suportados
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B1633] tracking-tight">
              Aparelhos Atendidos na Oficina
            </h2>
            <p className="text-slate-600 text-sm">
              Peças homologadas e ferramentas específicas para a manutenção de cada fabricante.
            </p>
          </div>

          {/* Navegação por marcas */}
          <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
            {(['Apple', 'Samsung', 'Xiaomi', 'Motorola'] as const).map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
                  selectedBrand === brand
                    ? 'bg-[#0055FF] text-white shadow-sm'
                    : 'bg-[#F5F7FA] text-[#0B1633] border border-[#E5E7EB] hover:bg-slate-200'
                }`}
              >
                {brand === 'Apple' ? 'Apple iPhone' : brand === 'Samsung' ? 'Samsung Galaxy' : brand}
              </button>
            ))}
          </div>

          {/* Grid dos Aparelhos */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredDevices.map((dev, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col justify-between hover:border-[#0055FF] transition-all shadow-sm group"
              >
                <div>
                  <div className="h-36 rounded-xl bg-[#F5F7FA] mb-3 p-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={dev.img}
                      alt={dev.name}
                      className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-extrabold text-[#0B1633] text-sm mb-1">{dev.name}</h3>
                  <p className="text-[11px] text-slate-500 mb-2 leading-snug">{dev.services}</p>
                  <div className="inline-block text-[10px] font-bold text-[#0055FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mb-3">
                    Prazo: {dev.time}
                  </div>
                </div>

                <a
                  href={`https://api.whatsapp.com/send?phone=5511987654321&text=Olá,%20gostaria%20de%20um%20orçamento%20para%20${encodeURIComponent(
                    dev.name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white font-bold text-xs text-center block transition-colors shadow-sm"
                >
                  Solicitar Orçamento
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção: Serviços Mais Procurados (#servicos) */}
      <section id="servicos" className="py-16 md:py-20 bg-[#F5F7FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0055FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
              Manutenção Balcão
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B1633] tracking-tight">
              Serviços Mais Procurados
            </h2>
            <p className="text-slate-600 text-sm">
              Serviços prestados na hora por técnicos especializados com vistoria de entrada.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#0055FF] transition-all"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0055FF] text-[#FFD100] flex items-center justify-center shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-extrabold text-[#0B1633]">{srv.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{srv.description}</p>

                    <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-[#E5E7EB]">
                      <div className="flex justify-between">
                        <span>Tempo estimado:</span>
                        <strong className="text-[#0B1633] font-bold">{srv.time}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Garantia:</span>
                        <strong className="text-emerald-700 font-bold">{srv.warranty}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Atende:</span>
                        <span className="text-slate-700 font-semibold">{srv.brands}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://api.whatsapp.com/send?phone=5511987654321&text=Olá,%20gostaria%20de%20orçamento%20para%20${encodeURIComponent(
                      srv.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full py-2.5 rounded-xl border-2 border-[#0055FF] text-[#0055FF] hover:bg-[#0055FF] hover:text-white font-bold text-xs text-center block transition-all"
                  >
                    Pedir Orçamento no WhatsApp
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seção: Acompanhe seu aparelho (#status) */}
      <section id="status" className="py-16 md:py-20 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-5 md:px-6 text-center space-y-6">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0055FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
            Consulta Online de Reparos
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-[#0B1633] tracking-tight">
            Acompanhe seu aparelho
          </h2>

          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            Consulte gratuitamente o andamento do seu reparo digitando o número da sua Ordem de Serviço (Ex: CM-2026-00128).
          </p>

          <form onSubmit={handleSearchOS} className="flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto pt-2">
            <input
              type="text"
              placeholder="Digite o código da OS (Ex: CM-2026-00128)"
              value={osInput}
              onChange={(e) => setOsInput(e.target.value)}
              className="flex-1 h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] text-[#0B1633] placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055FF] font-medium"
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-xl bg-[#0055FF] hover:bg-[#0044CC] font-bold text-sm text-white transition-colors shrink-0 shadow-sm flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-[#FFD100]" />
              Consultar Status
            </button>
          </form>
        </div>
      </section>

      {/* Seção: Como funciona (6 Etapas) */}
      <section className="py-16 md:py-20 bg-[#F5F7FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0055FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
              Transparência
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B1633] tracking-tight">
              Como funciona
            </h2>
            <p className="text-slate-600 text-sm">
              Passo a passo transparente desde o recebimento do celular até a entrega final.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { num: '1', title: 'Recebemos seu aparelho', desc: 'Fazemos um checklist físico completo junto com o cliente no balcão.' },
              { num: '2', title: 'Diagnóstico', desc: 'O técnico de bancada identifica a falha exata e registra o laudo inicial.' },
              { num: '3', title: 'Orçamento', desc: 'O cliente recebe o valor discriminado antes de qualquer reparo ser efetuado.' },
              { num: '4', title: 'Reparo', desc: 'O serviço técnico é executado após a aprovação expressa do cliente.' },
              { num: '5', title: 'Testes', desc: 'O aparelho passa por testes de touch, câmera, som e carregamento antes de liberar.' },
              { num: '6', title: 'Retirada', desc: 'O cliente recebe o celular testado com comprovante e garantia de 90 dias.' },
            ].map((st, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] p-5 rounded-2xl space-y-2 shadow-sm">
                <span className="w-8 h-8 rounded-lg bg-[#0055FF] text-[#FFD100] font-black flex items-center justify-center text-sm mb-2">
                  {st.num}
                </span>
                <h3 className="font-extrabold text-[#0B1633] text-sm">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção: Garantia Cambuci Mobile (#garantia) */}
      <section id="garantia" className="py-16 md:py-20 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block">
                Garantia Cambuci Mobile
              </span>

              <h2 className="text-3xl md:text-4xl font-black text-[#0B1633] tracking-tight leading-tight">
                90 dias de garantia nas peças e serviços realizados
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Respeitamos o direito do consumidor e prezamos pela honestidade. Trabalhamos com telas e componentes de procedência verificada, peças compatíveis homologadas ou de qualidade equivalente à original.
              </p>

              <div className="space-y-3">
                {[
                  'Comprovante impresso com discriminativo das peças substituídas',
                  'Checklist físico assinado no momento da entrega do celular',
                  'Registro da peça substituída com número de lote ou série',
                  'Data exata do reparo e data final da garantia de 90 dias',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F5F7FA] border-2 border-[#0055FF]/20 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                <FileText className="w-5 h-5 text-[#0055FF]" />
                <h3 className="font-extrabold text-sm text-[#0B1633]">Termo de Garantia e Transparência</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Não prometemos telas "originais de fábrica" em casos onde o fabricante não distribui componentes no mercado aberto. Informamos com total transparência se a peça utilizada é <strong>compatível homologada</strong>, <strong>premium OLED</strong> ou <strong>remanufaturada original</strong>.
              </p>

              <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] text-xs text-[#0B1633] font-bold flex items-center justify-between">
                <span>Garantia de 90 dias resguardada por lei</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Nossa Bancada */}
      <section className="py-16 md:py-20 bg-[#F5F7FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-md h-80 bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80"
                alt="Nossa Bancada Técnica"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0055FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
                Estrutura de Reparo
              </span>
              <h2 className="text-3xl font-black text-[#0B1633]">Nossa bancada técnica</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Seu aparelho é tratado em uma bancada técnica preparada para diagnóstico e reparos de diferentes níveis.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-[#0B1633] pt-2">
                <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0055FF]" /> Microscópio binocular
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0055FF]" /> Estação de solda Quick
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0055FF]" /> Ferramentas de precisão iFixit
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0055FF]" /> Multímetro e fonte de bancada
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Avaliações */}
      <section className="py-16 md:py-20 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-5 md:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs font-extrabold">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            4.9 de 5 estrelas
          </div>

          <h2 className="text-3xl font-black text-[#0B1633]">Mais de 1.200 atendimentos realizados</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium">
            Avaliações de clientes atendidos no balcão da Cambuci Mobile com acompanhamento de Ordem de Serviço.
          </p>
        </div>
      </section>

      {/* Seção: Visite a Cambuci Mobile (#loja / #contato) */}
      <section id="loja" className="py-16 md:py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0055FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
              Atendimento Balcão
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B1633] tracking-tight">
              Visite a Cambuci Mobile
            </h2>
            <p className="text-slate-600 text-sm">
              Loja física preparada para receber você e seu aparelho de segunda a sábado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] text-[#FFD100] flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#0B1633] text-base">Endereço da Loja</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Av. Lins de Vasconcelos, 1200 — Cambuci
                <br />
                São Paulo - SP
              </p>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center mx-auto">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#0B1633] text-base">WhatsApp Direct</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                (11) 98765-4321
                <br />
                contato@cambucimobile.com.br
              </p>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#0055FF] text-white flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#0B1633] text-base">Horários de Atendimento</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Segunda a sexta: 08:00 às 19:00
                <br />
                Sábado: 09:00 às 14:00
              </p>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
