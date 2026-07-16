import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/config/app.config';
import { Button } from '@/shared/components/ui/button';
import { Home, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-svh flex items-center justify-center px-6 bg-background page-mesh">
      <div className="text-center max-w-md relative z-10">
        <p className="text-7xl font-semibold tracking-tighter gradient-text mb-4">404</p>
        <h1 className="text-xl font-semibold mb-2">Página não encontrada</h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          O endereço não existe ou foi movido. Volte ao início ou abra o workspace.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button asChild variant="brand">
            <Link to={ROUTES.home}>
              <Home className="w-4 h-4" />
              Início
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.app.dashboard}>
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
