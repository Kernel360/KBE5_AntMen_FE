'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { StaticStarRating } from '@/shared/ui/StaticStarRating';
import { EllipsisVerticalIcon, StarIcon as StarIconSolid, XMarkIcon } from '@heroicons/react/24/solid';
import type { Review } from '@/entities/review/model/types';

function EditReviewModal({
    isOpen, onClose, review, onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    review: Review | null;
    onSave: (id: string, newRating: number, newContent: string) => void;
  }) {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
  
    useEffect(() => {
      if (review) {
        setRating(review.rating);
        setContent(review.comment); // comment 필드!
      }
    }, [review]);
  
    if (!isOpen || !review) return null;
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">리뷰 수정</h2>
            <button onClick={onClose}><XMarkIcon className="w-6 h-6"/></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">별점</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => <StarIconSolid key={star} className={`w-8 h-8 cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} onClick={() => setRating(star)} />)}
              </div>
            </div>
            <div>
              <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
              <textarea id="review-content" rows={4} className="w-full p-2 border border-gray-300 rounded-md" value={content} onChange={e => setContent(e.target.value)} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium">취소</button>
            <button onClick={() => { onSave(review.id, rating, content); onClose(); }} className="px-4 py-2 bg-cyan-500 text-white rounded-md text-sm font-medium">저장</button>
          </div>
        </div>
      </div>
    );
  }

  function DeleteConfirmModal({
    isOpen, onClose, onConfirm
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
             <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 rounded-md text-sm font-medium">취소</button>
             <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium">삭제</button>
          </div>
        </div>
      </div>
    );
}

function MyReviewCard({ review, onEdit, onDelete }: {
  review: Review,
  onEdit: (review: Review) => void,
  onDelete: (review: Review) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-slate-800 text-lg">{review.managerName}</span>
          <div className="flex items-center gap-2">
            <StaticStarRating rating={review.rating} />
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
                <EllipsisVerticalIcon className="w-5 h-5 text-slate-500" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-10 border"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button onClick={() => { onEdit(review); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100">수정</button>
                  <button onClick={() => { onDelete(review); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">삭제</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-500">
          {/* serviceType, serviceDate가 필요하면 reservationId로 fetch 필요 */}
          {new Date(review.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>
      <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-slate-500">아직 작성한 리뷰가 없습니다.</p>
    </div>
  );
}

// ... EditReviewModal, DeleteConfirmModal은 기존 목업 코드 그대로 복붙해서 사용

export default function ReviewsPageClient({ initialReviews }: { initialReviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

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

  const handleSaveReview = (id: string, newRating: number, newContent: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, rating: newRating, comment: newContent } : r));
    handleCloseModals();
  };

  const handleDeleteReview = () => {
    if (selectedReview) {
      setReviews(prev => prev.filter(r => r.id !== selectedReview.id));
      handleCloseModals();
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-5 border-b">
        <button onClick={() => router.back()} className="p-1">
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">리뷰 관리</h1>
        <div className="w-6" />
      </header>

      {/* 내용 */}
      <div className="p-5 space-y-4">
        {reviews.length > 0
          ? reviews.map(review => (
            <MyReviewCard
              key={review.id}
              review={review}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))
          : <EmptyState />
        }
      </div>

      {/* 모달 렌더링 */}
      {/* EditReviewModal, DeleteConfirmModal은 기존 목업 코드 그대로 사용 */}
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