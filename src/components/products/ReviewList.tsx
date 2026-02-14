'use client';

import React from 'react';
import { StarRating } from '@/components/ui/StarRating';
import { Review } from '@/types';
import { formatDate, getRelativeTime } from '@/lib/utils';
import { User, ThumbsUp, CheckCircle } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
  totalRating: number;
  reviewCount: number;
}

export function ReviewList({ reviews, totalRating, reviewCount }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-brand-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviewCount > 0
      ? Math.round((reviews.filter((r) => r.rating === star).length / reviewCount) * 100)
      : 0,
  }));

  return (
    <div>
      {/* Rating summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b border-white/5">
        {/* Average rating */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-white">{totalRating.toFixed(1)}</span>
          <StarRating rating={totalRating} size={20} className="mt-2" />
          <span className="text-sm text-brand-500 mt-1">{reviewCount} reviews</span>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-2">
          {distribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm text-brand-400 w-8">{star}★</span>
              <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-brand-500 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="pb-6 border-b border-white/5 last:border-0">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                {review.user.avatar ? (
                  <img
                    src={review.user.avatar}
                    alt={review.user.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={18} className="text-accent-500" />
                )}
              </div>

              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-white">
                    {review.user.fullName}
                  </span>
                  {review.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle size={12} />
                      Verified Purchase
                    </span>
                  )}
                </div>

                {/* Rating & date */}
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={review.rating} size={14} />
                  <span className="text-xs text-brand-500">{getRelativeTime(review.createdAt)}</span>
                </div>

                {/* Title */}
                {review.title && (
                  <h4 className="font-semibold text-sm text-white mt-2">{review.title}</h4>
                )}

                {/* Comment */}
                <p className="text-sm text-brand-400 mt-1 leading-relaxed">{review.comment}</p>

                {/* Review images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img, idx) => (
                      <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={img}
                          alt={`Review image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
