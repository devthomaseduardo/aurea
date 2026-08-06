import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  ShoppingBag,
  Package,
  Users,
  Settings,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  ChevronRight,
  ExternalLink,
  Plus,
  ShoppingCart,
  Smartphone,
  ShieldCheck,
  UserCheck,
  Calculator,
} from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { useUiStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
import { settingsService } from '@/services/settings.service';
import { Button } from '@/shared/components/ui/button';
import { BrandLogo } from '@/design-system/components/BrandLogo';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

const navGroups = [
  {
    label: 'Painel da Oficina',
    items: [
      { to: ROUTES.app.dashboard, label: 'Visão Geral', icon: LayoutDashboard },
      { to: ROUTES.app.orders, label: 'Ordens de Serviço', icon: Wrench },
      { to: ROUTES.app.clients, label: 'Clientes', icon: Users },
      { to: ROUTES.app.devices, label: 'Aparelhos', icon: Smartphone },
      { to: ROUTES.app.calculator, label: 'Serviços', icon: Calculator },
      { to: ROUTES.app.inventory, label: 'Estoque', icon: Package },
      { to: ROUTES.app.warranties, label: 'Garantias', icon: ShieldCheck },
      { to: ROUTES.app.pos, label: 'Financeiro', icon: ShoppingBag },
      { to: ROUTES.app.team, label: 'Equipe', icon: UserCheck },
      { to: ROUTES.app.settings, label: 'Configurações', icon: Settings },
    ],
  },
];

function NavItem({
  to,
  label,
  icon: Icon,
  collapsed,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  collapsed: boolean;
}) {
  const link = (
    <NavLink
      to={to}
      end={to === ROUTES.app.dashboard}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
          isActive
            ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        )
      }
      onClick={() => useUiStore.getState().setSidebarMobileOpen(false)}
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'w-4 h-4 shrink-0 transition-colors',
              isActive ? 'text-blue-600' : 'text-muted-foreground group-hover:text-foreground'
            )}
          />
          {!collapsed && <span className="truncate flex-1">{label}</span>}
          {!collapsed && isActive && (
            <ChevronRight className="w-3.5 h-3.5 text-blue-600/70" />
          )}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

function pageTitle(pathname: string) {
  const map: Record<string, string> = {
    [ROUTES.app.dashboard]: 'Visão Geral da Operação',
    [ROUTES.app.orders]: 'Ordens de Serviço (OS)',
    [ROUTES.app.ordersNew]: 'Nova Ordem de Serviço',
    [ROUTES.app.devices]: 'Aparelhos & Modelos Atendidos',
    [ROUTES.app.inventory]: 'Estoque de Peças e Aparelhos',
    [ROUTES.app.pos]: 'Frente de Caixa (PDV)',
    [ROUTES.app.clients]: 'Clientes & Histórico de Reparos',
    [ROUTES.app.calculator]: 'Calculadora de Orçamentos',
    [ROUTES.app.team]: 'Equipe Técnica & Bancada',
    [ROUTES.app.warranties]: 'Controle de Garantias 90 Dias',
    [ROUTES.app.settings]: 'Configurações da Loja (White-Label)',
  };
  if (map[pathname]) return map[pathname];
  if (pathname.startsWith('/app/orders')) return 'Ordem de Serviço';
  if (pathname.startsWith('/app/clients')) return 'Clientes';
  return APP_CONFIG.name;
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, setSidebarMobileOpen } =
    useUiStore();
  const { user, logout } = useAuthStore();
  const activeTenant = settingsService.getActiveTenant();
  const displayName = user?.name || 'Técnico Operador';
  const displayEmail = user?.email || 'operacao@cambucimobile.com.br';

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.auth.login);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {sidebarMobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-svh flex flex-col border-r border-sidebar-border bg-white transition-[width,transform] duration-200 ease-out',
          sidebarCollapsed ? 'w-[68px]' : 'w-[260px]',
          sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div
          className={cn(
            'flex items-center h-14 border-b border-sidebar-border shrink-0',
            sidebarCollapsed ? 'justify-center px-2' : 'px-4 gap-2.5'
          )}
        >
          <BrandLogo
            to={ROUTES.app.dashboard}
            showWordmark={!sidebarCollapsed}
            size="md"
            className="min-w-0"
            onClick={() => setSidebarMobileOpen(false)}
          />
          <button
            type="button"
            className="lg:hidden ml-auto p-1.5 rounded-md hover:bg-muted"
            onClick={() => setSidebarMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!sidebarCollapsed && (
                <p className="px-2.5 mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.to}
                    {...item}
                    collapsed={sidebarCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-2.5 border-t border-sidebar-border space-y-2 shrink-0">
          {!sidebarCollapsed && (
            <div className="px-2.5 py-2 rounded-lg bg-blue-50/60 border border-blue-100">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 mb-0.5">
                {activeTenant.name}
              </p>
              <p className="text-xs font-bold truncate text-slate-900">{displayName}</p>
              <p className="text-[11px] text-slate-500 truncate">{displayEmail}</p>
            </div>
          )}
          <div className={cn('flex gap-1', sidebarCollapsed && 'flex-col items-center')}>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8 text-muted-foreground"
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {sidebarCollapsed ? (
                <PanelLeft className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size={sidebarCollapsed ? 'icon' : 'sm'}
              className={cn(
                'text-muted-foreground h-8',
                !sidebarCollapsed && 'flex-1 justify-start px-2.5'
              )}
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2 text-xs">Sair</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-svh">
        <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 md:px-6 border-b border-border bg-white/95 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setSidebarMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg border border-border hover:bg-accent"
            aria-label="Abrir menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground hidden sm:block font-bold text-blue-700">
              {activeTenant.name} · Plataforma de Assistência Técnica
            </p>
            <p className="text-sm font-bold truncate text-slate-900">
              {pageTitle(location.pathname)}
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="hidden md:inline-flex gap-1.5 border-slate-300 font-bold text-xs">
            <Link to={ROUTES.app.pos}>
              <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
              PDV Venda
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm">
            <Link to={ROUTES.app.ordersNew}>
              <Plus className="w-3.5 h-3.5 text-yellow-300" />
              Nova OS
            </Link>
          </Button>
        </header>

        <main className="flex-1 overflow-x-hidden bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
