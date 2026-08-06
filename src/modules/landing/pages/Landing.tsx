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
  ShoppingBag,
  ArrowRight,
  Star,
  Award,
} from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

const servicesList = [
  {
    icon: Smartphone,
    title: 'Troca de Tela / Display',
    description:
      'Substituição de displays OLED e LCD trincados ou sem imagem para iPhone, Samsung, Xiaomi e Motorola com testes de touch e brilho original.',
    badge: 'Mais Solicitado',
  },
  {
    icon: BatteryCharging,
    title: 'Troca de Bateria Homologada',
    description:
      'Substituição de baterias estufadas, viciadas ou descarregando rápido por baterias novas com garantia total.',
    badge: 'Express (30 min)',
  },
  {
    icon: Zap,
    title: 'Conector de Carga USB-C / Lightning',
    description:
      'Reparo para celulares que não carregam, mau contato no cabo ou aquecimento excessivo na tomada.',
    badge: 'Peça Original',
  },
  {
    icon: Wrench,
    title: 'Reparo Avançado em Placa',
    description:
      'Recuperação de aparelhos molhados, curtos na placa mãe, desoxidação ultrassônica e reparos em CI de carga / áudio.',
    badge: 'Técnico Senior',
  },
  {
    icon: Camera,
    title: 'Lentes de Câmera & Vidro Traseiro',
    description:
      'Troca de lentes de câmera fotográfica e remoção de tampa traseira de vidro a laser com acabamento original de fábrica.',
    badge: 'Tecnologia a Laser',
  },
  {
    icon: ShoppingBag,
    title: 'Venda de Acessórios & Seminovos',
    description:
      'Capas de alta resistência, películas 3D cerâmicas, carregadores GaN ultra-rápidos e iPhones seminovos revisados com garantia.',
    badge: 'Pronta Entrega',
  },
];

export default function Landing() {
  const [osInput, setOsInput] = useState('');
  const navigate = useNavigate();

  const handleSearchOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (osInput.trim()) {
      navigate(`/status/${osInput.trim()}`);
    }
  };

  return (
    <LandingLayout>
      <Hero />

      {/* Seção 1: Consultar OS (#status) */}
      <section id="status" className="bg-slate-50 py-16 md:py-20 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-5 md:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            Consulta Online de Reparos
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Consultar Status da sua Ordem de Serviço (OS)
          </h2>

          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Digite o número impresso em seu comprovante para visualizar o andamento em tempo real do conserto do seu celular.
          </p>

          <form onSubmit={handleSearchOS} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto pt-2">
            <input
              type="text"
              placeholder="Digite a OS (Ex: OS-2026-001) ou seu Telefone"
              value={osInput}
              onChange={(e) => setOsInput(e.target.value)}
              className="flex-1 h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white transition-colors shrink-0 shadow-md flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-yellow-300" />
              Buscar Status
            </button>
          </form>
        </div>
      </section>

      {/* Seção 2: Serviços Técnico (#servicos) */}
      <section id="servicos" className="bg-white py-20 md:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
              Manutenção & Conserto
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Serviços Técnicos Especializados
            </h2>
            <p className="text-slate-600 text-sm">
              Componentes testados com laudo técnico e transparência do início ao fim.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 hover:border-blue-500 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-yellow-400 flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                        {service.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="pt-5 border-t border-slate-200 mt-6 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Garantia 90 dias
                    </span>
                    <a
                      href={`https://api.whatsapp.com/send?phone=5511987654321&text=Olá,%20gostaria%20de%20um%20orçamento%20para%20${encodeURIComponent(
                        service.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                    >
                      Orçamento WhatsApp <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seção 3: Garantia 90 Dias (#garantia) */}
      <section id="garantia" className="bg-slate-50 py-20 md:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Segurança Legal
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Garantia de 90 Dias em Todas as Peças e Serviços
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                Cada serviço realizado na Cambuci Mobile acompanha nota e comprovante com garantia formal de 90 dias para os componentes trocados e trabalho executado.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Checklist físico completo com o cliente na entrega do celular (tela, som, biometria)',
                  'Laudo técnico discriminando cada peça substituída e os custos',
                  'Peças com teste de qualidade e procedência garantida',
                  'Acompanhamento online da Ordem de Serviço pelo celular',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-blue-600/30 rounded-2xl p-8 space-y-6 shadow-md">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-yellow-400 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Nossos Compromissos</h3>
                  <span className="text-xs text-slate-500">Transparência total na bancada</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block font-bold mb-1">Aprovação Prévia de Orçamento</strong>
                  Você só paga pelo que autorizar previamente. Sem taxas surpresa no balcão.
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block font-bold mb-1">Proteção e Privacidade dos Seus Dados</strong>
                  Mantemos a integridade de suas fotos, mensagens e arquivos durante todo o processo técnico.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 4: Contato & Endereço (#contato) */}
      <section id="contato" className="bg-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
              Atendimento Balcão
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Endereço e Contato da Loja Física
            </h2>
            <p className="text-slate-600 text-sm">
              Visite nossa loja ou fale diretamente com a equipe técnica via WhatsApp.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-yellow-400 flex items-center justify-center mx-auto shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Endereço da Oficina</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Av. Paulista, 1000 — Loja 42 (Galeria Central)
                <br />
                Bela Vista, São Paulo - SP
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Atendimento via WhatsApp</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                WhatsApp: (11) 98765-4321
                <br />
                E-mail: contato@teronfix.com.br
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Horário de Atendimento</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Segunda a Sexta: 08:00h às 19:00h
                <br />
                Sábado: 09:00h às 14:00h
              </p>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
