'use client';

import React, { useState } from 'react';
import { useBasket } from '../../context/BasketContext';
import { snackService } from '../../services/snack.service';
import { useToast } from '../../context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/Button';
import { CategoryBadge } from '../ui/Badge';
import { ApiClientError } from '../../services/api';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Utensils,
  AlertTriangle,
  ArrowRight,
  Package,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function BasketDrawer() {
  const {
    items,
    totalPackets,
    uniqueCount,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeItem,
    clearBasket,
  } = useBasket();

  const toast = useToast();
  const queryClient = useQueryClient();
  const [isConsuming, setIsConsuming] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isDrawerOpen) return null;

  const handleConfirmConsumption = async () => {
    if (items.length === 0) return;
    setErrorMessage('');
    setIsConsuming(true);

    try {
      const payload = items.map((i) => ({
        snackId: i.snackId,
        amount: i.amount,
      }));

      const res = await snackService.consumeBasket(payload);
      toast.success(res.message || `Successfully consumed ${totalPackets} packet(s)!`);
      clearBasket();
      setIsDrawerOpen(false);

      // Invalidate queries so inventory & history refresh
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['snacks'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
        queryClient.invalidateQueries({ queryKey: ['my-activities'] }),
        queryClient.invalidateQueries({ queryKey: ['favourites'] }),
      ]);
    } catch (err: unknown) {
      if (err instanceof ApiClientError && err.status === 409) {
        setErrorMessage(err.message || 'Someone grabbed the last packet! Please adjust your basket.');
        toast.error(err.message || 'Stock discrepancy detected. Please review your basket.');
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
        toast.error(err.message);
      } else {
        setErrorMessage('Failed to consume basket. Please try again.');
        toast.error('Failed to consume basket.');
      }
      // Invalidate snacks to get fresh available numbers
      queryClient.invalidateQueries({ queryKey: ['snacks'] });
    } finally {
      setIsConsuming(false);
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'SWEET':
        return '🍫';
      case 'SAVOURY':
        return '🥨';
      case 'DRINK':
        return '🧃';
      case 'HEALTHY_ISH':
        return '🥗';
      default:
        return '🍿';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/40 dark:bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-pantry-surface border-l border-pantry-border shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-5 border-b border-pantry-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-coral/10 text-coral">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-pantry-text tracking-tight">
                  Snack Basket
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {uniqueCount === 0
                    ? 'Empty'
                    : `${uniqueCount} snack variety(ies) • ${totalPackets} packet(s)`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-pantry-subtle transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Error banner if concurrency issue occurred */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
                <div className="w-16 h-16 rounded-3xl bg-pantry-subtle flex items-center justify-center text-3xl mb-4 shadow-inner">
                  🧺
                </div>
                <h4 className="text-base font-bold text-pantry-text">Your basket is empty</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs mt-1.5 leading-relaxed">
                  Browse the catalog, add your favourite snacks, and consume them together in one
                  go.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-6"
                  icon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Browse Catalog
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const isMaxReached = item.amount >= item.availableQuantity;

                  return (
                    <div
                      key={item.snackId}
                      className="p-3.5 rounded-2xl bg-pantry-subtle/40 dark:bg-pantry-subtle/20 border border-pantry-border flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-pantry-surface border border-pantry-border flex items-center justify-center text-lg shrink-0 shadow-xs">
                          {getCategoryEmoji(item.category)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-pantry-text truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400">
                              {item.availableQuantity} in pantry
                            </span>
                            {isMaxReached && (
                              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-900">
                                Max
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Stepper */}
                        <div className="flex items-center rounded-xl bg-pantry-surface border border-pantry-border shadow-xs overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.snackId, item.amount - 1)}
                            className="p-1.5 text-gray-500 hover:text-navy-950 dark:hover:text-white hover:bg-pantry-subtle transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-black text-pantry-text min-w-[24px] text-center">
                            {item.amount}
                          </span>
                          <button
                            type="button"
                            disabled={isMaxReached}
                            onClick={() => updateQuantity(item.snackId, item.amount + 1)}
                            className="p-1.5 text-gray-500 hover:text-navy-950 dark:hover:text-white hover:bg-pantry-subtle transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.snackId)}
                          className="p-2 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                          title="Remove from basket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-pantry-border bg-pantry-subtle/20 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Total Packets</span>
                <span className="text-base font-black text-pantry-text">
                  {totalPackets} packet{totalPackets > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearBasket}
                  disabled={isConsuming}
                  className="text-xs text-gray-500 hover:text-rose-600 dark:hover:text-rose-400"
                >
                  Clear All
                </Button>

                <Button
                  type="button"
                  variant="coral"
                  className="flex-1 font-bold shadow-md"
                  onClick={handleConfirmConsumption}
                  isLoading={isConsuming}
                  icon={<Utensils className="w-4 h-4" />}
                >
                  Confirm Consumption ({totalPackets})
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
