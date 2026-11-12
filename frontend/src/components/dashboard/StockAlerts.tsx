import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { AlertCircle, ArrowUpRight } from 'lucide-react';
import { SnackCategory, SnackStatus } from '../../types/index';

interface AlertItem {
  id: string;
  name: string;
  category: SnackCategory;
  quantity: number;
  lowStockThreshold: number;
  status: SnackStatus;
}

export function StockAlerts({ alerts }: { alerts: AlertItem[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <CardTitle>Inventory Alerts</CardTitle>
        </div>
        <Link
          href="/admin"
          className="text-xs font-semibold text-pantry-text hover:text-coral flex items-center gap-0.5"
        >
          Manage inventory <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm font-semibold text-pantry-text">Pantry fully stocked! 🎉</p>
          <p className="text-xs mt-1">No snacks currently below low stock thresholds.</p>
        </div>
      ) : (
        <div className="divide-y divide-pantry-border">
          {alerts.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-pantry-text">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-pantry-text">{item.quantity}</span> packets left
                  (threshold: {item.lowStockThreshold})
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
