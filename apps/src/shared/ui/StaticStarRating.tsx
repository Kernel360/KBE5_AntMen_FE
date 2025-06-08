import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface StaticStarRatingProps {
  rating: number;
  totalStars?: number;
}

export function StaticStarRating({ rating, totalStars = 5 }: StaticStarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0; 

  const stars = Array.from({ length: totalStars }, (_, i) => {
    if (i < fullStars) {
      return <StarIconSolid key={`star-solid-${i}`} className="h-5 w-5 text-yellow-400" />;
    }
    // No half-star logic for now, just outline
    return <StarIconOutline key={`star-outline-${i}`} className="h-5 w-5 text-gray-300" />;
  });

  return <div className="flex items-center">{stars}</div>;
} 