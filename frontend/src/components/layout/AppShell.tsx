'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Loader2 } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AppShell({ children, requireAdmin = false }: AppShellProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!isLoading && user && requireAdmin && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, isLoading, requireAdmin, isAdmin, router]);

  if (isLoading || !user || (requireAdmin && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pantry-bg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-coral animate-spin" />
          <p className="text-xs font-semibold text-navy-900 uppercase tracking-widest">
            Loading Snack Overflow...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-pantry-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
