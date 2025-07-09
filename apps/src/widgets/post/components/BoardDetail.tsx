'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Comments } from './Comments'
import { formatDate } from '@/shared/utils/date'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAuthStore } from '@/shared/stores/authStore'
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [post, setPost] = useState(initialData)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { user, isLoggedIn } = useAuth()
  
  // authStore에서 userData 가져오기
  const { userData } = useAuthStore()

  // userId로만 작성자 여부 체크
  const isAuthor =
    isLoggedIn &&
    user?.userId &&
    post.userId &&
    user.userId === post.userId;

  const handleSubmitComment = async (content: string) => {
    setIsSubmitting(true)
    try {
      await boardService.createComment(String(post.boardId), content)
      // 댓글 작성 후 데이터 갱신
      const updatedPost = await boardService.getBoardDetail(String(post.boardId));
      setPost(updatedPost);
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompleteInquiry = async () => {
    try {
      await boardService.resolveBoard(String(post.boardId));
      alert('문의가 완료되었습니다.');
      // 게시글 상태 업데이트를 위해 다시 불러오기
      const updatedPost = await boardService.getBoardDetail(String(post.boardId));
      setPost(updatedPost);
    } catch (error) {
      console.error('문의 완료 처리 실패:', error);
      alert('문의 완료 처리 중 오류가 발생했습니다.');
    }
  }

  const handleEdit = () => {
    // 수정 페이지로 이동
    router.push(`/boards/write?id=${post.boardId}&mode=edit`)
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      await boardService.deleteBoard(String(post.boardId))
      alert('게시글이 삭제되었습니다.')
      router.push('/boards') // 게시판 목록으로 이동
    } catch (error) {
      console.error('게시글 삭제 실패:', error)
      alert('게시글 삭제에 실패했습니다.')
    } finally {
      setShowDeleteModal(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
  }

  const handleBack = () => {
    // 브라우저 히스토리에서 뒤로가기 (URL 파라미터가 자동으로 유지됨)
    router.back();
  }

  // 페이지 포커스 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = async () => {
      try {
        const updatedPost = await boardService.getBoardDetail(String(post.boardId));
        setPost(updatedPost);
      } catch (error) {
        console.error('데이터 새로고침 실패:', error);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [post.boardId]);

  return (
    <div className="min-h-screen bg-accent/5">
      <div className="fixed flex justify-center max-w-mobile w-full bg-white z-[1000]">
        <CommonHeader 
          title={boardType} 
          showBackButton={true}
        />
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
            <div className="flex items-center text-sm text-accent-foreground/70 pb-4 justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-primary-500">
                  {post.userName}
                </span>
                <span className="mx-2 text-accent/30">|</span>
                <div className="flex items-center gap-1 text-sm">
                  <span>작성: {formatDate(post.createdAt)}</span>
                  {post.modifiedAt && post.modifiedAt !== post.createdAt && (
                    <>
                      <span className="mx-1 text-accent/30">•</span>
                      <span>수정: {formatDate(post.modifiedAt)}</span>
                    </>
                  )}
                </div>
              </div>
              {/* 작성자일 때만 버튼 노출 */}
              {isAuthor && (
                <div className="flex flex-col items-end gap-1 ml-2">
                  {/* 수정/삭제 버튼: 한 줄 아래에 표시 */}
                  <div className="flex items-center gap-1">
                    {post.boardStatus?.toLowerCase() === 'new' && (
                      <>
                        <button
                          onClick={handleEdit}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          수정
                        </button>
                        <span className="mx-1 text-accent/30">·</span>
                      </>
                    )}
                    <button
                      onClick={handleDelete}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="h-[1px] bg-gray-200" />
            <div className="px-2 pt-4 pb-1">
              <p className="text-accent-foreground whitespace-pre-wrap break-words leading-relaxed min-h-[4.5rem]">
                {post.boardContent}
              </p>
            </div>
          </div>
        </div>

        {/* 문의 완료 버튼이 있던 위치에 구분선만 남김 */}
        <div className="h-2 bg-accent/5" />

        {/* 댓글 영역 */}
        <div>
          <Comments
            comments={post.comments}
            onSubmitComment={handleSubmitComment}
            isSubmitting={isSubmitting}
            inquiryDoneButton={!!(isAuthor && post.boardStatus?.toLowerCase() === 'inprogress')}
            onCompleteInquiry={handleCompleteInquiry}
            boardId={String(post.boardId)}
            onCommentUpdate={async () => {
              const updatedPost = await boardService.getBoardDetail(String(post.boardId));
              setPost(updatedPost);
            }}
          />
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">게시글 삭제</h3>
            <p className="text-gray-600 mb-4">
              정말로 이 게시글을 삭제하시겠습니까?<br />
              삭제된 게시글은 복구할 수 없습니다.
            </p>
            <div className="flex gap-2">
              <button
                onClick={cancelDelete}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 네비게이션 바 높이만큼 하단 여백 */}
      <div className="h-20" />
    </div>
  )
}
