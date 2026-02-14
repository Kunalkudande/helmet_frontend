import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User, token: string) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user: User, token: string) => {
        localStorage.setItem('accessToken', token);
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          // Ignore logout errors
        } finally {
          localStorage.removeItem('accessToken');
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
          toast.success('Logged out successfully');
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ isLoading: false, isAuthenticated: false, user: null, accessToken: null });
          return;
        }

        try {
          const response = await api.get('/auth/me');
          const userData = response.data.data;
          // auth/me returns user directly or wrapped in .user
          const user = userData.user || userData;
          set({
            user,
            accessToken: token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem('accessToken');
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the minimum needed — fetch full user data on session start
      partialize: (state) => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
