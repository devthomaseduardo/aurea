import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Wrench,
  Smartphone,
  CheckSquare,
  DollarSign,
  User,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { PageContainer, PageHeader } from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { ordersService } from '@/services/orders.service';
import { inventoryService } from '@/services/inventory.service';
import { clientsService } from '@/services/clients.service';
import { ROUTES } from '@/core/config/app.config';
import type {
  DeviceType,
  OSStatus,
  PhysicalChecklist,
  OSPartItem,
  InventoryItem,
} from '@/types/domain';

const DEVICE_BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'LG', 'ASUS', 'Realme', 'Outra'];

export default function OrderFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [clients] = useState(() => clientsService.getAll());
  const [inventory] = useState<InventoryItem[]>(() => inventoryService.list());

  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [deviceType, setDeviceType] = useState<DeviceType>('phone');
  const [deviceBrand, setDeviceBrand] = useState('Apple');
  const [deviceModel, setDeviceModel] = useState('');
  const [deviceColor, setDeviceColor] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [passcode, setPasscode] = useState('');
  const [accessoriesLeft, setAccessoriesLeft] = useState('');
  const [reportedIssue, setReportedIssue] = useState('');
  const [technicalReport, setTechnicalReport] = useState('');
  const [status, setStatus] = useState<OSStatus>('received');
  const [laborPrice, setLaborPrice] = useState<number>(100);
  const [warrantyDays, setWarrantyDays] = useState<number>(90);
  const [notes, setNotes] = useState('');

  const [checklist, setChecklist] = useState<PhysicalChecklist>({
    screenOk: true,
    touchOk: true,
    cameraOk: true,
    buttonsOk: true,
    chargingOk: true,
    wifiOk: true,
    audioOk: true,
    biometricsOk: true,
    housingOk: true,
    waterDamage: false,
  });

  const [partsUsed, setPartsUsed] = useState<OSPartItem[]>([]);

  useEffect(() => {
    if (isEditing && id) {
      const existing = ordersService.getById(id);
      if (existing) {
        setClientId(existing.clientId);
        setClientName(existing.clientName);
        setClientPhone(existing.clientPhone || '');
        setDeviceType(existing.deviceType);
        setDeviceBrand(existing.deviceBrand);
        setDeviceModel(existing.deviceModel);
        setDeviceColor(existing.deviceColor || '');
        setSerialNumber(existing.serialNumber || '');
        setPasscode(existing.passcode || '');
        setAccessoriesLeft(existing.accessoriesLeft || '');
        setReportedIssue(existing.reportedIssue);
        setTechnicalReport(existing.technicalReport || '');
        setStatus(existing.status);
        setLaborPrice(existing.laborPrice);
        setWarrantyDays(existing.warrantyDays || 90);
        setNotes(existing.notes || '');
        if (existing.checklist) setChecklist(existing.checklist);
        if (existing.partsUsed) setPartsUsed(existing.partsUsed);
      }
    } else if (clients.length > 0) {
      const first = clients[0];
      setClientId(first.id);
      setClientName(first.name);
      setClientPhone(first.phone || '');
    }
  }, [id, isEditing, clients]);

  const handleSelectClient = (cId: string) => {
    setClientId(cId);
    const selected = clients.find((c) => c.id === cId);
    if (selected) {
      setClientName(selected.name);
      setClientPhone(selected.phone || '');
    }
  };

  const handleAddPart = (partId: string) => {
    const item = inventory.find((i) => i.id === partId);
    if (!item) return;

    setPartsUsed((prev) => {
      const exists = prev.find((p) => p.partId === partId);
      if (exists) {
        return prev.map((p) =>
          p.partId === partId ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [
        ...prev,
        {
          id: `p-${Date.now()}`,
          partId: item.id,
          name: item.name,
          quantity: 1,
          unitPrice: item.salePrice,
        },
      ];
    });
  };

  const handleRemovePart = (partId: string) => {
    setPartsUsed((prev) => prev.filter((p) => p.partId !== partId));
  };

  const partsTotal = partsUsed.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0);
  const grandTotal = partsTotal + Number(laborPrice || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      alert('Selecione ou informe o nome do cliente.');
      return;
    }
    if (!deviceModel.trim()) {
      alert('Informe o modelo do aparelho (Ex: iPhone 13, Galaxy S21).');
      return;
    }
    if (!reportedIssue.trim()) {
      alert('Descreva o defeito relatado pelo cliente.');
      return;
    }

    const payload = {
      clientId: clientId || 'cli-custom',
      clientName,
      clientPhone,
      deviceType,
      deviceBrand,
      deviceModel,
      deviceColor,
      serialNumber,
      passcode,
      accessoriesLeft,
      reportedIssue,
      technicalReport,
      checklist,
      partsUsed,
      status,
      laborPrice: Number(laborPrice || 0),
      partsPrice: partsTotal,
      totalValue: grandTotal,
      paymentStatus: 'pending' as const,
      warrantyDays: Number(warrantyDays || 90),
      notes,
    };

    if (isEditing && id) {
      ordersService.update(id, payload);
    } else {
      ordersService.create(payload);
    }

    navigate(ROUTES.app.orders);
  };

  return (
    <PageContainer className="max-w-5xl space-y-6">
      <PageHeader
        title={isEditing ? `Editar Ordem de Serviço ${id}` : 'Nova Ordem de Serviço'}
        description="Abertura de OS com cadastro do aparelho, vistoria física e laudo técnico."
        actions={
          <Button asChild variant="outline">
            <Link to={ROUTES.app.orders}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Voltar para Ordens
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bloco 1: Dados do Cliente */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">1. Dados do Cliente</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs mb-1 block">Selecionar Cliente Cadastrado</Label>
              <select
                value={clientId}
                onChange={(e) => handleSelectClient(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="">-- Novo / Cliente Avulso --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs mb-1 block">Nome Completo do Cliente *</Label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Carlos Silva"
                required
              />
            </div>

            <div>
              <Label className="text-xs mb-1 block">Telefone / WhatsApp</Label>
              <Input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="(11) 98765-4321"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Identificação do Dispositivo */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Smartphone className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">2. Dados do Aparelho</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs mb-1 block">Tipo de Aparelho</Label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="phone">Smartphone / Celular</option>
                <option value="tablet">Tablet / iPad</option>
                <option value="smartwatch">Smartwatch / Apple Watch</option>
                <option value="computer">Notebook / Computador</option>
                <option value="other">Outro Eletrônico</option>
              </select>
            </div>

            <div>
              <Label className="text-xs mb-1 block">Marca</Label>
              <select
                value={deviceBrand}
                onChange={(e) => setDeviceBrand(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                {DEVICE_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs mb-1 block">Modelo Exato *</Label>
              <Input
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                placeholder="Ex: iPhone 13 Pro 128GB"
                required
              />
            </div>

            <div>
              <Label className="text-xs mb-1 block">Cor do Aparelho</Label>
              <Input
                value={deviceColor}
                onChange={(e) => setDeviceColor(e.target.value)}
                placeholder="Ex: Azul Sierra, Preto"
              />
            </div>

            <div>
              <Label className="text-xs mb-1 block">IMEI ou Número de Série</Label>
              <Input
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Ex: 358921098412345"
              />
            </div>

            <div>
              <Label className="text-xs mb-1 block">Senha / Padrão (para testes)</Label>
              <Input
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Ex: 123456 ou Desenho Z"
              />
            </div>

            <div className="md:col-span-2">
              <Label className="text-xs mb-1 block">Acessórios Deixados com o Aparelho</Label>
              <Input
                value={accessoriesLeft}
                onChange={(e) => setAccessoriesLeft(e.target.value)}
                placeholder="Ex: Capinha transparente, carregador original, chip da operadora"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Checklist Físico de Entrada */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <CheckSquare className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">3. Vistoria / Checklist Físico</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { key: 'screenOk', label: 'Tela / Display' },
              { key: 'touchOk', label: 'Touchscreen' },
              { key: 'cameraOk', label: 'Câmeras' },
              { key: 'buttonsOk', label: 'Botões Físicos' },
              { key: 'chargingOk', label: 'Conector Carga' },
              { key: 'wifiOk', label: 'Wi-Fi / Sinal' },
              { key: 'audioOk', label: 'Som / Microfone' },
              { key: 'biometricsOk', label: 'FaceID / Biometria' },
              { key: 'housingOk', label: 'Carcaça / Tampa' },
              { key: 'waterDamage', label: 'Marcas de Água/Oxidação', isNegative: true },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors text-xs font-medium"
              >
                <input
                  type="checkbox"
                  checked={Boolean(checklist[item.key as keyof PhysicalChecklist])}
                  onChange={(e) =>
                    setChecklist((prev) => ({
                      ...prev,
                      [item.key]: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
                <span className={item.isNegative && checklist.waterDamage ? 'text-red-600 font-bold' : ''}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Bloco 4: Defeito e Laudo Técnico */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Wrench className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">4. Diagnóstico Técnico & Status</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs mb-1 block">Defeito Relatado pelo Cliente *</Label>
              <Textarea
                rows={3}
                value={reportedIssue}
                onChange={(e) => setReportedIssue(e.target.value)}
                placeholder="Ex: Aparelho caiu no chão, tela trincou e parou de dar imagem..."
                required
              />
            </div>

            <div>
              <Label className="text-xs mb-1 block">Laudo Técnico / Solução Proposta</Label>
              <Textarea
                rows={3}
                value={technicalReport}
                onChange={(e) => setTechnicalReport(e.target.value)}
                placeholder="Ex: Diagnóstico efetuado. Necessária substituição da tela frontal e desoxidação dos conectores..."
              />
            </div>

            <div>
              <Label className="text-xs mb-1 block">Status Inicial da OS</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OSStatus)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="received">1. Recebido (Balcão)</option>
                <option value="analyzing">2. Em Análise (Triagem Técnica)</option>
                <option value="budget_pending">3. Aguardando Aprovação de Orçamento</option>
                <option value="repairing">4. Em Reparo (Bancada)</option>
                <option value="ready">5. Pronto para Retirada</option>
                <option value="delivered">6. Entregue / Concluído</option>
                <option value="cancelled">7. Cancelado</option>
              </select>
            </div>

            <div>
              <Label className="text-xs mb-1 block">Prazo de Garantia (Dias)</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={warrantyDays}
                  onChange={(e) => setWarrantyDays(Number(e.target.value))}
                  placeholder="90"
                />
                <ShieldCheck className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 5: Peças e Orçamento */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">5. Peças & Valores</h3>
            </div>

            <div className="flex items-center gap-2">
              <select
                className="h-8 text-xs border rounded-md px-2 bg-background"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddPart(e.target.value);
                    e.target.value = '';
                  }
                }}
              >
                <option value="">+ Adicionar Peça do Estoque</option>
                {inventory.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} (R$ {inv.salePrice.toFixed(2)}) - Est: {inv.quantity}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {partsUsed.length === 0 ? (
            <p className="text-xs text-muted-foreground italic py-2">
              Nenhuma peça selecionada do estoque para esta OS.
            </p>
          ) : (
            <div className="space-y-2">
              {partsUsed.map((part) => (
                <div
                  key={part.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-slate-50 text-xs"
                >
                  <span className="font-medium text-foreground">{part.name}</span>
                  <div className="flex items-center gap-4">
                    <span>Qtd: {part.quantity}</span>
                    <span className="font-semibold text-foreground">
                      R$ {(part.unitPrice * part.quantity).toFixed(2)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-700"
                      onClick={() => handleRemovePart(part.partId || part.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border">
            <div>
              <Label className="text-xs mb-1 block text-muted-foreground">Valor Peças (R$)</Label>
              <Input value={partsTotal.toFixed(2)} readOnly className="bg-slate-100 font-semibold" />
            </div>

            <div>
              <Label className="text-xs mb-1 block">Valor Mão de Obra (R$)</Label>
              <Input
                type="number"
                value={laborPrice}
                onChange={(e) => setLaborPrice(Number(e.target.value))}
                placeholder="100.00"
              />
            </div>

            <div>
              <Label className="text-xs mb-1 block text-emerald-700 font-bold">Valor Total (R$)</Label>
              <Input
                value={grandTotal.toFixed(2)}
                readOnly
                className="bg-emerald-50 text-emerald-700 font-bold text-base border-emerald-200"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button asChild variant="outline">
            <Link to={ROUTES.app.orders}>Cancelar</Link>
          </Button>
          <Button type="submit" variant="brand" className="gap-1.5">
            <Save className="w-4 h-4" />
            {isEditing ? 'Salvar Alterações da OS' : 'Gerar Ordem de Serviço'}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
