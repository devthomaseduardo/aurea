import type { ReactNode } from 'react';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
