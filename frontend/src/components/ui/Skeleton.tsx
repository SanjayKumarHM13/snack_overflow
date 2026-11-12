import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-pantry-border/60', className)}
      {...props}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-white border border-pantry-border shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function SnackCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-white border border-pantry-border shadow-sm space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="pt-2 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 w-12 rounded-xl" />
      </div>
    </div>
  );
}
