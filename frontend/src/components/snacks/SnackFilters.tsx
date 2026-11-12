'use client';

import React from 'react';
import { SnackCategory, SnackStatus } from '../../types/index';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SnackFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: SnackCategory | '';
  onCategoryChange: (value: SnackCategory | '') => void;
  status: SnackStatus | '';
  onStatusChange: (value: SnackStatus | '') => void;
  sortBy: 'name' | 'quantity' | 'votes';
  onSortByChange: (value: 'name' | 'quantity' | 'votes') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
}

export function SnackFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: SnackFiltersProps) {
  const categories: Array<{ id: SnackCategory | ''; label: string; icon: string }> = [
    { id: '', label: 'All Categories', icon: '✨' },
    { id: 'SWEET', label: 'Sweet', icon: '🍫' },
    { id: 'SAVOURY', label: 'Savoury', icon: '🥨' },
    { id: 'DRINK', label: 'Drinks', icon: '🧃' },
    { id: 'HEALTHY_ISH', label: 'Healthy-ish', icon: '🥗' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Search & Sorters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search snacks by name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pantry-border bg-white text-sm text-navy-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-800 transition-colors"
          />
        </div>

        {/* Status & Sort Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as SnackStatus | '')}
            className="px-3 py-2 rounded-xl border border-pantry-border bg-white text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
          >
            <option value="">All Stock Statuses</option>
            <option value="STOCKED">Stocked Only</option>
            <option value="RUNNING_LOW">Running Low</option>
            <option value="GONE">Out of Stock</option>
          </select>

          {/* Sort Dropdown */}
          <div className="flex items-center rounded-xl border border-pantry-border bg-white overflow-hidden">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as 'name' | 'quantity' | 'votes')}
              className="px-3 py-2 bg-transparent text-xs font-semibold text-navy-900 focus:outline-none border-r border-pantry-border"
            >
              <option value="name">Sort: Name</option>
              <option value="quantity">Sort: Stock Quantity</option>
              <option value="votes">Sort: Highest Votes</option>
            </select>
            <button
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              className="px-2.5 py-2 text-xs font-bold text-gray-600 hover:text-navy-900 hover:bg-pantry-subtle transition-colors"
            >
              {sortOrder === 'asc' ? '▲ ASC' : '▼ DESC'}
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id || 'all'}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border',
                isSelected
                  ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                  : 'bg-white text-gray-600 border-pantry-border hover:bg-pantry-subtle hover:text-navy-900'
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
