'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { useAuthStore } from '@/shared/stores/authStore'
import { boardService } from '@/widgets/post/api/boardService'

export default function WritePostPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuthStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fromTab, setFromTab] = useState('i') // 기본값은 서비스 문의(i)
  const [isEditMode, setIsEditMode] = useState(false)
  const [boardId, setBoardId] = useState<string | null>(null)
  const [originalTitle, setOriginalTitle] = useState('')
  const [originalContent, setOriginalContent] = useState('')

  // 기존 게시글 데이터 로드 (수정 모드용)
  const loadBoardData = async (id: string) => {
    try {
      const boardData = await boardService.getBoardDetail(id)
      setTitle(boardData.boardTitle)
      setContent(boardData.boardContent)
      setOriginalTitle(boardData.boardTitle)
      setOriginalContent(boardData.boardContent)
    } catch (error) {
      console.error('게시글 데이터 로드 실패:', error)
      alert('게시글 데이터를 불러오는데 실패했습니다.')
      handleGoBack()
    }
  }

  // 클라이언트에서만 searchParams 처리
  useEffect(() => {
    if (searchParams) {
      const tab = searchParams.get('from') || 'i'
      const mode = searchParams.get('mode')
      const id = searchParams.get('id')
      
      setFromTab(tab)
      setIsEditMode(mode === 'edit')
      setBoardId(id)
      
      // 수정 모드인 경우 기존 게시글 데이터 로드
      if (mode === 'edit' && id) {
        loadBoardData(id)
      }
    }
  }, [searchParams])

  // 로그인 체크
  if (!user) {
    router.push('/login')
    return null
  }

  // 사용자 권한에 따른 설정
  const isManager = user?.userRole === 'MANAGER'
  const boardType = fromTab === 'i' ? '서비스 문의' : fromTab === 'w' ? '업무 문의' : '서비스 문의'
  const basePath = isManager ? '/manager/boards' : '/boards'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    
    try {
      console.log('📋 글 처리 시도:', { 
        isManager, 
        boardType, 
        isEditMode,
        userId: user?.userId,
        userRole: user?.userRole
      });

      if (isEditMode && boardId) {
        // 수정 모드
        const updateData = {
          boardTitle: title,
          boardContent: content,
          boardIsPinned: false,
          boardReservatedAt: null
        }
        await boardService.updateBoard(boardId, updateData)
        alert(`${boardType}가 성공적으로 수정되었습니다.`)
        // 수정 후 원래 페이지로 돌아가기
        handleGoBack()
      } else {
        // 작성 모드
        if (isManager) {
          await boardService.createManagerBoard(title, content)
        } else {
          await boardService.createCustomerBoard(title, content)
        }
        alert(`${boardType}가 성공적으로 등록되었습니다.`)
        router.replace(`${basePath}?t=${fromTab}`)
      }
    } catch (error) {
      console.error('글 처리 실패:', error)
      alert(isEditMode ? '글 수정 중 오류가 발생했습니다.' : '글 작성 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    // 수정 모드에서 내용이 변경된 경우 확인
    if (isEditMode && (title !== originalTitle || content !== originalContent)) {
      if (confirm('변경사항이 저장되지 않았습니다. 정말 나가시겠습니까?')) {
        router.back()
      }
    } else {
      router.back()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title={`${boardType} ${isEditMode ? '수정' : '작성'}`} 
        showBackButton 
      />
      
      <div className="pt-16 pb-28">
        <form onSubmit={handleSubmit} className="bg-white mx-4 mt-4 pb-1 rounded-lg shadow-sm">
          {/* 제목 입력 */}
          <div className="p-4 border-b border-gray-100">
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-medium placeholder:text-gray-400 border-none outline-none bg-transparent"
              maxLength={100}
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-400 mt-1">
              {title.length}/100
            </div>
          </div>

          {/* 내용 입력 */}
          <div className="p-4">
            <textarea
              placeholder={boardType === '서비스 문의' 
                ? "문의 내용을 자세히 작성해주세요.\n\n• 어떤 문제가 발생했는지\n• 언제 발생했는지\n• 기대했던 결과는 무엇인지\n\n자세한 내용을 작성해주시면 더 빠르고 정확한 답변을 드릴 수 있습니다."
                : "업무 관련 문의 내용을 작성해주세요.\n\n• 업무 진행 과정에서의 문제\n• 시스템 사용 관련 문의\n• 기타 업무 관련 사항\n\n자세한 내용을 작성해주시면 신속하게 처리하겠습니다."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-80 placeholder:text-gray-400 border-none outline-none resize-none bg-transparent leading-relaxed"
              maxLength={2000}
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-400 mt-2">
              {content.length}/2000
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="mx-4 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">📝 {boardType} 작성 안내</p>
                <ul className="text-xs space-y-1 text-blue-600">
                  {boardType === '서비스 문의' ? (
                    <>
                      <li>• 문의 내용은 관리자가 검토 후 답변드립니다</li>
                      <li>• 답변까지 1-2일 정도 소요될 수 있습니다</li>
                      <li>• 긴급한 문의는 고객센터로 연락해주세요</li>
                    </>
                  ) : (
                    <>
                      <li>• 업무 문의는 관련 부서에서 검토 후 답변드립니다</li>
                      <li>• 답변까지 1-2일 정도 소요될 수 있습니다</li>
                      <li>• 긴급한 업무 사항은 직접 연락해주세요</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </form>

        {/* 하단 버튼 */}
        <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-mobile mx-auto">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleGoBack}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex-2 py-3 px-6 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isEditMode ? '수정 중...' : '등록 중...') : (isEditMode ? `${boardType} 수정` : `${boardType} 등록`)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 