'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { StatusBadge, CategoryBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Snack } from '../../types/index';
import { Heart, Utensils, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SnackCardProps {
  snack: Snack;
  onConsume: (snack: Snack, amount: number) => Promise<void>;
  onVoteToggle: (snack: Snack) => Promise<void>;
  isConsuming?: boolean;
  isVoting?: boolean;
}

export function SnackCard({
  snack,
  onConsume,
  onVoteToggle,
  isConsuming = false,
  isVoting = false,
}: SnackCardProps) {
  const isOut = snack.quantity === 0;

  return (
    <Card className="flex flex-col justify-between group hover:shadow-md transition-all">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={snack.category} />
          <StatusBadge status={snack.status} />
        </div>

        {/* Snack Title and Stock count */}
        <div className="mt-4">
          <h3 className="text-lg font-extrabold text-navy-900 group-hover:text-coral transition-colors tracking-tight">
            {snack.name}
          </h3>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span
              className={cn(
                'text-2xl font-black tracking-tight',
                isOut ? 'text-gray-400' : 'text-navy-900'
              )}
            >
              {snack.quantity}
            </span>
            <span className="text-xs text-gray-500 font-medium">packets remaining</span>
          </div>
        </div>

        {/* Low Stock Warning pill if running low */}
        {snack.status === 'RUNNING_LOW' && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/50">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Running low — grab one before it’s gone!</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-pantry-border/80 flex items-center gap-2">
        <Button
          variant={isOut ? 'outline' : 'coral'}
          size="sm"
          className="flex-1 font-semibold"
          disabled={isOut || isConsuming}
          isLoading={isConsuming}
          onClick={() => onConsume(snack, 1)}
          icon={<Utensils className="w-4 h-4" />}
        >
          {isOut ? 'Out of Stock' : 'Grab 1 Packet'}
        </Button>

        <button
          onClick={() => onVoteToggle(snack)}
          disabled={isVoting}
          title={snack.hasVoted ? 'Remove vote' : 'Vote for this snack'}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95',
            snack.hasVoted
              ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-xs'
              : 'bg-white text-gray-600 border-pantry-border hover:bg-pantry-subtle hover:text-navy-900'
          )}
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-transform',
              snack.hasVoted ? 'fill-rose-500 text-rose-500 scale-110' : 'text-gray-400'
            )}
          />
          <span>{snack.voteCount}</span>
        </button>
      </div>
    </Card>
  );
}
