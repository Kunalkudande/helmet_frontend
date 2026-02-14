'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  Package,
  Heart,
  Settings,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { NAV_LINKS, CATEGORIES, SITE_NAME, IMAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useSearchAutocomplete } from '@/hooks/useProducts';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, openCartDrawer } = useUIStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const { data: searchSuggestions = [] } = useSearchAutocomplete(searchQuery);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const shopDropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const currentPath = pathname as string;
  const isHomePage = currentPath === '/';
  const isDarkHeader = true; // Always dark – entire site uses dark theme
  const isActiveLink = (href: string) => currentPath === href || currentPath.startsWith(href + '/');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target as Node)) {
        setIsShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    closeMobileMenu();
    setIsSearchOpen(false);
  }, [pathname, closeMobileMenu]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const cartItemCount = totalItems();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isHomePage && !isScrolled
          ? 'bg-transparent'
          : isScrolled
            ? 'bg-[hsl(0,0%,7%)]/95 backdrop-blur-md shadow-soft border-b border-white/5'
            : 'bg-[hsl(0,0%,7%)] border-b border-white/5'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5" aria-label={SITE_NAME}>
              <img src={isDarkHeader ? IMAGES.logoDark : IMAGES.logo} alt={SITE_NAME} width={44} height={44} className="w-11 h-11 rounded-md object-contain" />
              <span className={cn(
                'text-lg font-bold hidden sm:block tracking-tight',
                isDarkHeader ? 'text-white' : 'text-brand-900'
              )}>
                <span className="text-accent-500">BIKERS</span>{' '}
                <span className={isDarkHeader ? 'text-white' : 'text-brand-900'}>BRAIN</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                // "Shop" gets a dropdown with categories
                if (link.label === 'Shop') {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      ref={shopDropdownRef}
                      onMouseEnter={() => {
                        if (shopDropdownTimeout.current) clearTimeout(shopDropdownTimeout.current);
                        setIsShopDropdownOpen(true);
                      }}
                      onMouseLeave={() => {
                        shopDropdownTimeout.current = setTimeout(() => setIsShopDropdownOpen(false), 200);
                      }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'px-3 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1',
                          isActiveLink(link.href)
                            ? 'text-accent-500'
                            : 'text-white/70 hover:text-white'
                        )}
                      >
                        {link.label}
                        <ChevronDown size={14} className={cn('transition-transform duration-200', isShopDropdownOpen && 'rotate-180')} />
                      </Link>

                      {/* Mega Dropdown */}
                      {isShopDropdownOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] bg-[hsl(0,0%,8%)] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                          {/* Arrow */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[hsl(0,0%,8%)] border-l border-t border-white/10 rotate-45" />

                          <div className="relative p-5">
                            <p className="text-[10px] font-bold text-accent-500 uppercase tracking-[0.2em] mb-4">Shop by Category</p>
                            <div className="grid grid-cols-2 gap-2">
                              {CATEGORIES.map((cat) => (
                                <Link
                                  key={cat.value}
                                  href={`/products?category=${cat.value}`}
                                  onClick={() => setIsShopDropdownOpen(false)}
                                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200"
                                >
                                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-white group-hover:text-accent-400 transition-colors">{cat.label}</p>
                                    <p className="text-[11px] text-white/40">{cat.description}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>

                            {/* Bottom CTA */}
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <Link
                                href="/products"
                                onClick={() => setIsShopDropdownOpen(false)}
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-accent-500/10 border border-accent-500/20 hover:bg-accent-500/20 transition-all group"
                              >
                                <span className="text-sm font-semibold text-accent-400">View All Helmets</span>
                                <ChevronRight size={16} className="text-accent-500 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActiveLink(link.href)
                        ? 'text-accent-500'
                        : 'text-white/70 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Search - Desktop */}
            <div className="hidden md:block relative" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2',
                    isDarkHeader ? 'text-white/40' : 'text-brand-400'
                  )} size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Search helmets..."
                    className={cn(
                      'w-64 h-10 pl-10 pr-4 border-0 rounded-lg text-sm transition-all focus:outline-none focus:ring-2',
                      isDarkHeader
                        ? 'bg-white/10 text-white placeholder:text-white/40 focus:ring-accent-500/30 focus:bg-white/15'
                        : 'bg-brand-50 text-brand-900 placeholder:text-brand-400 focus:ring-brand-200'
                    )}
                  />
                </div>
              </form>

              {/* Search suggestions */}
              {isSearchOpen && searchQuery.length >= 2 && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[hsl(0,0%,10%)] border border-white/10 rounded-xl shadow-medium overflow-hidden z-50">
                  <ul className="max-h-80 overflow-y-auto py-2">
                    {searchSuggestions.map((item: any) => (
                      <li key={item.slug}>
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2.5 text-sm text-brand-300 hover:bg-white/5 transition-colors"
                          onClick={() => {
                            router.push(`/products/${item.slug}`);
                            setSearchQuery('');
                            setIsSearchOpen(false);
                          }}
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Search - Mobile */}
            <button
              onClick={() => router.push('/products')}
              className={cn(
                'md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors',
                isDarkHeader ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-brand-500 hover:bg-brand-100 hover:text-brand-700'
              )}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                href="/account/wishlist"
                className={cn(
                  'hidden sm:flex w-10 h-10 items-center justify-center rounded-lg transition-colors',
                  isDarkHeader ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-brand-500 hover:bg-brand-100 hover:text-brand-700'
                )}
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCartDrawer}
              className={cn(
                'relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors',
                isDarkHeader ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-brand-500 hover:bg-brand-100 hover:text-brand-700'
              )}
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-lg transition-colors',
                    isUserMenuOpen
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                  aria-label="User menu"
                >
                  <User size={20} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[hsl(0,0%,10%)] border border-white/10 rounded-xl shadow-medium py-1 z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="font-medium text-white truncate">{user?.fullName}</p>
                      <p className="text-xs text-brand-500 truncate">{user?.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-300 hover:bg-white/5 transition-colors"
                      >
                        <Settings size={16} className="text-brand-500" />
                        Account
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-300 hover:bg-white/5 transition-colors"
                      >
                        <Package size={16} className="text-brand-500" />
                        Orders
                      </Link>
                      <Link
                        href="/account/wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-300 hover:bg-white/5 transition-colors"
                      >
                        <Heart size={16} className="text-brand-500" />
                        Wishlist
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-accent-400 hover:bg-white/5 transition-colors"
                        >
                          <Shield size={16} />
                          Admin
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-white/10 py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={cn(
                  'hidden sm:inline-flex items-center justify-center h-9 px-5 text-sm font-semibold rounded-lg transition-all duration-200',
                  isDarkHeader
                    ? 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/25'
                    : 'bg-accent-500 text-white hover:bg-accent-600'
                )}
              >
                Sign in
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={toggleMobileMenu}
              className={cn(
                'lg:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors',
                isDarkHeader ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-brand-500 hover:bg-brand-100 hover:text-brand-700'
              )}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
          <div className="fixed inset-y-0 left-0 w-80 bg-brand-950 z-50 lg:hidden overflow-y-auto border-r border-brand-800">
            <div className="p-5 border-b border-brand-800 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={closeMobileMenu}
              >
                <img src={IMAGES.logoDark} alt={SITE_NAME} width={44} height={44} className="w-11 h-11 rounded-md object-contain" />
                <span className="text-lg font-bold text-white tracking-tight">
                  <span className="text-accent-500">BIKERS</span> BRAIN
                </span>
              </Link>
              <button
                onClick={closeMobileMenu}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="p-5 border-b border-brand-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search helmets..."
                  className="w-full h-10 pl-10 pr-4 bg-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                />
              </div>
            </form>

            {/* Mobile Nav */}
            <nav className="p-5">
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                        isActiveLink(link.href)
                          ? 'bg-accent-500/10 text-accent-500 border border-accent-500/20'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Categories */}
              <div className="mt-8 pt-8 border-t border-brand-800">
                <p className="px-4 text-xs font-semibold text-accent-500 uppercase tracking-widest mb-3">
                  Categories
                </p>
                <ul className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.value}>
                      <Link
                        href={`/products?category=${cat.value}`}
                        onClick={closeMobileMenu}
                        className="block px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Auth Buttons */}
              {!isAuthenticated && (
                <div className="mt-8 pt-8 border-t border-brand-800 space-y-3">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center h-11 bg-accent-500 text-white rounded-lg text-sm font-semibold hover:bg-accent-600 transition-colors w-full"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center h-11 border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/5 transition-colors w-full"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
