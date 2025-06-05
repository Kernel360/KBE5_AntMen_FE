"use client";

import React, { useState } from 'react';
import { StarRating } from './StarRating';
import type { CreateReviewData } from '@/entities/review';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: CreateReviewData) => void;
  reservationId: string;
}

export const ReviewModal = ({ isOpen, onClose, onSubmit, reservationId }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('별점을 선택해 주세요.');
      return;
    }

    onSubmit({
      reservationId,
      rating,
      content: content.trim(),
    });

    // Reset form
    setRating(0);
    setContent('');
    onClose();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setContent(value);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white rounded-t-[20px] z-50">
        {/* Header */}
        <header className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-lg font-black text-[#333333]">리뷰</h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center"
            aria-label="모달 닫기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="#666666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-8 px-6 py-6 pb-8">
          {/* Question Section */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-center">
              <h3 className="text-base font-medium text-[#333333]">
                서비스에 만족하셨나요?
              </h3>
              <p className="text-sm text-[#666666]">
                고객님의 소중한 의견을 남겨주세요.
              </p>
            </div>
            
            <StarRating 
              rating={rating} 
              onRatingChange={setRating}
            />
          </section>

          {/* Feedback Section */}
          <section className="flex flex-col gap-4">
            <label htmlFor="review-content" className="text-sm text-[#666666]">
              내용
            </label>
            
            <div className="bg-[#F5F5F5] rounded-lg p-4 h-[120px]">
              <textarea
                id="review-content"
                value={content}
                onChange={handleContentChange}
                placeholder="고객님의 의견을 함께 남겨주세요.&#10;더 나은 서비스로 보답하겠습니다.&#10;(선택사항, 비밀 주소 등 개인정보 입력 불가)"
                className="w-full h-full bg-transparent text-sm text-[#333333] placeholder:text-[#999999] resize-none outline-none leading-relaxed"
                maxLength={500}
              />
              <div className="flex justify-end mt-2">
                <span className="text-xs text-[#CCCCCC]">
                  {content.length}/500
                </span>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#4ABED9] text-white font-black text-base py-4 rounded-lg"
          >
            등록
          </button>
        </div>
      </div>
    </>
  );
}; 