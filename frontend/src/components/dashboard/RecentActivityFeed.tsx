import React from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { History, ShoppingBag, PlusCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActivityItem {
  id: string;
  action: 'CONSUMED' | 'RESTOCKED';
  amount: number;
  snackName: string;
  userName: string;
  createdAt: string | Date;
}

export function RecentActivityFeed({ activities }: { activities: ActivityItem[] }) {
  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-pantry-text" />
          <CardTitle>Recent Pantry Activity</CardTitle>
        </div>
      </CardHeader>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm font-semibold text-pantry-text">No recent activity</p>
          <p className="text-xs mt-1">Snack consumptions and restocks will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => {
            const isConsumed = act.action === 'CONSUMED';
            return (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-pantry-subtle/50 border border-pantry-border/60 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-xl',
                      isConsumed
                        ? 'bg-coral/10 text-coral'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    )}
                  >
                    {isConsumed ? (
                      <ShoppingBag className="w-4 h-4" />
                    ) : (
                      <PlusCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-pantry-text">
                      {act.userName}{' '}
                      <span className="font-normal text-gray-500 dark:text-gray-400">
                        {isConsumed ? 'consumed' : 'restocked'}
                      </span>{' '}
                      <span className="font-bold text-pantry-text">{act.amount}x</span> {act.snackName}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{formatTime(act.createdAt)}</p>
                  </div>
                </div>

                <span
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider text-[10px]',
                    isConsumed
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60'
                  )}
                >
                  {act.action}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
