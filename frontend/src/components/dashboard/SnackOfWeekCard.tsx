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
      <Card className="bg-gradient-to-br from-amber-50/50 via-white to-white border-amber-200/60 p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100/70 rounded-xl text-amber-700">
            <Trophy className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-navy-900">Snack of the Week</h3>
            <p className="text-xs text-gray-500">Weekly leaderboard based on employee votes</p>
          </div>
        </div>

        <div className="my-6 text-center py-4 bg-amber-50/30 rounded-xl border border-dashed border-amber-200/80">
          <p className="text-sm font-semibold text-gray-700">No votes cast yet this week!</p>
          <p className="text-xs text-gray-500 mt-1">Be the first to vote for your favourite pantry snack.</p>
        </div>

        <Link href="/snacks" className="w-full">
          <Button variant="outline" size="sm" className="w-full border-amber-300 text-amber-900 hover:bg-amber-50">
            Vote in Catalog <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-50/30 to-white border-amber-300/80 shadow-sm p-6 flex flex-col justify-between">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm shadow-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 block">
                Office Favourite
              </span>
              <h3 className="text-base font-extrabold text-navy-900">Snack of the Week</h3>
            </div>
          </div>
          <CategoryBadge category={snack.category} />
        </div>

        <div className="mt-5 p-4 rounded-xl bg-white border border-amber-200/80 shadow-xs">
          <h4 className="text-xl font-black text-navy-900 tracking-tight">{snack.name}</h4>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-600">
              <strong className="text-navy-900 font-bold">{snack.quantity}</strong> packets remaining
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-coral bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              <Heart className="w-3 h-3 fill-coral text-coral" />
              {snack.weeklyVotes} votes this week
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/snacks" className="block w-full">
          <Button variant="coral" size="sm" className="w-full">
            View & Consume in Catalog <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
