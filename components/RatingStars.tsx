
import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          size={12} 
          fill={star <= Math.round(rating) ? "#FFD700" : "transparent"} 
          className={star <= Math.round(rating) ? "text-[#FFD700]" : "text-neutral-300"}
        />
      ))}
      <span className="text-[10px] font-black ml-1 text-neutral-900">{rating.toFixed(1)}</span>
    </div>
  );
};
