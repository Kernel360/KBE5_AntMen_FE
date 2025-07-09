'use client';

import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import type { ReviewAuthorType, ReviewRequest } from '@/shared/api/review';

interface ReviewModalProps {
  isOpen: boolean;
  reservationId: number;
  onClose: () => void;
  onSubmit: (dto: ReviewRequest) => void;
  authorType: ReviewAuthorType;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  reservationId,
  onClose,
  onSubmit,
  authorType,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }
    if (content.trim() === '') {
      alert('후기 내용을 입력해주세요.');
      return;
    }

    onSubmit({
      reservationId,
      reviewRating: rating,
      reviewComment: content.trim(),
      reviewAuthor: authorType,
    });
    
    // 모달 초기화
    setRating(0);
    setHoveredRating(0);
    setContent('');
  };

  const handleClose = () => {
    // 모달 초기화
    setRating(0);
    setHoveredRating(0);
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[90%] max-w-[400px] bg-white rounded-xl p-6 relative">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">리뷰 작성</h2>
          <p className="text-sm text-gray-600">
            {authorType === 'MANAGER' 
              ? '고객님과의 업무는 어떠셨나요?' 
              : '매니저님의 서비스는 어떠셨나요?'}
          </p>
        </div>

        {/* 별점 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            별점을 선택해주세요
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-colors"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 5 && '⭐ 최고예요!'}
              {rating === 4 && '😊  좋아요!'}
              {rating === 3 && '🙂 보통이에요'}
              {rating === 2 && '😐 아쉬워요'}
              {rating === 1 && '😞 별로예요'}
            </p>
          )}
        </div>

        {/* 후기 내용 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            후기 내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={authorType === 'MANAGER' 
              ? "업무에 대한 소감을 자유롭게 작성해주세요."
              : "서비스에 대한 평가를 자유롭게 작성해주세요."}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4DD0E1] focus:border-transparent"
            maxLength={200}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {content.length}/200
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            나중에 작성
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}; 