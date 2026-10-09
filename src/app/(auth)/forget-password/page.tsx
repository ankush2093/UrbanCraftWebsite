'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

import styles from './forget-password.module.scss';
import { useAuth } from '@/hooks/useAuth';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '@/store/api/auth';

type Step = 'email' | 'reset';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getApiErrorMessage(err: any): string {
  return (
    err?.data?.message ||
    err?.data?.error ||
    err?.message ||
    'Something went wrong. Please try again.'
  );
}

export default function ForgetPasswordPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [forgotPassword, { isLoading: isSendingCode }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const isBusy = isSendingCode || isResetting;

  const isEmailValid = useMemo(() => emailRegex.test(email.trim()), [email]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const res = await forgotPassword({ email: trimmedEmail }).unwrap();
      setEmail(res.email || trimmedEmail);
      setStep('reset');
      setSuccess('Verification code sent. Please check your email.');
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      setStep('email');
      return;
    }

    try {
      await forgotPassword({ email: trimmedEmail }).unwrap();
      setSuccess('Code resent. Please check your email.');
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleBackToEmail = () => {
    setError('');
    setSuccess('');
    setStep('email');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();

    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      setStep('email');
      return;
    }

    if (!/^\d{4}$/.test(normalizedCode)) {
      setError('Please enter the 4-digit code.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password & Confirm Password do not match.');
      return;
    }

    try {
      const res = await resetPassword({
        email: trimmedEmail,
        code: normalizedCode,
        newPassword,
      }).unwrap();

      if (!res?.status) {
        setError(res?.message || 'Reset failed. Please try again.');
        return;
      }

      setSuccess(res?.message || 'Password reset successfully. Logging you in...');

      const loginOk = await login(trimmedEmail, newPassword);
      if (!loginOk) {
        setError('Password reset done, but login failed. Please login manually.');
        return;
      }

      router.push('/profile');
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot Password</h1>
        <p className={styles.subtitle}>
          {step === 'email'
            ? 'Enter your email to receive a verification code.'
            : 'Enter the code and set a new password.'}
        </p>

        {error && <div className={styles.alertError}>{error}</div>}
        {success && <div className={styles.alertSuccess}>{success}</div>}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className={styles.form}>
            <label className={styles.label} htmlFor="fp_email">
              Email
            </label>
            <input
              id="fp_email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
              disabled={isBusy}
            />

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isSendingCode || !isEmailValid}
            >
              {isSendingCode ? 'Sending...' : 'Send Code'}
            </button>

            <p className={styles.footerText}>
              Remember your password? <Link href="/login">Login</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleReset} className={styles.form}>
            <label className={styles.label} htmlFor="fp_email_locked">
              Email
            </label>
            <input
              id="fp_email_locked"
              type="email"
              className={styles.input}
              value={email}
              readOnly
              disabled={isBusy}
            />

            <label className={styles.label} htmlFor="fp_code">
              4-digit code
            </label>
            <input
              id="fp_code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className={styles.input}
              value={code}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 4);
                setCode(onlyDigits);
              }}
              placeholder="1234"
              maxLength={4}
              required
              disabled={isBusy}
            />

            <label className={styles.label} htmlFor="fp_new_password">
              New password
            </label>
            <div className={styles.passwordWrap}>
              <input
                id="fp_new_password"
                type={showNewPassword ? 'text' : 'password'}
                className={`${styles.input} ${styles.passwordInput}`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={6}
                autoComplete="new-password"
                required
                disabled={isBusy}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowNewPassword((p) => !p)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showNewPassword}
                disabled={isBusy}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className={styles.label} htmlFor="fp_confirm_password">
              Confirm password
            </label>
            <div className={styles.passwordWrap}>
              <input
                id="fp_confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`${styles.input} ${styles.passwordInput}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                minLength={6}
                autoComplete="new-password"
                required
                disabled={isBusy}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword((p) => !p)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showConfirmPassword}
                disabled={isBusy}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isResetting}
            >
              {isResetting ? 'Resetting...' : 'Reset Password'}
            </button>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={handleBackToEmail}
                disabled={isBusy}
              >
                Change email
              </button>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={handleResend}
                disabled={isBusy}
              >
                Resend code
              </button>
            </div>

            <p className={styles.footerText}>
              Back to <Link href="/login">Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

