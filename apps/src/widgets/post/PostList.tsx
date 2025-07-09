import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Pin, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BoardSortModal } from './BoardSortModal';
import { NoticeSortOption, InquirySortOption } from '@/shared/types/board';
import { formatDate } from '@/shared/lib/utils/date';
import { BoardHeader } from './BoardHeader';
import { useAuthStore } from '@/shared/stores/authStore';
import { boardService, BoardPost } from './api/boardService';

interface PostListProps {
  userRole: 'customer' | 'manager';
  boardType: '공지사항' | '서비스 문의' | '업무 문의';
  searchTerm?: string;
  selectedSort?: NoticeSortOption | InquirySortOption;
  onSortChange?: (sort: NoticeSortOption | InquirySortOption) => void;
}

// FAQ 태그 추가 함수 
const getDisplayTitle = (post: BoardPost, isPinned: boolean = false, boardType: string) => {
  // 이미 [FAQ] 태그가 있는지 확인
  const hasExistingFaqTag = post.boardTitle.startsWith('[FAQ]');
  
  // 공지사항이 아니고 isPinned가 true이고 기존에 FAQ 태그가 없는 경우에만 [FAQ] 태그 추가
  if (isPinned && boardType !== '공지사항' && !hasExistingFaqTag) {
    return `[FAQ] ${post.boardTitle}`;
  }
  return post.boardTitle;
};

// 수정 여부 확인 함수
const isModified = (post: BoardPost): boolean => {
  if (!post.modifiedAt) return false;
  
  // Java LocalDateTime 배열 형태인 경우
  if (Array.isArray(post.modifiedAt) && Array.isArray(post.createdAt)) {
    return JSON.stringify(post.modifiedAt) !== JSON.stringify(post.createdAt);
  }
  
  // 문자열 형태인 경우
  if (typeof post.modifiedAt === 'string' && typeof post.createdAt === 'string') {
    return post.modifiedAt !== post.createdAt;
  }
  
  return false;
};

export const PostList = ({ 
  userRole, 
  boardType, 
  searchTerm = '', 
  selectedSort = 'latest',
  onSortChange
}: PostListProps) => {
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  
  // 게시글 상태 관리
  const [pinnedPosts, setPinnedPosts] = useState<BoardPost[]>([]);
  const [regularPosts, setRegularPosts] = useState<BoardPost[]>([]);
  const [totalRegularPosts, setTotalRegularPosts] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // props 디버깅
  useEffect(() => {
    console.log('📋 PostList props:', { userRole, boardType, searchTerm, selectedSort });
  }, [userRole, boardType, searchTerm, selectedSort]);

  // 게시글 목록 로드
  const loadPosts = useCallback(async (pageNum: number = 0, isRefresh: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const data = await boardService.getBoardList(
        boardType,
        userRole,
        selectedSort,
        searchTerm,
        pageNum,
        5
      );

      // 날짜 데이터 디버깅
      console.log('📅 게시글 데이터 날짜 확인:', {
        pinnedPosts: data.pinnedPosts.map(p => ({ id: p.boardId, createdAt: p.createdAt })),
        regularPosts: data.posts.content.map(p => ({ id: p.boardId, createdAt: p.createdAt }))
      });

      if (pageNum === 0 || isRefresh) {
        // 첫 페이지 또는 새로고침: 고정글 + 일반글 모두 설정
        setPinnedPosts(data.pinnedPosts);
        setRegularPosts(data.posts.content);
        setTotalRegularPosts(data.posts.totalElements);
        setHasMore(!data.posts.last);
        setPage(0);
      } else {
        // 추가 페이지: 일반글만 추가
        setRegularPosts(prev => [...prev, ...data.posts.content]);
        setTotalRegularPosts(data.posts.totalElements);
        setHasMore(!data.posts.last);
      }
      
      setPage(pageNum);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [boardType, userRole, selectedSort, searchTerm, loading]);

  // 초기 로드 및 정렬/검색어 변경 시 리로드
  useEffect(() => {
    loadPosts(0, true);
  }, [boardType, userRole, selectedSort, searchTerm]);

  // 정렬 변경 핸들러
  const handleSortChange = useCallback((sort: NoticeSortOption | InquirySortOption) => {
    if (onSortChange) {
      onSortChange(sort);
    }
    setIsSortModalOpen(false);
  }, [onSortChange]);

  const getTabCode = (boardType: string) => {
    switch(boardType) {
      case '공지사항':
        return 'n';
      case '서비스 문의':
        return 'i';
      case '업무 문의':
        return 'w';
      default:
        return 'n';
    }
  };

  const handlePostClick = (postId: number) => {
    const basePath = userRole === 'manager' ? '/manager/boards' : '/boards';
    const tabCode = getTabCode(boardType);
    
    // 현재 URL 파라미터를 유지하면서 게시글 상세 페이지로 이동
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    currentParams.set('t', tabCode);
    
    const boardPath = `${basePath}/${postId}?${currentParams.toString()}`;
    console.log('Clicking post:', { postId, userRole, boardPath, boardType });
    router.push(boardPath);
  };

  const handleWriteClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    
    // 현재 탭 정보를 URL 파라미터로 전달
    const tabCode = getTabCode(boardType);
    
    // 매니저는 별도 글쓰기 페이지가 있을 수 있으므로 확장 가능하게 작성
    if (userRole === 'manager') {
      // 매니저 글쓰기 페이지 (향후 별도 구현 시 경로 변경 가능)
      router.push(`/boards/write?from=${tabCode}`);
    } else {
      // 고객 글쓰기 페이지
      router.push(`/boards/write?from=${tabCode}`);
    }
  };

  // 글쓰기 버튼 표시 조건: 
  // - customer + 서비스 문의 OR 
  // - manager + 업무 문의
  const showWriteButton = user && (
    (boardType === '서비스 문의' && userRole === 'customer') ||
    (boardType === '업무 문의' && userRole === 'manager')
  );

  // 초기 로딩 중
  if (initialLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full mb-4"></div>
        <p className="text-gray-500">게시글을 불러오는 중...</p>
      </div>
    );
  }

  // 게시글이 없는 경우
  if (!initialLoading && pinnedPosts.length === 0 && regularPosts.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-500 relative">
        <div className="text-center">
          <p className="text-lg mb-2">아직 게시글이 없습니다</p>
          <p className="text-sm">{boardType === '서비스 문의' ? '첫 번째 문의를 작성해보세요!' : '곧 새로운 소식을 전해드릴 예정입니다'}</p>
        </div>
        
        {/* 글쓰기 버튼 (빈 상태에서도 표시) */}
        {showWriteButton && (
          <button
            onClick={handleWriteClick}
            className="fixed bottom-20 right-1/2 translate-x-[180px] w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center z-10 hover:scale-105"
            aria-label={`${boardType} 작성하기`}
          >
            <Plus size={20} strokeWidth={2} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto">
        {/* 고정된 게시글 섹션 */}
        {pinnedPosts.length > 0 && (
          <div className="bg-gray-50">
            <button
              onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
              className="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-500 hover:bg-gray-100"
            >
              <span>고정 게시글 <span className="text-primary">{pinnedPosts.length}</span></span>
              {isPinnedExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isPinnedExpanded && (
              <div className="bg-white">
                {pinnedPosts.map((post: BoardPost) => (
                  <div
                    key={post.boardId}
                    onClick={() => handlePostClick(post.boardId)}
                    className="p-4 border-b hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Pin className="h-4 w-4 text-primary" />
                          <h3 className="text-base font-medium text-gray-900 truncate">
                            {getDisplayTitle(post, true, boardType)}
                          </h3>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <span>{post.userName}</span>
                          <span>•</span>
                          <span>{post.createdAt ? formatDate(post.createdAt) : '날짜 없음'}</span>
                          {isModified(post) && (
                            <>
                              <span>•</span>
                              <span className="text-gray-400">수정됨 ({post.modifiedAt ? formatDate(post.modifiedAt) : ''})</span>
                            </>
                          )}
                        </div>
                      </div>
                      {post.commentNum > 0 && (
                        <span className="shrink-0 text-sm text-gray-400 font-medium">
                          {post.commentNum}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 일반 게시글 섹션 */}
        <div className="bg-white">
          {/* 일반 게시글 헤더 (총 개수 표시) */}
          {totalRegularPosts > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
              총 <span className="font-medium text-primary">{totalRegularPosts.toLocaleString()}</span>개의 게시글
            </div>
          )}
          
          {regularPosts.map((post: BoardPost) => (
            <div
              key={post.boardId}
              onClick={() => handlePostClick(post.boardId)}
              className="p-4 border-b hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-gray-900 truncate">
                    {getDisplayTitle(post, false, boardType)}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <span>{post.userName}</span>
                    <span>•</span>
                    <span>{post.createdAt ? formatDate(post.createdAt) : '날짜 없음'}</span>
                    {isModified(post) && (
                      <>
                        <span>•</span>
                        <span className="text-gray-400">수정됨 ({post.modifiedAt ? formatDate(post.modifiedAt) : ''})</span>
                      </>
                    )}
                  </div>
                </div>
                {post.commentNum > 0 && (
                  <span className="shrink-0 text-sm text-gray-400 font-medium">
                    {post.commentNum}
                  </span>
                )}
              </div>
            </div>
          ))}
          
                     {/* 로딩 상태 */}
           {loading && (
             <div className="p-4 text-center text-gray-500">
               <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full mr-2"></div>
               로딩 중...
             </div>
           )}
           
           {/* 무한 스크롤 트리거 */}
           {hasMore && !loading && (
             <div 
               className="h-10 flex items-center justify-center cursor-pointer hover:bg-gray-50"
               onClick={() => loadPosts(page + 1)}
             >
               <span className="text-sm text-gray-500">더 보기</span>
             </div>
           )}
        </div>
      </div>

      {/* 글쓰기 플로팅 버튼 - 로그인한 사용자가 서비스 문의 탭에 있을 때만 표시 */}
      {showWriteButton && (
        <button
          onClick={handleWriteClick}
          className="fixed bottom-20 right-1/2 translate-x-[180px] w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center z-10 hover:scale-105"
          aria-label={`${boardType} 작성하기`}
        >
          <Plus size={20} strokeWidth={2} />
        </button>
      )}

      {/* 정렬 모달 */}
      <BoardSortModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
        boardType={boardType}
      />
    </div>
  );
}; 