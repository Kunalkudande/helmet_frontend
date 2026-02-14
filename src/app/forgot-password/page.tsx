'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword, isForgotPasswordLoading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data.email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <h1 className="text-2xl font-display text-white">Forgot Password</h1>
          <p className="text-brand-500 mt-1">Enter your email to reset your password</p>
        </div>

        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8">
          {isSubmitted ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-lg font-semibold text-white mb-2">Check your email</h2>
              <p className="text-sm text-brand-500 mb-6">
                If an account exists with that email, we&apos;ve sent a password reset link.
              </p>
              <Link href="/login">
                <Button variant="outline" fullWidth leftIcon={<ArrowLeft size={16} />}>
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isForgotPasswordLoading}
              >
                Send Reset Link
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-accent-400 hover:text-accent-300 font-medium inline-flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
