import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
    MessageCircle,
    Clock,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    Send,
    Plus,
    Edit3,
    Trash2,
    Megaphone,
    Search,
    User,
    ChevronRight,
    ChevronDown,
    Reply
} from 'lucide-react';
import { adminService } from '../../api/adminService';
import { BoardRequestDto } from '../../api/types';
import { Comment, CommentWithDepth, AdminUser, CommentActionHandlers, buildCommentTree, flattenComments, CommentList } from '../../shared';

interface Notice {
    id: number;
    userName: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    commentNum: number;
    boardStatus: string | null;
    isDeleted: boolean;
    category: 'notice' | 'faq';
}

interface ManagerTicket {
    id: number;
    userName: string;
    title: string;
    createdAt: string;
    lastResponse: string;
    commentNum: number;
    boardStatus: string | null;
    isDeleted: boolean;
    category: 'system' | 'security' | 'performance' | 'bug' | 'feature' | 'maintenance';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'new' | 'assigned' | 'in_progress' | 'testing' | 'resolved' | 'closed';
    managerInfo: {
        name: string;
        position: string;
        location?: string;
    };
    responses: Array<{
        id: number;
        author: string;
        content: string;
        timestamp: string;
        isStaff: boolean;
    }>;
}







const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'notice': return <Megaphone className="h-4 w-4" />;
        case 'faq': return <MessageSquare className="h-4 w-4" />;
        default: return <MessageCircle className="h-4 w-4" />;
    }
};

const getCategoryBadge = (notice: Notice) => {
    const badges = [];
    
    // FAQ 배지
    if (notice.title?.startsWith('[FAQ]')) {
        badges.push(
            <Badge key="faq" className="bg-purple-100 text-purple-800">
                FAQ
            </Badge>
        );
    } else {
        badges.push(
            <Badge key="notice" className="bg-blue-100 text-blue-800">
                공지사항
            </Badge>
        );
    }
    
    // 상태 배지
    if (notice.boardStatus) {
        const statusLabels = {
            'Reserved': '예약',
            'reserved': '예약',
            'Draft': '임시저장',
            'Published': '발행됨',
            'null': '임시저장'
        };
        const statusLabel = statusLabels[notice.boardStatus as keyof typeof statusLabels] || notice.boardStatus;
        badges.push(
            <Badge key="status" className="bg-yellow-100 text-yellow-800">
                {statusLabel}
            </Badge>
        );
    } else {
        // boardStatus가 null인 경우
        badges.push(
            <Badge key="status" className="bg-yellow-100 text-yellow-800">
                임시저장
            </Badge>
        );
    }
    
    // 삭제됨 배지
    if (notice.isDeleted) {
        badges.push(
            <Badge key="deleted" className="bg-red-100 text-red-800">
                삭제됨
            </Badge>
        );
    }
    
    return (
        <div className="flex gap-2 flex-wrap">
            {badges}
        </div>
    );
};

const getPriorityBadge = (priority: string) => {
    const priorities = {
        low: { label: '낮음', color: 'bg-gray-100 text-gray-800' },
        medium: { label: '보통', color: 'bg-blue-100 text-blue-800' },
        high: { label: '높음', color: 'bg-orange-100 text-orange-800' },
        critical: { label: '긴급', color: 'bg-red-100 text-red-800' }
    };

    const pri = priorities[priority as keyof typeof priorities] || priorities.medium;
    return <Badge className={pri.color}>{pri.label}</Badge>;
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'new':
            return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />신규</Badge>;
        case 'assigned':
            return <Badge className="bg-blue-100 text-blue-800">배정됨</Badge>;
        case 'in_progress':
            return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />진행중</Badge>;
        case 'testing':
            return <Badge className="bg-purple-100 text-purple-800">테스트중</Badge>;
        case 'resolved':
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />해결완료</Badge>;
        case 'closed':
            return <Badge className="bg-gray-100 text-gray-800"><CheckCircle className="w-3 h-3 mr-1" />종료</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

export const ManagerSupport: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [tickets, setTickets] = useState<ManagerTicket[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<ManagerTicket | null>(null);
    const [selectedTicketDetail, setSelectedTicketDetail] = useState<any>(null);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
    const [selectedNoticeDetail, setSelectedNoticeDetail] = useState<any>(null);
    const [replyContent, setReplyContent] = useState('');
    const [noticeReplyContent, setNoticeReplyContent] = useState('');
    

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchInput, setSearchInput] = useState<string>('');
    const [noticeSearchTerm, setNoticeSearchTerm] = useState<string>('');
    const [noticeSearchInput, setNoticeSearchInput] = useState<string>('');
    const [noticeSortBy, setNoticeSortBy] = useState<string>('latest');
    const [noticeFilter, setNoticeFilter] = useState<string>('all');
    const [isWritingNotice, setIsWritingNotice] = useState(false);
    const [isEditingNotice, setIsEditingNotice] = useState(false);
    const [newNotice, setNewNotice] = useState<{
        boardTitle: string;
        boardContent: string;
        boardIsPinned: boolean;
        boardReservatedAt: string;
        category: 'notice' | 'faq';
    }>({
        boardTitle: '',
        boardContent: '',
        boardIsPinned: false,
        boardReservatedAt: '',
        category: 'notice'
    });
    const [editingNotice, setEditingNotice] = useState<{
        boardTitle: string;
        boardContent: string;
        boardIsPinned: boolean;
        boardReservatedAt: string;
        category: 'notice' | 'faq';
    }>({
        boardTitle: '',
        boardContent: '',
        boardIsPinned: false,
        boardReservatedAt: '',
        category: 'notice'
    });
    const [isReserved, setIsReserved] = useState(false);
    
    // 페이지네이션 상태 추가
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10); // 페이지당 아이템 수



    // 공지사항 목록 로드 (전체 데이터)
    const loadNotices = async () => {
        try {
            const response: any = await adminService.getBoardList(
                'manager', 
                'notice', 
                noticeSearchTerm
            );
            
            const transformedNotices: Notice[] = response.map((notice: any) => {
                // boardType이 있으면 사용, 없으면 제목으로 판단
                let category: 'notice' | 'faq' = 'notice';
                
                if (notice.boardType) {
                    // boardType 필드가 있는 경우
                    category = notice.boardType === 'faq' ? 'faq' : 'notice';
                } else {
                    // 제목으로 판단하는 경우
                    category = notice.boardTitle.startsWith('[FAQ]') ? 'faq' : 'notice';
                }
                
                return { 
                    id: notice.boardId,
                    userName: notice.userName,
                    title: notice.boardTitle,
                    createdAt: notice.createdAt,
                    updatedAt: notice.modifiedAt,
                    commentNum: notice.commentNum,
                    boardStatus: notice.boardStatus,
                    isDeleted: notice.isDeleted,
                    category: category,
                };
            });
            
            setNotices(transformedNotices);
        } catch (error) {
            console.error('매니저 공지사항 로드 실패:', error);
        }
    };

    // 매니저 1:1 문의 목록 로드 (전체 데이터)
    const loadManagerInquiries = async () => {
        try {
            console.log('매니저 문의 데이터 로드 시작');
            const response: any = await adminService.getBoardList(
                'manager', 
                'personal'
            );
            
            console.log('매니저 문의 원본 데이터:', response);
            
            if (!response || !Array.isArray(response)) {
                console.error('매니저 문의 데이터가 배열이 아님:', response);
                setTickets([]);
                return;
            }
            
            const transformedTickets: ManagerTicket[] = response.map((inquiry: any) => {
                console.log('변환 중인 문의:', inquiry);
                
                // isDeleted가 true면 무조건 closed 상태
                if (inquiry.isDeleted) {
                    return {
                        id: inquiry.boardId || inquiry.id,
                        userName: inquiry.userName || '매니저',
                        title: inquiry.boardTitle || inquiry.title || '제목 없음',
                        createdAt: inquiry.createdAt || inquiry.boardCreatedAt || new Date().toISOString(),
                        lastResponse: inquiry.modifiedAt || inquiry.boardModifiedAt || inquiry.createdAt || new Date().toISOString(),
                        commentNum: inquiry.commentNum || 0,
                        boardStatus: inquiry.boardStatus,
                        isDeleted: inquiry.isDeleted,
                        category: 'system',
                        priority: 'medium',
                        status: 'closed' as const,
                        managerInfo: {
                            name: inquiry.userName || '매니저',
                            position: '매니저',
                            location: '',
                        },
                        responses: [],
                    };
                }

                // boardStatus에 따른 상태 분류
                let status: 'new' | 'in_progress' | 'resolved' | 'closed';
                switch (inquiry.boardStatus) {
                    case 'New':
                        status = 'new';
                        break;
                    case 'InProgress':
                    case 'IN_PROGRESS':
                        status = 'in_progress';
                        break;
                    case 'COMPLETED':
                    case 'Resolved':
                    case 'Completed':
                        status = 'resolved';
                        break;
                    default:
                        status = 'new'; // 기본값을 new로 변경
                }

                return {
                    id: inquiry.boardId || inquiry.id,
                    userName: inquiry.userName || '매니저',
                    title: inquiry.boardTitle || inquiry.title || '제목 없음',
                    createdAt: inquiry.createdAt || inquiry.boardCreatedAt || new Date().toISOString(),
                    lastResponse: inquiry.modifiedAt || inquiry.boardModifiedAt || inquiry.createdAt || new Date().toISOString(),
                    commentNum: inquiry.commentNum || 0,
                    boardStatus: inquiry.boardStatus,
                    isDeleted: inquiry.isDeleted || false,
                    category: 'system',
                    priority: 'medium',
                    status,
                    managerInfo: {
                        name: inquiry.userName || '매니저',
                        position: '매니저',
                        location: '',
                    },
                    responses: [],
                };
            });
            
            console.log('변환된 매니저 문의 데이터:', transformedTickets);
            setTickets(transformedTickets);
        } catch (error) {
            console.error('매니저 문의 로드 실패:', error);
            setTickets([]);
        }
    };

    // 공지사항 상세 조회
    const loadNoticeDetail = async (noticeId: number) => {
        try {
            // 카테고리에 따라 boardType 결정
            const boardType = selectedNotice?.category === 'faq' ? 'manager' : 'manager-notice';
            const response = await adminService.getNotice(noticeId);
            setSelectedNoticeDetail(response);
        } catch (error) {
            console.error('공지 상세 조회 실패:', error);
            setSelectedNoticeDetail(null);
        }
    };

    // 1:1 문의 상세 조회
    const loadTicketDetail = async (ticketId: number) => {
        try {
            const response = await adminService.getNotice(ticketId);
            setSelectedTicketDetail(response);
        } catch (error) {
            console.error('문의 상세 조회 실패:', error);
            setSelectedTicketDetail(null);
        }
    };

    // 공지 댓글 작성
    const handleCreateNoticeReply = async () => {
        if (!selectedNotice || !noticeReplyContent.trim()) return;

        try {
            await adminService.createBoardComment(selectedNotice.id, noticeReplyContent, null);
            
            // 댓글 작성 후 상세 정보 다시 로드
            await loadNoticeDetail(selectedNotice.id);
            setNoticeReplyContent('');
            alert('댓글이 성공적으로 등록되었습니다.');
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            alert('댓글 작성에 실패했습니다.');
        }
    };

    // 공지사항 검색 핸들러
    const handleNoticeSearch = () => {
        setNoticeSearchTerm(noticeSearchInput);
    };

    // 문의 검색 핸들러
    const handleTicketSearch = () => {
        setSearchTerm(searchInput);
    };

    // 탭 변경 핸들러
    const handleTabChange = (value: string) => {
        console.log('탭 변경:', value);
        if (value === 'notices') {
            loadNotices();
        } else if (value === 'tickets') {
            console.log('매니저 문의 탭 선택됨');
            loadManagerInquiries();
        }
    };

    // 초기 로드 및 URL 파라미터 처리
    useEffect(() => {
        const tab = searchParams.get('tab');
        console.log('초기 로드, URL 탭:', tab);
        
        if (tab === 'tickets') {
            loadManagerInquiries();
        } else {
            loadNotices();
        }
    }, [searchParams]);

    // 필터가 변경될 때마다 공지사항 다시 로드
    useEffect(() => {
        loadNotices();
    }, [noticeFilter]);

    // 필터링된 공지사항
    const filteredNotices = notices.filter(notice => {
        // 카테고리/필터 매칭
        let matchesFilter = false;
        switch (noticeFilter) {
            case 'all':
                matchesFilter = true;
                break;
            case 'notice':
                matchesFilter = notice.category === 'notice' && !notice.isDeleted;
                break;
            case 'faq':
                matchesFilter = notice.category === 'faq' && !notice.isDeleted;
                break;
            case 'reservation':
                // Reserved 또는 reserved 상태인 경우
                matchesFilter = (notice.boardStatus === 'Reserved' || notice.boardStatus === 'reserved') && !notice.isDeleted;
                break;
            case 'deleted':
                matchesFilter = notice.isDeleted === true;
                break;
            default:
                matchesFilter = notice.category === noticeFilter;
        }
        
        const matchesSearch = !noticeSearchTerm || 
            notice.title.toLowerCase().includes(noticeSearchTerm.toLowerCase()) ||
            notice.userName.toLowerCase().includes(noticeSearchTerm.toLowerCase());
        
        return matchesFilter && matchesSearch;
    });

    // 정렬 적용
    const sortedNotices = [...filteredNotices].sort((a, b) => {
        if (noticeSortBy === 'latest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (noticeSortBy === 'oldest') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return 0;
    });

    // 페이지네이션 적용
    const totalPages = Math.ceil(sortedNotices.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedNotices = sortedNotices.slice(startIndex, endIndex);

    // 필터나 검색어가 변경되면 첫 페이지로 이동
    useEffect(() => {
        setCurrentPage(0);
    }, [noticeFilter, noticeSearchTerm, noticeSortBy]);

    // 컴포넌트 마운트 시 공지사항 목록 로드
    useEffect(() => {
        loadNotices();
    }, [noticeSearchTerm, noticeSortBy]);

    // URL 파라미터 처리
    useEffect(() => {
        const inquiryId = searchParams.get('inquiry');
        if (inquiryId && searchParams.get('tab') === 'tickets') {
            // 문의 상세보기 모달 열기
            const inquiry = tickets.find(ticket => ticket.id === parseInt(inquiryId));
            if (inquiry) {
                setSelectedTicket(inquiry);
                loadTicketDetail(parseInt(inquiryId));
            }
        }
    }, [searchParams, tickets]);

    // 필터링된 티켓 목록
    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
        const matchesSearch = !searchTerm || 
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.managerInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesStatus && matchesPriority && matchesSearch;
    });

    const handleStatusChange = async (ticketId: number, newStatus: string) => {
        try {
            // 로컬 상태 업데이트만 수행 (API 호출 제거)
            setTickets(tickets.map(ticket =>
                ticket.id === ticketId
                    ? { ...ticket, status: newStatus as any, lastResponse: new Date().toLocaleString('ko-KR') }
                    : ticket
            ));
            if (selectedTicket && selectedTicket.id === ticketId) {
                setSelectedTicket({
                    ...selectedTicket,
                    status: newStatus as any,
                    lastResponse: new Date().toLocaleString('ko-KR')
                });
            }
        } catch (error) {
            console.error('문의 상태 변경 실패:', error);
            alert('문의 상태 변경에 실패했습니다.');
        }
    };

    const handleSendReply = async () => {
        if (!selectedTicket || !replyContent.trim()) return;

        try {
            // API 호출로 답변 등록
            await adminService.createBoardComment(selectedTicket.id, replyContent, null);

            // 댓글 작성 후 상세 정보 다시 로드
            await loadTicketDetail(selectedTicket.id);
            setReplyContent('');
            alert('답변이 성공적으로 등록되었습니다.');
        } catch (error) {
            console.error('답변 전송 실패:', error);
            alert('답변 전송에 실패했습니다.');
        }
    };

    // 댓글 액션 핸들러들
    const handleCommentEdit = async (commentId: number, content: string) => {
        const boardId = selectedNotice?.id || selectedTicket?.id;
        if (!boardId) return;

        try {
            await adminService.updateBoardComment(boardId, commentId, content);
            
            // 상세 정보 다시 로드
            if (selectedNotice) {
                loadNoticeDetail(selectedNotice.id);
            } else if (selectedTicket) {
                loadTicketDetail(selectedTicket.id);
            }
            alert('댓글이 성공적으로 수정되었습니다.');
        } catch (error) {
            console.error('댓글 수정 실패:', error);
            alert('댓글 수정에 실패했습니다.');
        }
    };

    const handleCommentDelete = async (commentId: number) => {
        const boardId = selectedNotice?.id || selectedTicket?.id;
        if (!boardId) return;

        try {
            await adminService.deleteBoardComment(boardId, commentId);
            
            // 상세 정보 다시 로드
            if (selectedNotice) {
                loadNoticeDetail(selectedNotice.id);
            } else if (selectedTicket) {
                loadTicketDetail(selectedTicket.id);
            }
            alert('댓글이 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    const handleCommentReply = async (parentId: number, content: string) => {
        const boardId = selectedNotice?.id || selectedTicket?.id;
        if (!boardId) return;

        try {
            await adminService.createBoardComment(boardId, content, parentId);
            
            // 상세 정보 다시 로드
            if (selectedNotice) {
                loadNoticeDetail(selectedNotice.id);
            } else if (selectedTicket) {
                loadTicketDetail(selectedTicket.id);
            }
        } catch (error) {
            console.error('답글 작성 실패:', error);
            alert('답글 작성에 실패했습니다.');
        }
    };

    const handleCreateNotice = async () => {
        if (!newNotice.boardTitle.trim() || !newNotice.boardContent.trim()) return;

        try {
            // 카테고리에 따라 boardType 결정
            const getBoardType = (category: string) => {
                switch (category) {
                    case 'faq':
                        return 'manager';
                    case 'notice':
                        return 'manager-notice';
                    default:
                        return 'manager-notice';
                }
            };

            const requestData: BoardRequestDto = {
                boardTitle: newNotice.boardTitle,
                boardContent: newNotice.boardContent,
                boardIsPinned: newNotice.boardIsPinned,
                boardReservatedAt: isReserved && newNotice.boardReservatedAt ? newNotice.boardReservatedAt : undefined,
                boardType: getBoardType(newNotice.category)
            };

            await adminService.createNotice(requestData);
            
            // 성공시 공지사항 목록 다시 로드
            await loadNotices();
            setNewNotice({ boardTitle: '', boardContent: '', boardIsPinned: false, boardReservatedAt: '', category: 'notice' });
            setIsReserved(false);
            setIsWritingNotice(false);
            alert('매니저 공지사항이 성공적으로 등록되었습니다.');
        } catch (error: any) {
            console.error('매니저 공지사항 등록 실패:', error);
            if (error.response?.status === 401) {
                alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
            } else {
                alert('매니저 공지사항 등록에 실패했습니다.');
            }
        }
    };

    const handleEditNotice = async (noticeId: number) => {
        if (!selectedNotice || !selectedNoticeDetail) return;

        try {
            // 수정 모드로 전환하고 현재 데이터로 폼 초기화
            setIsEditingNotice(true);
            setEditingNotice({
                boardTitle: selectedNoticeDetail.boardTitle,
                boardContent: selectedNoticeDetail.boardContent,
                boardIsPinned: selectedNoticeDetail.boardIsPinned || false,
                boardReservatedAt: selectedNoticeDetail.boardReservatedAt || '',
                category: selectedNotice.category
            });
        } catch (error) {
            console.error('공지사항 수정 모드 전환 실패:', error);
            alert('공지사항 수정 모드로 전환할 수 없습니다.');
        }
    };

    const handleUpdateNotice = async () => {
        if (!selectedNotice || !editingNotice.boardTitle.trim() || !editingNotice.boardContent.trim()) return;

        try {
            // 카테고리에 따라 boardType 결정
            const boardType = selectedNotice.category === 'faq' ? 'manager' : 'manager-notice';
            
            const updateData = {
                boardTitle: editingNotice.boardTitle,
                boardContent: editingNotice.boardContent,
                boardIsPinned: editingNotice.boardIsPinned,
                boardReservatedAt: editingNotice.boardReservatedAt || undefined
            };
            
            await adminService.updateBoard(selectedNotice.id, updateData);
            
            // 성공시 공지사항 목록과 상세 정보 다시 로드
            await loadNotices();
            await loadNoticeDetail(selectedNotice.id);
            setIsEditingNotice(false);
            alert('공지사항이 성공적으로 수정되었습니다.');
        } catch (error: any) {
            console.error('공지사항 수정 실패:', error);
            if (error.response?.status === 401) {
                alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
            } else {
                alert('공지사항 수정에 실패했습니다.');
            }
        }
    };

    const handleDeleteNotice = async (noticeId: number) => {
        if (!selectedNotice) return;

        try {
            // 카테고리에 따라 boardType 결정
            const boardType = selectedNotice.category === 'faq' ? 'manager' : 'manager-notice';
            
            await adminService.deleteNotice(noticeId);
            
            // 성공시 공지사항 목록 다시 로드
            await loadNotices();
            setSelectedNotice(null);
            alert('매니저 공지사항이 성공적으로 삭제되었습니다.');
        } catch (error: any) {
            console.error('매니저 공지사항 삭제 실패:', error);
            if (error.response?.status === 401) {
                alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
            } else {
                alert('매니저 공지사항 삭제에 실패했습니다.');
            }
        }
    };

    const stats = {
        total: tickets.length,
        critical: tickets.filter(t => t.priority === 'critical').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                    <h1 className="text-2xl font-semibold text-gray-900">매니저 문의 관리</h1>
                </div>
                <p className="text-gray-600">매니저 문의와 공지사항을 관리합니다</p>
            </div>

            <Tabs 
                defaultValue={searchParams.get('tab') || "notices"} 
                className="space-y-4" 
                onValueChange={handleTabChange}
            >
                <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
                    <TabsTrigger 
                        value="notices" 
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                    >
                        <Megaphone className="w-4 h-4 mr-2" />
                        공지사항
                    </TabsTrigger>
                    <TabsTrigger 
                        value="tickets" 
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        1:1 문의
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="notices" className="space-y-3">
                    {/* Notice Header */}
                    <div className="flex justify-between items-center">
                        <div>
                        </div>
                        <Button onClick={() => setIsWritingNotice(true)} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            공지 작성
                        </Button>
                    </div>

                    {isWritingNotice ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>새 공지 작성</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="notice-title">제목</Label>
                                    <Input
                                        id="notice-title"
                                        value={newNotice.boardTitle}
                                        onChange={(e) => {
                                            let newTitle = e.target.value;
                                            
                                            // FAQ 카테고리일 때 [FAQ] 프리픽스 자동 처리
                                            if (newNotice.category === 'faq') {
                                                // 사용자가 [FAQ]를 지우려고 하는 경우 방지
                                                if (!newTitle.startsWith('[FAQ]') && newTitle.length > 0) {
                                                    newTitle = '[FAQ] ' + newTitle;
                                                } else if (newTitle === '' || newTitle === '[FAQ]') {
                                                    newTitle = '[FAQ] ';
                                                }
                                            }
                                            
                                            setNewNotice({ ...newNotice, boardTitle: newTitle });
                                        }}
                                        placeholder={newNotice.category === 'faq' ? '[FAQ] 제목을 입력하세요' : '공지 제목을 입력하세요'}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="notice-category">카테고리</Label>
                                    <select
                                        id="notice-category"
                                        value={newNotice.category}
                                        onChange={(e) => {
                                            const newCategory = e.target.value as 'notice' | 'faq';
                                            let newTitle = newNotice.boardTitle;
                                            
                                            // [FAQ] 프리픽스 처리
                                            if (newCategory === 'faq') {
                                                // FAQ 선택 시: [FAQ] 추가 (중복 방지)
                                                if (!newTitle.startsWith('[FAQ]')) {
                                                    newTitle = '[FAQ] ' + newTitle;
                                                }
                                            } else {
                                                // 다른 카테고리 선택 시: [FAQ] 제거
                                                if (newTitle.startsWith('[FAQ] ')) {
                                                    newTitle = newTitle.substring(6);
                                                }
                                            }
                                            
                                            setNewNotice({ 
                                                ...newNotice, 
                                                category: newCategory,
                                                boardTitle: newTitle,
                                                boardIsPinned: newCategory === 'faq' ? true : newNotice.boardIsPinned
                                            });
                                        }}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="notice">공지사항</option>
                                        <option value="faq">FAQ</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="notice-content">내용</Label>
                                    <Textarea
                                        id="notice-content"
                                        value={newNotice.boardContent}
                                        onChange={(e) => setNewNotice({ ...newNotice, boardContent: e.target.value })}
                                        placeholder="공지 내용을 입력하세요"
                                        rows={6}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="pinned"
                                        checked={newNotice.boardIsPinned}
                                        onChange={(e) => setNewNotice({ ...newNotice, boardIsPinned: e.target.checked })}
                                        disabled={newNotice.category === 'faq'}
                                        className="w-4 h-4"
                                    />
                                    <Label htmlFor="pinned">
                                        고정 공지로 설정
                                        {newNotice.category === 'faq' && (
                                            <span className="text-sm text-gray-500 ml-2">(FAQ는 자동으로 고정됩니다)</span>
                                        )}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="reserved"
                                        checked={isReserved}
                                        onChange={(e) => setIsReserved(e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <Label htmlFor="reserved">예약 게시글로 설정</Label>
                                </div>
                                {isReserved && (
                                    <div>
                                        <Label htmlFor="reserved-date">예약 게시 시간</Label>
                                        <Input
                                            id="reserved-date"
                                            type="datetime-local"
                                            value={newNotice.boardReservatedAt}
                                            onChange={(e) => setNewNotice({ ...newNotice, boardReservatedAt: e.target.value })}
                                            className="mt-1 w-fit max-w-xs"
                                        />
                                    </div>
                                )}
                                <div className="flex gap-3 pt-2">
                                    <Button 
                                        onClick={handleCreateNotice} 
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all duration-200"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        공지 등록
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsWritingNotice(false);
                                            setNewNotice({ boardTitle: '', boardContent: '', boardIsPinned: false, boardReservatedAt: '', category: 'notice' });
                                            setIsReserved(false);
                                        }}
                                        className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200"
                                    >
                                        취소
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {/* Filter Cards */}
                            <div className="grid grid-cols-5 gap-3">
                                {[
                                    { value: 'all', label: '전체', count: notices.length, icon: MessageCircle, color: 'text-blue-600' },
                                    { value: 'notice', label: '공지', count: notices.filter(n => n.category === 'notice' && !n.isDeleted).length, icon: Megaphone, color: 'text-green-600' },
                                    { value: 'faq', label: 'FAQ', count: notices.filter(n => n.category === 'faq' && !n.isDeleted).length, icon: MessageCircle, color: 'text-purple-600' },
                                    { value: 'reservation', label: '예약', count: notices.filter(n => (n.boardStatus === 'Reserved' || n.boardStatus === 'reserved') && !n.isDeleted).length, icon: Clock, color: 'text-orange-600' },
                                    { value: 'deleted', label: '삭제', count: notices.filter(n => n.isDeleted).length, icon: Trash2, color: 'text-red-600' },
                                ].map((filter) => {
                                    const IconComponent = filter.icon;
                                    const isActive = noticeFilter === filter.value;
                                    return (
                                        <Card 
                                            key={filter.value}
                                            className={`cursor-pointer border ${
                                                isActive 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setNoticeFilter(filter.value)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">{filter.label}</span>
                                                    <IconComponent className={`h-4 w-4 ${filter.color}`} />
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {filter.count}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                {/* Notice List */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            공지사항 목록
                                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                                                {filteredNotices.length}건
                                            </Badge>
                                        </CardTitle>
                                        {/* Search Bar */}
                                        <div className="flex gap-3" style={{ marginTop: '24px'}}>
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <Input
                                                    placeholder="제목, 내용으로 검색..."
                                                    value={noticeSearchInput}
                                                    onChange={(e) => setNoticeSearchInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleNoticeSearch();
                                                        }
                                                    }}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <select
                                                value={noticeSortBy}
                                                onChange={(e) => setNoticeSortBy(e.target.value)}
                                                className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="latest">최신순</option>
                                                <option value="oldest">오래된순</option>
                                            </select>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="h-[800px] flex flex-col">
                                        <div className="space-y-3 h-[680px] overflow-hidden flex-1">
                                            {paginatedNotices.length === 0 ? (
                                                <div className="text-center text-gray-500 py-8">
                                                    {noticeSearchTerm ? '검색 결과가 없습니다.' : '공지사항이 없습니다.'}
                                                </div>
                                            ) : (
                                                paginatedNotices.map((notice) => (
                                                    <div
                                                        key={notice.id}
                                                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md h-20 flex flex-col justify-center ${
                                                            selectedNotice?.id === notice.id
                                                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                                                : 'border-gray-200 hover:border-blue-300'
                                                        }`}
                                                        onClick={() => {
                                                    setSelectedNotice(notice);
                                                    setSelectedNoticeDetail(null);
                                                    loadNoticeDetail(notice.id);
                                                }}
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                                                                    {notice.title}
                                                                </h3>
                                                            </div>
                                                            <div className="flex-shrink-0 ml-2">
                                                                {getCategoryBadge(notice)}
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                                            <span>{notice.userName}</span>
                                                            <div className="flex items-center gap-2">
                                                                <MessageCircle className="h-3 w-3" />
                                                                <span>{notice.commentNum}</span>
                                                                <span>{new Date(notice.createdAt).toLocaleString('ko-KR')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        
                                        {/* 페이지네이션 */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-center mt-6">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                                        disabled={currentPage === 0}
                                                        className="h-8 px-3 text-sm disabled:opacity-50"
                                                    >
                                                        이전
                                                    </Button>
                                                    
                                                    <div className="flex items-center space-x-1">
                                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                            const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                                                            const isActive = currentPage === pageNum;
                                                            return (
                                                                <Button
                                                                    key={pageNum}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setCurrentPage(pageNum)}
                                                                    className={`h-8 w-8 p-0 text-sm ${
                                                                        isActive
                                                                            ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                                                                            : 'hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                    {pageNum + 1}
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                    
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                                        disabled={currentPage >= totalPages - 1}
                                                        className="h-8 px-3 text-sm disabled:opacity-50"
                                                    >
                                                        다음
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Notice Detail */}
                                <Card>
                                    <CardHeader>
                                                                        <CardTitle>공지사항 상세</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedNotice ? (
                                            <div className="space-y-6">
                                                {/* 공지사항 헤더 */}
                                                <div className="border-b border-gray-200 pb-4">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        {getCategoryBadge(selectedNotice)}
                                                    </div>
                                                    <h3 className="font-semibold text-lg mb-2">{selectedNotice.title}</h3>
                                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                                        <div className="flex items-center gap-3">
                                                            <span>{selectedNoticeDetail?.userName || selectedNotice.userName}</span>
                                                            <span>{new Date(selectedNotice.createdAt).toLocaleString('ko-KR')}</span>
                                                        </div>
                                                        <span className="text-xs">
                                                            {(selectedNoticeDetail?.modifiedAt || selectedNotice.updatedAt) && 
                                                             new Date(selectedNoticeDetail?.modifiedAt || selectedNotice.updatedAt).getTime() !== new Date(selectedNotice.createdAt).getTime()
                                                                ? `수정: ${new Date(selectedNoticeDetail?.modifiedAt || selectedNotice.updatedAt).toLocaleString('ko-KR')}`
                                                                : ''
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* 공지사항 내용 */}
                                                {isEditingNotice ? (
                                                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                                                        <div>
                                                            <Label className="text-gray-700 font-medium mb-2 block">제목</Label>
                                                            <Input
                                                                value={editingNotice.boardTitle}
                                                                onChange={(e) => setEditingNotice({...editingNotice, boardTitle: e.target.value})}
                                                                placeholder="공지사항 제목을 입력하세요"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-gray-700 font-medium mb-2 block">내용</Label>
                                                            <Textarea
                                                                value={editingNotice.boardContent}
                                                                onChange={(e) => setEditingNotice({...editingNotice, boardContent: e.target.value})}
                                                                placeholder="공지사항 내용을 입력하세요"
                                                                rows={8}
                                                                className="w-full resize-none"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Switch
                                                                    id="pin-notice"
                                                                    checked={editingNotice.boardIsPinned}
                                                                    onCheckedChange={(checked) => setEditingNotice({...editingNotice, boardIsPinned: checked})}
                                                                />
                                                                <Label htmlFor="pin-notice">상단 고정</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Switch
                                                                    id="reserve-notice"
                                                                    checked={isReserved}
                                                                    onCheckedChange={setIsReserved}
                                                                />
                                                                <Label htmlFor="reserve-notice">예약 공지</Label>
                                                            </div>
                                                        </div>
                                                        {isReserved && (
                                                            <div>
                                                                <Label className="text-gray-700 font-medium mb-2 block">예약 시간</Label>
                                                                <Input
                                                                    type="datetime-local"
                                                                    value={editingNotice.boardReservatedAt}
                                                                    onChange={(e) => setEditingNotice({...editingNotice, boardReservatedAt: e.target.value})}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2 pt-2">
                                                            <Button 
                                                                onClick={handleUpdateNotice}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                disabled={!editingNotice.boardTitle.trim() || !editingNotice.boardContent.trim()}
                                                            >
                                                                수정 완료
                                                            </Button>
                                                            <Button 
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setIsEditingNotice(false);
                                                                    setEditingNotice({
                                                                        boardTitle: '',
                                                                        boardContent: '',
                                                                        boardIsPinned: false,
                                                                        boardReservatedAt: '',
                                                                        category: 'notice'
                                                                    });
                                                                }}
                                                            >
                                                                취소
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                        {selectedNoticeDetail ? (
                                                            <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                                                {selectedNoticeDetail.boardContent}
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center py-8">
                                                                <div className="text-sm text-gray-500">공지사항 내용을 불러오는 중...</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* 댓글 작성 영역 - 삭제된 글이 아닐 때만 표시 */}
                                                {!selectedNotice.isDeleted && (
                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                                                        <Label className="text-gray-700 font-medium">댓글 작성</Label>
                                                        <Textarea
                                                            value={noticeReplyContent}
                                                            onChange={(e) => setNoticeReplyContent(e.target.value)}
                                                            placeholder="공지사항에 대한 댓글을 작성해주세요..."
                                                            rows={4}
                                                            className="bg-white resize-none"
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button 
                                                                onClick={handleCreateNoticeReply} 
                                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                disabled={!noticeReplyContent.trim()}
                                                            >
                                                                <Send className="w-4 h-4 mr-2" />
                                                                댓글 등록
                                                            </Button>
                                                            <Button 
                                                                variant="outline"
                                                                onClick={() => setNoticeReplyContent('')}
                                                            >
                                                                취소
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 댓글 목록 영역 - 대댓글 지원 */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-gray-700 font-medium flex items-center gap-2">
                                                            <MessageCircle className="w-4 h-4" />
                                                            댓글 목록
                                                            {selectedNoticeDetail?.comments && (
                                                                <Badge variant="outline" className="ml-2">
                                                                    {selectedNoticeDetail.comments.length}개
                                                                </Badge>
                                                            )}
                                                        </Label>
                                                    </div>
                                                    <CommentList
                                                        comments={selectedNoticeDetail?.comments || []}
                                                        boardId={selectedNotice.id}
                                                        adminUser={JSON.parse(localStorage.getItem('adminUser') || '{}')}
                                                        actions={{
                                                            onEdit: handleCommentEdit,
                                                            onDelete: handleCommentDelete,
                                                            onReply: handleCommentReply
                                                        }}
                                                        emptyMessage="아직 댓글이 없습니다"
                                                    />
                                                </div>

                                                {/* 액션 버튼 영역 - 공지사항 수정/삭제 (댓글 목록 아래) */}
                                                <div className="flex gap-2 pt-2 border-t border-gray-200 mt-4">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="flex items-center gap-2 hover:bg-gray-50"
                                                        onClick={() => handleEditNotice(selectedNotice.id)}
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        수정
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteNotice(selectedNotice.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        삭제
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500 py-12">
                                                <div className="mb-4">
                                                    <MessageCircle className="h-12 w-12 mx-auto text-gray-300" />
                                                </div>
                                                <p className="text-lg font-medium">공지사항을 선택하세요</p>
                                                <p className="text-sm">왼쪽 목록에서 공지사항을 선택하면 상세 내용을 확인할 수 있습니다.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="tickets" className="space-y-6">
                    {/* Filter Cards */}
                    <div className="grid grid-cols-5 gap-3">
                        {[
                            { value: 'all', label: '전체', count: tickets.length, icon: MessageCircle, color: 'text-blue-600' },
                            { value: 'new', label: '신규', count: tickets.filter(t => t.status === 'new').length, icon: AlertCircle, color: 'text-red-600' },
                            { value: 'in_progress', label: '진행중', count: tickets.filter(t => t.status === 'in_progress').length, icon: Clock, color: 'text-orange-600' },
                            { value: 'resolved', label: '완료', count: tickets.filter(t => t.status === 'resolved').length, icon: CheckCircle, color: 'text-green-600' },
                            { value: 'closed', label: '종료', count: tickets.filter(t => t.status === 'closed').length, icon: CheckCircle, color: 'text-gray-600' },
                        ].map((filter) => {
                            const IconComponent = filter.icon;
                            const isActive = statusFilter === filter.value;
                            return (
                                <Card 
                                    key={filter.value}
                                    className={`cursor-pointer border ${
                                        isActive 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setStatusFilter(filter.value)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">{filter.label}</span>
                                            <IconComponent className={`h-4 w-4 ${filter.color}`} />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {filter.count}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Ticket List and Detail */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        {/* Ticket List */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    문의 목록
                                    <Badge variant="outline" className="bg-blue-50 text-blue-600">
                                        {filteredTickets.length}건
                                    </Badge>
                                </CardTitle>
                                {/* Search Bar */}
                                <div className="flex gap-3" style={{ marginTop: '24px'}}>
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="제목, 매니저명으로 검색..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleTicketSearch();
                                                }
                                            }}
                                            className="pl-10"
                                        />
                                    </div>
                                    <select
                                        value={priorityFilter}
                                        onChange={e => setPriorityFilter(e.target.value)}
                                        className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="all">전체</option>
                                        <option value="low">낮음</option>
                                        <option value="medium">보통</option>
                                        <option value="high">높음</option>
                                        <option value="critical">긴급</option>
                                    </select>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[800px] flex flex-col">
                                <div className="space-y-3 h-[680px] overflow-hidden flex-1">
                                    {filteredTickets.length === 0 ? (
                                        <div className="text-center text-gray-500 py-8">
                                            {searchTerm ? '검색 결과가 없습니다.' : '문의가 없습니다.'}
                                        </div>
                                    ) : (
                                        filteredTickets.map((ticket) => (
                                            <div
                                                key={ticket.id}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md h-20 flex flex-col justify-center ${
                                                    selectedTicket?.id === ticket.id
                                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                                onClick={() => {
                                                    setSelectedTicket(ticket);
                                                    setSelectedTicketDetail(null);
                                                    loadTicketDetail(ticket.id);
                                                }}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                                                            {ticket.title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex-shrink-0 ml-2 flex gap-2">
                                                        {getStatusBadge(ticket.status)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <span>{ticket.userName}</span>
                                                    <div className="flex items-center gap-2">
                                                        <MessageCircle className="h-3 w-3" />
                                                        <span>{ticket.commentNum}</span>
                                                        <span>{new Date(ticket.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ticket Detail */}
                        <Card>
                            <CardHeader>
                                <CardTitle>문의 상세</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedTicket ? (
                                    <div className="space-y-6">
                                        {/* 헤더 영역 */}
                                        <div className="border-b border-gray-200 pb-4">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                {getStatusBadge(selectedTicket.status)}
                                            </div>
                                            <h3 className="font-semibold text-lg mb-2">{selectedTicket.title}</h3>
                                            <div className="flex justify-between items-center text-sm text-gray-500">
                                                <div className="flex items-center gap-3">
                                                    <span>{selectedTicketDetail?.userName || selectedTicket.userName}</span>
                                                    <span>{new Date(selectedTicket.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</span>
                                                </div>
                                                <span className="text-xs">
                                                    {(selectedTicketDetail?.modifiedAt || selectedTicket.lastResponse) && 
                                                     new Date(selectedTicketDetail?.modifiedAt || selectedTicket.lastResponse).getTime() !== new Date(selectedTicket.createdAt).getTime()
                                                        ? `수정: ${new Date(selectedTicketDetail?.modifiedAt || selectedTicket.lastResponse).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`
                                                        : ''
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        {/* 본문 영역 */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            {selectedTicketDetail ? (
                                                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                                    {selectedTicketDetail.boardContent}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="text-sm text-gray-500">문의 내용을 불러오는 중...</div>
                                                </div>
                                            )}
                                        </div>
                                        {/* 댓글 작성 영역 - 삭제된 글이 아닐 때만 표시 */}
                                        {!selectedTicket.isDeleted && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                                                <Label className="text-gray-700 font-medium">답변 작성</Label>
                                                <Textarea
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    placeholder="매니저 문의에 대한 답변을 작성해주세요..."
                                                    rows={4}
                                                    className="bg-white resize-none"
                                                />
                                                <div className="flex gap-2">
                                                    <Button 
                                                        onClick={handleSendReply} 
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                        disabled={!replyContent.trim()}
                                                    >
                                                        <Send className="w-4 h-4 mr-2" />
                                                        답변 전송
                                                    </Button>
                                                    <Button 
                                                        variant="outline"
                                                        onClick={() => setReplyContent('')}
                                                    >
                                                        취소
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        {/* 댓글 목록 영역 - 대댓글 지원 */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-gray-700 font-medium flex items-center gap-2">
                                                    <MessageCircle className="w-4 h-4" />
                                                    대화 내역
                                                    {selectedTicketDetail?.comments && (
                                                        <Badge variant="outline" className="ml-2">
                                                            {selectedTicketDetail.comments.length}개
                                                        </Badge>
                                                    )}
                                                </Label>
                                            </div>
                                            <CommentList
                                                comments={selectedTicketDetail?.comments || []}
                                                boardId={selectedTicket.id}
                                                adminUser={JSON.parse(localStorage.getItem('adminUser') || '{}')}
                                                actions={{
                                                    onEdit: handleCommentEdit,
                                                    onDelete: handleCommentDelete,
                                                    onReply: handleCommentReply
                                                }}
                                                emptyMessage="아직 답변이 없습니다"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-12">
                                        <div className="mb-4">
                                            <MessageCircle className="h-12 w-12 mx-auto text-gray-300" />
                                        </div>
                                        <p className="text-lg font-medium">문의를 선택하세요</p>
                                        <p className="text-sm">왼쪽 목록에서 문의를 선택하면 상세 내용을 확인할 수 있습니다.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 