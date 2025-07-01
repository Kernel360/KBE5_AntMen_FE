'use client'

import { useState } from 'react'
import { Comments } from './Comments'
import { formatDate } from '@/shared/utils/date'
import {
  boardService,
  type BoardDetailResponse,
} from '../api/boardService'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'

interface BoardDetailProps {
  initialData: BoardDetailResponse
  boardType: string
}

export const BoardDetail = ({ initialData, boardType }: BoardDetailProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [post, setPost] = useState(initialData)

  const handleSubmitComment = async (content: string) => {
    setIsSubmitting(true)
    try {
      await boardService.createComment(String(post.boardId), content)
      // TODO: 댓글 작성 후 데이터 갱신
      // const updatedPost = await boardService.getBoardDetail(String(post.boardId));
      // setPost(updatedPost);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-accent/5">
      <div className="fixed flex justify-center max-w-mobile w-full bg-white">
        <CommonHeader title={boardType} showBackButton />
      </div>

      {/* 헤더 높이만큼 여백 */}
      <div className="h-[56px]" />

      {/* 게시글 영역 */}
      <div className="max-w-mobile mx-auto">
        <div className="bg-white shadow-sm">
          <div className="px-4 py-5">
            <h1 className="text-xl font-bold mb-2 text-accent-foreground">
              {post.boardTitle}
            </h1>
            <div className="flex items-center text-sm text-accent-foreground/70 pb-4">
              <span className="font-medium text-primary/80">
                {post.userName}
              </span>
              <span className="mx-2 text-accent/30">|</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="h-[1px] bg-gray-200" />
            <div className="px-2 pt-4 pb-1">
              <p className="text-accent-foreground whitespace-pre-wrap break-words leading-relaxed min-h-[4.5rem]">
                {post.boardContent}
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

      {/* 네비게이션 바 높이만큼 하단 여백 */}
      <div className="h-20" />
    </div>
  )
}
