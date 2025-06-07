import { useSession } from 'next-auth/react';
import { CommentForm } from './CommentForm';
import { formatDate } from '@/shared/utils/date';

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    profileImage: string;
  };
  createdAt: string;
  updatedAt: string;
  isAnswer: boolean;
}

interface CommentsProps {
  comments: Comment[];
  onSubmitComment: (content: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const Comments = ({ comments, onSubmitComment, isSubmitting }: CommentsProps) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b bg-white">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-gray-900">
            댓글 <span className="text-primary font-bold">{comments.length}</span>
          </h2>
          {!session && (
            <p className="text-sm text-gray-500">
              로그인 후 댓글을 작성할 수 있습니다
            </p>
          )}
        </div>
      </div>
      
      {/* 댓글 목록 */}
      <div className="flex-1 p-4 space-y-4">
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gray-400 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 mb-1">
                {comment.author.name}
              </span>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-primary/10 text-gray-800 shadow-lg">
                <p className="text-sm whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {formatDate(comment.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 댓글 작성 폼 */}
      {session && (
        <div className="p-4 border-t">
          <CommentForm onSubmit={onSubmitComment} isSubmitting={isSubmitting} />
        </div>
      )}
    </div>
  );
}; 