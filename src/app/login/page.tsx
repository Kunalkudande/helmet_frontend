'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SITE_NAME, IMAGES } from '@/lib/constants';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoginLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src={IMAGES.logo} alt={SITE_NAME} width={40} height={40} className="w-10 h-10" />
            <span className="text-xl font-semibold text-white">{SITE_NAME}</span>
          </Link>
          <h1 className="text-display-sm text-white font-display">Welcome back</h1>
          <p className="text-brand-500 mt-2">Sign in to continue to your account</p>
        </div>

        <div className="bg-white/[0.03] rounded-xl border border-white/10 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-brand-400 hover:text-brand-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-accent-500 rounded border-white/20 bg-white/5 focus:ring-accent-500" />
                <span className="text-sm text-brand-400">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-accent-400 hover:text-accent-300 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isLoginLoading}>
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-brand-500 mt-6">
          New here?{' '}
          <Link href="/register" className="text-accent-400 hover:text-accent-300 font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
