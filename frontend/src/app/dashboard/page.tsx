'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { snackService } from '../../services/snack.service';
import { useAuth } from '../../context/AuthContext';
import { AppShell } from '../../components/layout/AppShell';
import { StatCard } from '../../components/dashboard/StatCard';
import { SnackOfWeekCard } from '../../components/dashboard/SnackOfWeekCard';
import { StockAlerts } from '../../components/dashboard/StockAlerts';
import { RecentActivityFeed } from '../../components/dashboard/RecentActivityFeed';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';
import {
  Boxes,
  PackageCheck,
  AlertTriangle,
  Layers,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const {
    data: summary,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useQuery({
    queryKey: ['summary'],
    queryFn: () => snackService.getSummary(),
    refetchInterval: 20000,
  });

  return (
    <AppShell requireAdmin>
      <div className="space-y-6 sm:space-y-8">
        {/* Top Greeting & Action Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-pantry-text tracking-tight">
                Pantry Dashboard
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-900 text-white dark:bg-navy-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Overview
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome, {user?.name.split(' ')[0]}. Real-time inventory metrics, depletion warnings, and pantry audit feed.
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
              Refresh
            </Button>
            <Link href="/admin">
              <Button variant="coral" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Manage Inventory
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 rounded-3xl w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-72 rounded-3xl w-full lg:col-span-1" />
              <Skeleton className="h-72 rounded-3xl w-full lg:col-span-2" />
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {error && !isLoading && (
          <div className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-3xl text-center">
            <p className="text-sm font-bold text-rose-900 dark:text-rose-200">Failed to load pantry dashboard</p>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">
              Please check your connection or sign in again.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
              Retry
            </Button>
          </div>
        )}

        {/* Dashboard Content */}
        {summary && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Varieties"
                value={summary.totalSnackTypes}
                subtitle="Active snack options"
                icon={<Layers className="w-5 h-5" />}
                variant="default"
              />
              <StatCard
                title="Total Packets"
                value={summary.totalPackets}
                subtitle="Physical items in stock"
                icon={<Boxes className="w-5 h-5" />}
                variant="default"
              />
              <StatCard
                title="Well-Stocked"
                value={summary.stockedCount}
                subtitle="Above reorder threshold"
                icon={<PackageCheck className="w-5 h-5" />}
                variant="success"
              />
              <StatCard
                title="Needs Restock"
                value={summary.runningLowCount + summary.goneCount}
                subtitle={`${summary.runningLowCount} low, ${summary.goneCount} depleted`}
                icon={<AlertTriangle className="w-5 h-5" />}
                variant={summary.runningLowCount + summary.goneCount > 0 ? 'warning' : 'default'}
              />
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Snack of the Week & Admin Shortcuts */}
              <div className="space-y-6 lg:col-span-1 flex flex-col justify-between">
                <SnackOfWeekCard snack={summary.snackOfTheWeek} />

                <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-950 to-navy-900 dark:from-slate-900 dark:to-slate-950 text-white shadow-sm flex flex-col justify-between border border-navy-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-coral uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Administrative Hub
                    </div>
                    <h4 className="text-lg font-black text-white mt-1">Pantry Inventory Control</h4>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      Restock depleted snacks, adjust reorder thresholds, or introduce new snacks to the office pantry.
                    </p>
                  </div>
                  <div className="mt-5 flex flex-col gap-2">
                    <Link href="/admin">
                      <Button
                        size="sm"
                        variant="coral"
                        className="w-full font-bold"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Inventory Manager
                      </Button>
                    </Link>
                    <Link href="/activities">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full font-bold border-white/20 text-white hover:bg-white/10"
                      >
                        Full Activity Audit Log
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Middle / Right Column: Alerts & Recent Activity */}
              <div className="space-y-6 lg:col-span-2">
                <StockAlerts alerts={summary.alerts} />
                <RecentActivityFeed activities={summary.recentActivities} />
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
