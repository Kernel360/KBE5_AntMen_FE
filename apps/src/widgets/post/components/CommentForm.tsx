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
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 작성해주세요."
        rows={3}
        className="w-full"
        disabled={isSubmitting}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          isLoading={isSubmitting}
        >
          댓글 작성
        </Button>
      </div>
    </form>
  );
}; 