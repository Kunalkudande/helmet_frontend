'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ShoppingCart, Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { PageLoader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/account/wishlist');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) return <PageLoader />;

  const items = wishlist || [];

  const handleMoveToCart = async (product: any) => {
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      removeFromWishlist(product.id);
      toast.success('Moved to cart!');
    } catch (error) {
      toast.error('Failed to move to cart');
    }
  };

  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      <div className="container-custom py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/account" className="text-brand-500 hover:text-accent-400">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-display text-white">My Wishlist</h1>
          {items.length > 0 && (
            <span className="text-sm text-brand-500">({items.length} items)</span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/[0.03] rounded-xl h-80 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.03] rounded-2xl border border-white/10">
            <Heart size={48} className="mx-auto text-brand-600 mb-4" />
            <h2 className="text-lg font-semibold text-white">Your wishlist is empty</h2>
            <p className="text-brand-500 mt-1">Save items you love for later</p>
            <Link
              href="/products"
              className="inline-block mt-4 px-6 py-2 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((item: any) => {
                const product = item.product || item;
                const productPrice = Number(product.discountPrice || product.price);
                const originalPrice = Number(product.price);
                const discount = product.discountPrice && Number(product.discountPrice) < originalPrice
                  ? getDiscountPercentage(Number(product.discountPrice), originalPrice)
                  : 0;
                const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white/[0.03] rounded-xl border border-white/10 overflow-hidden group"
                  >
                    <div className="relative aspect-square bg-white/5">
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                          {discount}% OFF
                        </span>
                      )}
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/20 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                      <Link href={`/products/${product.slug}`} className="block w-full h-full">
                        {primaryImage?.imageUrl && (
                          <img src={primaryImage.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </Link>
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-brand-500 uppercase">{product.brand}</p>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-medium text-white text-sm mt-1 truncate hover:text-accent-400 transition">
                          {product.name}
                        </h3>
                      </Link>

                      {Number(product.rating) > 0 && (
                        <div className="mt-1">
                          <StarRating rating={Number(product.rating)} size={14} />
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-white">{formatPrice(productPrice)}</span>
                        {discount > 0 && (
                          <span className="text-xs text-brand-500 line-through">{formatPrice(originalPrice)}</span>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          fullWidth
                          leftIcon={<ShoppingCart size={14} />}
                          onClick={() => handleMoveToCart(product)}
                        >
                          Move to Cart
                        </Button>
                        <Link href={`/products/${product.slug}`}>
                          <Button size="sm" variant="outline">
                            <ExternalLink size={14} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
