'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronLeft, User, Mail, Phone, Lock, MapPin, Plus, Pencil, Trash2, Check, X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import { INDIAN_STATES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { Address } from '@/types';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'Min 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must include upper, lower, number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match', path: ['confirmPassword'],
});

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid PIN code'),
  addressType: z.enum(['HOME', 'OFFICE']),
});

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;
type AddressData = z.infer<typeof addressSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const updateUser = useAuthStore((s) => s.updateUser);

  const [tab, setTab] = useState<'profile' | 'password' | 'addresses'>('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.fullName?.split(' ')[0] || user?.firstName || '',
      lastName: user?.fullName?.split(' ').slice(1).join(' ') || user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  const addressForm = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { addressType: 'HOME' },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/account/profile');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.fullName?.split(' ')[0] || user.firstName || '',
        lastName: user.fullName?.split(' ').slice(1).join(' ') || user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get('/users/addresses');
        const data = res.data.data;
        setAddresses(Array.isArray(data) ? data : data.addresses || []);
      } catch (error) {}
    };
    if (isAuthenticated) fetchAddresses();
  }, [isAuthenticated]);

  if (authLoading || !user) return <PageLoader />;

  const handleProfileUpdate = async (data: ProfileData) => {
    try {
      // Backend expects fullName, not firstName/lastName
      const payload = {
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone || undefined,
      };
      const res = await api.put('/users/profile', payload);
      const updatedUser = res.data.data.user || res.data.data;
      updateUser(updatedUser);
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Update failed');
    }
  };

  const handlePasswordChange = async (data: PasswordData) => {
    try {
      await api.put('/users/change-password', data);
      passwordForm.reset();
      toast.success('Password changed');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    }
  };

  const handleSaveAddress = async (data: AddressData) => {
    try {
      if (editingAddressId) {
        const res = await api.put(`/users/addresses/${editingAddressId}`, data);
        const updatedAddr = res.data.data.address || res.data.data;
        setAddresses(addresses.map((a) => a.id === editingAddressId ? updatedAddr : a));
        toast.success('Address updated');
      } else {
        const res = await api.post('/users/addresses', data);
        const newAddr = res.data.data.address || res.data.data;
        setAddresses([...addresses, newAddr]);
        toast.success('Address added');
      }
      setShowAddressForm(false);
      setEditingAddressId(null);
      addressForm.reset({ addressType: 'HOME' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      await api.delete(`/users/addresses/${id}`);
      setAddresses(addresses.filter((a) => a.id !== id));
      toast.success('Address deleted');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.put(`/users/addresses/${id}`, { isDefault: true });
      setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
      toast.success('Default address updated');
    } catch (error: any) {
      toast.error('Failed to update default address');
    }
  };

  const startEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    addressForm.reset({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      pinCode: addr.pinCode,
      addressType: addr.addressType as 'HOME' | 'OFFICE',
    });
    setShowAddressForm(true);
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'password', label: 'Password', icon: Lock },
    { key: 'addresses', label: 'Addresses', icon: MapPin },
  ] as const;

  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      <div className="container-custom py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/account" className="text-brand-500 hover:text-accent-400">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-display text-white">My Profile</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/10 mb-6 max-w-md">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium flex-1 transition',
                tab === t.key ? 'bg-accent-500 text-white' : 'text-brand-500 hover:bg-white/5 hover:text-white'
              )}
            >
              <t.icon size={16} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 max-w-lg">
            <h2 className="font-semibold text-white mb-4">Personal Information</h2>
            <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" error={profileForm.formState.errors.firstName?.message} {...profileForm.register('firstName')} />
                <Input label="Last Name" error={profileForm.formState.errors.lastName?.message} {...profileForm.register('lastName')} />
              </div>
              <Input label="Email" value={user.email} disabled leftIcon={<Mail size={16} />} />
              <Input label="Phone" error={profileForm.formState.errors.phone?.message} leftIcon={<Phone size={16} />} {...profileForm.register('phone')} />
              <Button type="submit" isLoading={profileForm.formState.isSubmitting}>Save Changes</Button>
            </form>
          </motion.div>
        )}

        {/* Password tab */}
        {tab === 'password' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 max-w-lg">
            <h2 className="font-semibold text-white mb-4">Change Password</h2>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                error={passwordForm.formState.errors.currentPassword?.message}
                {...passwordForm.register('currentPassword')}
              />
              <Input
                label="New Password"
                type="password"
                error={passwordForm.formState.errors.newPassword?.message}
                {...passwordForm.register('newPassword')}
              />
              <Input
                label="Confirm New Password"
                type="password"
                error={passwordForm.formState.errors.confirmPassword?.message}
                {...passwordForm.register('confirmPassword')}
              />
              <Button type="submit" isLoading={passwordForm.formState.isSubmitting}>Change Password</Button>
            </form>
          </motion.div>
        )}

        {/* Addresses tab */}
        {tab === 'addresses' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-2xl">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white/[0.03] rounded-xl border border-white/10 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{addr.fullName}</span>
                      <span className="text-xs bg-white/5 text-brand-400 px-2 py-0.5 rounded">{addr.addressType}</span>
                      {addr.isDefault && (
                        <span className="text-xs bg-accent-500/10 text-accent-400 px-2 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-brand-400">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                    <p className="text-sm text-brand-400">{addr.city}, {addr.state} - {addr.pinCode}</p>
                    <p className="text-sm text-brand-500 mt-1">📞 {addr.phone}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-accent-400 hover:underline mr-2">
                        Set Default
                      </button>
                    )}
                    <button onClick={() => startEditAddress(addr)} className="p-2 text-brand-500 hover:text-accent-400 transition">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-brand-500 hover:text-red-400 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!showAddressForm ? (
              <button
                onClick={() => { setShowAddressForm(true); setEditingAddressId(null); addressForm.reset({ addressType: 'HOME' }); }}
                className="flex items-center gap-2 w-full p-4 bg-white/[0.03] rounded-xl border-2 border-dashed border-white/10 text-sm font-medium text-brand-400 hover:border-accent-500/40 hover:text-accent-400 transition"
              >
                <Plus size={18} />
                Add New Address
              </button>
            ) : (
              <div className="bg-white/[0.03] rounded-xl border border-white/10 p-6">
                <h3 className="font-semibold text-white mb-4">
                  {editingAddressId ? 'Edit Address' : 'New Address'}
                </h3>
                <form onSubmit={addressForm.handleSubmit(handleSaveAddress)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Full Name" error={addressForm.formState.errors.fullName?.message} {...addressForm.register('fullName')} />
                    <Input label="Phone" error={addressForm.formState.errors.phone?.message} {...addressForm.register('phone')} />
                  </div>
                  <Input label="Address Line 1" error={addressForm.formState.errors.addressLine1?.message} {...addressForm.register('addressLine1')} />
                  <Input label="Address Line 2" {...addressForm.register('addressLine2')} />
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="City" error={addressForm.formState.errors.city?.message} {...addressForm.register('city')} />
                    <Select
                      label="State"
                      options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                      placeholder="Select"
                      error={addressForm.formState.errors.state?.message}
                      {...addressForm.register('state')}
                    />
                    <Input label="PIN Code" error={addressForm.formState.errors.pinCode?.message} {...addressForm.register('pinCode')} />
                  </div>
                  <Select
                    label="Address Type"
                    options={[{ value: 'HOME', label: 'Home' }, { value: 'OFFICE', label: 'Office' }]}
                    {...addressForm.register('addressType')}
                  />
                  <div className="flex gap-3">
                    <Button type="submit">{editingAddressId ? 'Update' : 'Save'} Address</Button>
                    <Button variant="ghost" onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }}>Cancel</Button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
