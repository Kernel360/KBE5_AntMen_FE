'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ReviewCard } from '@/entities/review/ui/ReviewCard';
import { StaticStarRating } from '@/shared/ui/StaticStarRating';
import { EllipsisVerticalIcon, StarIcon as StarIconSolid, XMarkIcon } from '@heroicons/react/24/solid';
import { mapReviewResponseToModel } from '@/entities/review/lib/mappers';
import type { Review } from '@/entities/review/model/types';
import { managerApi } from '@/shared/api/review';
import { EditReviewModal, DeleteConfirmModal } from '@/shared/ui/modal/ReviewModals';
import { CommonHeader } from '@/shared/ui/Header/CommonHeader';

type ActiveTab = 'received' | 'written';

function EmptyState({ tab }: { tab: ActiveTab }) {
  const message = tab === 'received'
    ? '아직 받은 리뷰가 없습니다.'
    : '아직 작성한 리뷰가 없습니다.';
  return (
    <div className="text-center py-20">
      <p className="text-slate-500">{message}</p>
    </div>
  );
}

function ReviewStats({ reviews }: { reviews: { rating: number }[] }) {
  if (!reviews || reviews.length === 0) {
    return null;
  }
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  return (
    <section className="p-5 border-b border-gray-100 bg-slate-50">
      <div className="flex items-center gap-4">
        <div className="flex-1 text-center">
          <h2 className="text-sm font-semibold text-slate-500 mb-1">리뷰 총 개수</h2>
          <p className="text-xl font-bold text-slate-800">{totalReviews}개</p>
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-sm font-semibold text-slate-500 mb-1">전체 평점</h2>
          <div className="flex items-center justify-center gap-2">
            <StaticStarRating rating={averageRating} />
            <span className="text-xl font-bold text-slate-800">{averageRating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// 이름 마스킹 함수
function maskName(name: string) {
  if (!name) return '';
  return name[0] + '*'.repeat(name.length - 1);
}

export default function ManagerReviewsClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('received');
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([]);
  const [writtenReviews, setWrittenReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const [receivedResponses, writtenResponses] = await Promise.all([
          managerApi.getMyReceivedReviews(),
          managerApi.getMyWrittenReviews()
        ]);
        setReceivedReviews(receivedResponses.map(mapReviewResponseToModel));
        setWrittenReviews(writtenResponses.map(mapReviewResponseToModel));
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('리뷰를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleOpenEditModal = (review: Review) => {
    setSelectedReview(review);
    setEditModalOpen(true);
  };

  const handleOpenDeleteModal = (review: Review) => {
    setSelectedReview(review);
    setDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setSelectedReview(null);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };

  const handleSaveReview = async (id: string, newRating: number, newContent: string) => {
    try {
      await managerApi.updateReview(Number(id), {
        reviewRating: newRating,
        reviewComment: newContent,
      });

      // 성공 시 로컬 상태 업데이트
      setWrittenReviews(prev => prev.map(r => 
        r.id === id 
          ? { ...r, rating: newRating, comment: newContent } 
          : r
      ));

      handleCloseModals();
      alert('리뷰가 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      alert('리뷰 수정에 실패했습니다.');
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      setIsDeleting(true);
      await managerApi.deleteReview(Number(selectedReview.id));

      // 성공 시 로컬 상태 업데이트
      setWrittenReviews(prev => prev.filter(r => r.id !== selectedReview.id));

      handleCloseModals();
      alert('리뷰가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert('리뷰 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <CommonHeader 
        title="리뷰 관리"
        showBackButton
      />

      {/* Tab Navigation */}
      <nav className="flex">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-3 text-center text-sm font-semibold ${
            activeTab === 'received'
              ? 'border-b-2 border-slate-800 text-slate-800'
              : 'text-slate-400'
          }`}
        >
          받은 리뷰
        </button>
        <button
          onClick={() => setActiveTab('written')}
          className={`flex-1 py-3 text-center text-sm font-semibold ${
            activeTab === 'written'
              ? 'border-b-2 border-slate-800 text-slate-800'
              : 'text-slate-400'
          }`}
        >
          작성한 리뷰
        </button>
      </nav>

      {/* 리뷰 통계 (받은 리뷰 탭 전용) */}
      {activeTab === 'received' && <ReviewStats reviews={receivedReviews} />}

      {/* Content */}
      <div className="p-5 space-y-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <>
            {activeTab === 'received' && (
              receivedReviews.length > 0
                ? receivedReviews.map(review => (
                    <ReviewCard
                      key={review.id}
                      review={{
                        ...review,
                        customerName: maskName(review.customerName),
                      }}
                      showProfileType="customer"
                    />
                  ))
                : <EmptyState tab="received" />
            )}
            {activeTab === 'written' && (
              writtenReviews.length > 0
                ? writtenReviews.map(review => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      showProfileType="customer"
                      serviceType={'serviceType' in review ? (review as any).serviceType : undefined}
                      serviceDate={'serviceDate' in review ? (review as any).serviceDate : undefined}
                      onEdit={id => {
                        const r = writtenReviews.find(r => r.id === id);
                        if (r) handleOpenEditModal(r);
                      }}
                      onDelete={id => {
                        const r = writtenReviews.find(r => r.id === id);
                        if (r) handleOpenDeleteModal(r);
                      }}
                    />
                  ))
                : <EmptyState tab="written" />
            )}
          </>
        )}
      </div>

      {/* 모달 렌더링 */}
      <EditReviewModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        review={selectedReview}
        onSave={handleSaveReview}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteReview}
        isDeleting={isDeleting}
      />
    </main>
  );
} 