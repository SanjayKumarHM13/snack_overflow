'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../ui/Badge';
import {
  LayoutDashboard,
  Package,
  Boxes,
  History,
  LogOut,
  UtensilsCrossed,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
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
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-pantry-border min-h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-pantry-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral shadow-sm">
          <UtensilsCrossed className="w-5 h-5 text-coral" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-navy-900 tracking-tight flex items-center gap-1.5">
            Snack Overflow
          </h1>
          <p className="text-[11px] font-medium text-gray-500">Pantry SaaS • v1.0</p>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 px-3 py-6 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Pantry Hub
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all select-none',
                isActive
                  ? 'bg-navy-900 text-white shadow-sm shadow-navy-900/10'
                  : 'text-gray-600 hover:text-navy-900 hover:bg-pantry-subtle'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-coral' : 'text-gray-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User Profile Tray */}
      {user && (
        <div className="p-4 border-t border-pantry-border bg-pantry-bg/40">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white border border-pantry-border shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-navy-900 truncate">{user.name}</p>
                <div className="mt-0.5">
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Log out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
