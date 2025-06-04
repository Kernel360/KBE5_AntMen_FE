import { MessageCircle, ChevronRight } from 'lucide-react';

interface PostCardProps {
  title: string;
  author: string;
  commentCount: number;
  createdAt: string;
  isPinned?: boolean;
}

export const PostCard = ({
  title,
  author,
  commentCount,
  createdAt,
  isPinned = false,
}: PostCardProps) => {
  return (
    <div className="relative w-full border-b border-gray-200 bg-white p-4">
      {isPinned && (
        <div className="absolute left-3 top-4">
          <div className="h-4 w-4 text-red-500">📌</div>
        </div>
      )}
      <div className="ml-8">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">{createdAt}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-semibold text-white">
              {author[0].toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-gray-500">{author}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">
                {commentCount}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}; 