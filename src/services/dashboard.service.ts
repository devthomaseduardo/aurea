import { clientsService } from './clients.service';
import { ordersService } from './orders.service';
import { salesService } from './sales.service';
import { inventoryService } from './inventory.service';
import type { DashboardMetrics } from '@/types/domain';

function computeMetrics(): DashboardMetrics {
  const clients = clientsService.getAll();
  const orders = ordersService.list();
  const sales = salesService.list();
  const lowStockItems = inventoryService.getLowStockItems();

  const repairRevenue = orders
    .filter((o) => o.status === 'delivered' || o.paymentStatus === 'paid')
    .reduce((acc, o) => acc + o.totalValue, 0);

  const salesRevenue = sales.reduce((acc, s) => acc + s.totalValue, 0);
  const totalRevenue = repairRevenue + salesRevenue;

  const activeOS = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const completedOS = orders.filter((o) => o.status === 'delivered').length;
  const readyOS = orders.filter((o) => o.status === 'ready').length;
  const pendingBudgets = orders.filter((o) => o.status === 'budget_pending').length;

  const totalTransactions = completedOS + sales.length;
  const averageTicket = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

  return {
    revenue: totalRevenue,
    repairRevenue,
    salesRevenue,
    clients: clients.filter((c) => c.status !== 'inactive').length,
    activeOS,
    completedOS,
    readyOS,
    pendingBudgets,
    lowStockItemsCount: lowStockItems.length,
    averageTicket,
    hours: 42,
    projects: activeOS,
    profit: Math.round(totalRevenue * 0.65),
    acceptanceRate: 92,
  };
}

export const dashboardService = {
  getMetrics(): DashboardMetrics {
    return computeMetrics();
  },

  async getMetricsAsync(): Promise<DashboardMetrics> {
    return computeMetrics();
  },

  getRevenueSeries() {
    const months = ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
    const baseRepair = [4200, 6800, 5900, 8400, 7800, 10500];
    const baseSales = [1800, 3200, 2900, 4500, 3900, 5600];

    return months.map((month, i) => ({
      month,
      repair: baseRepair[i],
      sales: baseSales[i],
      revenue: baseRepair[i] + baseSales[i],
      profit: Math.round((baseRepair[i] + baseSales[i]) * 0.65),
    }));
  },

  getOSStatusBreakdown() {
    const orders = ordersService.list();
    const statuses = [
      'received',
      'analyzing',
      'budget_pending',
      'repairing',
      'testing',
      'ready',
      'delivered',
      'cancelled',
    ] as const;

    return statuses.map((status) => ({
      status,
      count: orders.filter((o) => o.status === status).length,
    }));
  },
};
