import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/core/auth/auth.service';
import { toast } from '@/shared/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/config/app.config';
import { Loader2 } from 'lucide-react';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.9 2.3 2.8 6.4 2.8 11.5S6.9 20.7 12 20.7c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"
      />
      <path
        fill="#34A853"
        d="M3.9 7.6l3.2 2.4C8 7.6 9.9 6.2 12 6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 8.4 2.3 5.3 4.4 3.9 7.6z"
      />
      <path
        fill="#4A90E2"
        d="M12 20.7c2.5 0 4.6-.8 6.1-2.3l-3-2.4c-.8.6-1.9 1-3.1 1-3.1 0-5.7-2-6.6-4.7l-3.2 2.5c1.5 3 4.6 5 8.8 5z"
      />
      <path
        fill="#FBBC05"
        d="M5.4 12.3c0-.7.1-1.4.3-2l-3.2-2.5C1.8 9 1.5 10.2 1.5 11.5s.3 2.5.9 3.6l3.2-2.5c-.2-.6-.3-1.2-.3-1.8z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.6 5.6.6 11.9c0 5 3.3 9.3 7.8 10.8.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 1.6 2.7 1.1.1-.8.4-1.3.7-1.6-2.5-.3-5.2-1.3-5.2-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.2 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.2 5.7.4.3.8 1 .8 2.1v3.1c0 .3.2.6.8.5 4.5-1.5 7.8-5.7 7.8-10.8C23.4 5.6 18.3.5 12 .5z" />
    </svg>
  );
}

interface SocialAuthButtonsProps {
  redirectTo?: string;
}

export function SocialAuthButtons({ redirectTo = ROUTES.app.dashboard }: SocialAuthButtonsProps) {
  const navigate = useNavigate();
  const { setFromSocial, isLoading, clearError } = useAuthStore();
  const [pending, setPending] = useState<'google' | 'github' | null>(null);
  const live = authService.isSocialOAuthLive();

  const handle = async (provider: 'google' | 'github') => {
    clearError();
    setPending(provider);
    try {
      const result = await setFromSocial(provider);
      if (result === 'redirect') {
        toast({
          title: `Redirecionando para ${provider === 'google' ? 'Google' : 'GitHub'}…`,
          description: 'Complete a autorização na janela do provedor.',
        });
        return;
      }
      toast({
        title: 'Login social realizado',
        description: live
          ? 'Sessão autenticada com sucesso.'
          : 'Modo local (sem Supabase). Configure OAuth para produção.',
      });
      navigate(redirectTo, { replace: true });
    } catch (e) {
      toast({
        title: 'Falha no login social',
        description: e instanceof Error ? e.message : 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2.5">
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 justify-center gap-2.5 font-medium text-foreground hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          onClick={() => handle('google')}
          disabled={Boolean(pending) || isLoading}
        >
          {pending === 'google' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <GoogleIcon className="w-4 h-4" />
          )}
          Continuar com Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 justify-center gap-2.5 font-medium text-foreground hover:bg-slate-900 hover:text-white hover:border-slate-900 dark:hover:bg-white dark:hover:text-slate-900 transition-colors"
          onClick={() => handle('github')}
          disabled={Boolean(pending) || isLoading}
        >
          {pending === 'github' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <GitHubIcon className="w-4 h-4" />
          )}
          Continuar com GitHub
        </Button>
      </div>

      <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
        {live
          ? 'OAuth real via Supabase (Google e GitHub).'
          : 'Sem chaves Supabase: login social local para desenvolvimento. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para OAuth real.'}
      </p>
    </div>
  );
}
