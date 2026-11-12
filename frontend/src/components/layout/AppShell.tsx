'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BasketDrawer } from '../basket/BasketDrawer';
import { Loader2 } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireMember?: boolean;
}

export function AppShell({
  children,
  requireAdmin = false,
  requireMember = false,
}: AppShellProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Route protection
  useEffect(() => {
    if (!isLoading && user) {
      if (requireAdmin && !isAdmin) {
        // Non-admin trying to access admin dashboard or inventory -> redirect to catalog
        router.replace('/snacks');
      } else if (requireMember && isAdmin) {
        // Admin trying to access member-only history or favourites -> redirect to admin dashboard
        router.replace('/dashboard');
      }
    }
  }, [user, isLoading, requireAdmin, requireMember, isAdmin, router]);

  if (isLoading || !user || (requireAdmin && !isAdmin) || (requireMember && isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pantry-bg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-coral animate-spin" />
          <p className="text-xs font-bold text-pantry-text uppercase tracking-widest">
            Loading Snack Overflow...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-pantry-bg transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full transition-colors">
          {children}
        </main>
      </div>

      {/* Global Slide-out Basket Drawer */}
      <BasketDrawer />
    </div>
  );
}
