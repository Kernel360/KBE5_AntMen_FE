'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Review } from '@/entities/review/model/types';
import { ReviewCard } from '@/entities/review/ui/ReviewCard';
import { EditReviewModal, DeleteConfirmModal } from '@/shared/ui/modal/ReviewModals';
import { customerApi } from '@/shared/api/review';
import { mapReviewResponseToModel } from '@/entities/review/lib/mappers';
import { CommonHeader } from '@/shared/ui/Header/CommonHeader';

function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-slate-500">아직 작성한 리뷰가 없습니다.</p>
    </div>
  );
}

export default function ReviewsPageClient() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const reviewResponses = await customerApi.getMyWrittenReviews();
        const mappedReviews = reviewResponses.map(mapReviewResponseToModel);
        setReviews(mappedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('리뷰를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
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
      // API 호출
      await customerApi.updateReview(Number(id), {
        reviewRating: newRating,
        reviewComment: newContent,
      });

      // 성공 시 로컬 상태 업데이트
      setReviews(prev => prev.map(r => 
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

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      setIsDeleting(true);
      
      // API 호출
      await customerApi.deleteReview(Number(selectedReview.id));

      // 성공 시 로컬 상태 업데이트
      setReviews(prev => prev.filter(r => r.id !== selectedReview.id));

      // 모달 닫기
      handleCloseModals();
      
      // 성공 메시지
      alert('리뷰가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert('리뷰 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="리뷰 관리"
        showBackButton
      />

      {/* 내용 */}
      <div className="pt-0 p-5 pb-20 min-h-[calc(100vh-64px)] space-y-4">
        {isLoading ? (
          <div className="text-center py-20 text-slate-400">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={id => {
                const r = reviews.find(r => r.id === id);
                if (r) handleOpenEditModal(r);
              }}
              onDelete={id => {
                const r = reviews.find(r => r.id === id);
                if (r) handleOpenDeleteModal(r);
              }}
            />
          ))
        ) : (
          <EmptyState />
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