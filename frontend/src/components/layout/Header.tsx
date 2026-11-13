'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useBasket } from '../../context/BasketContext';
import { useRealtimeEvents } from '../../hooks/useRealtimeEvents';
import { RoleBadge } from '../ui/Badge';
import { ThemeToggle } from '../ui/ThemeToggle';
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Boxes,
  History,
  LogOut,
  UtensilsCrossed,
  ShoppingBag,
  Heart,
  Clock,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const { totalPackets, toggleDrawer } = useBasket();
  const { isConnected } = useRealtimeEvents();

  const adminNavItems = [
    { name: 'Pantry Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory Manager', href: '/admin', icon: Boxes },
    { name: 'Activity Audit Log', href: '/activities', icon: History },
  ];

  const memberNavItems = [
    { name: 'Snack Catalog', href: '/snacks', icon: Package },
    { name: 'My Favourites', href: '/favourites', icon: Heart },
    { name: 'My History', href: '/history', icon: Clock },
  ];

  const navItems = isAdmin ? adminNavItems : memberNavItems;

  return (
    <>
      <header className="sticky top-0 z-20 bg-pantry-surface/85 backdrop-blur-md border-b border-pantry-border px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-pantry-text hover:bg-pantry-subtle transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <UtensilsCrossed className="w-5 h-5 text-coral" />
            <span className="font-black text-pantry-text tracking-tight text-sm">Snack Overflow</span>
          </div>
        </div>

        {/* Right: Actions, Theme Switcher, Basket, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Member Basket Trigger */}
          {!isAdmin && user && (
            <button
              type="button"
              onClick={toggleDrawer}
              aria-label="Open snack basket"
              className="relative p-2 rounded-xl border border-pantry-border bg-pantry-surface text-gray-600 dark:text-gray-300 hover:text-navy-950 dark:hover:text-white hover:bg-pantry-subtle transition-all duration-150 flex items-center justify-center shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-coral" />
              {totalPackets > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-coral text-white shadow-xs animate-in zoom-in-75">
                  {totalPackets}
                </span>
              )}
            </button>
          )}

          {/* Real-time Live Sync Indicator */}
          {user && (
            <div
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border border-pantry-border bg-pantry-surface/80"
              title={isConnected ? 'Real-time live updates connected' : 'Connecting to real-time live updates...'}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  isConnected
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-400'
                )}
              />
              <span className="text-gray-500 dark:text-gray-400">
                {isConnected ? 'Live' : 'Syncing'}
              </span>
            </div>
          )}

          {/* Global Theme Toggle */}
          <ThemeToggle />

          {/* User Status Bar */}
          {user && (
            <div className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-pantry-border">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-pantry-text leading-tight">{user.name}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[140px]">
                  {user.email}
                </span>
              </div>
              <RoleBadge role={user.role} />
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-navy-950/40 dark:bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-pantry-surface border-r border-pantry-border p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-pantry-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-coral/10 flex items-center justify-center text-coral">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <span className="font-black text-pantry-text tracking-tight text-base">
                    Snack Overflow
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-pantry-text hover:bg-pantry-subtle"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors',
                        isActive
                          ? 'bg-navy-900 text-white dark:bg-coral dark:text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-300 hover:text-pantry-text hover:bg-pantry-subtle'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', isActive ? 'text-coral dark:text-white' : 'text-gray-400')} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {!isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      toggleDrawer();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-pantry-subtle transition-colors mt-2 border border-dashed border-pantry-border"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 text-coral" />
                      <span>Snack Basket</span>
                    </div>
                    {totalPackets > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-coral text-white">
                        {totalPackets}
                      </span>
                    )}
                  </button>
                )}
              </nav>
            </div>

            {user && (
              <div className="pt-4 border-t border-pantry-border space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-navy-900 dark:bg-coral text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <p className="text-xs font-bold text-pantry-text truncate">{user.name}</p>
                    <RoleBadge role={user.role} />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
