import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="w-full max-w-[390px] mx-auto min-h-screen bg-white relative">
      {children}
    </main>
  );
} 