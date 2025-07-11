import { useState } from 'react';
import { CommentForm } from './CommentForm';
import { formatDate } from '@/shared/utils/date';
import { Comment, boardService } from '../api/boardService';
import { useAuthStore } from '@/shared/stores/authStore';
import { Avatar } from '@/shared/components/Avatar';

// 무한 중첩 댓글 컴포넌트
interface CommentItemProps {
  comment: Comment;
  level: number;
  currentUserId?: number | null;
  onEdit?: (commentId: number, content: string) => void;
  onDelete?: (commentId: number) => void;
  onReply?: (parentId: number) => void;
  replyingTo?: number | null;
  onStartReply?: (parentId: number) => void;
  onCancelReply?: () => void;
  onSubmitReply?: (parentId: number, content: string) => Promise<void>;
  isSubmittingReply?: boolean;
}

const CommentItem = ({ 
  comment, 
  level, 
  currentUserId, 
  onEdit, 
  onDelete, 
  onReply,
  replyingTo,
  onStartReply,
  onCancelReply,
  onSubmitReply,
  isSubmittingReply
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.commentContent);
  const [isSubCommentsExpanded, setIsSubCommentsExpanded] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const leftMargin = level * 12; // 모바일에서 들여쓰기 줄임

  const isMyComment = currentUserId ? currentUserId === comment.userId : false;
  const isAdminComment = comment.userName?.toLowerCase().includes('admin') || comment.userName?.toLowerCase().includes('관리자');
  const isReplying = replyingTo === comment.commentId;
  
  const handleSaveEdit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(comment.commentId, editContent);
      setIsEditing(false);
    }
  };

  const handleSubmitReply = async () => {
    if (replyContent.trim() && onSubmitReply) {
      await onSubmitReply(comment.commentId, replyContent.trim());
      setReplyContent('');
    }
  };

  const handleStartReply = () => {
    if (onStartReply) {
      onStartReply(comment.commentId);
    }
  };

  const handleCancelReply = () => {
    setReplyContent('');
    if (onCancelReply) {
      onCancelReply();
    }
  };

  const hasSubComments = comment.subComments && comment.subComments.length > 0;

  return (
    <div className="mb-3" style={{ marginLeft: `${leftMargin}px` }}>
      {/* 채팅 스타일의 댓글 */}
      <div className={`flex gap-2 ${isMyComment ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* 프로필 */}
        <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
          {comment.userAvatar ? (
            <Avatar 
              src={comment.userAvatar} 
              alt={comment.userName || '사용자'}
              className="w-8 h-8 border border-gray-200"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-xs font-medium ${
              isMyComment ? 'bg-primary-200 text-primary-600' : 
              isAdminComment ? 'bg-yellow-100 text-yellow-700' : 
              'bg-gray-100 text-gray-600'
            }`}>
              {comment.userName?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>

        {/* 댓글 내용 영역 */}
        <div className={`flex-1 max-w-[75%] ${isMyComment ? 'items-end' : 'items-start'} flex flex-col`}>
          {/* 작성자 + 관리자 표시 + 대댓글 접기 버튼 (한 줄) */}
          <div className={`flex items-center gap-1 mb-1 text-xs ${isMyComment ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="font-medium text-gray-700">{comment.userName}</span>
            {isAdminComment && (
              <span className="bg-yellow-400 text-white px-1.5 py-0.5 rounded text-xs font-medium">관리자</span>
            )}
            {/* 대댓글 접기/펼치기 - 헤더로 이동 */}
            {hasSubComments && (
              <>
                <button
                  onClick={() => setIsSubCommentsExpanded(!isSubCommentsExpanded)}
                  className="flex items-center gap-1 hover:text-blue-500"
                >
                  <svg 
                    className={`w-3 h-3 transition-transform ${isSubCommentsExpanded ? 'rotate-90' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{comment.subComments.length}개</span>
                </button>
              </>
            )}
          </div>

          {/* 댓글 말풍선 */}
          <div className={`rounded-2xl px-3 py-2 max-w-full ${
            isMyComment ? 'bg-primary-200 text-gray-800' : 
            isAdminComment ? 'bg-yellow-200/50 text-gray-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg resize-none text-sm bg-white text-gray-800"
                  rows={2}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-lg"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words">{comment.commentContent}</p>
            )}
          </div>

          {/* 시간 + 액션 버튼들 (한 줄) */}
          <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isMyComment ? 'flex-row-reverse' : 'flex-row'}`}>
            <span>
              {comment.modifiedAt && comment.modifiedAt !== comment.createdAt ? (
                `${formatDate(comment.modifiedAt)} (수정됨)`
              ) : (
                formatDate(comment.createdAt)
              )}
            </span>
            
            {!isEditing && (
              <>
                <span>•</span>
                <button
                  onClick={handleStartReply}
                  className="hover:text-blue-500"
                >
                  답글
                </button>
                
                {isMyComment && (
                  <>
                    <span>•</span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="hover:text-blue-500"
                    >
                      수정
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => onDelete?.(comment.commentId)}
                      className="hover:text-red-500"
                    >
                      삭제
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 대댓글 입력창 */}
      {isReplying && (
        <div className="mt-3 ml-10 bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-2">
            {comment.userName}님에게 답글 작성
          </div>
          <div className="flex gap-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답글을 입력해주세요..."
              className="flex-1 resize-none border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={2}
              disabled={isSubmittingReply}
            />
            <div className="flex flex-col gap-1">
              <button
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || isSubmittingReply}
                className="px-3 py-1 text-xs font-semibold bg-primary-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-primary-600 transition-colors"
              >
                {isSubmittingReply ? '전송중' : '작성'}
              </button>
              <button
                onClick={handleCancelReply}
                className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 대댓글 렌더링 */}
      {hasSubComments && isSubCommentsExpanded && (
        <div className="mt-3 space-y-3">
          {comment.subComments.map((subComment) => (
            <CommentItem 
              key={subComment.commentId} 
              comment={subComment} 
              level={level + 1}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
              replyingTo={replyingTo}
              onStartReply={onStartReply}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
              isSubmittingReply={isSubmittingReply}
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
  inquiryDoneButton?: boolean;
  onCompleteInquiry?: () => void;
  boardId: string;
  onCommentUpdate: () => Promise<void>;
}

export const Comments = ({ 
  comments, 
  onSubmitComment, 
  isSubmitting, 
  inquiryDoneButton,
  onCompleteInquiry,
  boardId,
  onCommentUpdate
}: CommentsProps) => {
  const { user } = useAuthStore();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const getTotalCommentCount = (comments: Comment[] | null): number => {
    if (!comments || comments.length === 0) return 0;
    return comments.length;
  };

  const totalComments = getTotalCommentCount(comments);

  const handleEdit = async (commentId: number, content: string) => {
    try {
      await boardService.updateComment(boardId, String(commentId), content);
      await onCommentUpdate();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId: number) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;
    
    setIsDeleting(true);
    try {
      await boardService.deleteComment(boardId, String(commentToDelete));
      await onCommentUpdate();
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  const handleStartReply = (parentId: number) => {
    setReplyingTo(parentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleSubmitReply = async (parentId: number, content: string) => {
    setIsSubmittingReply(true);
    try {
      await boardService.createComment(boardId, content, parentId);
      await onCommentUpdate();
      setReplyingTo(null);
    } catch (error) {
      console.error('답글 작성 실패:', error);
      alert('답글 작성에 실패했습니다.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <>
      <div className="flex flex-col bg-white">
        {/* 댓글 헤더 - 모바일 최적화 */}
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              댓글 <span className="text-primary-500 font-bold">{totalComments}</span>
            </h2>
            
            {inquiryDoneButton && (
              <button
                onClick={onCompleteInquiry}
                className="bg-primary-500 text-white font-medium rounded-lg px-3 py-1.5 text-sm hover:bg-primary-600"
              >
                문의완료
              </button>
            )}
          </div>
        </div>
        
        {/* 댓글 목록 */}
        <div className="flex-1 px-4">
          {comments && comments.length > 0 ? (
            <div className="py-4">
              {comments.map((comment) => (
                <CommentItem 
                  key={comment.commentId}
                  comment={comment}
                  level={0}
                  currentUserId={user?.userId}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onReply={handleStartReply}
                  replyingTo={replyingTo}
                  onStartReply={handleStartReply}
                  onCancelReply={handleCancelReply}
                  onSubmitReply={handleSubmitReply}
                  isSubmittingReply={isSubmittingReply}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">아직 댓글이 없습니다.</p>
              <p className="text-xs mt-1">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}
        </div>
        
        {!user && (
          <div className="px-4 py-3 bg-gray-50 text-center">
            <p className="text-sm text-gray-500">로그인 후 댓글을 작성할 수 있습니다</p>
          </div>
        )}
      </div>

      {/* 댓글 작성 폼 */}
      {user && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-200 z-10">
          <div className="px-4 py-3">
            <CommentForm onSubmit={onSubmitComment} isSubmitting={isSubmitting} />
          </div>
        </div>
      )}

      {/* 댓글 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">댓글 삭제</h3>
            <p className="text-gray-600 mb-4">
              정말로 이 댓글을 삭제하시겠습니까?<br />
              삭제된 댓글은 복구할 수 없습니다.
            </p>
            <div className="flex gap-2">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 