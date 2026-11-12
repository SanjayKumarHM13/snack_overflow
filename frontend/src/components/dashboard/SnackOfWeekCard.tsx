'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { CategoryBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Trophy, Heart, ArrowRight } from 'lucide-react';
import { SnackCategory } from '../../types/index';

interface SnackOfWeekProps {
  snack: {
    id: string;
    name: string;
    category: SnackCategory;
    quantity: number;
    weeklyVotes: number;
  } | null;
}

export function SnackOfWeekCard({ snack }: SnackOfWeekProps) {
  if (!snack) {
    return (
      <Card className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-300/40 p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-pantry-text">Snack of the Week</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Weekly leaderboard based on team votes</p>
          </div>
        </div>

        <div className="my-6 text-center py-5 bg-pantry-subtle rounded-2xl border border-dashed border-pantry-border">
          <p className="text-sm font-semibold text-pantry-text">No votes cast yet this week</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Votes will highlight the top office snack here.</p>
        </div>

        <Link href="/snacks" className="w-full">
          <Button variant="outline" size="sm" className="w-full" icon={<ArrowRight className="w-3.5 h-3.5" />}>
            View Catalog
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border-amber-300/50 shadow-sm p-6 flex flex-col justify-between">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm shadow-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-300 block">
                Office Favourite
              </span>
              <h3 className="text-base font-extrabold text-pantry-text">Snack of the Week</h3>
            </div>
          </div>
          <CategoryBadge category={snack.category} />
        </div>

        <div className="mt-5 p-4 rounded-2xl bg-pantry-surface border border-amber-200 dark:border-amber-900/60 shadow-xs">
          <h4 className="text-xl font-black text-pantry-text tracking-tight">{snack.name}</h4>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-500 dark:text-gray-400">
              <strong className="text-pantry-text font-bold">{snack.quantity}</strong> packets remaining
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-coral bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/60">
              <Heart className="w-3 h-3 fill-coral text-coral" />
              {snack.weeklyVotes} votes this week
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/snacks" className="block w-full">
          <Button variant="coral" size="sm" className="w-full" icon={<ArrowRight className="w-3.5 h-3.5" />}>
            View in Catalog
          </Button>
        </Link>
      </div>
    </Card>
  );
}
