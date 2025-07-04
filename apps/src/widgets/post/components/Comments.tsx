import { CommentForm } from './CommentForm';
import { formatDate } from '@/shared/utils/date';
import { Comment } from '../api/boardService';
import { useAuthStore } from '@/shared/stores/authStore';

// 무한 중첩 댓글 컴포넌트
interface CommentItemProps {
  comment: Comment;
  level: number;
}

const CommentItem = ({ comment, level }: CommentItemProps) => {
  const leftMargin = level * 16; // 레벨당 16px씩 들여쓰기

  return (
    <div className="space-y-2">
      <div 
        className="flex items-start gap-3"
        style={{ marginLeft: `${leftMargin}px` }}
      >
        <div className="w-7 h-7 rounded-full bg-gray-300 flex-shrink-0" />
        <div className="flex flex-col flex-1">
          <span className="text-xs text-gray-600 mb-1">
            {comment.userName}
          </span>
          <div className="max-w-[85%] rounded-lg px-3 py-2 bg-gray-100 text-gray-800">
            <p className="text-sm whitespace-pre-wrap break-words">
              {comment.commentContent}
            </p>
          </div>
          <span className="text-xs text-gray-400 mt-1">
            {comment.createdAt ? formatDate(comment.createdAt) : '날짜 없음'}
          </span>
        </div>
      </div>
      
      {/* 대댓글 렌더링 (재귀) */}
      {comment.subComments && comment.subComments.length > 0 && (
        <div className="space-y-2">
          {comment.subComments.map((subComment) => (
            <CommentItem 
              key={subComment.commentId} 
              comment={subComment} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CommentsProps {
  comments: Comment[] | null;
  onSubmitComment: (content: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const Comments = ({ comments, onSubmitComment, isSubmitting }: CommentsProps) => {
  const { user } = useAuthStore();
  
  // 부모 댓글만 세는 함수 (대댓글 제외)
  const getTotalCommentCount = (comments: Comment[] | null): number => {
    if (!comments || comments.length === 0) return 0;
    return comments.length; // 부모 댓글 개수만 반환
  };

  const totalComments = getTotalCommentCount(comments);

  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-gray-900 flex items-center">
              댓글 <span className="text-primary font-bold ml-1">{totalComments}</span>
            </h2>
            {!user && (
              <p className="text-sm text-gray-500">
                로그인 후 댓글을 작성할 수 있습니다
              </p>
            )}
          </div>
        </div>
        
        {/* 댓글 목록 */}
        <div className="flex-1 px-4 space-y-3 pb-16">
          {comments && comments.length > 0 ? (
            <div className="py-4 space-y-3">
              {comments.map((comment) => (
                <CommentItem key={comment.commentId} comment={comment} level={0} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6">
              <p>아직 댓글이 없습니다.</p>
              <p className="text-sm mt-1">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </div>

      {/* 댓글 작성 폼을 네비게이션 바 바로 위에 고정 */}
      {user && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-200 z-10">
          <div className="px-4 py-3">
            <CommentForm onSubmit={onSubmitComment} isSubmitting={isSubmitting} />
          </div>
        </div>
      )}
    </>
  );
}; 