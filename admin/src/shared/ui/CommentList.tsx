import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { 
    Reply, 
    Edit3, 
    Trash2, 
    ChevronDown, 
    ChevronRight,
    Send
} from 'lucide-react';
import { Comment, CommentWithDepth, AdminUser, CommentActionHandlers } from '../types/comment';
import { buildCommentTree, flattenComments, isCommentModified } from '../utils/commentUtils';
import { CommentInput } from './CommentInput';

interface CommentListProps {
    comments: any[]; // API에서 오는 원본 댓글 데이터
    boardId: number;
    adminUser: AdminUser;
    actions: CommentActionHandlers;
    emptyMessage?: string;
    className?: string;
}

export const CommentList: React.FC<CommentListProps> = ({
    comments,
    boardId,
    adminUser,
    actions,
    emptyMessage = "등록된 댓글이 없습니다",
    className = ""
}) => {
    // 로컬 상태
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
    const [collapsedComments, setCollapsedComments] = useState<Set<number>>(new Set());
    const [editingComment, setEditingComment] = useState<number | null>(null);
    const [editInputs, setEditInputs] = useState<{ [key: number]: string }>({});

    // 댓글 트리 구성 및 평탄화
    const flatComments = useMemo(() => {
        const commentTree = buildCommentTree(comments);
        return flattenComments(commentTree, 0, collapsedComments);
    }, [comments, collapsedComments]);

    // 액션 핸들러들
    const handleToggleReply = useCallback((commentId: number) => {
        setReplyingTo(replyingTo === commentId ? null : commentId);
        if (replyingTo !== commentId) {
            setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
        }
    }, [replyingTo]);

    const handleReplyInputChange = useCallback((commentId: number, value: string) => {
        setReplyInputs(prev => ({ ...prev, [commentId]: value }));
    }, []);

    const handleSubmitReply = useCallback(async (parentId: number) => {
        const content = replyInputs[parentId]?.trim();
        if (!content) {
            alert('답글 내용을 입력해주세요.');
            return;
        }

        try {
            await actions.onReply(parentId, content);
            setReplyInputs(prev => ({ ...prev, [parentId]: '' }));
            setReplyingTo(null);
        } catch (error) {
            console.error('답글 작성 실패:', error);
            alert('답글 작성에 실패했습니다.');
        }
    }, [replyInputs, actions]);

    const handleToggleEdit = useCallback((commentId: number, currentContent: string) => {
        if (editingComment === commentId) {
            setEditingComment(null);
            setEditInputs(prev => {
                const newInputs = { ...prev };
                delete newInputs[commentId];
                return newInputs;
            });
        } else {
            setEditingComment(commentId);
            setEditInputs(prev => ({ ...prev, [commentId]: currentContent }));
        }
    }, [editingComment]);

    const handleEditInputChange = useCallback((commentId: number, value: string) => {
        setEditInputs(prev => ({ ...prev, [commentId]: value }));
    }, []);

    const handleSubmitEdit = useCallback(async (commentId: number) => {
        const content = editInputs[commentId]?.trim();
        if (!content) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        try {
            await actions.onEdit(commentId, content);
            setEditInputs(prev => {
                const newInputs = { ...prev };
                delete newInputs[commentId];
                return newInputs;
            });
            setEditingComment(null);
        } catch (error) {
            console.error('댓글 수정 실패:', error);
            alert('댓글 수정에 실패했습니다.');
        }
    }, [editInputs, actions]);

    const handleDeleteComment = useCallback(async (commentId: number) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

        try {
            await actions.onDelete(commentId);
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            alert('댓글 삭제에 실패했습니다.');
        }
    }, [actions]);

    const handleToggleCollapse = useCallback((commentId: number) => {
        setCollapsedComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    }, []);

    // 댓글 렌더링
    const renderComment = useCallback((comment: CommentWithDepth) => {
        const isMine = comment.userId === adminUser.id;
        const isReplying = replyingTo === comment.commentId;
        const isEditing = editingComment === comment.commentId;

        return (
            <div key={comment.commentId} className="space-y-3">
                {/* 댓글 본문 */}
                <div
                    className={`
                        relative p-3 rounded-lg text-sm border
                        ${comment.depth > 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}
                        ${isMine ? 'border-blue-300' : ''}
                    `}
                    style={{ marginLeft: `${comment.depth * 20}px` }}
                >
                    {/* 들여쓰기 라인 */}
                    {comment.depth > 0 && (
                        <div className="absolute left-0 top-0 w-1 h-full bg-blue-300 rounded-l-lg"></div>
                    )}
                    
                    {/* 댓글 헤더 */}
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                                ${isMine ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
                                {comment.userName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-800">{comment.userName}</span>
                            {isMine && <Badge variant="secondary" className="text-xs">관리자</Badge>}
                            {comment.depth > 0 && <Reply className="w-3 h-3 text-blue-500" />}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                                {isCommentModified(comment)
                                    ? `${new Date(comment.modifiedAt!).toLocaleString('ko-KR')} (수정됨)`
                                    : new Date(comment.createdAt).toLocaleString('ko-KR')
                                }
                            </span>
                            {comment.hasReplies && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-6 w-6"
                                    onClick={() => handleToggleCollapse(comment.commentId)}
                                >
                                    {collapsedComments.has(comment.commentId) ? 
                                        <ChevronRight className="w-3 h-3" /> : 
                                        <ChevronDown className="w-3 h-3" />
                                    }
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    {/* 댓글 내용 */}
                    {isEditing ? (
                        <div className="space-y-3 p-3 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
                            <div className="flex items-center gap-2 text-sm text-orange-700 font-medium">
                                <Edit3 className="w-4 h-4 text-orange-600" />
                                댓글 수정 중
                            </div>
                            <Textarea
                                value={editInputs[comment.commentId] || ''}
                                onChange={(e) => handleEditInputChange(comment.commentId, e.target.value)}
                                placeholder="댓글을 수정하세요..."
                                rows={3}
                                className="resize-none border-orange-200 focus:border-orange-400 focus:ring-orange-100 bg-white transition-all duration-200"
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleEdit(comment.commentId, comment.commentContent)}
                                    className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                                >
                                    취소
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => handleSubmitEdit(comment.commentId)}
                                    disabled={!editInputs[comment.commentId]?.trim()}
                                    className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    <Send className="w-3 h-3 mr-1" />
                                    수정 완료
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-800 mb-3 leading-relaxed whitespace-pre-wrap">
                            {comment.commentContent}
                        </div>
                    )}
                    
                    {/* 댓글 액션 버튼들 */}
                    {!isEditing && (
                        <div className="flex gap-1">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-2 text-xs rounded-md transition-colors duration-200"
                                onClick={() => handleToggleReply(comment.commentId)}
                            >
                                <Reply className="w-3 h-3 mr-1" />
                                답글
                            </Button>
                            {isMine && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 h-7 px-2 text-xs rounded-md transition-colors duration-200"
                                    onClick={() => handleToggleEdit(comment.commentId, comment.commentContent)}
                                >
                                    <Edit3 className="w-3 h-3 mr-1" />
                                    수정
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs rounded-md transition-colors duration-200"
                                onClick={() => handleDeleteComment(comment.commentId)}
                            >
                                <Trash2 className="w-3 h-3 mr-1" />
                                삭제
                            </Button>
                        </div>
                    )}
                </div>
                
                {/* 답글 입력창 */}
                {isReplying && (
                    <div 
                        className="relative p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-2 shadow-sm"
                        style={{ marginLeft: `${(comment.depth + 1) * 20}px` }}
                    >
                        <div className="absolute left-0 top-0 w-1 h-full bg-blue-400 rounded-l-lg"></div>
                        <CommentInput
                            value={replyInputs[comment.commentId] || ''}
                            onChange={(value) => handleReplyInputChange(comment.commentId, value)}
                            onSubmit={() => handleSubmitReply(comment.commentId)}
                            onCancel={() => handleToggleReply(comment.commentId)}
                            placeholder="답글을 입력하세요..."
                            rows={2}
                            submitText="등록"
                            cancelText="취소"
                            isReply={true}
                            replyTo={comment.userName}
                            className="bg-white text-sm"
                        />
                    </div>
                )}
            </div>
        );
    }, [
        adminUser.id,
        replyingTo,
        editingComment,
        editInputs,
        replyInputs,
        collapsedComments,
        handleToggleReply,
        handleReplyInputChange,
        handleSubmitReply,
        handleToggleEdit,
        handleEditInputChange,
        handleSubmitEdit,
        handleDeleteComment,
        handleToggleCollapse
    ]);

    if (!comments || comments.length === 0) {
        return (
            <div className={`text-center text-gray-500 py-12 ${className}`}>
                <div className="mb-4">
                    <Reply className="h-12 w-12 mx-auto text-gray-300" />
                </div>
                <p className="text-lg font-medium mb-1">{emptyMessage}</p>
                <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
            </div>
        );
    }

    return (
        <div className={`space-y-3 bg-gray-50 rounded-lg p-4 border ${className}`}>
            {flatComments.map(renderComment)}
        </div>
    );
}; 