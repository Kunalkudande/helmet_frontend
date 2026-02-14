'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { IMAGES, SITE_NAME } from '@/lib/constants';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number').optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isRegisterLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerUser({
      ...registerData,
      phone: registerData.phone || undefined,
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src={IMAGES.logo} alt="Helmet" width={64} height={64} className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-display text-white">Create Account</h1>
          <p className="text-brand-500 mt-1">Join HelmetStore for the best deals</p>
        </div>

        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Rahul"
                leftIcon={<User size={18} />}
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Sharma"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="9876543210"
              leftIcon={<Phone size={18} />}
              helperText="Optional - for order updates"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 characters"
              leftIcon={<Lock size={18} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-brand-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              leftIcon={<Lock size={18} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-brand-500 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-accent-500 rounded border-white/20 bg-white/5 focus:ring-accent-500 mt-0.5"
              />
              <span className="text-xs text-brand-500">
                I agree to the{' '}
                <Link href="/terms" className="text-accent-400 hover:underline">Terms & Conditions</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-accent-400 hover:underline">Privacy Policy</Link>
              </span>
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isRegisterLoading}>
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-brand-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-accent-400 hover:text-accent-300 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
