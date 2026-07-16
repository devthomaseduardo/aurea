import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/core/config/app.config';
import { LoadingState } from '@/design-system/patterns';
import { toast } from '@/shared/components/ui/use-toast';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const completeOAuth = useAuthStore((s) => s.completeOAuth);
  const [message, setMessage] = useState('Finalizando autenticação social…');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await completeOAuth();
        if (cancelled) return;
        if (user) {
          toast({
            title: 'Login social concluído',
            description: `Olá, ${user.name}`,
          });
          navigate(ROUTES.app.dashboard, { replace: true });
        } else {
          setMessage('Não foi possível validar a sessão OAuth.');
          setTimeout(() => navigate(ROUTES.auth.login, { replace: true }), 1500);
        }
      } catch (e) {
        if (cancelled) return;
        toast({
          title: 'Erro no callback OAuth',
          description: e instanceof Error ? e.message : 'Tente novamente',
          variant: 'destructive',
        });
        navigate(ROUTES.auth.login, { replace: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [completeOAuth, navigate]);

  return <LoadingState fullPage label={message} />;
}
