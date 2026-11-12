'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { snackService } from '../../services/snack.service';
import { AppShell } from '../../components/layout/AppShell';
import { SnackCard } from '../../components/snacks/SnackCard';
import { SnackFilters } from '../../components/snacks/SnackFilters';
import { useToast } from '../../context/ToastContext';
import { useBasket } from '../../context/BasketContext';
import { Snack, SnackCategory, SnackStatus } from '../../types/index';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, ChevronRight, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react';

export default function SnacksPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { totalItems, openBasket } = useBasket();

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<SnackCategory | ''>('');
  const [status, setStatus] = useState<SnackStatus | ''>('');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'votes'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const limit = 12;

  // Active vote state for spinner feedback
  const [activeVoteId, setActiveVoteId] = useState<string | null>(null);

  // Query Snacks
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['snacks', { search, category, status, sortBy, sortOrder, page, limit }],
    queryFn: () =>
      snackService.getSnacks({
        search: search.trim() || undefined,
        category: category || undefined,
        status: status || undefined,
        sortBy,
        sortOrder,
        page,
        limit,
      }),
  });

  const snacks = data?.data ?? [];
  const pagination = data?.pagination;

  // Vote Toggle Handler
  const handleVoteToggle = async (snack: Snack) => {
    setActiveVoteId(snack.id);
    try {
      if (snack.hasVoted) {
        await snackService.unvote(snack.id);
        toast.info(`Removed favourite for ${snack.name}`);
      } else {
        await snackService.vote(snack.id);
        toast.success(`Added ${snack.name} to favourites! ❤️`);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['snacks'] }),
        queryClient.invalidateQueries({ queryKey: ['favourites'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
      ]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to update favourite.');
      }
    } finally {
      setActiveVoteId(null);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Hero Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-pantry-text tracking-tight">
                Pantry Snack Catalog
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-coral/10 text-coral border border-coral/20">
                <Sparkles className="w-3 h-3" />
                Live Stock
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Browse available pantry items, build your snack basket, and vote for your favourites.
            </p>
          </div>

          {totalItems > 0 && (
            <Button
              variant="coral"
              size="sm"
              onClick={openBasket}
              icon={<ShoppingBag className="w-4 h-4" />}
              className="shadow-md animate-in fade-in"
            >
              View Basket ({totalItems} item{totalItems === 1 ? '' : 's'})
            </Button>
          )}
        </div>

        {/* Filters */}
        <SnackFilters
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          category={category}
          onCategoryChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
          status={status}
          onStatusChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          sortBy={sortBy}
          onSortByChange={(v) => {
            setSortBy(v);
            setPage(1);
          }}
          sortOrder={sortOrder}
          onSortOrderChange={(v) => {
            setSortOrder(v);
            setPage(1);
          }}
        />

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-64 rounded-3xl w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center">
            <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">Unable to load snacks</h3>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">Check your network or server connection.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
              Retry
            </Button>
          </div>
        )}

        {/* Empty Catalog State */}
        {!isLoading && !isError && snacks.length === 0 && (
          <div className="bg-pantry-surface rounded-3xl border border-pantry-border p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-coral/10 text-coral text-3xl flex items-center justify-center mx-auto mb-3">
              🍿
            </div>
            <h3 className="text-base font-bold text-pantry-text">No snacks match your filters</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Try adjusting your search keywords, category or stock status filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setCategory('');
                setStatus('');
                setPage(1);
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Snacks Grid */}
        {!isLoading && !isError && snacks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {snacks.map((snack) => (
              <SnackCard
                key={snack.id}
                snack={snack}
                onVoteToggle={handleVoteToggle}
                isVoting={activeVoteId === snack.id}
              />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-pantry-border text-xs text-gray-500 dark:text-gray-400">
            <div>
              Showing <span className="font-bold text-pantry-text">{snacks.length}</span> of{' '}
              <span className="font-bold text-pantry-text">{pagination.totalItems}</span> snacks
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
