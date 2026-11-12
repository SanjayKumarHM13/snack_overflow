'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snackService } from '../../services/snack.service';
import { AppShell } from '../../components/layout/AppShell';
import { SnackCard } from '../../components/snacks/SnackCard';
import { SnackFilters } from '../../components/snacks/SnackFilters';
import { ConsumeModal } from '../../components/snacks/ConsumeModal';
import { useToast } from '../../context/ToastContext';
import { Snack, SnackCategory, SnackStatus } from '../../types/index';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { ApiClientError } from '../../services/api';
import { ChevronLeft, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

export default function SnacksPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<SnackCategory | ''>('');
  const [status, setStatus] = useState<SnackStatus | ''>('');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'votes'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const limit = 12;

  // Modals state
  const [consumingSnack, setConsumingSnack] = useState<Snack | null>(null);
  const [activeConsumeId, setActiveConsumeId] = useState<string | null>(null);
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

  // Consume Handler
  const handleConsume = async (snack: Snack, amount: number) => {
    setActiveConsumeId(snack.id);
    try {
      await snackService.consume(snack.id, amount);
      toast.success(`Enjoy! Grabbed ${amount} packet${amount > 1 ? 's' : ''} of ${snack.name}.`);
      setConsumingSnack(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['snacks'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
      ]);
    } catch (err: unknown) {
      if (err instanceof ApiClientError && err.status === 409) {
        toast.error('Someone beat you to the last packet! Please refresh the inventory.');
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to grab snack. Please try again.');
      }
      queryClient.invalidateQueries({ queryKey: ['snacks'] });
    } finally {
      setActiveConsumeId(null);
    }
  };

  // Vote Toggle Handler
  const handleVoteToggle = async (snack: Snack) => {
    setActiveVoteId(snack.id);
    try {
      if (snack.hasVoted) {
        await snackService.unvote(snack.id);
        toast.info(`Removed vote for ${snack.name}`);
      } else {
        await snackService.vote(snack.id);
        toast.success(`Voted for ${snack.name}! ❤️`);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['snacks'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
      ]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to update vote.');
      }
    } finally {
      setActiveVoteId(null);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Pantry Snack Catalog
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Browse current inventory, grab what you need, and vote for your favourites.
            </p>
          </div>
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
              <Skeleton key={i} className="h-56 rounded-2xl w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-rose-950">Unable to load snacks</h3>
            <p className="text-xs text-rose-700 mt-1">Check your network or server connection.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
              Retry
            </Button>
          </div>
        )}

        {/* Empty Catalog State */}
        {!isLoading && !isError && snacks.length === 0 && (
          <div className="bg-white rounded-3xl border border-pantry-border p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-coral/10 text-coral text-2xl flex items-center justify-center mx-auto mb-3">
              🔍
            </div>
            <h3 className="text-base font-bold text-navy-900">No snacks match your filters</h3>
            <p className="text-xs text-gray-500 mt-1">
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
                onConsume={handleConsume}
                onVoteToggle={handleVoteToggle}
                isConsuming={activeConsumeId === snack.id}
                isVoting={activeVoteId === snack.id}
              />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-pantry-border text-xs text-gray-500">
            <div>
              Showing <span className="font-bold text-navy-900">{snacks.length}</span> of{' '}
              <span className="font-bold text-navy-900">{pagination.totalItems}</span> snacks
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
              <span className="px-2 font-semibold text-navy-900">
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

      {/* Consume Modal */}
      {consumingSnack && (
        <ConsumeModal
          isOpen={!!consumingSnack}
          onClose={() => setConsumingSnack(null)}
          snack={consumingSnack}
          onConfirm={(snack, amt) => handleConsume(snack, amt)}
          isLoading={activeConsumeId === consumingSnack.id}
        />
      )}
    </AppShell>
  );
}
