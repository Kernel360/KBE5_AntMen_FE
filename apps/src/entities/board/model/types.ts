export interface Board {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isAnswered: boolean;
  category: string;
  isPinned: boolean;
  attachments?: {
    id: number;
    fileName: string;
    fileUrl: string;
  }[];
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
  isAnswer: boolean;
}

export interface BoardDetailProps {
  board: Board;
  isAuthor: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onAddComment: (content: string) => Promise<void>;
  onDeleteComment: (commentId: number) => Promise<void>;
  onEditComment: (commentId: number, content: string) => Promise<void>;
  onMarkAsAnswer: (commentId: number) => Promise<void>;
} 