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
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

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
    <AppShell>
      <div className="space-y-6 sm:space-y-8">
        {/* Top Greeting & Action Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                Welcome back, {user?.name.split(' ')[0]} 👋
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-coral/10 text-coral border border-coral/20">
                Pantry Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Real-time pantry inventory and consumption tracking across the office.
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
            <Link href="/snacks">
              <Button variant="coral" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Browse Snacks
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 rounded-2xl w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-72 rounded-2xl w-full lg:col-span-1" />
              <Skeleton className="h-72 rounded-2xl w-full lg:col-span-2" />
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {error && !isLoading && (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
            <p className="text-sm font-bold text-rose-900">Failed to load pantry dashboard</p>
            <p className="text-xs text-rose-700 mt-1">
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
                title="Total Snack Types"
                value={summary.totalSnackTypes}
                subtitle="Active varieties in catalog"
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
                title="Fully Stocked"
                value={summary.stockedCount}
                subtitle="Above low stock threshold"
                icon={<PackageCheck className="w-5 h-5" />}
                variant="success"
              />
              <StatCard
                title="Needs Attention"
                value={summary.runningLowCount + summary.goneCount}
                subtitle={`${summary.runningLowCount} low, ${summary.goneCount} depleted`}
                icon={<AlertTriangle className="w-5 h-5" />}
                variant={summary.runningLowCount + summary.goneCount > 0 ? 'warning' : 'default'}
              />
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Snack of the Week & Inventory Alerts */}
              <div className="space-y-6 lg:col-span-1 flex flex-col justify-between">
                <SnackOfWeekCard snack={summary.snackOfTheWeek} />

                {isAdmin && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 text-white shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-coral uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        Admin Controls
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">Pantry Management</h4>
                      <p className="text-xs text-gray-300 mt-1">
                        Restock depleted snacks, adjust reorder thresholds, or introduce new snacks.
                      </p>
                    </div>
                    <Link href="/admin" className="mt-4">
                      <Button
                        size="sm"
                        variant="coral"
                        className="w-full font-semibold"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Manage Inventory
                      </Button>
                    </Link>
                  </div>
                )}
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
