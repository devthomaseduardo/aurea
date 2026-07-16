import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
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
  Zap,
  ChevronLeft,
  LogOut,
  Palette,
} from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { useUiStore } from '@/stores/ui.store';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
import { profileService } from '@/services/profile.service';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

const navItems = [
  { to: ROUTES.app.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.app.clients, label: 'Clientes', icon: Users },
  { to: ROUTES.app.calculator, label: 'Calculadora', icon: Calculator },
  { to: ROUTES.app.proposals, label: 'Propostas', icon: FileText },
  { to: ROUTES.app.contracts, label: 'Contratos', icon: FileSignature },
  { to: ROUTES.app.analytics, label: 'Analytics', icon: BarChart3 },
  { to: ROUTES.app.settings, label: 'Configurações', icon: Settings },
  { to: ROUTES.app.profile, label: 'Perfil', icon: User },
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
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
          isActive
            ? 'bg-primary/15 text-foreground border border-primary/25 shadow-[0_0_20px_rgba(100,80,255,0.12)]'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent'
        )
      }
      onClick={() => useUiStore.getState().setSidebarMobileOpen(false)}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, setSidebarMobileOpen } =
    useUiStore();
  const profile = profileService.get();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile overlay */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col border-r border-border bg-[hsl(var(--sidebar-background))]/95 backdrop-blur-xl transition-all duration-300',
          sidebarCollapsed ? 'w-[72px]' : 'w-64',
          sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link to={ROUTES.app.dashboard} className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, hsl(243,75%,66%), hsl(213,90%,60%))',
              }}
            >
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-base font-bold tracking-tight truncate">
                <span className="gradient-text-subtle">Calcula</span>
                <span className="gradient-text">Freela</span>
              </span>
            )}
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5"
            onClick={() => setSidebarMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} collapsed={sidebarCollapsed} />
          ))}
          <div className="pt-3 mt-3 border-t border-border">
            <NavItem
              to={ROUTES.designSystem}
              label="Design System"
              icon={Palette}
              collapsed={sidebarCollapsed}
            />
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-2">
          {!sidebarCollapsed && (
            <div className="px-2 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs font-medium text-foreground truncate">{profile.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{profile.email}</p>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={toggleSidebar}
              aria-label="Recolher menu"
            >
              <ChevronLeft
                className={cn('w-4 h-4 transition-transform', sidebarCollapsed && 'rotate-180')}
              />
            </Button>
            <Button
              variant="ghost"
              size={sidebarCollapsed ? 'icon' : 'sm'}
              className="flex-1 justify-start text-muted-foreground"
              onClick={() => navigate(ROUTES.home)}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2">Sair do app</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar mobile */}
        <header className="lg:hidden sticky top-0 z-30 h-14 flex items-center gap-3 px-4 border-b border-border bg-background/90 backdrop-blur-xl">
          <button
            onClick={() => setSidebarMobileOpen(true)}
            className="p-2 rounded-lg border border-border hover:bg-white/5"
            aria-label="Abrir menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="font-semibold text-sm">{APP_CONFIG.name}</span>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
