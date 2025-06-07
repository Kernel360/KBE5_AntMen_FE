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
    <div className="relative w-full bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
      <div className="p-4">
        {/* Title and Pin */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-medium text-gray-900 line-clamp-2">
            {isPinned && <span className="inline-block mr-1 text-red-500">📌</span>}
            {title}
          </h3>
          <ChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400" />
        </div>

        {/* Meta Information */}
        <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
          <span className="font-medium">{author}</span>
          <span>{createdAt}</span>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 