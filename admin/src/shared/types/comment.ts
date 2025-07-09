// 대댓글 지원을 위한 개선된 댓글 인터페이스
export interface Comment {
    commentId: number;
    userId: number;
    userName: string;
    commentContent: string;
    createdAt: string;
    modifiedAt?: string;
    parentId?: number | null;
    replies?: Comment[];
    isCollapsed?: boolean;
}

// 댓글 표시를 위한 확장된 인터페이스  
export interface CommentWithDepth extends Comment {
    depth: number;
    hasReplies: boolean;
}

// 관리자 사용자 정보
export interface AdminUser {
    id: number;
    userName: string;
}

// 댓글 액션 핸들러
export interface CommentActionHandlers {
    onEdit: (commentId: number, content: string) => Promise<void>;
    onDelete: (commentId: number) => Promise<void>;
    onReply: (parentId: number, content: string) => Promise<void>;
} 