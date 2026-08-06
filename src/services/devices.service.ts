import type { DeviceModel } from '@/types/domain';

const DEFAULT_DEVICES: DeviceModel[] = [
  // Apple
  {
    id: 'dev-1',
    brand: 'Apple',
    model: 'iPhone 16 Pro Max',
    category: 'phone',
    imageUrl: '/img/celulares/apple-iphone-16-preto.jpg',
    screenCostAvg: 890,
    batteryCostAvg: 280,
    releaseYear: 2024,
  },
  {
    id: 'dev-2',
    brand: 'Apple',
    model: 'iPhone 16',
    category: 'phone',
    imageUrl: '/img/celulares/apple-iphone-16-rosa.jpg',
    screenCostAvg: 750,
    batteryCostAvg: 250,
    releaseYear: 2024,
  },
  {
    id: 'dev-3',
    brand: 'Apple',
    model: 'iPhone 16e',
    category: 'phone',
    imageUrl: '/img/celulares/apple-iphone-16e-branco.jpg',
    screenCostAvg: 620,
    batteryCostAvg: 220,
    releaseYear: 2025,
  },
  {
    id: 'dev-4',
    brand: 'Apple',
    model: 'iPhone 13',
    category: 'phone',
    imageUrl: '/img/celulares/apple-iphone-13-preto.jpg',
    screenCostAvg: 550,
    batteryCostAvg: 190,
    releaseYear: 2021,
  },
  {
    id: 'dev-5',
    brand: 'Apple',
    model: 'iPhone SE 2ª Geração',
    category: 'phone',
    imageUrl: '/img/celulares/apple-iphone-se.jpg',
    screenCostAvg: 280,
    batteryCostAvg: 140,
    releaseYear: 2020,
  },
  // Samsung
  {
    id: 'dev-6',
    brand: 'Samsung',
    model: 'Galaxy S25 5G',
    category: 'phone',
    imageUrl: '/img/celulares/samsung-galaxy-s25.jpg',
    screenCostAvg: 920,
    batteryCostAvg: 260,
    releaseYear: 2025,
  },
  {
    id: 'dev-7',
    brand: 'Samsung',
    model: 'Galaxy S25 FE 5G',
    category: 'phone',
    imageUrl: '/img/celulares/samsung-galaxy-s25-fe.jpg',
    screenCostAvg: 780,
    batteryCostAvg: 230,
    releaseYear: 2025,
  },
  {
    id: 'dev-8',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra 5G',
    category: 'phone',
    imageUrl: '/img/celulares/samsung-galaxy-s24-ultra.jpg',
    screenCostAvg: 980,
    batteryCostAvg: 270,
    releaseYear: 2024,
  },
  {
    id: 'dev-9',
    brand: 'Samsung',
    model: 'Galaxy A26 5G',
    category: 'phone',
    imageUrl: '/img/celulares/samsung-galaxy-a26.jpg',
    screenCostAvg: 390,
    batteryCostAvg: 170,
    releaseYear: 2025,
  },
  {
    id: 'dev-10',
    brand: 'Samsung',
    model: 'Galaxy A16',
    category: 'phone',
    imageUrl: '/img/celulares/samsung-galaxy-a16.jpg',
    screenCostAvg: 320,
    batteryCostAvg: 150,
    releaseYear: 2024,
  },
  // Motorola
  {
    id: 'dev-11',
    brand: 'Motorola',
    model: 'Motorola Signature 5G',
    category: 'phone',
    imageUrl: '/img/celulares/motorola-signature.jpg',
    screenCostAvg: 850,
    batteryCostAvg: 240,
    releaseYear: 2025,
  },
  {
    id: 'dev-12',
    brand: 'Motorola',
    model: 'Motorola Edge 70 5G',
    category: 'phone',
    imageUrl: '/img/celulares/motorola-edge-70.png',
    screenCostAvg: 720,
    batteryCostAvg: 210,
    releaseYear: 2025,
  },
  {
    id: 'dev-13',
    brand: 'Motorola',
    model: 'Moto G86 5G',
    category: 'phone',
    imageUrl: '/img/celulares/motorola-moto-g86.png',
    screenCostAvg: 420,
    batteryCostAvg: 180,
    releaseYear: 2025,
  },
  {
    id: 'dev-14',
    brand: 'Motorola',
    model: 'Moto G67 5G',
    category: 'phone',
    imageUrl: '/img/celulares/motorola-moto-g67.png',
    screenCostAvg: 360,
    batteryCostAvg: 160,
    releaseYear: 2024,
  },
  // Xiaomi
  {
    id: 'dev-15',
    brand: 'Xiaomi',
    model: 'Xiaomi 17 Pro 5G',
    category: 'phone',
    imageUrl: '/img/celulares/xiaomi-17-pro.jpg',
    screenCostAvg: 880,
    batteryCostAvg: 250,
    releaseYear: 2025,
  },
  {
    id: 'dev-16',
    brand: 'Xiaomi',
    model: 'Xiaomi 14',
    category: 'phone',
    imageUrl: '/img/celulares/xiaomi-14.jpg',
    screenCostAvg: 690,
    batteryCostAvg: 210,
    releaseYear: 2024,
  },
  {
    id: 'dev-17',
    brand: 'Xiaomi',
    model: 'Redmi Note 15 Pro 5G',
    category: 'phone',
    imageUrl: '/img/celulares/xiaomi-redmi-note-15-pro.jpg',
    screenCostAvg: 480,
    batteryCostAvg: 190,
    releaseYear: 2025,
  },
  {
    id: 'dev-18',
    brand: 'Xiaomi',
    model: 'Redmi 12 4G',
    category: 'phone',
    imageUrl: '/img/celulares/xiaomi-redmi-12.jpg',
    screenCostAvg: 260,
    batteryCostAvg: 130,
    releaseYear: 2023,
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
