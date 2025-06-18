'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ReviewCard } from '@/entities/review/ui/ReviewCard';
import { StaticStarRating } from '@/shared/ui/StaticStarRating';
import { EllipsisVerticalIcon, StarIcon as StarIconSolid, XMarkIcon } from '@heroicons/react/24/solid';
import { mapReviewResponseToModel } from '@/entities/review/lib/mappers';
import type { Review } from '@/entities/review/model/types';
import { updateReview } from '@/entities/review/api/reviewApi';

// API fetch helpers
async function fetchReceivedReviews() {
  const res = await fetch('http://localhost:9092/v1/manager/reviews/my/received', { credentials: 'include' });
  if (!res.ok) throw new Error('받은 리뷰를 불러오지 못했습니다');
  const data = await res.json();
  return data.map(mapReviewResponseToModel);
}
async function fetchWrittenReviews() {
  const res = await fetch('http://localhost:9092/v1/manager/reviews/my/written', { credentials: 'include' });
  if (!res.ok) throw new Error('작성한 리뷰를 불러오지 못했습니다');
  const data = await res.json();
  return data.map(mapReviewResponseToModel);
}

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

function EditReviewModal({
  isOpen,
  onClose,
  review,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  onSave: (id: string, newRating: number, newContent: string) => Promise<void>;
}) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setContent(review.comment);
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const handleSave = async () => {
    if (rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(review.id, rating, content);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">리뷰 수정</h2>
          <button onClick={onClose} disabled={isSubmitting}>
            <XMarkIcon className="w-6 h-6"/>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">별점</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIconSolid
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } ${isSubmitting ? 'opacity-50' : ''}`}
                  onClick={() => !isSubmitting && setRating(star)}
                />
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
              내용
            </label>
            <textarea
              id="review-content"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {content.length}/200
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium disabled:opacity-50"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-500 text-white rounded-md text-sm font-medium disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-lg font-bold mb-4">리뷰 삭제</h2>
        <p className="text-slate-600 mb-6">정말로 이 리뷰를 삭제하시겠습니까?</p>
        <div className="flex justify-center gap-4">
           <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 rounded-md text-sm font-medium"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
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

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchReceivedReviews(), fetchWrittenReviews()])
      .then(([received, written]) => {
        setReceivedReviews(received);
        setWrittenReviews(written);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
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
      // API 호출
      await updateReview(Number(id), {
        reviewRating: newRating,
        reviewComment: newContent,
      });

      // 성공 시 로컬 상태 업데이트
      setWrittenReviews(prev => prev.map(r => 
        r.id === id 
          ? { ...r, rating: newRating, comment: newContent } 
          : r
      ));

      // 모달 닫기
      handleCloseModals();
      
      // 성공 메시지
      alert('리뷰가 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      alert('리뷰 수정에 실패했습니다.');
    }
  };
  const handleDeleteReview = () => {
    if (selectedReview) {
      setWrittenReviews(prev => prev.filter(r => r.id !== selectedReview.id));
      handleCloseModals();
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-5 border-b">
        <button onClick={() => router.back()} className="p-1">
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">리뷰 관리</h1>
        <div className="w-6" />
      </header>

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
      />
    </main>
  );
} 