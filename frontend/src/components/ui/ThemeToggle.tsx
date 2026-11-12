'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, Theme } from '../../context/ThemeContext';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: Array<{ id: Theme; label: string; icon: React.ReactNode }> = [
    { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-blue-400" /> },
    { id: 'system', label: 'System', icon: <Laptop className="w-4 h-4 text-gray-400" /> },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle color theme"
        title={`Current theme: ${theme} (${resolvedTheme})`}
        className={cn(
          'p-2 rounded-xl border border-pantry-border bg-pantry-surface text-gray-600 dark:text-gray-300 hover:text-navy-900 dark:hover:text-white hover:bg-pantry-subtle transition-all duration-150 flex items-center justify-center shadow-xs',
          className
        )}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-4 h-4 text-blue-400 transition-transform hover:scale-110" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transition-transform hover:scale-110" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-pantry-surface border border-pantry-border shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1">
            Appearance
          </div>
          {options.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors',
                  isSelected
                    ? 'bg-pantry-subtle text-navy-950 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-pantry-subtle/60'
                )}
              >
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-coral shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
