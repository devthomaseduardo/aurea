import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calculator,
  FileText,
  FileSignature,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  Palette,
  ChevronRight,
  Plug,
} from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { useUiStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
import { profileService } from '@/services/profile.service';
import { Button } from '@/shared/components/ui/button';
import { BrandLogo } from '@/design-system/components/BrandLogo';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

const navGroups = [
  {
    label: 'Operações',
    items: [
      { to: ROUTES.app.dashboard, label: 'Visão geral', icon: LayoutDashboard },
      { to: ROUTES.app.calculator, label: 'Precificação', icon: Calculator },
      { to: ROUTES.app.proposals, label: 'Propostas', icon: FileText },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { to: ROUTES.app.clients, label: 'Clientes', icon: Users },
      { to: ROUTES.app.contracts, label: 'Contratos', icon: FileSignature },
      { to: ROUTES.app.analytics, label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Administração',
    items: [
      { to: ROUTES.app.integrations, label: 'Integrações', icon: Plug },
      { to: ROUTES.app.profile, label: 'Organização', icon: User },
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
            ? 'bg-primary/10 text-foreground shadow-[inset_0_0_0_1px_hsla(239,84%,57%,0.2)]'
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
              isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
            )}
          />
          {!collapsed && <span className="truncate flex-1">{label}</span>}
          {!collapsed && isActive && (
            <ChevronRight className="w-3.5 h-3.5 text-primary/60" />
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
    [ROUTES.app.dashboard]: 'Visão geral',
    [ROUTES.app.clients]: 'Clientes',
    [ROUTES.app.calculator]: 'Precificação',
    [ROUTES.app.proposals]: 'Propostas',
    [ROUTES.app.contracts]: 'Contratos',
    [ROUTES.app.analytics]: 'Analytics',
    [ROUTES.app.integrations]: 'Integrações',
    [ROUTES.app.settings]: 'Configurações',
    [ROUTES.app.profile]: 'Organização',
  };
  if (map[pathname]) return map[pathname];
  if (pathname.startsWith('/app/clients')) return 'Clientes';
  if (pathname.startsWith('/app/proposals')) return 'Propostas';
  return APP_CONFIG.name;
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, setSidebarMobileOpen } =
    useUiStore();
  const { user, logout } = useAuthStore();
  const profile = profileService.get();
  const displayName = user?.name || profile.name;
  const displayEmail = user?.email || profile.email;

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
          'fixed lg:sticky top-0 left-0 z-50 h-svh flex flex-col border-r border-sidebar-border bg-[hsl(var(--sidebar-background))] transition-[width,transform] duration-200 ease-out',
          sidebarCollapsed ? 'w-[68px]' : 'w-[260px]',
          sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand */}
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
                <p className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
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
            <div className="px-2.5 py-2 rounded-lg bg-slate-50 border border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                Conta autenticada
              </p>
              <p className="text-xs font-medium truncate">{displayName}</p>
              <p className="text-[11px] text-muted-foreground truncate">{displayEmail}</p>
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
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground hidden sm:block">
              Console {APP_CONFIG.name}
            </p>
            <p className="text-sm font-semibold truncate text-slate-900">
              {pageTitle(location.pathname)}
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
            <Link to={ROUTES.app.clients}>Clientes</Link>
          </Button>
          <Button asChild size="sm" variant="brand" className="hidden sm:inline-flex">
            <Link to={ROUTES.app.calculator}>Nova proposta</Link>
          </Button>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
