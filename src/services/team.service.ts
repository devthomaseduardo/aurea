import type { Technician } from '@/types/domain';

const DEFAULT_TEAM: Technician[] = [
  {
    id: 'tech-1',
    name: 'Rafael Santos',
    role: 'Técnico Senior',
    specialties: ['iPhone', 'Placa Mãe', 'Desoxidação Micro-soldagem'],
    phone: '(11) 97123-4567',
    email: 'rafael.santos@cambucimobile.com.br',
    avatarUrl: '/brand/logo-mark.jpg',
    activeOSCount: 4,
    completedOSCount: 142,
    status: 'active',
  },
  {
    id: 'tech-2',
    name: 'Matheus Lima',
    role: 'Técnico Pleno',
    specialties: ['Samsung', 'Xiaomi', 'Troca de Telas OLED', 'Baterias'],
    phone: '(11) 98234-5678',
    email: 'matheus.lima@cambucimobile.com.br',
    avatarUrl: '/brand/logo-mark.jpg',
    activeOSCount: 3,
    completedOSCount: 98,
    status: 'active',
  },
  {
    id: 'tech-3',
    name: 'Ana Clara',
    role: 'Atendente Balcão',
    specialties: ['Recebimento de OS', 'Checklist Físico', 'Acessórios'],
    phone: '(11) 99345-6789',
    email: 'ana.clara@cambucimobile.com.br',
    avatarUrl: '/brand/logo-mark.jpg',
    activeOSCount: 0,
    completedOSCount: 310,
    status: 'active',
  },
  {
    id: 'tech-4',
    name: 'Thiago Silva',
    role: 'Gerente',
    specialties: ['Gestão de Estoque', 'Orçamentos Especiais', 'Garantias'],
    phone: '(11) 96456-7890',
    email: 'thiago.silva@cambucimobile.com.br',
    avatarUrl: '/brand/logo-mark.jpg',
    activeOSCount: 1,
    completedOSCount: 205,
    status: 'active',
  },
];

const STORAGE_KEY = 'cambuci_team_v1';

class TeamService {
  list(): Technician[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TEAM));
        return DEFAULT_TEAM;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_TEAM;
    }
  }

  getById(id: string): Technician | undefined {
    return this.list().find((t) => t.id === id);
  }
}

export const teamService = new TeamService();
