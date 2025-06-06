import { useState } from 'react';
import { ChevronDown, ChevronUp, Pin } from 'lucide-react';
import { getPosts, sortPosts } from './model/posts';
import { BoardSortModal } from './BoardSortModal';
import { NoticeSortOption, InquirySortOption } from '@/shared/types/board';

interface PostListProps {
  userRole: 'user' | 'manager';
  boardType: '공지사항' | '서비스 문의' | '업무 문의';
}

// FAQ 태그 추가 함수
const getDisplayTitle = (post: { title: string; isPinned?: boolean; boardType?: string }) => {
  // 공지사항이 아니고 isPinned가 true인 경우에만 [FAQ] 태그 추가
  if (post.isPinned && post.boardType !== '공지사항') {
    return `[FAQ] ${post.title}`;
  }
  return post.title;
};

export const PostList = ({ userRole, boardType }: PostListProps) => {
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<NoticeSortOption | InquirySortOption>('latest');

  const posts = getPosts(userRole, boardType);
  const pinnedPosts = posts.filter((post) => post.isPinned);
  const regularPosts = posts.filter((post) => !post.isPinned);

  // 정렬된 일반 게시글
  const sortedRegularPosts = sortPosts(regularPosts, boardType, selectedSort);

  // 고정 게시글은 order 필드로 정렬 (관리자가 지정한 순서)
  const sortedPinnedPosts = [...pinnedPosts].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="flex flex-col min-h-0">
      {/* 고정된 게시글 섹션 */}
      {sortedPinnedPosts.length > 0 && (
        <div className="bg-gray-50">
          <button
            className="w-full px-4 py-2 flex items-center justify-between text-sm"
            onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-500">고정게시글</span>
              <span className="text-primary font-medium">
                {sortedPinnedPosts.length}
              </span>
            </div>
            {isPinnedExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          {isPinnedExpanded && (
            <div className="bg-white">
              {sortedPinnedPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 border-b hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Pin className="h-4 w-4 text-primary" />
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {getDisplayTitle({ ...post, boardType })}
                        </h3>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                    {post.commentCount > 0 && (
                      <span className="shrink-0 text-sm text-gray-400 font-medium">
                        {post.commentCount}
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
      <div className="bg-white flex-1">
        {sortedRegularPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 border-b hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 truncate">
                  {getDisplayTitle({ ...post, boardType })}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.createdAt}</span>
                  {post.status && (
                    <>
                      <span>•</span>
                      <span className={post.status === '답변대기' ? 'text-primary' : 'text-green-600'}>
                        {post.status}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {post.commentCount > 0 && (
                <span className="shrink-0 text-sm text-gray-400 font-medium">
                  {post.commentCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 정렬 모달 */}
      <BoardSortModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        boardType={boardType}
      />
    </div>
  );
}; 