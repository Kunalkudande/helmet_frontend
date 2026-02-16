'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  ShoppingCart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useProduct, useRelatedProducts, useWishlist } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { ImageGallery } from '@/components/products/ImageGallery';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ReviewList } from '@/components/products/ReviewList';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { ProductDetailSkeleton } from '@/components/ui/Loader';
import {
  formatPrice,
  getDiscountPercentage,
  getCategoryDisplayName,
  getSizeDisplayName,
  cn,
} from '@/lib/utils';
import { SIZES, SITE_URL } from '@/lib/constants';
import Script from 'next/script';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: product, isLoading } = useProduct(slug);
  const { data: relatedProducts, isLoading: relatedLoading } = useRelatedProducts(product?.slug || '');
  const { addToCart, isUpdating, items: cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const inWishlist = product ? isInWishlist(product.id) : false;

  // Check if product is already in cart
  const isInCart = product ? cartItems.some((item: any) => item.productId === product.id || item.product?.id === product.id) || addedToCart : false;

  const productJsonLd = useMemo(() => {
    if (!product) return null;

    const productPrice = Number(product.price);
    const productDiscountPrice = product.discountPrice ? Number(product.discountPrice) : null;
    const offerPrice = productDiscountPrice && productDiscountPrice < productPrice ? productDiscountPrice : productPrice;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images?.map((img: { imageUrl: string }) => img.imageUrl),
      description: product.description,
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: offerPrice,
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${SITE_URL}/products/${product.slug}`,
      },
      aggregateRating:
        product.totalReviews && product.totalReviews > 0
          ? {
              '@type': 'AggregateRating',
              ratingValue: Number(product.rating) || 0,
              reviewCount: product.totalReviews,
            }
          : undefined,
    };
  }, [product]);

  // Update document title for SEO
  React.useEffect(() => {
    if (product) {
      document.title = `${product.name} - ${product.brand} | Bikers Brain`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', product.description?.slice(0, 160) || '');
      }
    }
  }, [product]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-brand-400 mb-6">The helmet you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products">
          <Button>Browse All Helmets</Button>
        </Link>
      </div>
    );
  }

  const price = Number(product.price);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const discount = discountPrice && discountPrice < price
    ? getDiscountPercentage(discountPrice, price)
    : 0;

  // Get available sizes and colors from variants
  const availableSizes = Array.from(new Set(product.variants?.map((v) => v.size) || []));
  const availableColors = Array.from(new Set(product.variants?.map((v) => v.color).filter(Boolean) || []));

  const handleAddToCart = () => {
    // If already in cart, redirect to cart page
    if (isInCart) {
      router.push('/cart');
      return;
    }

    if (!selectedSize && availableSizes.length > 0) {
      const { default: toast } = require('react-hot-toast');
      toast.error('Please select a size');
      return;
    }

    // Find the matching variant to get variantId
    const variant = product.variants?.find(
      (v) =>
        (!selectedSize || v.size === selectedSize) &&
        (!selectedColor || v.color === selectedColor)
    );

    addToCart({
      productId: product.id,
      variantId: variant?.id,
      quantity,
    });
    setAddedToCart(true);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast.error('Please log in to save helmets to your wishlist.');
      return;
    }

    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div>
      {productJsonLd && (
        <Script
          id="ld-json-product"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      {/* Breadcrumb */}
      <div className="bg-[hsl(0,0%,7%)] border-b border-white/5">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-brand-500">
            <Link href="/" className="hover:text-accent-400 transition">Home</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-accent-400 transition">Products</Link>
            <ChevronRight size={14} />
            <Link href={`/products?category=${product.category}`} className="hover:text-accent-400 transition">
              {getCategoryDisplayName(product.category)}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ImageGallery images={product.images} productName={product.name} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-5"
          >
            {/* Brand & Category */}
            <div className="flex items-center gap-2">
              <span className="badge-primary">{product.brand}</span>
              <span className="badge bg-white/5 text-brand-300 border border-white/10">{getCategoryDisplayName(product.category)}</span>
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-display text-white tracking-wide">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={Number(product.rating)} size={18} showValue showCount reviewCount={product.totalReviews} />
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold text-white">{formatPrice(discountPrice && discountPrice < price ? discountPrice : price)}</span>
              {discountPrice && discountPrice < price && (
                <>
                  <span className="text-lg text-brand-500 line-through">{formatPrice(price)}</span>
                  <span className="bg-green-500/10 text-green-400 text-sm font-bold px-2 py-0.5 rounded-md border border-green-500/20">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-brand-300 leading-relaxed">{product.description?.slice(0, 200)}{product.description?.length > 200 ? '...' : ''}</p>

            {/* Certification */}
            {product.specifications?.certifications && product.specifications.certifications.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded-lg w-fit border border-green-500/20">
                <Shield size={16} />
                <span className="font-medium">{product.specifications.certifications.join(', ')} Certified</span>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Size {selectedSize && `- ${getSizeDisplayName(selectedSize)}`}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const variant = product.variants?.find((v) => v.size === size);
                    const isOutOfStock = variant && variant.stock === 0;
                    return (
                      <button
                        key={size}
                        onClick={() => !isOutOfStock && setSelectedSize(size)}
                        disabled={isOutOfStock}
                        className={cn(
                          'px-4 py-2 rounded-lg border text-sm font-medium transition',
                          selectedSize === size
                            ? 'bg-accent-500 text-white border-accent-500'
                            : isOutOfStock
                            ? 'border-white/5 text-brand-600 cursor-not-allowed line-through'
                            : 'border-white/10 text-brand-300 hover:border-accent-500/50 hover:text-accent-400'
                        )}
                      >
                        {getSizeDisplayName(size)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Color {selectedColor && `- ${selectedColor}`}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const variant = product.variants?.find((v) => v.color === color);
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          'px-4 py-2 rounded-lg border text-sm font-medium transition flex items-center gap-2',
                          selectedColor === color
                            ? 'bg-accent-500 text-white border-accent-500'
                            : 'border-white/10 text-brand-300 hover:border-accent-500/50'
                        )}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-brand-400 hover:border-accent-500/50 hover:text-accent-400 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-brand-400 hover:border-accent-500/50 hover:text-accent-400 transition"
                >
                  <Plus size={16} />
                </button>
                <span className="text-sm text-brand-500 ml-2">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                size="lg"
                fullWidth
                isLoading={isUpdating}
                disabled={product.stock === 0}
                leftIcon={<ShoppingCart size={18} />}
                className={isInCart ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {product.stock === 0 ? 'Out of Stock' : isInCart ? 'Go to Cart' : 'Add to Cart'}
              </Button>
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`w-12 h-12 flex-shrink-0 rounded-lg border flex items-center justify-center transition ${
                  inWishlist
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : 'border-white/10 text-brand-400 hover:border-red-500/50 hover:text-red-400'
                }`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={20} />
              </button>
              <button className="w-12 h-12 flex-shrink-0 rounded-lg border border-white/10 flex items-center justify-center text-brand-400 hover:border-accent-500/50 hover:text-accent-400 transition">
                <Share2 size={20} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-brand-400">
                <Truck size={16} className="text-accent-500" />
                <span>Free shipping above ₹999</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-400">
                <Shield size={16} className="text-accent-500" />
                <span>Genuine product</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-400">
                <RotateCcw size={16} className="text-accent-500" />
                <span>7-day returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs: Description, Specs, Reviews */}
        <div className="mt-16">
          <div className="border-b border-white/10">
            <nav className="flex gap-0">
              {(['description', 'specifications', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-6 py-3 text-sm font-semibold border-b-2 transition capitalize',
                    activeTab === tab
                      ? 'text-accent-500 border-accent-500'
                      : 'text-brand-500 border-transparent hover:text-white'
                  )}
                >
                  {tab}
                  {tab === 'reviews' && ` (${product.totalReviews})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none text-brand-300">
                <p className="leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-xl">
                {product.specifications ? (
                  <div className="space-y-0">
                    {[
                      { label: 'Weight', value: product.specifications.weight },
                      { label: 'Material', value: product.specifications.material },
                      { label: 'Visor Type', value: product.specifications.visorType },
                      { label: 'Ventilation', value: product.specifications.ventilation ? 'Yes' : 'No' },
                      { label: 'Certifications', value: product.specifications.certifications?.join(', ') },
                      { label: 'Features', value: product.specifications.features?.join(', ') },
                    ].filter(s => s.value).map((spec, index) => (
                      <div
                        key={spec.label}
                        className={`flex py-3 ${index % 2 === 0 ? 'bg-white/[0.03]' : ''} px-4 rounded`}
                      >
                        <span className="w-1/3 text-sm font-medium text-brand-500">{spec.label}</span>
                        <span className="w-2/3 text-sm text-white">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-brand-500">No specifications available</p>
                )}

                {/* SKU */}
                <div className="mt-6 space-y-0">
                  <div className="flex py-3 px-4 rounded">
                    <span className="w-1/3 text-sm font-medium text-brand-500">SKU</span>
                    <span className="w-2/3 text-sm text-white">{product.sku}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewList
                reviews={product.reviews || []}
                totalRating={Number(product.rating)}
                reviewCount={product.totalReviews}
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16 pb-8">
            <h2 className="section-heading mb-8">Related Helmets</h2>
            <ProductGrid products={relatedProducts} isLoading={relatedLoading} columns={4} />
          </section>
        )}
      </div>
    </div>
  );
}
