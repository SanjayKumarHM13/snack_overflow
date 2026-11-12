'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { StatusBadge, CategoryBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Snack, SnackCategory } from '../../types/index';
import { useBasket } from '../../context/BasketContext';
import { Heart, Plus, Minus, ShoppingBag, Check, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SnackCardProps {
  snack: Snack;
  onVoteToggle: (snack: Snack) => Promise<void>;
  isVoting?: boolean;
}

export function SnackCard({ snack, onVoteToggle, isVoting = false }: SnackCardProps) {
  const { addItem, updateQuantity, getItemAmount } = useBasket();
  const isOut = snack.quantity === 0;
  const inBasketAmount = getItemAmount(snack.id);
  const isMaxInBasket = inBasketAmount >= snack.quantity;

  const categoryVisuals: Record<
    SnackCategory,
    { gradient: string; emoji: string; accentColor: string }
  > = {
    SWEET: {
      gradient: 'from-pink-500/10 via-rose-500/5 to-transparent dark:from-pink-900/20 dark:via-rose-900/10',
      emoji: '🍫',
      accentColor: 'text-pink-500',
    },
    SAVOURY: {
      gradient: 'from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-900/20 dark:via-orange-900/10',
      emoji: '🥨',
      accentColor: 'text-amber-500',
    },
    DRINK: {
      gradient: 'from-blue-500/10 via-cyan-500/5 to-transparent dark:from-blue-900/20 dark:via-cyan-900/10',
      emoji: '🧃',
      accentColor: 'text-blue-500',
    },
    HEALTHY_ISH: {
      gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-900/20 dark:via-teal-900/10',
      emoji: '🥗',
      accentColor: 'text-emerald-500',
    },
  };

  const visual = categoryVisuals[snack.category] || {
    gradient: 'from-gray-500/10 to-transparent',
    emoji: '🍿',
    accentColor: 'text-gray-500',
  };

  return (
    <Card className="flex flex-col justify-between group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border-pantry-border overflow-hidden p-5">
      <div>
        {/* Visual Graphic Header Banner */}
        <div
          className={cn(
            'h-32 w-full rounded-2xl bg-gradient-to-br flex flex-col justify-between p-3.5 border border-pantry-border/60 relative overflow-hidden',
            visual.gradient
          )}
        >
          {/* Top Badges */}
          <div className="flex items-center justify-between gap-1.5 z-10">
            <CategoryBadge category={snack.category} />
            <StatusBadge status={snack.status} />
          </div>

          {/* Decorative Centered Snack Emoji */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-5xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
              {visual.emoji}
            </span>
          </div>

          {/* Stock Indicator Pill */}
          <div className="z-10 flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-300">
            <span>Stock level</span>
            <span
              className={cn(
                'px-2 py-0.5 rounded-lg bg-pantry-surface/90 border border-pantry-border shadow-2xs font-extrabold',
                isOut ? 'text-gray-400' : 'text-pantry-text'
              )}
            >
              {snack.quantity} pkt{snack.quantity === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Snack Title and Subtitle */}
        <div className="mt-4">
          <h3 className="text-base font-extrabold text-pantry-text group-hover:text-coral transition-colors tracking-tight line-clamp-1">
            {snack.name}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {snack.category.replace('_', ' ')} • Reorder at ≤ {snack.lowStockThreshold} pkts
          </p>
        </div>

        {/* Low Stock Warning Pill */}
        {snack.status === 'RUNNING_LOW' && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-900/60">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Running low — add to basket soon!</span>
          </div>
        )}
      </div>

      {/* Action Footer: Add to Basket & Vote */}
      <div className="mt-5 pt-3.5 border-t border-pantry-border flex items-center gap-2">
        {isOut ? (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="flex-1 text-xs font-bold text-gray-400 dark:text-gray-600 border-pantry-border cursor-not-allowed"
          >
            Out of Stock
          </Button>
        ) : inBasketAmount > 0 ? (
          /* When already in basket: show quick stepper */
          <div className="flex-1 flex items-center justify-between rounded-2xl bg-coral/10 dark:bg-coral/20 border border-coral/30 px-2 py-1">
            <button
              type="button"
              onClick={() => updateQuantity(snack.id, inBasketAmount - 1)}
              className="p-1 rounded-lg text-coral hover:bg-coral/20 transition-colors"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-black text-coral flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              {inBasketAmount} in basket
            </span>
            <button
              type="button"
              disabled={isMaxInBasket}
              onClick={() => updateQuantity(snack.id, inBasketAmount + 1)}
              className="p-1 rounded-lg text-coral hover:bg-coral/20 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title={isMaxInBasket ? 'All stock in basket' : 'Add another packet'}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Primary Add to Basket Button */
          <Button
            variant="coral"
            size="sm"
            className="flex-1 text-xs font-bold shadow-xs hover:shadow-md transition-shadow"
            onClick={() => addItem(snack, 1)}
            icon={<ShoppingBag className="w-3.5 h-3.5" />}
          >
            Add to Basket
          </Button>
        )}

        {/* Heart Vote Button */}
        <button
          type="button"
          onClick={() => onVoteToggle(snack)}
          disabled={isVoting}
          title={snack.hasVoted ? 'Remove favourite' : 'Mark as favourite'}
          aria-label={snack.hasVoted ? 'Remove favourite' : 'Mark as favourite'}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold border transition-all active:scale-95',
            snack.hasVoted
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 shadow-xs'
              : 'bg-pantry-surface text-gray-500 dark:text-gray-400 border-pantry-border hover:bg-pantry-subtle hover:text-pantry-text'
          )}
        >
          <Heart
            className={cn(
              'w-3.5 h-3.5 transition-transform',
              snack.hasVoted ? 'fill-rose-500 text-rose-500 scale-110' : 'text-gray-400'
            )}
          />
          <span>{snack.voteCount}</span>
        </button>
      </div>
    </Card>
  );
}
