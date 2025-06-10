'use client'

import { useState } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Paperclip, MessageCircle, Eye } from 'lucide-react'
import type { BoardDetailProps } from '@/entities/board/model/types'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'

export const BoardDetail = ({
  board,
  isAuthor,
  onDelete,
  onEdit,
  onAddComment,
  onDeleteComment,
  onEditComment,
  onMarkAsAnswer,
}: BoardDetailProps) => {
  const [commentContent, setCommentContent] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleAddComment = async () => {
    if (!commentContent.trim()) return
    await onAddComment(commentContent)
    setCommentContent('')
  }

  const handleEditComment = async (commentId: number) => {
    if (!editContent.trim()) return
    await onEditComment(commentId, editContent)
    setEditingCommentId(null)
    setEditContent('')
  }

  const startEditing = (commentId: number, content: string) => {
    setEditingCommentId(commentId)
    setEditContent(content)
  }

  return (
    <div className="w-full max-w-mobile mx-auto bg-gray-50 min-h-screen">
      <CommonHeader title={board.category} showBackButton />
      {/* 게시글 영역 */}
      <div className="bg-white px-5">
        {/* 제목 */}
        <h1 className="text-[22px] font-semibold text-gray-900 mt-5 mb-3 break-keep leading-normal">
          {board.title}
        </h1>

        {/* 작성자 정보 */}
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <div className="w-[26px] h-[26px] rounded-full bg-gray-300 flex-shrink-0" />
          <span className="text-[13px] text-gray-600">{board.author.name}</span>
          <span className="text-gray-300 text-[13px]">|</span>
          <span className="text-[13px] text-gray-500">
            {format(new Date(board.createdAt), 'yyyy.MM.dd', { locale: ko })}
          </span>
          {/* 수정/삭제 버튼 */}
          {isAuthor && !board.category.includes('공지사항') && (
            <>
              <span className="text-gray-300 text-[13px]">|</span>
              <button
                onClick={onEdit}
                className="text-[13px] text-primary hover:text-primary/80"
              >
                수정
              </button>
              <button
                onClick={onDelete}
                className="text-[13px] text-secondary hover:text-secondary/80"
              >
                삭제
              </button>
            </>
          )}
        </div>

        {/* 본문 내용 */}
        <div className="py-5 text-[15px] text-gray-800 whitespace-pre-wrap break-words leading-[1.8] min-h-[200px]">
          {board.content}
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="mt-3 bg-gray-50">
        <div className="px-5 py-4 bg-white border-t border-gray-100">
          <h2 className="text-[15px] font-medium text-gray-900">
            댓글{' '}
            <span className="text-primary">{board.comments?.length ?? 0}</span>
          </h2>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-5 px-5 py-4">
          {board.comments?.map((comment, index) => {
            const isAuthorComment = comment.author.id === board.author.id
            return (
              <div
                key={`${comment.id}-${index}`}
                className={`flex ${isAuthorComment ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* 프로필 이미지 */}
                <div className="w-[34px] h-[34px] rounded-full bg-gray-300 flex-shrink-0" />

                {/* 댓글 내용 */}
                <div
                  className={`flex flex-col max-w-[75%] ${isAuthorComment ? 'ml-3' : 'mr-3'}`}
                >
                  {/* 작성자 이름 */}
                  <span
                    className={`text-[13px] font-medium text-gray-900 mb-1.5 ${isAuthorComment ? 'text-left' : 'text-right'}`}
                  >
                    {comment.author.name}
                  </span>

                  {/* 댓글 말풍선 */}
                  <div
                    className={`relative p-3.5 rounded-2xl ${
                      isAuthorComment
                        ? 'bg-primary/10 text-gray-900'
                        : 'bg-primary text-white'
                    }`}
                  >
                    {editingCommentId === comment.id ? (
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary text-[15px]"
                        rows={3}
                      />
                    ) : (
                      <p className="text-[15px] whitespace-pre-wrap break-words leading-[1.7]">
                        {comment.content}
                      </p>
                    )}
                  </div>

                  {/* 메타 정보 */}
                  <div
                    className={`flex items-center gap-2 mt-2 text-[13px] ${isAuthorComment ? 'justify-start' : 'justify-end'}`}
                  >
                    <span className="text-gray-500">
                      {format(new Date(comment.createdAt), 'HH:mm', {
                        locale: ko,
                      })}
                    </span>
                    {comment.isAnswer && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className="text-primary font-medium">
                          채택된 답변
                        </span>
                      </>
                    )}
                    {/* 댓글 수정/삭제/채택 버튼 */}
                    {editingCommentId === comment.id ? (
                      <>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="text-primary"
                        >
                          완료
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="text-gray-500"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() =>
                            startEditing(comment.id, comment.content)
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          삭제
                        </button>
                        {!board.category.includes('공지사항') &&
                          !comment.isAnswer && (
                            <>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => onMarkAsAnswer(comment.id)}
                                className="text-primary hover:text-primary/80"
                              >
                                채택
                              </button>
                            </>
                          )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 댓글 입력 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 max-w-mobile mx-auto">
          <div className="flex gap-2">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-primary text-[15px] placeholder:text-gray-400"
              rows={1}
            />
            <button
              onClick={handleAddComment}
              className="px-4 bg-primary text-white rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 flex-shrink-0 font-medium"
            >
              작성
            </button>
          </div>
        </div>
        {/* 댓글 입력창 fixed 포지션으로 인한 하단 여백 */}
        <div className="h-[80px]" />
      </div>
    </div>
  )
}
