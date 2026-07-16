import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/config/app.config';
import { Button } from '@/shared/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="text-center max-w-md">
        <p className="text-6xl font-black gradient-text mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="btn-primary text-white">
            <Link to={ROUTES.home}>
              <Home className="w-4 h-4" />
              Voltar ao início
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.app.dashboard}>Ir para o app</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
