import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { getStarsArray } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  showCount?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  size = 16,
  showValue = false,
  showCount = false,
  reviewCount = 0,
  className = '',
}: StarRatingProps) {
  const stars = getStarsArray(rating);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {stars.map((star, index) => (
          <span key={index}>
            {star === 'full' ? (
              <Star size={size} className="text-yellow-400 fill-yellow-400" />
            ) : star === 'half' ? (
              <StarHalf size={size} className="text-yellow-400 fill-yellow-400" />
            ) : (
              <Star size={size} className="text-brand-600" />
            )}
          </span>
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-white ml-1">
          {rating.toFixed(1)}
        </span>
      )}
      {showCount && reviewCount > 0 && (
        <span className="text-sm text-brand-500 ml-1">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

// Interactive star rating for reviews
interface InteractiveStarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

export function InteractiveStarRating({
  value,
  onChange,
  size = 28,
}: InteractiveStarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={
              star <= value
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-brand-600 hover:text-yellow-300'
            }
          />
        </button>
      ))}
    </div>
  );
}
