import { create } from 'zustand';

interface UIState {
  // Mobile menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Cart drawer
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;

  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;

  // Modal
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;

  // Filters sidebar (mobile)
  isFilterSidebarOpen: boolean;
  openFilterSidebar: () => void;
  closeFilterSidebar: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  // Mobile menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Cart drawer
  isCartDrawerOpen: false,
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

  // Search
  isSearchOpen: false,
  searchQuery: '',
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  // Modal
  isModalOpen: false,
  modalContent: null,
  openModal: (content: React.ReactNode) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),

  // Filters sidebar
  isFilterSidebarOpen: false,
  openFilterSidebar: () => set({ isFilterSidebarOpen: true }),
  closeFilterSidebar: () => set({ isFilterSidebarOpen: false }),
}));
