import { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Printer,
  CreditCard,
  QrCode,
  Banknote,
  Percent,
} from 'lucide-react';
import { PageContainer, PageHeader } from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { inventoryService } from '@/services/inventory.service';
import { salesService, PAYMENT_METHOD_LABELS } from '@/services/sales.service';
import { clientsService } from '@/services/clients.service';
import { formatCurrency } from '@/shared/utils/utils';
import type { InventoryItem, SaleItem, PaymentMethod, Sale } from '@/types/domain';

export default function POSPage() {
  const [inventory] = useState<InventoryItem[]>(() => inventoryService.list());
  const [clients] = useState(() => clientsService.getAll());

  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [selectedClientName, setSelectedClientName] = useState('Cliente Balcão');

  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return inventory.filter(
      (item) =>
        item.quantity > 0 &&
        (!q ||
          item.name.toLowerCase().includes(q) ||
          (item.sku && item.sku.toLowerCase().includes(q)) ||
          (item.brand && item.brand.toLowerCase().includes(q)))
    );
  }, [inventory, searchTerm]);

  const addToCart = (product: InventoryItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.itemId === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          alert('Quantidade máxima em estoque atingida!');
          return prev;
        }
        return prev.map((item) =>
          item.itemId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * item.unitPrice,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          itemId: product.id,
          name: product.name,
          quantity: 1,
          unitPrice: product.salePrice,
          totalPrice: product.salePrice,
        },
      ];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.itemId === itemId) {
            const product = inventory.find((i) => i.id === itemId);
            const newQty = item.quantity + delta;
            if (product && newQty > product.quantity) {
              alert('Estoque insuficiente!');
              return item;
            }
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as SaleItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [cart]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - (Number(discount) || 0));
  }, [subtotal, discount]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Selecione pelo menos um produto para vender.');
      return;
    }

    const sale = salesService.registerSale({
      clientName: selectedClientName,
      items: cart,
      discount: Number(discount) || 0,
      paymentMethod,
    });

    setCompletedSale(sale);
    setCart([]);
    setDiscount(0);
  };

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title="Frente de Caixa (PDV)"
        description="Venda rápida no balcão de acessórios, celulares e serviços técnicos."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da Esquerda: Catálogo de Produtos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar pelo nome do acessório, capa, celular ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-card border rounded-xl">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-semibold text-sm">Nenhum produto disponível em estoque</p>
              </div>
            ) : (
              filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => addToCart(prod)}
                  className="bg-card border border-border hover:border-primary/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                      {prod.category === 'parts'
                        ? 'Peça'
                        : prod.category === 'devices'
                        ? 'Aparelho'
                        : 'Acessório'}
                    </span>
                    <p className="font-semibold text-sm text-foreground line-clamp-2 mt-0.5 group-hover:text-primary transition-colors">
                      {prod.name}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground block">Estoque: {prod.quantity}</span>
                      <span className="font-extrabold text-base text-foreground">
                        {formatCurrency(prod.salePrice)}
                      </span>
                    </div>

                    <Button size="icon" variant="brand" className="h-8 w-8 rounded-lg shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coluna da Direita: Carrinho e Checkout */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-foreground">Carrinho de Compras</h3>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">{cart.length} itens</span>
            </div>

            {/* Seleção do Cliente */}
            <div>
              <Label className="text-xs mb-1 block">Cliente do Balcão</Label>
              <select
                value={selectedClientName}
                onChange={(e) => setSelectedClientName(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
              >
                <option value="Cliente Balcão">Cliente Avulso (Balcão)</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Lista de Itens no Carrinho */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <p className="text-xs text-center text-muted-foreground py-8 italic">
                  Selecione produtos ao lado para adicionar ao carrinho.
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-slate-50 text-xs gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground truncate">{item.name}</p>
                      <span className="text-muted-foreground">{formatCurrency(item.unitPrice)} un</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.itemId!, -1)}
                        className="w-6 h-6 rounded border bg-background flex items-center justify-center hover:bg-muted"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold tabular-nums px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.itemId!, 1)}
                        className="w-6 h-6 rounded border bg-background flex items-center justify-center hover:bg-muted"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.itemId!)}
                        className="p-1 text-red-500 hover:text-red-700 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Totais e Método de Pagamento */}
          <div className="space-y-4 border-t border-border pt-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Desconto (R$):</span>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-24 h-7 text-xs text-right font-semibold"
                  placeholder="0.00"
                />
              </div>

              <div className="flex justify-between text-base font-extrabold text-foreground pt-2 border-t border-border">
                <span>TOTAL A PAGAR:</span>
                <span className="text-emerald-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Método de Pagamento */}
            <div>
              <Label className="text-xs mb-1.5 block font-bold">Forma de Pagamento</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'pix', label: 'PIX', icon: QrCode },
                  { key: 'credit_card', label: 'Cartão Crédito', icon: CreditCard },
                  { key: 'debit_card', label: 'Cartão Débito', icon: CreditCard },
                  { key: 'cash', label: 'Dinheiro', icon: Banknote },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const selected = paymentMethod === pm.key;

                  return (
                    <button
                      key={pm.key}
                      type="button"
                      onClick={() => setPaymentMethod(pm.key as PaymentMethod)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold transition-all ${
                        selected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              variant="brand"
              className="w-full h-11 text-sm font-bold shadow-lg gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Finalizar Venda no Balcão
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Comprovante de Venda */}
      {completedSale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="text-center space-y-1">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Venda Concluída com Sucesso!</h3>
              <p className="text-xs text-muted-foreground">Comprovante #{completedSale.id}</p>
            </div>

            <div className="bg-slate-50 border border-border p-4 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Cliente:</span>
                <span className="font-semibold">{completedSale.clientName}</span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Itens:</span>
                {completedSale.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {i.quantity}x {i.name}
                    </span>
                    <span className="font-semibold">{formatCurrency(i.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 space-y-1 font-semibold">
                <div className="flex justify-between text-muted-foreground">
                  <span>Forma de Pagamento:</span>
                  <span>{PAYMENT_METHOD_LABELS[completedSale.paymentMethod]}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-600 font-extrabold pt-1">
                  <span>Total Pago:</span>
                  <span>{formatCurrency(completedSale.totalValue)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 text-xs gap-1.5"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" /> Imprimir Recibo
              </Button>
              <Button variant="brand" className="flex-1 text-xs" onClick={() => setCompletedSale(null)}>
                Nova Venda
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
