"use client";

import React from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  readonly?: boolean;
}

export const StarRating = ({ rating, onRatingChange, readonly = false }: StarRatingProps) => {
  const handleStarClick = (starIndex: number) => {
    if (!readonly) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleStarClick(index)}
          disabled={readonly}
          className={`h-12 w-12 transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          aria-label={`${index + 1}점 평가`}
        >
          <svg
            width="49"
            height="48"
            viewBox="0 0 49 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <path
              d="M24.5 37.5L10.5 45L13.5 29.25L2 18.75L18 16.5L24.5 3L31 16.5L47 18.75L35.5 29.25L38.5 45L24.5 37.5Z"
              fill={index < rating ? '#4ABED9' : '#EDECEC'}
              stroke={index < rating ? '#4ABED9' : '#E5E5E5'}
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}; 