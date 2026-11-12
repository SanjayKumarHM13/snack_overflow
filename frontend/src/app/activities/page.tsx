'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { activityService } from '../../services/activity.service';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { History, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, Utensils, PackagePlus, AlertCircle } from 'lucide-react';
import { ActivityAction } from '../../types/index';

export default function ActivitiesPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState<ActivityAction | ''>('');
  const limit = 20;

  const { data, isLoading, isRefetching, refetch, isError } = useQuery({
    queryKey: ['admin-activities', page, limit],
    queryFn: () => activityService.listActivities(page, limit),
  });

  const rawActivities = data?.data ?? [];
  const pagination = data?.pagination;

  // Filter client-side if selected
  const activities = actionFilter
    ? rawActivities.filter((act) => act.action === actionFilter)
    : rawActivities;

  const formatTimestamp = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <AppShell requireAdmin>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-pantry-text tracking-tight">
                Pantry Activity Audit Log
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-900 dark:bg-navy-700 text-white">
                <ShieldCheck className="w-3.5 h-3.5" />
                Audit Trail
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Immutable historical log of all snack consumptions and administrative restocks.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />}
            >
              Refresh Logs
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActionFilter('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              actionFilter === ''
                ? 'bg-navy-900 text-white border-navy-900 dark:bg-navy-700 dark:border-navy-600'
                : 'bg-pantry-surface text-gray-500 dark:text-gray-400 border-pantry-border hover:bg-pantry-subtle'
            }`}
          >
            All Actions ({rawActivities.length})
          </button>
          <button
            onClick={() => setActionFilter('CONSUMED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              actionFilter === 'CONSUMED'
                ? 'bg-coral text-white border-coral'
                : 'bg-pantry-surface text-gray-500 dark:text-gray-400 border-pantry-border hover:bg-pantry-subtle'
            }`}
          >
            Consumed Only
          </button>
          <button
            onClick={() => setActionFilter('RESTOCKED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              actionFilter === 'RESTOCKED'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-pantry-surface text-gray-500 dark:text-gray-400 border-pantry-border hover:bg-pantry-subtle'
            }`}
          >
            Restocked Only
          </button>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="bg-pantry-surface rounded-3xl border border-pantry-border p-4 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error Fallback */}
        {isError && !isLoading && (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center">
            <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">Unable to load activity log</h3>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">Please try refreshing the page.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && activities.length === 0 && (
          <div className="bg-pantry-surface rounded-3xl border border-pantry-border p-12 text-center shadow-xs">
            <History className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-pantry-text">No activity records found</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Events will appear as employees consume or admins restock pantry snacks.
            </p>
          </div>
        )}

        {/* Activities Table */}
        {!isLoading && !isError && activities.length > 0 && (
          <div className="bg-pantry-surface rounded-3xl border border-pantry-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-pantry-border bg-pantry-subtle/50 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="py-4 px-5">Timestamp</th>
                    <th className="py-4 px-5">Action</th>
                    <th className="py-4 px-5">Snack Item</th>
                    <th className="py-4 px-5">Quantity</th>
                    <th className="py-4 px-5">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pantry-border/60">
                  {activities.map((act) => {
                    const isConsumed = act.action === 'CONSUMED';
                    return (
                      <tr key={act.id} className="hover:bg-pantry-subtle/30 transition-colors">
                        <td className="py-4 px-5 font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {formatTimestamp(act.createdAt)}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border ${
                              isConsumed
                                ? 'bg-coral/10 text-coral border-coral/20'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60'
                            }`}
                          >
                            {isConsumed ? (
                              <Utensils className="w-3 h-3" />
                            ) : (
                              <PackagePlus className="w-3 h-3" />
                            )}
                            {act.action}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-extrabold text-pantry-text text-sm">
                          {act.snackName}
                          {!act.snackId && (
                            <span className="ml-2 text-[10px] font-normal text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                              Archived/Deleted
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`font-black text-sm ${
                              isConsumed ? 'text-coral' : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {isConsumed ? `-${act.amount}` : `+${act.amount}`}
                          </span>{' '}
                          <span className="text-gray-400 dark:text-gray-500 font-medium">packet(s)</span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-semibold text-pantry-text">{act.userName}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-pantry-border text-xs text-gray-500 dark:text-gray-400">
            <div>
              Showing page <span className="font-bold text-pantry-text">{pagination.page}</span> of{' '}
              <span className="font-bold text-pantry-text">{pagination.totalPages}</span> (
              {pagination.totalItems} total logs)
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <span className="px-2 font-semibold text-pantry-text">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                icon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
