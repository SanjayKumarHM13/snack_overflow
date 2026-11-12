'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../ui/Badge';
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Boxes,
  History,
  LogOut,
  UtensilsCrossed,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Snacks Catalog', href: '/snacks', icon: Package },
    ...(isAdmin
      ? [
          { name: 'Inventory Manager', href: '/admin', icon: Boxes },
          { name: 'Activity Log', href: '/activities', icon: History },
        ]
      : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-pantry-border px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-navy-900 hover:bg-pantry-subtle"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <UtensilsCrossed className="w-5 h-5 text-coral" />
            <span className="font-extrabold text-navy-900 tracking-tight text-sm">Snack Overflow</span>
          </div>
        </div>

        {/* User Status Bar */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Signed in as</span>
              <span className="text-xs font-bold text-navy-900">{user.email}</span>
            </div>
            <RoleBadge role={user.role} />
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-navy-950/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white p-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-pantry-border">
                <div className="flex items-center gap-2.5">
                  <UtensilsCrossed className="w-5 h-5 text-coral" />
                  <span className="font-extrabold text-navy-900 tracking-tight text-base">Snack Overflow</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-pantry-subtle"
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
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                        isActive
                          ? 'bg-navy-900 text-white'
                          : 'text-gray-600 hover:text-navy-900 hover:bg-pantry-subtle'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', isActive ? 'text-coral' : 'text-gray-400')} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {user && (
              <div className="pt-4 border-t border-pantry-border space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-navy-900 truncate">{user.name}</p>
                    <RoleBadge role={user.role} />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
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
