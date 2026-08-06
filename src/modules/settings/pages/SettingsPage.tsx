import { useState } from 'react';
import { Settings, Building2, Store, Phone, ShieldCheck, Check, Save } from 'lucide-react';
import { settingsService } from '@/services/settings.service';
import { Button } from '@/shared/components/ui/button';

export default function SettingsPage() {
  const tenants = settingsService.getTenants();
  const [activeTenant, setActiveTenant] = useState(settingsService.getActiveTenant());
  const [name, setName] = useState(activeTenant.name);
  const [phone, setPhone] = useState(activeTenant.phone);
  const [whatsapp, setWhatsapp] = useState(activeTenant.whatsapp);
  const [address, setAddress] = useState(activeTenant.address);
  const [cnpj, setCnpj] = useState(activeTenant.cnpj);
  const [warrantyTerms, setWarrantyTerms] = useState(activeTenant.warrantyTerms);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSwitchTenant = (id: string) => {
    const updated = settingsService.setActiveTenant(id);
    setActiveTenant(updated);
    setName(updated.name);
    setPhone(updated.phone);
    setWhatsapp(updated.whatsapp);
    setAddress(updated.address);
    setCnpj(updated.cnpj);
    setWarrantyTerms(updated.warrantyTerms);
    window.location.reload();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = settingsService.updateTenant(activeTenant.id, {
      name,
      phone,
      whatsapp,
      address,
      cnpj,
      warrantyTerms,
    });
    setActiveTenant(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase">
            <Settings className="w-3.5 h-3.5 text-blue-600" />
            Configurações White-Label
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Minha Loja & Dados da Empresa
          </h1>
          <p className="text-xs text-slate-500">
            Personalize o nome da empresa, logo, endereço e altere entre lojas cadastradas na plataforma.
          </p>
        </div>
      </div>

      {/* Showcase Multi-Tenant Switcher */}
      <div className="bg-blue-50/70 border-2 border-blue-200 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-blue-900">
          <Store className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-sm">Seletor de Empresas (Multi-Tenant Showcase)</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Esta plataforma foi desenhada como um **SaaS Multi-Tenant**. Cada assistência técnica cadastrada possui seus próprios dados, clientes, ordens de serviço e marca. Alterne abaixo para simular outra empresa:
        </p>

        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          {tenants.map((t) => {
            const isCurrent = t.id === activeTenant.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSwitchTenant(t.id)}
                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'border-blue-600 bg-white shadow-sm ring-2 ring-blue-600/20'
                    : 'border-slate-200 bg-white/70 hover:bg-white'
                }`}
              >
                <div>
                  <strong className="text-sm font-bold text-slate-900 block">{t.name}</strong>
                  <span className="text-[11px] text-slate-500">{t.cnpj}</span>
                </div>
                {isCurrent && (
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <Check className="w-3 h-3 text-blue-600" /> Ativa
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulário de Configuração da Loja */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-3">
          Dados da Assistência Técnica
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nome Fantasia da Loja</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">CNPJ da Empresa</label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Telefone Fixo / Balcão</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">WhatsApp da Assistência</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Endereço Completo</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Termos e Condições da Garantia Legal (90 Dias)</label>
          <textarea
            rows={3}
            value={warrantyTerms}
            onChange={(e) => setWarrantyTerms(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Alterações salvas com sucesso!
            </span>
          ) : (
            <span className="text-xs text-slate-500">As alterações serão refletidas em todos os comprovantes.</span>
          )}

          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-sm">
            <Save className="w-4 h-4 text-yellow-300" /> Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  );
}
