import type { DeviceModel } from '@/types/domain';

const DEFAULT_DEVICES: DeviceModel[] = [
  {
    id: 'dev-1',
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    category: 'phone',
    imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=200&auto=format&fit=crop&q=80',
    screenCostAvg: 650,
    batteryCostAvg: 220,
    releaseYear: 2021,
  },
  {
    id: 'dev-2',
    brand: 'Apple',
    model: 'iPhone 14',
    category: 'phone',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&auto=format&fit=crop&q=80',
    screenCostAvg: 780,
    batteryCostAvg: 250,
    releaseYear: 2022,
  },
  {
    id: 'dev-3',
    brand: 'Apple',
    model: 'iPhone 11',
    category: 'phone',
    imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=200&auto=format&fit=crop&q=80',
    screenCostAvg: 320,
    batteryCostAvg: 160,
    releaseYear: 2019,
  },
  {
    id: 'dev-4',
    brand: 'Samsung',
    model: 'Galaxy S22 Ultra',
    category: 'phone',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&auto=format&fit=crop&q=80',
    screenCostAvg: 890,
    batteryCostAvg: 240,
    releaseYear: 2022,
  },
  {
    id: 'dev-5',
    brand: 'Samsung',
    model: 'Galaxy A54 5G',
    category: 'phone',
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=200&auto=format&fit=crop&q=80',
    screenCostAvg: 380,
    batteryCostAvg: 180,
    releaseYear: 2023,
  },
  {
    id: 'dev-6',
    brand: 'Xiaomi',
    model: 'Redmi Note 12 Pro',
    category: 'phone',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&auto=format&fit=crop&q=80',
    screenCostAvg: 290,
    batteryCostAvg: 140,
    releaseYear: 2023,
  },
  {
    id: 'dev-7',
    brand: 'Motorola',
    model: 'Moto Edge 30',
    category: 'phone',
    imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=200&auto=format&fit=crop&q=80',
    screenCostAvg: 410,
    batteryCostAvg: 170,
    releaseYear: 2022,
  },
  {
    id: 'dev-8',
    brand: 'Apple',
    model: 'iPad Air 5ª Geração',
    category: 'tablet',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&auto=format&fit=crop&q=80',
    screenCostAvg: 950,
    batteryCostAvg: 320,
    releaseYear: 2022,
  },
];

const STORAGE_KEY = 'cambuci_devices_v1';

class DevicesService {
  list(brandFilter?: string): DeviceModel[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let devices = stored ? JSON.parse(stored) : DEFAULT_DEVICES;
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DEVICES));
      }
      if (brandFilter && brandFilter !== 'all') {
        devices = devices.filter((d: DeviceModel) => d.brand === brandFilter);
      }
      return devices;
    } catch {
      return DEFAULT_DEVICES;
    }
  }

  getById(id: string): DeviceModel | undefined {
    return this.list().find((d) => d.id === id);
  }

  getByModelName(modelName: string): DeviceModel | undefined {
    const q = modelName.toLowerCase().trim();
    return this.list().find((d) => d.model.toLowerCase().includes(q) || q.includes(d.model.toLowerCase()));
  }
}

export const devicesService = new DevicesService();
