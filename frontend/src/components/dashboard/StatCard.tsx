import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatCard({ title, value, subtitle, icon, variant = 'default' }: StatCardProps) {
  const iconBg = {
    default: 'bg-navy-900/5 text-navy-900',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-extrabold text-navy-900 mt-2 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={cn('p-3 rounded-xl flex items-center justify-center', iconBg[variant])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
