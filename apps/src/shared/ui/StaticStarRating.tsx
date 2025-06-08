import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface StaticStarRatingProps {
  rating: number;
  totalStars?: number;
}

// 반쪽 별 컴포넌트
function HalfStar() {
  return (
    <div className="relative inline-block">
      {/* 배경으로 빈 별 */}
      <StarIconOutline className="h-5 w-5 text-yellow-400" />
      {/* 절반만 채워진 별 */}
      <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
        <StarIconSolid className="h-5 w-5 text-yellow-400" />
      </div>
    </div>
  );
}

export function StaticStarRating({ rating, totalStars = 5 }: StaticStarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {/* 꽉 찬 별 */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIconSolid key={`full-${i}`} className="h-5 w-5 text-yellow-400" />
      ))}
      
      {/* 반쪽 별 */}
      {hasHalfStar && <HalfStar />}

      {/* 빈 별 */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarIconOutline key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      ))}
    </div>
  );
} 