'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { snackService, CreateSnackDto, UpdateSnackDto } from '../../services/snack.service';
import { AppShell } from '../../components/layout/AppShell';
import { SnackTable } from '../../components/admin/SnackTable';
import { AddSnackModal } from '../../components/admin/AddSnackModal';
import { EditSnackModal } from '../../components/admin/EditSnackModal';
import { RestockModal } from '../../components/admin/RestockModal';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { Snack, SnackCategory, SnackStatus } from '../../types/index';
import { PlusCircle, Search, ChevronLeft, ChevronRight, RefreshCw, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<SnackCategory | ''>('');
  const [status, setStatus] = useState<SnackStatus | ''>('');
  const [page, setPage] = useState(1);
  const limit = 15;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSnack, setEditingSnack] = useState<Snack | null>(null);
  const [restockingSnack, setRestockingSnack] = useState<Snack | null>(null);
  const [deletingSnack, setDeletingSnack] = useState<Snack | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Query
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['admin-snacks', { search, category, status, page, limit }],
    queryFn: () =>
      snackService.getSnacks({
        search: search.trim() || undefined,
        category: category || undefined,
        status: status || undefined,
        page,
        limit,
      }),
  });

  const snacks = data?.data ?? [];
  const pagination = data?.pagination;

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin-snacks'] }),
      queryClient.invalidateQueries({ queryKey: ['snacks'] }),
      queryClient.invalidateQueries({ queryKey: ['summary'] }),
    ]);
  };

  // Handlers
  const handleCreateSnack = async (payload: CreateSnackDto) => {
    setIsActionLoading(true);
    try {
      await snackService.createSnack(payload);
      toast.success(`Successfully added "${payload.name}" to inventory.`);
      setIsAddOpen(false);
      await invalidateAll();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add snack');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateSnack = async (id: string, payload: UpdateSnackDto) => {
    setIsActionLoading(true);
    try {
      await snackService.updateSnack(id, payload);
      toast.success('Snack details updated successfully.');
      setEditingSnack(null);
      await invalidateAll();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update snack');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestock = async (snackId: string, amount: number) => {
    setIsActionLoading(true);
    try {
      await snackService.restock(snackId, amount);
      toast.success(`Restocked ${amount} packet(s) successfully.`);
      setRestockingSnack(null);
      await invalidateAll();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to restock snack');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsActionLoading(true);
    try {
      await snackService.deleteSnack(id);
      toast.success('Snack deleted from catalog. Historical logs preserved.');
      setDeletingSnack(null);
      await invalidateAll();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete snack');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <AppShell requireAdmin>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                Pantry Administration
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-900 text-white">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage inventory levels, restock depleted snacks, and configure reorder thresholds.
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
            <Button
              variant="coral"
              size="sm"
              onClick={() => setIsAddOpen(true)}
              icon={<PlusCircle className="w-4 h-4" />}
            >
              Add New Snack
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search pantry items..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-pantry-border bg-white text-xs text-navy-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as SnackCategory | '');
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-pantry-border bg-white text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              <option value="">All Categories</option>
              <option value="SWEET">Sweet</option>
              <option value="SAVOURY">Savoury</option>
              <option value="DRINK">Drinks</option>
              <option value="HEALTHY_ISH">Healthy-ish</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as SnackStatus | '');
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-pantry-border bg-white text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
            >
              <option value="">All Statuses</option>
              <option value="STOCKED">Stocked Only</option>
              <option value="RUNNING_LOW">Running Low</option>
              <option value="GONE">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Snack Table */}
        <SnackTable
          snacks={snacks}
          onRestock={(snack) => setRestockingSnack(snack)}
          onEdit={(snack) => setEditingSnack(snack)}
          onDelete={(snack) => setDeletingSnack(snack)}
          isLoading={isLoading}
        />

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-pantry-border text-xs text-gray-500">
            <div>
              Showing <span className="font-bold text-navy-900">{snacks.length}</span> of{' '}
              <span className="font-bold text-navy-900">{pagination.totalItems}</span> inventory
              records
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

      {/* Admin Modals */}
      <AddSnackModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreateSnack}
        isLoading={isActionLoading}
      />

      <EditSnackModal
        isOpen={!!editingSnack}
        onClose={() => setEditingSnack(null)}
        snack={editingSnack}
        onSubmit={handleUpdateSnack}
        isLoading={isActionLoading}
      />

      <RestockModal
        isOpen={!!restockingSnack}
        onClose={() => setRestockingSnack(null)}
        snack={restockingSnack}
        onRestock={handleRestock}
        isLoading={isActionLoading}
      />

      <DeleteConfirmModal
        isOpen={!!deletingSnack}
        onClose={() => setDeletingSnack(null)}
        snack={deletingSnack}
        onConfirm={handleDelete}
        isLoading={isActionLoading}
      />
    </AppShell>
  );
}
