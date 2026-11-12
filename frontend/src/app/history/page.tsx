'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { activityService } from '../../services/activity.service';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import Link from 'next/link';
import { History, Utensils, AlertCircle, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

export default function MemberHistoryPage() {
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-activities', page, limit],
    queryFn: () => activityService.listMyActivities(page, limit),
  });

  const activities = data?.data ?? [];
  const pagination = data?.pagination;

  const formatTimestamp = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Hero Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-pantry-text tracking-tight">
                My Consumption History
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-coral/10 text-coral border border-coral/20">
                <History className="w-3.5 h-3.5" />
                Personal Log
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your personal record of snacks and drinks consumed from the office pantry.
            </p>
          </div>

          <Link href="/snacks">
            <Button variant="coral" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Pantry Catalog
            </Button>
          </Link>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="bg-pantry-surface rounded-3xl border border-pantry-border p-5 space-y-3 shadow-xs">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center">
            <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">Unable to load consumption history</h3>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">Please try refreshing the page.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && activities.length === 0 && (
          <div className="bg-pantry-surface rounded-3xl border border-pantry-border p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-coral/10 text-coral text-3xl flex items-center justify-center mx-auto mb-3">
              ☕
            </div>
            <h3 className="text-base font-bold text-pantry-text">No snack history yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Whenever you consume a snack or basket from the catalog, your personal consumption log will be recorded here.
            </p>
            <Link href="/snacks" className="inline-block mt-4">
              <Button variant="coral" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Browse Catalog
              </Button>
            </Link>
          </div>
        )}

        {/* History Table */}
        {!isLoading && !isError && activities.length > 0 && (
          <div className="bg-pantry-surface rounded-3xl border border-pantry-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-pantry-border bg-pantry-subtle/50 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="py-4 px-5">Timestamp</th>
                    <th className="py-4 px-5">Snack Item</th>
                    <th className="py-4 px-5">Quantity Grabbed</th>
                    <th className="py-4 px-5">Event</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pantry-border/60">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-pantry-subtle/30 transition-colors">
                      <td className="py-4 px-5 font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatTimestamp(act.createdAt)}
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-extrabold text-pantry-text text-sm">
                          {act.snackName}
                        </span>
                        {!act.snackId && (
                          <span className="ml-2 text-[10px] font-normal text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                            Discontinued
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 font-black text-coral text-sm bg-coral/10 dark:bg-coral/20 px-2.5 py-0.5 rounded-lg border border-coral/20">
                          <Utensils className="w-3 h-3" />
                          {act.amount} pkt{act.amount === 1 ? '' : 's'}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-coral/10 text-coral border border-coral/20">
                          Consumed
                        </span>
                      </td>
                    </tr>
                  ))}
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
              {pagination.totalItems} total items consumed)
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
