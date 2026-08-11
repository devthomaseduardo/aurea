import { useState } from 'react';
import { Building2, Check, Save, ArrowUpRight } from 'lucide-react';
import { settingsService } from '@/services/settings.service';
import { Button } from '@/shared/components/ui/button';
import { PageContainer, PageHeader } from '@/design-system/patterns';

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

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const updated = settingsService.updateTenant(activeTenant.id, { name, phone, whatsapp, address, cnpj, warrantyTerms });
    setActiveTenant(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const fieldClass = 'h-11 w-full rounded-[14px] border border-black/[0.08] bg-white/75 px-3.5 text-sm text-[#171614] outline-none transition focus:border-[#f26522]/50 focus:ring-4 focus:ring-[#f26522]/10';

  return (
    <PageContainer size="lg">
      <PageHeader title="Seu workspace, do seu jeito." description="Defina os dados comerciais que acompanham propostas, contratos e comunicações da sua empresa." />

      {tenants.length > 1 && (
        <section className="mb-5 rounded-[26px] bg-[#171614] p-5 text-white sm:p-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#f6a576]">Workspaces disponíveis</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/42">Alterne entre empresas sem misturar o contexto comercial de cada operação.</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {tenants.map((tenant) => {
              const isCurrent = tenant.id === activeTenant.id;
              return (
                <button key={tenant.id} type="button" onClick={() => handleSwitchTenant(tenant.id)} className={isCurrent ? 'flex items-center justify-between rounded-[18px] bg-white p-4 text-left text-[#171614]' : 'flex items-center justify-between rounded-[18px] bg-white/[0.06] p-4 text-left text-white transition hover:bg-white/[0.1]'}>
                  <div className="min-w-0">
                    <strong className="block truncate text-sm font-semibold">{tenant.name}</strong>
                    <span className={isCurrent ? 'mt-1 block text-[10px] text-black/38' : 'mt-1 block text-[10px] text-white/30'}>{tenant.cnpj || 'Documento não informado'}</span>
                  </div>
                  {isCurrent ? <span className="flex size-7 items-center justify-center rounded-full bg-[#f26522] text-white"><Check className="size-3.5" /></span> : <ArrowUpRight className="size-4 text-white/25" />}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <form onSubmit={handleSave} className="rounded-[28px] border border-black/[0.06] bg-white/68 p-5 shadow-[0_24px_65px_rgba(35,29,22,.05)] sm:p-7">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ece7df] text-[#f26522]"><Building2 className="size-4" /></span>
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.035em] text-[#171614]">Identidade comercial</h2>
            <p className="mt-1 text-xs leading-6 text-black/40">Informações usadas como referência nos documentos e contatos gerados pelo Áurea.</p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="space-y-2"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/38">Nome da empresa ou marca</span><input type="text" value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} /></label>
          <label className="space-y-2"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/38">CNPJ / documento</span><input type="text" value={cnpj} onChange={(event) => setCnpj(event.target.value)} className={fieldClass} /></label>
          <label className="space-y-2"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/38">Telefone</span><input type="text" value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClass} /></label>
          <label className="space-y-2"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/38">WhatsApp comercial</span><input type="text" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} className={fieldClass} /></label>
        </div>

        <label className="mt-5 block space-y-2"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/38">Endereço comercial</span><input type="text" value={address} onChange={(event) => setAddress(event.target.value)} className={fieldClass} /></label>

        <label className="mt-5 block space-y-2"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/38">Condições padrão de garantia e suporte</span><textarea rows={4} value={warrantyTerms} onChange={(event) => setWarrantyTerms(event.target.value)} className="w-full resize-y rounded-[16px] border border-black/[0.08] bg-white/75 p-3.5 text-sm leading-6 text-[#171614] outline-none transition focus:border-[#f26522]/50 focus:ring-4 focus:ring-[#f26522]/10" /></label>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className={savedSuccess ? 'inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700' : 'text-xs text-black/35'}>
            {savedSuccess ? <><Check className="size-3.5" />Alterações salvas</> : 'Esses dados ajudam a manter propostas e contratos consistentes.'}
          </span>
          <Button type="submit" className="rounded-full bg-[#171614] px-5 text-xs font-semibold text-white shadow-none hover:bg-[#f26522]"><Save className="mr-1.5 size-3.5" />Salvar configurações</Button>
        </div>
      </form>
    </PageContainer>
  );
}
