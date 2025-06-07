"use client";

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
}

export const StarRating = ({ rating, onRatingChange, size = 32 }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (selectedRating: number) => {
    onRatingChange(selectedRating);
  };

  const handleStarHover = (selectedRating: number) => {
    setHoverRating(selectedRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="flex justify-center items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            className={`transition-colors duration-200 ${
              isActive ? 'text-[#4ABED9]' : 'text-[#EDECEC]'
            }`}
            style={{ width: size, height: size }}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
            aria-label={`${star}점 선택`}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L14.09 8.26L22 9L16 14.74L17.18 22.5L12 19.77L6.82 22.5L8 14.74L2 9L9.91 8.26L12 2Z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}; 