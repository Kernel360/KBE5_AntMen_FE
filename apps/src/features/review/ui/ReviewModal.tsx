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
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-[20px] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <header className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-lg font-black text-[#333333]">리뷰</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center"
            aria-label="닫기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>

        {/* 콘텐츠 */}
        <main className="px-6 pt-6 pb-8 space-y-8">
          {/* 질문 섹션 */}
          <section className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium text-[#333333] text-center">
                서비스에 만족하셨나요?
              </h3>
              <p className="text-sm text-[#666666] text-center">
                고객님의 소중한 의견을 남겨주세요.
              </p>
            </div>
            
            {/* 별점 */}
            <StarRating 
              rating={rating} 
              onRatingChange={setRating}
              size={32}
            />
          </section>

          {/* 피드백 섹션 */}
          <section className="space-y-4">
            <div className="bg-[#F5F5F5] rounded-lg p-4 h-[120px] flex flex-col">
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="고객님의 의견을 함께 남겨주세요.&#10;더 나은 서비스로 보답하겠습니다.&#10;(선택사항, 비밀 주소 등 개인정보 입력 불가)"
                className="flex-1 bg-transparent resize-none outline-none text-sm text-[#333333] placeholder-[#999999] leading-relaxed"
                maxLength={500}
              />
              <div className="flex justify-end">
                <span className="text-xs text-[#CCCCCC]">
                  {content.length}/500
                </span>
              </div>
            </div>
          </section>

          {/* 등록 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full h-12 bg-[#4ABED9] rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-base font-black text-white">
              등록
            </span>
          </button>
        </main>
      </div>
    </div>
  );
}; 