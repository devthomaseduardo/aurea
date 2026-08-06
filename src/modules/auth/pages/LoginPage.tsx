import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/design-system/layouts/AuthLayout';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/core/auth/auth.service';
import { ROUTES } from '@/core/config/app.config';
import { toast } from '@/shared/components/ui/use-toast';
import { SocialAuthButtons } from '@/modules/auth/components/SocialAuthButtons';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [demoLoading, setDemoLoading] = useState(false);
  const from =
    (location.state as { from?: string } | null)?.from ?? ROUTES.app.dashboard;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    clearError();
    try {
      await login(values);
      toast({ title: 'Login realizado', description: 'Bem-vindo de volta à Aurea.' });
      navigate(from, { replace: true });
    } catch {
      // store error
    }
  };

  const loginDemo = async () => {
    setDemoLoading(true);
    clearError();
    try {
      const creds = await authService.ensureDemoAccount();
      await login(creds);
      toast({ title: 'Conta demo', description: 'Você entrou com demo@aurea.app' });
      navigate(ROUTES.app.dashboard, { replace: true });
    } catch (e) {
      toast({
        title: 'Erro na conta demo',
        description: e instanceof Error ? e.message : 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Acessar o Sistema da Oficina"
      subtitle="Entre com suas credenciais de operador ou técnico."
    >
      <SocialAuthButtons redirectTo={from} />

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <span className="select-none">ou e-mail</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail do Técnico / Operador</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tecnico@teronfix.com.br"
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha de Acesso</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register('password')}
          />
          {form.formState.errors.password && (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" variant="brand" disabled={isLoading}>
          {isLoading ? 'Entrando…' : 'Entrar no Sistema'}
        </Button>
      </form>

      <Button
        type="button"
        variant="ghost"
        className="w-full mt-3 text-muted-foreground hover:text-foreground"
        onClick={loginDemo}
        disabled={demoLoading || isLoading}
      >
        {demoLoading ? 'Preparando conta demo…' : 'Entrar com Conta Demo da Oficina'}
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Precisa de acesso?{' '}
        <Link
          to={ROUTES.auth.register}
          className="text-primary font-medium link-hover"
        >
          Cadastrar nova loja
        </Link>
      </p>
    </AuthLayout>
  );
}
