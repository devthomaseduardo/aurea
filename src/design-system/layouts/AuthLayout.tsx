import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(100,80,255,0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to={ROUTES.home} className="inline-flex items-center gap-2 mb-6">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(243,75%,66%), hsl(213,90%,60%))',
              }}
            >
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold">
              <span className="gradient-text-subtle">Calcula</span>
              <span className="gradient-text">Freela</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        <div className="glass-card rounded-2xl p-6 md:p-8">{children}</div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          {APP_CONFIG.name} v{APP_CONFIG.version}
        </p>
      </div>
    </div>
  );
}
