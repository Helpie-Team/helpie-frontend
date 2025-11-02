'use client';
import { ReactNode } from 'react';

interface SubPagesLayoutProps {
  children: ReactNode;
}

export default function SubPagesLayout({ children }: SubPagesLayoutProps) {
  return (
    
    <main className="flex min-h-screen flex-col items-center justify-center px-16">
      {children}
    </main>
  );
}