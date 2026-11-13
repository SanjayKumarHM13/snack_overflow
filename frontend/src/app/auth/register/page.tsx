'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '../../../services/auth.service';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ThemeToggle } from '../../../components/ui/ThemeToggle';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Check,
} from 'lucide-react';

export default function RegisterPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistrationEnabled, setIsRegistrationEnabled] = useState<boolean | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push('/snacks');
      }
    }
  }, [user, authLoading, router]);

  // Check if registration is enabled on mount
  useEffect(() => {
    let isMounted = true;
    authService
      .getRegistrationStatus()
      .then((res) => {
        if (isMounted) setIsRegistrationEnabled(res.registrationEnabled);
      })
      .catch(() => {
        if (isMounted) setIsRegistrationEnabled(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Password criteria check
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasDigit && hasSpecial;
  const doPasswordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage('Full name must be at least 2 characters.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Password must meet all complexity requirements listed below.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.register(name, email, password, confirmPassword);
      toastSuccess('Account created successfully! Please sign in with your credentials.');
      router.push('/login?registered=true');
    } catch (err: unknown) {
      let msg = 'Failed to create account. Please try again.';
      if (err instanceof Error) {
        msg = err.message;
      }
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-pantry-bg flex flex-col justify-center items-center p-4 sm:p-6 relative transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-coral/10 border border-coral/20 text-coral text-3xl shadow-xs mb-3">
            🍿
          </div>
          <h1 className="text-3xl font-black text-pantry-text tracking-tight">Snack Overflow</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            Create your Office Pantry Account
          </p>
        </div>

        {/* Card */}
        <div className="bg-pantry-surface rounded-3xl border border-pantry-border shadow-md p-6 sm:p-8 transition-colors">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-pantry-text tracking-tight">
                Member Sign-up
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Join your colleagues and enjoy fresh snacks daily.
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-coral/10 text-coral flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>

          {/* Registration Disabled Notice */}
          {isRegistrationEnabled === false && (
            <div className="mb-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Public Registration Restricted</p>
                <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                  New member registration is currently disabled by administrator policy. Please
                  contact your pantry admin to be invited.
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Full name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting || isRegistrationEnabled === false}
                autoComplete="name"
                required
              />
            </div>

            <div>
              <Input
                label="Work email"
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || isRegistrationEnabled === false}
                autoComplete="email"
                required
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting || isRegistrationEnabled === false}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Requirements Checklist */}
            {password.length > 0 && (
              <div className="p-3 rounded-xl bg-pantry-subtle border border-pantry-border text-[11px] space-y-1">
                <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Password must include:
                </p>
                <div className="grid grid-cols-2 gap-1 text-gray-500 dark:text-gray-400">
                  <div
                    className={`flex items-center gap-1 ${
                      hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''
                    }`}
                  >
                    {hasMinLength ? <Check className="w-3 h-3" /> : <span className="w-3">·</span>}
                    <span>8+ characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''
                    }`}
                  >
                    {hasUppercase ? <Check className="w-3 h-3" /> : <span className="w-3">·</span>}
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      hasLowercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''
                    }`}
                  >
                    {hasLowercase ? <Check className="w-3 h-3" /> : <span className="w-3">·</span>}
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      hasDigit ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''
                    }`}
                  >
                    {hasDigit ? <Check className="w-3 h-3" /> : <span className="w-3">·</span>}
                    <span>Number (0-9)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 col-span-2 ${
                      hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''
                    }`}
                  >
                    {hasSpecial ? <Check className="w-3 h-3" /> : <span className="w-3">·</span>}
                    <span>Special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="relative">
              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting || isRegistrationEnabled === false}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {confirmPassword.length > 0 && (
              <div className="text-[11px] flex items-center gap-1.5 px-1">
                {doPasswordsMatch ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                  </span>
                )}
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="coral"
                className="w-full font-bold shadow-sm"
                isLoading={isSubmitting}
                disabled={isRegistrationEnabled === false || isSubmitting}
              >
                Create Account
              </Button>
            </div>
          </form>

          {/* Link to login */}
          <div className="mt-6 pt-5 border-t border-pantry-border text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Already have a pantry account?{' '}
              <Link
                href="/login"
                className="font-bold text-coral hover:text-coral-dark dark:hover:text-coral-light underline decoration-coral/30 hover:decoration-coral transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="text-center mt-6 text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>Bcrypt Password Hashing • CSRF Protected • Dedicated Member Role</span>
        </div>
      </div>
    </div>
  );
}
