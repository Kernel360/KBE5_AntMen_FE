import { StaticStarRating } from '@/shared/ui/StaticStarRating';

// Assuming a review type, let's define a basic one.
export interface Review {
  id: string;
  userName: string;
  rating: number;
  content: string;
  date: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-slate-800">{review.userName}</span>
        <StaticStarRating rating={review.rating} />
      </div>
      <p className="text-slate-700 text-sm leading-relaxed mb-2">{review.content}</p>
      <p className="text-xs text-slate-500">{review.date}</p>
    </div>
  );
} 