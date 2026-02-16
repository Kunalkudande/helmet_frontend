// Site & Brand Constants
export const SITE_NAME = 'Bikers Brain';
export const SITE_TAGLINE = 'Premium motorcycle helmets';
export const SITE_PUNCHLINE = 'Curated selection of ISI & DOT certified helmets for every rider.';
export const SITE_DESCRIPTION =
  'Discover premium ISI & DOT certified motorcycle helmets. Expertly curated for safety, comfort, and style.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Brand Story
export const BRAND_POSITIONING = {
  oneLiner: 'Premium helmets, thoughtfully curated.',
  safetyPromise: 'Every helmet is ISI & DOT certified. Safety is non-negotiable.',
  differentiation: 'Curated gear, verified reviews, expert guidance.',
} as const;

// Navigation Links
export const NAV_LINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

// Categories - using icon identifiers for proper icon components
export const CATEGORIES = [
  { value: 'FULL_FACE', label: 'Full Face', description: 'Maximum protection', icon: 'shield', image: '/updated_images/helmet-fullface.jpg' },
  { value: 'HALF_FACE', label: 'Half Face', description: 'Lightweight design', icon: 'circle-half', image: '/updated_images/helmet-halfface.jpg' },
  { value: 'OPEN_FACE', label: 'Open Face', description: 'Classic style', icon: 'circle', image: '/updated_images/helmet-fullface.jpg' },
  { value: 'MODULAR', label: 'Modular', description: 'Versatile flip-up', icon: 'flip-vertical', image: '/updated_images/helmet-modular.jpg' },
  { value: 'OFF_ROAD', label: 'Off Road', description: 'Adventure ready', icon: 'mountain', image: '/updated_images/helmet-offroad.jpg' },
  { value: 'KIDS', label: 'Kids', description: 'Junior collection', icon: 'baby', image: '/updated_images/helmet-halfface.jpg' },
  { value: 'LADIES', label: 'Ladies', description: 'Designed for women', icon: 'heart', image: '/updated_images/helmet-fullface.jpg' },
] as const;

// Image paths
export const IMAGES = {
  logo: '/updated_images/bikersbrain-logo.png',
  logoDark: '/updated_images/bikersbrain-logo.png',
  hero: '/updated_images/hero-helmet.jpg',
  ctaBanner: '/updated_images/helmets-collection.jpg',
  promoBanner: '/updated_images/helmets-collection.jpg',
  aboutHero: '/updated_images/hero-helmet.jpg',
  featuredBg: '/updated_images/helmets-collection.jpg',
  ogImage: '/updated_images/bikersbrain-logo.png',
  noProductImage: '/updated_images/helmet-fullface.jpg',
  freeShippingBanner: '/updated_images/helmets-collection.jpg',
} as const;

// Sizes
export const SIZES = [
  { value: 'XS', label: 'XS', headSize: '53-54 cm' },
  { value: 'S', label: 'S', headSize: '55-56 cm' },
  { value: 'M', label: 'M', headSize: '57-58 cm' },
  { value: 'L', label: 'L', headSize: '59-60 cm' },
  { value: 'XL', label: 'XL', headSize: '61-62 cm' },
  { value: 'XXL', label: 'XXL', headSize: '63-64 cm' },
  { value: 'FREE_SIZE', label: 'Free Size', headSize: '56-60 cm' },
] as const;

// Brands
export const BRANDS = [
  'Vega',
  'Steelbird',
  'Studds',
  'LS2',
  'MT Helmets',
  'Axor',
  'SMK',
  'Royal Enfield',
] as const;

// Sort Options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Popular' },
  { value: 'name_asc', label: 'A to Z' },
  { value: 'name_desc', label: 'Z to A' },
] as const;

// Price Ranges
export const PRICE_RANGES = [
  { label: 'Under Rs.1,000', min: 0, max: 999 },
  { label: 'Rs.1,000 - Rs.2,000', min: 1000, max: 2000 },
  { label: 'Rs.2,000 - Rs.5,000', min: 2000, max: 5000 },
  { label: 'Rs.5,000 - Rs.10,000', min: 5000, max: 10000 },
  { label: 'Above Rs.10,000', min: 10000, max: 999999 },
] as const;

// Order Statuses
export const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'warning' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'accent' },
  { value: 'PROCESSING', label: 'Processing', color: 'accent' },
  { value: 'SHIPPED', label: 'Shipped', color: 'accent' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', color: 'accent' },
  { value: 'DELIVERED', label: 'Delivered', color: 'success' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'error' },
  { value: 'RETURNED', label: 'Returned', color: 'neutral' },
] as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'RAZORPAY', label: 'Pay Online', description: 'UPI, Card, Net Banking' },
  { value: 'COD', label: 'Cash on Delivery', description: 'Pay when delivered' },
] as const;

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
] as const;

// Shipping
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_COST = 99;
export const GST_RATE = 0.18;

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

// Image Limits
export const MAX_PRODUCT_IMAGES = 10;
export const MAX_REVIEW_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Rating Labels
export const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

// Features - no emojis, use icon identifiers
export const HELMET_FEATURES = [
  { icon: 'shield-check', title: 'ISI Certified', description: 'Safety standards met' },
  { icon: 'truck', title: 'Free Shipping', description: 'Orders above Rs.999' },
  { icon: 'refresh-cw', title: '7-Day Returns', description: 'Easy returns' },
  { icon: 'check-circle', title: 'Genuine', description: '100% authentic' },
] as const;

// Social Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/helmet',
  instagram: 'https://instagram.com/helmet',
  twitter: 'https://twitter.com/helmet',
  youtube: 'https://youtube.com/helmet',
} as const;

// Contact Info
export const CONTACT_INFO = {
  email: 'support@helmet.com',
  phone: '+91 98765 43210',
  address: 'Pune, Maharashtra, India',
  workingHours: 'Mon-Sat: 9AM - 8PM',
} as const;
