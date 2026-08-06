import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import { Wrench, BatteryCharging, Zap, Cpu, Camera, Layers, ShieldCheck, Clock, CheckCircle2, PhoneCall } from 'lucide-react';

export default function ServicesPage() {
  const fullServices = [
    {
      icon: Wrench,
      title: 'Substituição de Tela / Display OLED',
      desc: 'Troca completa de módulo frontal para telas trincadas, touch falhando ou sem imagem. Peças compatíveis homologadas e telas de padrão original com regulagem de brilho.',
      time: '30 a 50 minutos',
      warranty: '90 Dias Legal',
      price: 'A partir de R$ 180,00',
    },
    {
      icon: BatteryCharging,
      title: 'Troca de Bateria Nova',
      desc: 'Substituição de baterias viciadas, com baixa autonomia, desligamentos inesperados ou estufadas. Teste de consumo de corrente no multímetro.',
      time: '20 a 40 minutos',
      warranty: '90 Dias Legal',
      price: 'A partir de R$ 120,00',
    },
    {
      icon: Zap,
      title: 'Reparo de Conector de Carga USB-C / Lightning',
      desc: 'Correção de mau contato, cabo folgado ou falha total de carregamento. Substituição da sub-placa ou conector físico.',
      time: '40 a 60 minutos',
      warranty: '90 Dias Legal',
      price: 'A partir de R$ 110,00',
    },
    {
      icon: Cpu,
      title: 'Reparo Avançado de Placa Mãe (Micro-soldagem)',
      desc: 'Diagnóstico de curto-circuito, falhas de iluminação (backlight), oxidação grave, problemas em CIs de carga (Tristar/Hydra) e de áudio.',
      time: '24 a 48 horas',
      warranty: '90 Dias Legal',
      price: 'Sob Consulta Técnica',
    },
    {
      icon: Camera,
      title: 'Troca de Lente, Câmeras & Vidro Traseiro a Laser',
      desc: 'Remoção limpa do vidro traseiro trincado sem danificar o carregamento sem fio e troca de lentes de câmera riscadas.',
      time: '1 a 3 horas',
      warranty: '90 Dias Legal',
      price: 'A partir de R$ 150,00',
    },
    {
      icon: Layers,
      title: 'Desoxidação & Limpeza Química por Ultrassom',
      desc: 'Tratamento imediato para celulares molhados ou expostos à umidade extrema. Banho ultrassônico com álcool isopropílico 99.9%.',
      time: '2 a 4 horas',
      warranty: '90 Dias Legal',
      price: 'A partir de R$ 140,00',
    },
  ];

  return (
    <LandingLayout>
      <section className="bg-[#0B1633] text-white py-14 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 text-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FFD100] bg-blue-900/60 px-3.5 py-1 rounded-full border border-blue-700/50 inline-block">
            Tabela de Manutenção Balcão
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white">
            Serviços Técnicos Especializados
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto font-medium">
            Diagnóstico transparente, prazos reais de execução e garantia legal de 90 dias com laudo assinado.
          </p>
        </div>
      </section>

      <section className="py-14 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto px-5 md:px-6 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {fullServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0055FF] text-[#FFD100] flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[#0B1633] text-base leading-snug">{srv.title}</h3>
                        <span className="text-xs font-bold text-[#0055FF]">{srv.price}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{srv.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#0055FF]" /> {srv.time}</span>
                    <span className="flex items-center gap-1 text-emerald-700"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {srv.warranty}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border-2 border-[#0055FF]/20 p-6 rounded-2xl text-center space-y-4 shadow-sm">
            <h3 className="text-lg font-black text-[#0B1633]">Precisa de um orçamento sob medida?</h3>
            <p className="text-xs text-slate-600 max-w-xl mx-auto font-medium">
              Fale com um técnico de bancada agora mesmo no WhatsApp e tire todas as suas dúvidas sobre peças e prazos.
            </p>
            <a
              href="https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20tirar%20dúvidas%20sobre%20serviços"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cambuci-whatsapp inline-flex items-center mx-auto"
            >
              <PhoneCall className="w-4 h-4" /> Conversar com Técnico no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
