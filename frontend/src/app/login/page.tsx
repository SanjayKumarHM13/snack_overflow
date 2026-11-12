'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const { user, login, isLoading: authLoading } = useAuth();
  const { error: toastError } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (err: unknown) {
      let msg = 'Failed to sign in. Please verify your credentials.';
      if (err instanceof Error) {
        msg = err.message;
      }
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  if (authLoading || user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-pantry-bg flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-coral/10 border border-coral/20 text-coral text-3xl shadow-xs mb-3">
            🍿
          </div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Snack Overflow</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Office Pantry & Snack Inventory System
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-pantry-border shadow-md p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-navy-900 tracking-tight">Welcome back</h2>
            <p className="text-xs text-gray-500 mt-1">
              Sign in with your work email or choose a seeded demo account below.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Email address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                autoComplete="email"
                required
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="coral"
                className="w-full font-bold shadow-sm"
                isLoading={isSubmitting}
              >
                Sign In to Pantry
              </Button>
            </div>
          </form>

          {/* Demo Account Quick-Fill Section */}
          <div className="mt-8 pt-6 border-t border-pantry-border">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Demo Accounts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handlePreFill('admin@example.com', 'Admin1234!')}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-pantry-border bg-pantry-subtle/50 hover:bg-pantry-subtle hover:border-coral/40 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-navy-900 text-white flex items-center justify-center shrink-0 text-xs font-bold group-hover:scale-105 transition-transform">
                  👑
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-navy-900 flex items-center gap-1">
                    Admin User
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">admin@example.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePreFill('member@example.com', 'Member1234!')}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-pantry-border bg-pantry-subtle/50 hover:bg-pantry-subtle hover:border-coral/40 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-coral/20 text-coral flex items-center justify-center shrink-0 text-xs font-bold group-hover:scale-105 transition-transform">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-navy-900 flex items-center gap-1">
                    Team Member
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">member@example.com</div>
                </div>
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2.5 text-center">
              Click either chip to autofill credentials instantly.
            </p>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="text-center mt-6 text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>HTTP-only Cookie Session • CSRF Protected • PostgreSQL Hashed</span>
        </div>
      </div>
    </div>
  );
}
