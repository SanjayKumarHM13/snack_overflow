'use client';

import React from 'react';
import { Snack } from '../../types/index';
import { StatusBadge, CategoryBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PackagePlus, Edit2, Trash2, Heart, AlertTriangle } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

interface SnackTableProps {
  snacks: Snack[];
  onRestock: (snack: Snack) => void;
  onEdit: (snack: Snack) => void;
  onDelete: (snack: Snack) => void;
  isLoading?: boolean;
}

export function SnackTable({
  snacks,
  onRestock,
  onEdit,
  onDelete,
  isLoading = false,
}: SnackTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-pantry-border overflow-hidden">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (snacks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-pantry-border p-12 text-center">
        <div className="w-12 h-12 bg-pantry-subtle rounded-xl flex items-center justify-center mx-auto mb-3 text-gray-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-navy-900">No snacks found</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Add new snacks to the inventory to start tracking pantry stock.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-pantry-border shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-pantry-border bg-pantry-subtle/50 text-gray-500 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Snack & Category</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4">Threshold</th>
              <th className="py-3.5 px-4">Votes</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pantry-border/60">
            {snacks.map((snack) => (
              <tr key={snack.id} className="hover:bg-pantry-subtle/30 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-navy-900 text-sm">{snack.name}</div>
                  <div className="mt-1">
                    <CategoryBadge category={snack.category} />
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={snack.status} />
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-navy-900 text-sm">{snack.quantity}</span>
                  <span className="text-gray-400 font-medium ml-1">pkts</span>
                </td>
                <td className="py-3.5 px-4 font-medium text-gray-600">
                  ≤ {snack.lowStockThreshold} pkts
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    {snack.voteCount}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRestock(snack)}
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-8 px-2.5"
                      title="Restock"
                      icon={<PackagePlus className="w-3.5 h-3.5" />}
                    >
                      Restock
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(snack)}
                      className="text-gray-600 hover:text-navy-900 hover:bg-pantry-subtle h-8 w-8 p-0"
                      title="Edit details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(snack)}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0"
                      title="Delete snack"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
