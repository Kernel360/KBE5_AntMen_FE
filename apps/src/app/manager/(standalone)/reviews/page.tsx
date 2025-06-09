'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ReviewCard, type Review } from '@/entities/review/ui';
import { StaticStarRating } from '@/shared/ui/StaticStarRating';
import { EllipsisVerticalIcon, StarIcon as StarIconSolid, XMarkIcon } from '@heroicons/react/24/solid';

// --- Mock Data ---

// 내가 받은 리뷰 (고객이 매니저에게 쓴 리뷰)
const MOCK_RECEIVED_REVIEWS: Review[] = [
  {
    id: 'R1',
    userName: '김고객',
    rating: 5,
    content: '정말 꼼꼼하고 친절하게 청소해주셨어요. 감동입니다!',
    date: '2024년 5월 20일',
  },
  {
    id: 'R2',
    userName: '이손님',
    rating: 4,
    content: '시간 약속도 잘 지켜주시고, 청소도 만족스럽습니다.',
    date: '2024년 5월 12일',
  },
];

// 내가 쓴 리뷰 (매니저가 고객에게 쓴 리뷰)
interface WrittenReview {
  id: string;
  customerName: string;
  serviceType: string;
  serviceDate: string;
  rating: number;
  content: string;
}

const MOCK_WRITTEN_REVIEWS: WrittenReview[] = [
  {
    id: 'W1',
    customerName: '박단골',
    serviceType: '정기 청소',
    serviceDate: '2024년 5월 18일',
    rating: 5,
    content: '항상 집을 깨끗하게 유지해주셔서 감사합니다. 배려심이 깊은 고객님입니다.',
  },
];

type ActiveTab = 'received' | 'written';

// --- Components ---

function WrittenReviewCard({ 
  review,
  onEdit,
  onDelete
}: { 
  review: WrittenReview,
  onEdit: (review: WrittenReview) => void,
  onDelete: (review: WrittenReview) => void 
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleEdit = () => {
    onEdit(review);
    setMenuOpen(false);
  }

  const handleDelete = () => {
    onDelete(review);
    setMenuOpen(false);
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-slate-800 text-lg">{review.customerName} 고객님</span>
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
                  <button
                    onClick={handleEdit}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-500">
          {review.serviceType} · {review.serviceDate}
        </div>
      </div>
      <p className="text-slate-700 text-sm leading-relaxed">{review.content}</p>
    </div>
  );
}

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

// 리뷰 통계 컴포넌트
function ReviewStats({ reviews }: { reviews: { rating: number }[] }) {
  if (!reviews || reviews.length === 0) {
    return null; // 리뷰가 없으면 이 섹션을 표시하지 않음
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

// 리뷰 수정 모달
function EditReviewModal({
  isOpen,
  onClose,
  review,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  review: WrittenReview | null;
  onSave: (id: string, newRating: number, newContent: string) => void;
}) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setContent(review.content);
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const handleSave = () => {
    onSave(review.id, rating, content);
    onClose();
  };

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
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIconSolid
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
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
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-500 text-white rounded-md text-sm font-medium"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// 삭제 확인 모달
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

// --- Page ---

export default function ManagerReviewsManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('received');
  const [writtenReviews, setWrittenReviews] = useState(MOCK_WRITTEN_REVIEWS);

  // 모달 상태 관리
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<WrittenReview | null>(null);

  const handleOpenEditModal = (review: WrittenReview) => {
    setSelectedReview(review);
    setEditModalOpen(true);
  };
  
  const handleOpenDeleteModal = (review: WrittenReview) => {
    setSelectedReview(review);
    setDeleteModalOpen(true);
  };
  
  const handleCloseModals = () => {
    setSelectedReview(null);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };

  // 리뷰 저장 핸들러
  const handleSaveReview = (id: string, newRating: number, newContent: string) => {
    setWrittenReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === id ? { ...review, rating: newRating, content: newContent } : review
      )
    );
    handleCloseModals();
  };
  
  // 리뷰 삭제 핸들러
  const handleDeleteReview = () => {
    if (selectedReview) {
      setWrittenReviews(prev => prev.filter(review => review.id !== selectedReview.id));
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
      {activeTab === 'received' && <ReviewStats reviews={MOCK_RECEIVED_REVIEWS} />}

      {/* Content */}
      <div className="p-5 space-y-4">
        {activeTab === 'received' && (
          MOCK_RECEIVED_REVIEWS.length > 0
            ? MOCK_RECEIVED_REVIEWS.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            : <EmptyState tab="received" />
        )}
        
        {activeTab === 'written' && (
          writtenReviews.length > 0
            ? writtenReviews.map(review => (
                <WrittenReviewCard 
                  key={review.id} 
                  review={review}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              ))
            : <EmptyState tab="written" />
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