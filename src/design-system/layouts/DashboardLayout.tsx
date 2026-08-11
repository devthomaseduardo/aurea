import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  Plus,
  Calculator,
  FileText,
  FileSignature,
  BarChart3,
  Plug,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { useUiStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';
import { settingsService } from '@/services/settings.service';
import { Button } from '@/shared/components/ui/button';
import { BrandLogo } from '@/design-system/components/BrandLogo';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';

const navGroups = [
  {
    label: 'Workspace',
    items: [{ to: ROUTES.app.dashboard, label: 'Visão geral', icon: LayoutDashboard }],
  },
  {
    label: 'Comercial',
    items: [
      { to: ROUTES.app.clients, label: 'Clientes', icon: Users },
      { to: ROUTES.app.calculator, label: 'Precificação', icon: Calculator },
      { to: ROUTES.app.proposals, label: 'Propostas', icon: FileText },
      { to: ROUTES.app.contracts, label: 'Contratos', icon: FileSignature },
    ],
  },
  {
    label: 'Operação',
    items: [
      { to: ROUTES.app.analytics, label: 'Resultados', icon: BarChart3 },
      { to: ROUTES.app.integrations, label: 'Integrações', icon: Plug },
      { to: ROUTES.app.settings, label: 'Configurações', icon: Settings },
    ],
  },
];

const mobileNav = [
  { to: ROUTES.app.dashboard, label: 'Início', icon: LayoutDashboard },
  { to: ROUTES.app.clients, label: 'Clientes', icon: Users },
  { to: ROUTES.app.proposals, label: 'Propostas', icon: FileText },
];

function NavItem({ to, label, icon: Icon, collapsed }: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  collapsed: boolean;
}) {
  const link = (
    <NavLink
      to={to}
      end={to === ROUTES.app.dashboard}
      className={({ isActive }) => cn(
        'group flex min-h-10 items-center gap-3 rounded-full px-3 text-[13px] font-medium transition-all duration-200',
        isActive
          ? 'bg-white text-[#171614] shadow-sm'
          : 'text-white/48 hover:bg-white/[0.06] hover:text-white'
      )}
      onClick={() => useUiStore.getState().setSidebarMobileOpen(false)}
    >
      {({ isActive }) => (
        <>
          <Icon className={cn('size-4 shrink-0 transition-colors', isActive ? 'text-[#f26522]' : 'text-white/40 group-hover:text-white/80')} />
          {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
          {!collapsed && isActive && <span className="size-1.5 rounded-full bg-[#f26522]" />}
        </>
      )}
    </NavLink>
  );

  if (!collapsed) return link;
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
    </Tooltip>
  );
}

function pageTitle(pathname: string) {
  const map: Record<string, string> = {
    [ROUTES.app.dashboard]: 'Visão geral',
    [ROUTES.app.clients]: 'Clientes',
    [ROUTES.app.clientsNew]: 'Novo cliente',
    [ROUTES.app.calculator]: 'Precificação',
    [ROUTES.app.proposals]: 'Propostas',
    [ROUTES.app.contracts]: 'Contratos',
    [ROUTES.app.analytics]: 'Resultados',
    [ROUTES.app.integrations]: 'Integrações',
    [ROUTES.app.settings]: 'Configurações',
    [ROUTES.app.profile]: 'Perfil',
  };
  if (map[pathname]) return map[pathname];
  if (pathname.startsWith('/app/proposals')) return 'Proposta';
  if (pathname.startsWith('/app/clients')) return 'Cliente';
  return APP_CONFIG.name;
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, setSidebarMobileOpen } = useUiStore();
  const { user, logout } = useAuthStore();
  const activeTenant = settingsService.getActiveTenant();
  const displayName = user?.name || 'Profissional';
  const displayEmail = user?.email || APP_CONFIG.supportEmail;

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.auth.login);
  };

  return (
    <div className="bg-[#f4f1eb] text-[#1b1a18] lg:h-screen lg:overflow-hidden lg:p-3">
      {sidebarMobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      <div className="mx-auto flex min-h-screen max-w-[1800px] overflow-hidden lg:h-full lg:min-h-0 lg:rounded-[28px] lg:bg-white/50 lg:shadow-[0_26px_90px_rgba(40,34,26,.08)]">
        <aside
          className={cn(
            'fixed left-0 top-0 z-50 flex h-svh flex-col bg-[#121110] text-white transition-[width,transform] duration-300 ease-out lg:static lg:h-full',
            sidebarCollapsed ? 'w-[76px]' : 'w-[252px]',
            sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className={cn('flex h-[72px] shrink-0 items-center', sidebarCollapsed ? 'justify-center px-3' : 'gap-3 px-5')}>
            <BrandLogo
              to={ROUTES.app.dashboard}
              showWordmark={!sidebarCollapsed}
              size="md"
              className="min-w-0 [&_span]:text-white"
              onClick={() => setSidebarMobileOpen(false)}
            />
            <button type="button" className="ml-auto rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setSidebarMobileOpen(false)}>
              <X className="size-4" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-3">
            <div className="space-y-7">
              {navGroups.map((group) => (
                <div key={group.label}>
                  {!sidebarCollapsed && <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/24">{group.label}</p>}
                  <div className="space-y-1">
                    {group.items.map((item) => <NavItem key={item.to} {...item} collapsed={sidebarCollapsed} />)}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          <div className="p-3">
            {!sidebarCollapsed && (
              <div className="mb-2 rounded-[22px] bg-white/[0.06] p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#f6a576]">{activeTenant.name}</p>
                <p className="mt-2 truncate text-sm font-semibold text-white">{displayName}</p>
                <p className="mt-0.5 truncate text-[11px] text-white/35">{displayEmail}</p>
              </div>
            )}
            <div className={cn('flex gap-1', sidebarCollapsed && 'flex-col items-center')}>
              <Button variant="ghost" size="icon" className="hidden size-9 rounded-full text-white/40 hover:bg-white/10 hover:text-white lg:flex" onClick={toggleSidebar} aria-label={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}>
                {sidebarCollapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
              </Button>
              <Button variant="ghost" size={sidebarCollapsed ? 'icon' : 'sm'} className={cn('h-9 rounded-full text-white/40 hover:bg-white/10 hover:text-white', !sidebarCollapsed && 'flex-1 justify-start px-3')} onClick={handleLogout}>
                <LogOut className="size-4" />
                {!sidebarCollapsed && <span className="ml-2 text-xs">Sair</span>}
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-svh min-w-0 flex-1 flex-col bg-[#f4f1eb] lg:h-full lg:min-h-0 lg:overflow-y-auto">
          <header className="sticky top-0 z-30 pt-3 sm:pt-4">
            <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
              <div className="flex min-h-[58px] w-full items-center gap-2 rounded-full border border-black/[0.06] bg-white/85 px-2.5 shadow-sm backdrop-blur-xl sm:gap-3 sm:px-4">
                <button type="button" onClick={() => setSidebarMobileOpen(true)} className="rounded-full p-2 hover:bg-black/[0.05] lg:hidden" aria-label="Abrir menu">
                  <Menu className="size-4" />
                </button>

                <div className="min-w-0 flex-1 pl-0.5 sm:pl-1">
                  <p className="hidden text-[9px] font-semibold uppercase tracking-[0.14em] text-black/35 sm:block">{activeTenant.name}</p>
                  <p className="truncate text-[12px] font-semibold text-[#171614] sm:text-[13px]">{pageTitle(location.pathname)}</p>
                </div>

                <Button asChild size="sm" variant="ghost" className="hidden rounded-full px-4 text-xs font-medium text-black/55 hover:bg-black/[0.04] hover:text-black md:inline-flex">
                  <Link to={ROUTES.app.clients}>Clientes</Link>
                </Button>

                <Button asChild size="sm" className="rounded-full bg-[#171614] px-3 text-[11px] font-semibold text-white shadow-none hover:bg-[#f26522] sm:px-4 sm:text-xs">
                  <Link to={ROUTES.app.calculator}>
                    <Plus className="mr-1 size-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline">Nova precificação</span>
                    <span className="sm:hidden">Novo</span>
                    <ArrowUpRight className="ml-1 size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden pb-20 lg:pb-0">
            <Outlet />
          </main>

          <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-[22px] border border-white/15 bg-[#171614]/95 p-1.5 shadow-[0_20px_50px_rgba(20,18,16,.24)] backdrop-blur-xl lg:hidden">
            {mobileNav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === ROUTES.app.dashboard}
                className={({ isActive }) => cn(
                  'flex min-h-12 flex-col items-center justify-center gap-1 rounded-[17px] text-[9px] font-medium transition',
                  isActive ? 'bg-white text-[#171614]' : 'text-white/45'
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('size-4', isActive ? 'text-[#f26522]' : 'text-white/45')} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => setSidebarMobileOpen(true)}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-[17px] text-[9px] font-medium text-white/45 transition hover:bg-white/[0.06] hover:text-white"
            >
              <MoreHorizontal className="size-4" />
              <span>Mais</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
