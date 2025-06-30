'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/Button';
import { Textarea } from '@/shared/components/Textarea';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const CommentForm = ({ onSubmit, isSubmitting }: CommentFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await onSubmit(content);
      setContent(''); // 성공 시 입력 필드 초기화
    } catch (error) {
      console.error('댓글 작성 중 오류 발생:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-stretch space-x-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 작성해주세요."
        rows={1}
        className="flex-1 resize-none h-10 overflow-y-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        disabled={!content.trim() || isSubmitting}
        isLoading={isSubmitting}
        className="h-10 px-4 text-sm font-medium flex-shrink-0"
      >
        작성
      </Button>
    </form>
  );
}; 