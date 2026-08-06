import type { WarrantyRecord } from '@/types/domain';
import { ordersService } from './orders.service';

class WarrantiesService {
  list(): WarrantyRecord[] {
    const orders = ordersService.list();
    const records: WarrantyRecord[] = [];

    orders.forEach((os) => {
      if (os.status === 'delivered' || os.status === 'ready' || os.finishedAt) {
        const startDate = os.finishedAt || os.createdAt;
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + (os.warrantyDays || 90));

        const now = new Date();
        const isExpired = now > end;

        const partsNames = (os.partsUsed || []).map((p) => p.name);
        if (partsNames.length === 0) partsNames.push('Serviço de Mão de Obra e Ajuste');

        records.push({
          id: `war-${os.id}`,
          osId: os.id,
          clientName: os.clientName,
          clientPhone: os.clientPhone || '(11) 98765-4321',
          deviceModel: `${os.deviceBrand} ${os.deviceModel}`,
          partsReplaced: partsNames,
          warrantyDays: os.warrantyDays || 90,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          status: isExpired ? 'expired' : 'active',
        });
      }
    });

    return records;
  }
}

export const warrantiesService = new WarrantiesService();
