'use client';

import { useState } from 'react';
import { Comments } from './Comments';
import { formatDate } from '@/shared/utils/date';
import { boardService, type BoardDetail as BoardDetailType } from '../api/boardService';
import { CommonHeader } from '@/shared/ui/Header/CommonHeader';

interface BoardDetailProps {
  initialData: BoardDetailType;
  boardType: string;
}

export const BoardDetail = ({ initialData, boardType }: BoardDetailProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState(initialData);

  const handleSubmitComment = async (content: string) => {
    setIsSubmitting(true);
    try {
      await boardService.createComment(String(post.id), content);
      // TODO: 댓글 작성 후 데이터 갱신
      // const updatedPost = await boardService.getBoardDetail(String(post.id));
      // setPost(updatedPost);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent/5">
      <div className="fixed flex justify-center w-[370px] bg-white">
        <CommonHeader 
          title={boardType} 
          showBackButton
        />
      </div>
      
      {/* 헤더 높이만큼 여백 */}
      <div className="h-[56px]" />
      
      {/* 게시글 영역 */}
      <div className="max-w-[370px] mx-auto">
        <div className="bg-white shadow-sm">
          <div className="px-4 py-5">
            <h1 className="text-xl font-bold mb-3 text-accent-foreground">{post.title}</h1>
            <div className="flex items-center text-sm text-accent-foreground/70 pb-4 border-b border-accent/10">
              <span className="font-medium text-primary/80">{post.author.name}</span>
              <span className="mx-2 text-accent/30">|</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.status && (
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  post.status === '답변완료' 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-accent/10 text-accent-foreground/70'
                }`}>
                  {post.status}
                </span>
              )}
            </div>
            <div className="h-px bg-accent/10 my-5" />
            <div className="py-6">
              <p className="text-accent-foreground whitespace-pre-wrap break-words leading-relaxed">
                {post.content}
              </p>
            </div>
          </div>
        </div>

        <div className="h-2 bg-accent/5" />

        {/* 댓글 영역 */}
        <div>
          <Comments
            comments={post.comments}
            onSubmitComment={handleSubmitComment}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}; 