'use client';

import { useState, FormEvent } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
}

export const CommentForm = ({ onSubmit, isSubmitting = false }: CommentFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSubmitting) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 작성해주세요..."
        rows={1}
        className="flex-1 resize-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-tight h-10"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={!content.trim() || isSubmitting}
        className="px-4 py-2.5 text-sm font-semibold flex-shrink-0 bg-primary-500 text-white rounded-lg disabled:bg-primary hover:bg-primary-600 transition-colors h-10"
      >
        {isSubmitting ? '전송중' : '작성'}
      </button>
    </form>
  );
}; 