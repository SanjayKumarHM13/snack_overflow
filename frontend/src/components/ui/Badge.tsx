import React from 'react';
import { cn } from '../../lib/utils';
import { SnackCategory, SnackStatus, Role } from '../../types/index';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, User as UserIcon } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, className }: { status: SnackStatus; className?: string }) {
  if (status === 'STOCKED') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/60',
          className
        )}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        STOCKED
      </span>
    );
  }

  if (status === 'RUNNING_LOW') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-amber-50 text-amber-800 border border-amber-200/80',
          className
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        RUNNING LOW
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-rose-50 text-rose-700 border border-rose-200/60',
        className
      )}
    >
      <XCircle className="w-3.5 h-3.5 text-rose-600" />
      OUT OF STOCK
    </span>
  );
}

export function CategoryBadge({ category, className }: { category: SnackCategory; className?: string }) {
  const configs: Record<SnackCategory, { label: string; icon: string; classes: string }> = {
    SWEET: { label: 'Sweet', icon: '🍫', classes: 'bg-pink-50 text-pink-700 border-pink-200/60' },
    SAVOURY: { label: 'Savoury', icon: '🥨', classes: 'bg-amber-50 text-amber-800 border-amber-200/60' },
    DRINK: { label: 'Drink', icon: '🧃', classes: 'bg-blue-50 text-blue-700 border-blue-200/60' },
    HEALTHY_ISH: { label: 'Healthy-ish', icon: '🥗', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
  };

  const config = configs[category] || { label: category, icon: '🍿', classes: 'bg-gray-50 text-gray-700 border-gray-200' };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.classes,
        className
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  if (role === 'ADMIN') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-navy-900 text-white',
          className
        )}
      >
        <ShieldCheck className="w-3 h-3 text-coral" />
        ADMIN
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium tracking-wide bg-pantry-subtle text-navy-800 border border-pantry-border',
        className
      )}
    >
      <UserIcon className="w-3 h-3 text-gray-500" />
      MEMBER
    </span>
  );
}
