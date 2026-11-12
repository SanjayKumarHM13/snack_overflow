'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { snackService } from '../../services/snack.service';
import { AppShell } from '../../components/layout/AppShell';
import { SnackCard } from '../../components/snacks/SnackCard';
import { useToast } from '../../context/ToastContext';
import { useBasket } from '../../context/BasketContext';
import { Snack } from '../../types/index';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';
import { Heart, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function FavouritesPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { totalItems, openBasket } = useBasket();
  const [activeVoteId, setActiveVoteId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['favourites'],
    queryFn: () => snackService.getFavourites(),
  });

  const snacks = data?.data ?? [];

  // Vote Toggle Handler
  const handleVoteToggle = async (snack: Snack) => {
    setActiveVoteId(snack.id);
    try {
      if (snack.hasVoted) {
        await snackService.unvote(snack.id);
        toast.info(`Removed ${snack.name} from your favourites`);
      } else {
        await snackService.vote(snack.id);
        toast.success(`Added ${snack.name} to favourites! ❤️`);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['favourites'] }),
        queryClient.invalidateQueries({ queryKey: ['snacks'] }),
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
                My Favourite Snacks
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                {snacks.length} saved
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Quickly reorder the office snacks and drinks you enjoy the most.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {totalItems > 0 && (
              <Button
                variant="coral"
                size="sm"
                onClick={openBasket}
                icon={<ShoppingBag className="w-4 h-4" />}
                className="shadow-md"
              >
                Basket ({totalItems})
              </Button>
            )}
            <Link href="/snacks">
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Browse All Snacks
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 rounded-3xl w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center">
            <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">Unable to load favourites</h3>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">Please try again shortly.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && snacks.length === 0 && (
          <div className="bg-pantry-surface rounded-3xl border border-pantry-border p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 text-3xl flex items-center justify-center mx-auto mb-3">
              ❤️
            </div>
            <h3 className="text-base font-bold text-pantry-text">No favourites added yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Explore the pantry catalog and click the heart icon on any snack you love to pin it here.
            </p>
            <Link href="/snacks" className="inline-block mt-4">
              <Button variant="coral" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Discover Snacks
              </Button>
            </Link>
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
      </div>
    </AppShell>
  );
}
