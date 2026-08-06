import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator as CalcIcon,
  Wrench,
  Smartphone,
  DollarSign,
  Percent,
  Plus,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { PageContainer, PageHeader } from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { inventoryService } from '@/services/inventory.service';
import { ROUTES } from '@/core/config/app.config';
import { formatCurrency } from '@/shared/utils/utils';
import type { InventoryItem } from '@/types/domain';

const SERVICE_TYPES = [
  { name: 'Troca de Tela / Display OLED Premium', defaultLabor: 150 },
  { name: 'Troca de Bateria Homologada', defaultLabor: 100 },
  { name: 'Substituição de Conector de Carga USB-C', defaultLabor: 100 },
  { name: 'Reparo de Placa / Desoxidação Molhado', defaultLabor: 250 },
  { name: 'Troca de Vidro Traseiro a Laser', defaultLabor: 180 },
  { name: 'Troca de Câmera / Lente', defaultLabor: 120 },
];

export default function CalculatorPage() {
  const navigate = useNavigate();
  const [inventory] = useState<InventoryItem[]>(() => inventoryService.list());

  const [deviceBrand, setDeviceBrand] = useState('Apple');
  const [deviceModel, setDeviceModel] = useState('iPhone 13');
  const [serviceName, setServiceName] = useState(SERVICE_TYPES[0].name);

  const [partCost, setPartCost] = useState<number>(280);
  const [partMarginPct, setPartMarginPct] = useState<number>(50); // 50% margem na peça
  const [laborPrice, setLaborPrice] = useState<number>(150);
  const [cardFeePct, setCardFeePct] = useState<number>(3.5); // 3.5% taxa maquininha

  // Preencher peças automaticamente se selecionar do estoque
  const handleSelectInventoryPart = (partId: string) => {
    const item = inventory.find((i) => i.id === partId);
    if (item) {
      setPartCost(item.costPrice);
      const margin = item.salePrice > item.costPrice ? ((item.salePrice - item.costPrice) / item.costPrice) * 100 : 50;
      setPartMarginPct(Math.round(margin));
    }
  };

  const partSaleValue = Math.round(partCost + (partCost * (partMarginPct || 0)) / 100);
  const subtotalBeforeFees = partSaleValue + (Number(laborPrice) || 0);

  // Valor final com taxa de maquininha embutida
  const cardFeeAmount = Math.round((subtotalBeforeFees * (cardFeePct || 0)) / 100);
  const finalBudget = subtotalBeforeFees + cardFeeAmount;

  // Lucro líquido esperado
  const netProfit = finalBudget - partCost - cardFeeAmount;

  const handleCreateOS = () => {
    navigate(`${ROUTES.app.ordersNew}?brand=${deviceBrand}&model=${deviceModel}&labor=${laborPrice}`);
  };

  return (
    <PageContainer className="max-w-4xl space-y-6">
      <PageHeader
        title="Calculadora de Orçamento de Conserto"
        description="Simulador para cálculo de preço final ao cliente, margem sobre peças e taxas de cartão."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Cálculo */}
        <div className="lg:col-span-2 space-y-5 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <CalcIcon className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base text-foreground">Parâmetros do Manutenção</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs mb-1 block">Marca do Aparelho</Label>
              <Input
                value={deviceBrand}
                onChange={(e) => setDeviceBrand(e.target.value)}
                placeholder="Ex: Apple, Samsung"
              />
            </div>

            <div>
              <Label className="text-xs mb-1 block">Modelo do Celular</Label>
              <Input
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                placeholder="Ex: iPhone 13 Pro"
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="text-xs mb-1 block">Tipo de Serviço Técnico</Label>
              <select
                value={serviceName}
                onChange={(e) => {
                  setServiceName(e.target.value);
                  const found = SERVICE_TYPES.find((s) => s.name === e.target.value);
                  if (found) setLaborPrice(found.defaultLabor);
                }}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
              >
                {SERVICE_TYPES.map((st) => (
                  <option key={st.name} value={st.name}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <Label className="text-xs mb-1 block text-muted-foreground">
                Puxar Custo de Peça do Estoque (Opcional)
              </Label>
              <select
                onChange={(e) => handleSelectInventoryPart(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
              >
                <option value="">-- Selecionar Peça Cadastrada --</option>
                {inventory.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} (Custo: R$ {i.costPrice.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs mb-1 block">Custo da Peça (R$)</Label>
              <Input
                type="number"
                value={partCost}
                onChange={(e) => setPartCost(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label className="text-xs mb-1 block">Margem Desejada na Peça (%)</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={partMarginPct}
                  onChange={(e) => setPartMarginPct(Number(e.target.value))}
                  placeholder="50"
                />
                <Percent className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1 block">Mão de Obra Técnica (R$)</Label>
              <Input
                type="number"
                value={laborPrice}
                onChange={(e) => setLaborPrice(Number(e.target.value))}
                placeholder="150.00"
              />
            </div>

            <div>
              <Label className="text-xs mb-1 block">Taxa Maquininha / Imposto (%)</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={cardFeePct}
                  onChange={(e) => setCardFeePct(Number(e.target.value))}
                  placeholder="3.5"
                />
                <Percent className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Resumo do Orçamento Calculado */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-foreground">Resultado do Orçamento</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Custo Bruto Peça:</span>
                <span className="font-semibold">{formatCurrency(partCost)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Venda Peça (com +{partMarginPct}%):</span>
                <span className="font-semibold">{formatCurrency(partSaleValue)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Mão de Obra:</span>
                <span className="font-semibold">{formatCurrency(laborPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxas/Maquininha ({cardFeePct}%):</span>
                <span className="font-semibold">{formatCurrency(cardFeeAmount)}</span>
              </div>

              <div className="pt-3 border-t border-border space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase block">
                  ORÇAMENTO RECOMENDADO
                </span>
                <p className="text-2xl font-extrabold text-emerald-600">
                  {formatCurrency(finalBudget)}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 font-medium">
                Lucro Líquido Estimado:{' '}
                <strong className="text-emerald-700">{formatCurrency(netProfit)}</strong>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateOS}
            variant="brand"
            className="w-full h-11 font-bold shadow-lg gap-2 text-xs"
          >
            <Plus className="w-4 h-4" />
            Gerar OS com este Orçamento
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
