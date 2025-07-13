import { Comment, CommentWithDepth } from '../types/comment';

// 댓글을 계층구조로 변환하는 함수
export const buildCommentTree = (comments: any[]): Comment[] => {
    // API에서 오는 데이터 구조에 맞게 처리 (subComments 구조)
    const processComment = (comment: any): Comment => {
        const processedComment: Comment = {
            commentId: comment.commentId,
            userId: comment.userId,
            userName: comment.userName,
            commentContent: comment.commentContent,
            createdAt: comment.createdAt,
            modifiedAt: comment.modifiedAt,
            parentId: null, // subComments 구조에서는 parentId가 없음
            replies: [],
            isCollapsed: false
        };

        // subComments가 있으면 재귀적으로 처리
        if (comment.subComments && comment.subComments.length > 0) {
            processedComment.replies = comment.subComments.map(processComment);
        }

        return processedComment;
    };

    // 모든 댓글을 처리
    const rootComments = comments.map(processComment);

    // 각 레벨에서 시간순 정렬
    const sortComments = (comments: Comment[]) => {
        comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        comments.forEach(comment => {
            if (comment.replies && comment.replies.length > 0) {
                sortComments(comment.replies);
            }
        });
    };

    sortComments(rootComments);
    return rootComments;
};

// 댓글을 평면 리스트로 변환 (depth 정보 포함)
export const flattenComments = (
    comments: Comment[], 
    depth: number = 0, 
    collapsedComments: Set<number> = new Set()
): CommentWithDepth[] => {
    const result: CommentWithDepth[] = [];
    
    comments.forEach(comment => {
        const hasReplies = !!(comment.replies && comment.replies.length > 0);
        result.push({
            ...comment,
            depth,
            hasReplies
        });
        
        // 대댓글이 있고 collapsed 상태가 아니면 표시
        if (hasReplies && !collapsedComments.has(comment.commentId)) {
            const childComments = flattenComments(comment.replies!, depth + 1, collapsedComments);
            result.push(...childComments);
        }
    });
    
    return result;
};

// 댓글이 수정되었는지 확인
export const isCommentModified = (comment: Comment): boolean => {
    if (!comment.modifiedAt) return false;
    return new Date(comment.modifiedAt).getTime() > new Date(comment.createdAt).getTime();
}; 