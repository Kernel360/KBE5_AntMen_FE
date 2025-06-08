'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { MANAGER_LIST, type Manager } from '@/widgets/manager/model/manager';
import { ReviewCard } from '@/entities/review/ui';
import { ManagerDetailLoading } from '@/widgets/manager';
import { StaticStarRating } from '@/shared/ui/StaticStarRating';

export default function ManagerReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const managerId = params?.managerId as string;

  const [manager, setManager] = useState<Manager | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadManagerData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundManager = MANAGER_LIST.find(m => m.id === managerId);
      setManager(foundManager || null);
      setIsLoading(false);
    };

    if (managerId) {
      loadManagerData();
    }
  }, [managerId]);

  if (isLoading) {
    return <ManagerDetailLoading />;
  }

  if (!manager) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-800">매니저를 찾을 수 없습니다</h2>
          <button onClick={() => router.back()} className="text-primary hover:underline">
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const averageRating = manager.reviews.length > 0
    ? manager.reviews.reduce((sum, r) => sum + r.rating, 0) / manager.reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[420px] mx-auto">
        <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-600">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">{manager.name} 매니저님의 전체 리뷰</h1>
          <div className="w-6 h-6" />
        </header>

        <section className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-base font-semibold text-slate-600 mb-2">전체 평점</h2>
              <div className="flex items-center gap-2">
                <StaticStarRating rating={averageRating} />
                <span className="text-2xl font-bold text-slate-800">{averageRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-slate-600 mb-2">리뷰 총 개수</h2>
              <p className="text-2xl font-bold text-slate-800">
                {manager.reviews.length}개
              </p>
            </div>
          </div>
        </section>

        <main className="p-5">
          <div className="space-y-4">
            {manager.reviews.length > 0 ? (
              manager.reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-500">아직 작성된 리뷰가 없습니다.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 