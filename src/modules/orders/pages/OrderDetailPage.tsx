import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Smartphone,
  CheckCircle2,
  Clock,
  Printer,
  MessageCircle,
  ArrowLeft,
  Edit,
  ShieldCheck,
  User,
  AlertCircle,
  FileCheck,
  Calendar,
} from 'lucide-react';
import { PageContainer } from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ordersService, OS_STATUS_LABELS } from '@/services/orders.service';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
import { formatCurrency, formatRelativeDate } from '@/shared/utils/utils';
import type { OSStatus } from '@/types/domain';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [printMode, setPrintMode] = useState<boolean>(false);

  const order = useMemo(() => {
    if (!id) return undefined;
    return ordersService.getById(id);
  }, [id]);

  if (!order) {
    return (
      <PageContainer className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h2 className="text-xl font-bold text-foreground">Ordem de Serviço não encontrada</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          A OS requisitada não existe ou foi removida.
        </p>
        <Button asChild variant="brand">
          <Link to={ROUTES.app.orders}>Voltar para Ordens de Serviço</Link>
        </Button>
      </PageContainer>
    );
  }

  const statusInfo = OS_STATUS_LABELS[order.status];
  const whatsappLink = ordersService.generateWhatsAppLink(order);

  const handleStatusChange = (newStatus: OSStatus) => {
    ordersService.update(order.id, { status: newStatus });
    window.location.reload();
  };

  return (
    <PageContainer className="max-w-4xl space-y-6">
      {/* Header com Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link to={ROUTES.app.orders}>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{order.id}</h1>
            <Badge className={`text-xs px-2.5 py-0.5 ${statusInfo.color}`}>{statusInfo.label}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-10">
            Cadastrado em {new Date(order.createdAt).toLocaleDateString('pt-BR')} às{' '}
            {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {order.clientPhone && (
            <Button asChild variant="outline" className="text-emerald-700 border-emerald-300 hover:bg-emerald-50 gap-1.5 text-xs">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                WhatsApp Cliente
              </a>
            </Button>
          )}

          <Button variant="outline" className="gap-1.5 text-xs" onClick={() => window.print()}>
            <Printer className="w-4 h-4 text-muted-foreground" />
            Imprimir Recibo
          </Button>

          <Button asChild variant="brand" className="gap-1.5 text-xs">
            <Link to={`/app/orders/${order.id}/edit`}>
              <Edit className="w-4 h-4" />
              Editar OS
            </Link>
          </Button>
        </div>
      </div>

      {/* Seção Imprimível / Comprovante */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm print:border-none print:shadow-none">
        {/* Marca da Loja */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">{APP_CONFIG.name}</h2>
            <p className="text-xs text-muted-foreground">{APP_CONFIG.tagline}</p>
            <p className="text-[11px] text-muted-foreground">Suporte: {APP_CONFIG.supportEmail}</p>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block">
              Comprovante de OS
            </span>
            <span className="text-lg font-bold text-primary">{order.id}</span>
          </div>
        </div>

        {/* Informações do Cliente e Aparelho */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              <User className="w-4 h-4 text-primary" /> Cliente
            </div>
            <p className="text-sm font-semibold text-foreground">{order.clientName}</p>
            <p className="text-xs text-muted-foreground">Telefone: {order.clientPhone || 'Não informado'}</p>
          </div>

          <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              <Smartphone className="w-4 h-4 text-primary" /> Dispositivo
            </div>
            <p className="text-sm font-semibold text-foreground">
              {order.deviceBrand} {order.deviceModel} {order.deviceColor ? `(${order.deviceColor})` : ''}
            </p>
            {order.serialNumber && <p className="text-xs text-muted-foreground font-mono">IMEI/SN: {order.serialNumber}</p>}
            {order.accessoriesLeft && (
              <p className="text-xs text-muted-foreground">Acessórios: {order.accessoriesLeft}</p>
            )}
          </div>
        </div>

        {/* Defeito e Laudo Técnico */}
        <div className="space-y-4">
          <div className="border-l-4 border-amber-500 pl-3 py-1 bg-amber-50/50 rounded-r-md">
            <p className="text-xs font-bold text-amber-900 uppercase">Defeito Relatado pelo Cliente</p>
            <p className="text-sm text-amber-950 mt-0.5">{order.reportedIssue}</p>
          </div>

          {order.technicalReport && (
            <div className="border-l-4 border-indigo-500 pl-3 py-1 bg-indigo-50/50 rounded-r-md">
              <p className="text-xs font-bold text-indigo-900 uppercase">Laudo Técnico / Diagnóstico</p>
              <p className="text-sm text-indigo-950 mt-0.5">{order.technicalReport}</p>
            </div>
          )}
        </div>

        {/* Peças e Valores */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Detalhamento Financeiro</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-border font-semibold text-slate-700">
                <tr>
                  <th className="p-2.5">Item / Serviço</th>
                  <th className="p-2.5 text-center">Qtd</th>
                  <th className="p-2.5 text-right">Valor Unitário</th>
                  <th className="p-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(order.partsUsed || []).map((part) => (
                  <tr key={part.id}>
                    <td className="p-2.5 font-medium">{part.name}</td>
                    <td className="p-2.5 text-center">{part.quantity}</td>
                    <td className="p-2.5 text-right">{formatCurrency(part.unitPrice)}</td>
                    <td className="p-2.5 text-right font-semibold">{formatCurrency(part.unitPrice * part.quantity)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="p-2.5 font-medium text-slate-700">Mão de Obra Técnica</td>
                  <td className="p-2.5 text-right font-semibold">{formatCurrency(order.laborPrice)}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-border">
                <tr>
                  <td colSpan={3} className="p-3 text-right text-sm">VALOR TOTAL DA OS:</td>
                  <td className="p-3 text-right text-base text-primary">{formatCurrency(order.totalValue)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Termos de Garantia e Assinatura */}
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Garantia de {order.warrantyDays} dias:</strong> Esta garantia cobre exclusivamente as peças
              substituídas e os serviços efetuados especificados nesta ordem. Não cobre danos provocados por quedas,
              líquidos ou violação por terceiros.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
            <div className="border-t border-slate-400 pt-1">Assinatura do Técnico Responsável</div>
            <div className="border-t border-slate-400 pt-1">Assinatura do Cliente</div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
