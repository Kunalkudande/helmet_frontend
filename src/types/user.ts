// User & Auth Types
export interface User {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  addressType: AddressType;
  isDefault: boolean;
  createdAt: string;
}

export type AddressType = 'HOME' | 'OFFICE';

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
