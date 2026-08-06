import { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Tag,
  Boxes,
  TrendingUp,
  Edit2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import {
  PageContainer,
  PageHeader,
  MetricCard,
  MetricGrid,
} from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { inventoryService } from '@/services/inventory.service';
import { formatCurrency } from '@/shared/utils/utils';
import type { InventoryItem, ItemCategory } from '@/types/domain';

const CATEGORY_LABELS: Record<ItemCategory, { label: string; color: string }> = {
  parts: { label: 'Peça de Reposição', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  accessories: { label: 'Acessório', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  devices: { label: 'Aparelho Novo/Seminovo', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  services: { label: 'Serviço Técnico', color: 'bg-blue-100 text-blue-800 border-blue-200' },
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(() => inventoryService.list());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('parts');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [quantity, setQuantity] = useState<number>(5);
  const [minQuantity, setMinQuantity] = useState<number>(2);
  const [costPrice, setCostPrice] = useState<number>(50);
  const [salePrice, setSalePrice] = useState<number>(120);
  const [location, setLocation] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.sku && item.sku.toLowerCase().includes(q)) ||
        (item.brand && item.brand.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [items, selectedCategory, searchTerm]);

  const lowStockCount = useMemo(() => {
    return items.filter((i) => i.quantity <= i.minQuantity).length;
  }, [items]);

  const totalInventoryValue = useMemo(() => {
    return items.reduce((acc, i) => acc + i.salePrice * i.quantity, 0);
  }, [items]);

  const handleOpenModal = (item?: InventoryItem) => {
    if (item) {
      setEditingId(item.id);
      setName(item.name);
      setCategory(item.category);
      setSku(item.sku || '');
      setBrand(item.brand || '');
      setQuantity(item.quantity);
      setMinQuantity(item.minQuantity);
      setCostPrice(item.costPrice);
      setSalePrice(item.salePrice);
      setLocation(item.location || '');
    } else {
      setEditingId(null);
      setName('');
      setCategory('parts');
      setSku('');
      setBrand('');
      setQuantity(5);
      setMinQuantity(2);
      setCostPrice(50);
      setSalePrice(120);
      setLocation('');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      category,
      sku,
      brand,
      quantity: Number(quantity),
      minQuantity: Number(minQuantity),
      costPrice: Number(costPrice),
      salePrice: Number(salePrice),
      location,
    };

    if (editingId) {
      inventoryService.update(editingId, payload);
    } else {
      inventoryService.create(payload);
    }

    setItems(inventoryService.list());
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item do estoque?')) {
      inventoryService.delete(id);
      setItems(inventoryService.list());
    }
  };

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title="Estoque de Peças e Aparelhos"
        description="Controle de reposição de telas, baterias, acessórios e aparelhos novos/seminovos."
        actions={
          <Button variant="brand" onClick={() => handleOpenModal()} className="gap-1.5">
            <Plus className="w-4 h-4" />
            Cadastrar Produto / Peça
          </Button>
        }
      />

      <MetricGrid columns={3}>
        <MetricCard
          label="Itens Cadastrados"
          value={String(items.length)}
          icon={Boxes}
          hint="total no catálogo"
        />
        <MetricCard
          label="Alertas de Estoque Baixo"
          value={String(lowStockCount)}
          icon={AlertTriangle}
          hint="necessitam reposição"
        />
        <MetricCard
          label="Valor Total do Estoque"
          value={formatCurrency(totalInventoryValue)}
          icon={TrendingUp}
          hint="preço final de venda"
        />
      </MetricGrid>

      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        {/* Barra de Filtros */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome da peça, modelo, SKU ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {(
              [
                { key: 'all', label: 'Todas as Categorias' },
                { key: 'parts', label: 'Peças' },
                { key: 'accessories', label: 'Acessórios' },
                { key: 'devices', label: 'Aparelhos' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  selectedCategory === cat.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Estoque */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-border text-xs uppercase font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-3">Produto / SKU</th>
                <th className="px-4 py-3">Categoria / Marca</th>
                <th className="px-4 py-3 text-center">Quantidade</th>
                <th className="px-4 py-3 text-right">Custo</th>
                <th className="px-4 py-3 text-right">Preço Venda</th>
                <th className="px-4 py-3 text-right">Margem</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="font-medium text-base text-foreground">Nenhum item encontrado no estoque</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.quantity <= item.minQuantity;
                  const margin = item.salePrice - item.costPrice;
                  const marginPct = item.costPrice > 0 ? Math.round((margin / item.costPrice) * 100) : 0;
                  const catInfo = CATEGORY_LABELS[item.category];

                  return (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3.5 align-top">
                        <p className="font-bold text-foreground">{item.name}</p>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          SKU: {item.sku || 'N/A'} {item.location ? `· Prateleira: ${item.location}` : ''}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <Badge variant="outline" className={`text-[11px] ${catInfo.color}`}>
                          {catInfo.label}
                        </Badge>
                        {item.brand && (
                          <span className="text-xs text-muted-foreground block mt-1">Marca: {item.brand}</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 align-top text-center">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-sm px-2.5 py-0.5 rounded-full ${
                            isLow
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isLow && <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
                          {item.quantity} un
                        </span>
                        {isLow && <span className="text-[10px] text-red-600 block mt-0.5 font-medium">Reposição necessária!</span>}
                      </td>

                      <td className="px-4 py-3.5 align-top text-right text-muted-foreground">
                        {formatCurrency(item.costPrice)}
                      </td>

                      <td className="px-4 py-3.5 align-top text-right font-bold text-foreground">
                        {formatCurrency(item.salePrice)}
                      </td>

                      <td className="px-4 py-3.5 align-top text-right text-emerald-600 font-semibold">
                        +{marginPct}%
                      </td>

                      <td className="px-4 py-3.5 align-top text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenModal(item)}
                            title="Editar Item"
                          >
                            <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(item.id)}
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Adição/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-foreground">
              {editingId ? 'Editar Item do Estoque' : 'Cadastrar Novo Item no Estoque'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label className="text-xs mb-1 block">Nome do Produto / Peça *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Tela Frontal iPhone 13 OLED Premium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">Categoria</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="parts">Peça de Reposição</option>
                    <option value="accessories">Acessório</option>
                    <option value="devices">Aparelho Novo/Seminovo</option>
                    <option value="services">Serviço Técnico</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs mb-1 block">Marca</Label>
                  <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex: Apple" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">SKU / Código</Label>
                  <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Ex: TL-IP13-PRM" />
                </div>

                <div>
                  <Label className="text-xs mb-1 block">Localização / Prateleira</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Gaveta A1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">Quantidade Atual</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs mb-1 block">Quantidade Mínima (Alerta)</Label>
                  <Input
                    type="number"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">Preço de Custo (R$)</Label>
                  <Input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs mb-1 block font-bold text-emerald-700">Preço de Venda (R$)</Label>
                  <Input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="brand">
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
