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
    Send,
    Plus,
    Edit,
    Trash2,
    Megaphone,
    Search,
    Reply,
    ChevronDown,
    ChevronRight,
    User,
    Calendar,
    Hash
} from 'lucide-react';
import { adminService } from '../../api/adminService';
import { BoardRequestDto } from '../../api/types';
import { Comment, CommentWithDepth, AdminUser, CommentActionHandlers, buildCommentTree, flattenComments, CommentList } from '../../shared';

interface CustomerTicket {
    id: number;
    title: string;
    category: 'general' | 'billing' | 'technical' | 'refund' | 'account';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'new' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
    content: string;
    createdAt: string;
    lastResponse: string;
    commentNum: number;
    assignedTo?: string;
    isDeleted?: boolean;
    customerInfo: {
        name: string;
        email: string;
    };
    responses: Array<{
        id: number;
        author: string;
        content: string;
        timestamp: string;
        isStaff: boolean;
    }>;
}

interface Notice {
    boardId: number;
    userName: string;
    boardTitle: string;
    createdAt: string;
    modifiedAt: string;
    commentNum: number;
    boardStatus: string | null;
    isDeleted: boolean;
    category: 'notice' | 'faq';
}



const getCategoryBadge = (notice: Notice) => {
    const badges = [];
    
    // FAQ 배지
    if (notice.boardTitle?.startsWith('[FAQ]')) {
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
    
    // 상태 배지 - 임시저장 제거, 예약만 표시
    if (notice.boardStatus) {
        const statusLabels = {
            'Reserved': '예약',
            'reserved': '예약'
        };
        const statusLabel = statusLabels[notice.boardStatus as keyof typeof statusLabels];
        if (statusLabel) {
            badges.push(
                <Badge key="status" className="bg-yellow-100 text-yellow-800">
                    {statusLabel}
                </Badge>
            );
        }
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
        urgent: { label: '긴급', color: 'bg-red-100 text-red-800' }
    };

    const pri = priorities[priority as keyof typeof priorities] || priorities.medium;
    return <Badge className={pri.color}>{pri.label}</Badge>;
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'new':
            return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />신규</Badge>;
        case 'in_progress':
            return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />진행중</Badge>;
        case 'resolved':
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />해결완료</Badge>;
        case 'closed':
            return <Badge className="bg-gray-100 text-gray-800"><CheckCircle className="w-3 h-3 mr-1" />종료</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

export const CustomerSupport: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [tickets, setTickets] = useState<CustomerTicket[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<CustomerTicket | null>(null);
    const [selectedTicketDetail, setSelectedTicketDetail] = useState<any>(null);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
    const [selectedNoticeDetail, setSelectedNoticeDetail] = useState<any>(null);
    const [replyContent, setReplyContent] = useState('');
    const [noticeReplyContent, setNoticeReplyContent] = useState('');
    

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
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

    // 공지사항 필터링 상태
    const [noticeFilter, setNoticeFilter] = useState<string>('all');
    const [noticeSearchTerm, setNoticeSearchTerm] = useState<string>('');
    const [noticeSearchInput, setNoticeSearchInput] = useState<string>('');
    const [noticeSortBy, setNoticeSortBy] = useState<string>('latest');
    
    // 1:1 문의 필터링 상태
    const [ticketFilter, setTicketFilter] = useState<string>('all');
    const [ticketSearchTerm, setTicketSearchTerm] = useState<string>('');
    const [ticketSearchInput, setTicketSearchInput] = useState<string>('');
    const [ticketSortBy, setTicketSortBy] = useState<string>('latest');
    
    // 페이지네이션 상태 추가
    const [currentPage, setCurrentPage] = useState(0);
    
    // 탭별 필터링 상태 추가
    const [activeTab, setActiveTab] = useState<'all' | 'deleted' | 'reserved'>('all');

    // 공지사항 목록 로드 (전체 데이터)
    const loadNotices = async () => {
        try {
            const response: any = await adminService.getBoardList(
                'customer', 
                'notice', 
                noticeSearchTerm,
                noticeSortBy
            );
            
            const transformedNotices: Notice[] = response.map((notice: any) => ({
                boardId: notice.boardId,
                userName: notice.userName,
                boardTitle: notice.boardTitle,
                createdAt: notice.createdAt,
                modifiedAt: notice.modifiedAt,
                commentNum: notice.commentNum || notice.commentCount || 0,
                boardStatus: notice.boardStatus,
                isDeleted: notice.isDeleted,
                category: notice.boardTitle?.startsWith('[FAQ]') ? 'faq' : 'notice'
            }));
            
            setNotices(transformedNotices);
        } catch (error) {
            console.error('공지사항 로드 실패:', error);
        }
    };

    // 고객 1:1 문의 목록 로드 (전체 데이터)
    const loadCustomerInquiries = async () => {
        try {
            const response: any = await adminService.getBoardList(
                'customer',
                'personal',
                ticketSearchTerm,
                ticketSortBy
            );
            
            if (!response || !Array.isArray(response)) {
                console.error('고객 문의 데이터가 배열이 아님:', response);
                setTickets([]);
                return;
            }
            
            const transformedTickets: CustomerTicket[] = response.map((inquiry: any) => {
                
                // isDeleted가 true면 무조건 closed 상태
                if (inquiry.isDeleted) {
                    return {
                        id: inquiry.boardId || inquiry.id,
                        title: inquiry.boardTitle || inquiry.title || '제목 없음',
                        category: 'general',
                        priority: 'medium',
                        status: 'closed' as const,
                        content: inquiry.boardContent || inquiry.content || '',
                        createdAt: inquiry.createdAt || inquiry.boardCreatedAt || new Date().toISOString(),
                        lastResponse: inquiry.modifiedAt || inquiry.boardModifiedAt || inquiry.createdAt || new Date().toISOString(),
                        commentNum: inquiry.commentNum || inquiry.commentCount || 0,
                        customerInfo: {
                            name: inquiry.userName || '고객',
                            email: inquiry.userEmail || ''
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
                    title: inquiry.boardTitle || inquiry.title || '제목 없음',
                    category: 'general',
                    priority: 'medium',
                    status,
                    content: inquiry.boardContent || inquiry.content || '',
                    createdAt: inquiry.createdAt || inquiry.boardCreatedAt || new Date().toISOString(),
                    lastResponse: inquiry.modifiedAt || inquiry.boardModifiedAt || inquiry.createdAt || new Date().toISOString(),
                    commentNum: inquiry.commentNum || inquiry.commentCount || 0,
                    customerInfo: {
                        name: inquiry.userName || '고객',
                        email: inquiry.userEmail || ''
                    },
                    responses: [],
                };
            });
            setTickets(transformedTickets);
        } catch (error) {
            console.error('고객 문의 로드 실패:', error);
            setTickets([]);
        }
    };

    // 공지 상세 조회
    const loadNoticeDetail = async (noticeId: number) => {
        try {
            // 카테고리에 따라 boardType 결정
            const boardType = selectedNotice?.category === 'faq' ? 'customer' : 'customer-notice';
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
            await adminService.createBoardComment(selectedNotice.boardId, noticeReplyContent, null);
            
            // 댓글 작성 후 상세 정보 다시 로드
            await loadNoticeDetail(selectedNotice.boardId);
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
        setTicketSearchTerm(ticketSearchInput);
    };

    // 컴포넌트 마운트 시 공지사항 목록만 로드
    useEffect(() => {
        loadNotices();
    }, [noticeSearchTerm, noticeSortBy]);



    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
        const matchesFilter = ticketFilter === 'all' || 
                            (ticketFilter === 'new' && ticket.status === 'new') ||
                            (ticketFilter === 'in_progress' && ticket.status === 'in_progress') ||
                            (ticketFilter === 'resolved' && ticket.status === 'resolved') ||
                            (ticketFilter === 'closed' && ticket.status === 'closed');
        const matchesSearch = ticket.title.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
                            ticket.customerInfo.name.toLowerCase().includes(ticketSearchTerm.toLowerCase());
        return matchesStatus && matchesPriority && matchesFilter && matchesSearch;
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

    const handleCreateNotice = async () => {
        if (!newNotice.boardTitle.trim() || !newNotice.boardContent.trim()) return;

        try {
            // 카테고리에 따라 boardType 결정
            const getBoardType = (category: string) => {
                switch (category) {
                    case 'faq':
                        return 'customer';
                    case 'notice':
                        return 'customer-notice';
                    default:
                        return 'customer-notice';
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
            alert('공지사항이 성공적으로 등록되었습니다.');
        } catch (error: any) {
            console.error('공지사항 등록 실패:', error);
            if (error.response?.status === 401) {
                alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
            } else {
                alert('공지사항 등록에 실패했습니다.');
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
            const boardType = selectedNotice.category === 'faq' ? 'customer' : 'customer-notice';
            
            const updateData = {
                boardTitle: editingNotice.boardTitle,
                boardContent: editingNotice.boardContent,
                boardIsPinned: editingNotice.boardIsPinned,
                boardReservatedAt: editingNotice.boardReservatedAt || undefined
            };
            
            await adminService.updateBoard(selectedNotice.boardId, updateData);
            
            // 성공시 공지사항 목록과 상세 정보 다시 로드
            await loadNotices();
            await loadNoticeDetail(selectedNotice.boardId);
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
            const boardType = selectedNotice.category === 'faq' ? 'customer' : 'customer-notice';
            
            await adminService.deleteNotice(noticeId);
            
            // 성공시 공지사항 목록 다시 로드
            await loadNotices();
            setSelectedNotice(null);
            alert('공지사항이 성공적으로 삭제되었습니다.');
        } catch (error: any) {
            console.error('공지사항 삭제 실패:', error);
            if (error.response?.status === 401) {
                alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
            } else {
                alert('공지사항 삭제에 실패했습니다.');
            }
        }
    };

    // 댓글 액션 핸들러들
    const handleCommentEdit = async (commentId: number, content: string) => {
        const boardId = selectedNotice?.boardId || selectedTicket?.id;
        if (!boardId) return;

        try {
            await adminService.updateBoardComment(boardId, commentId, content);
            
            // 상세 정보 다시 로드
            if (selectedNotice) {
                loadNoticeDetail(selectedNotice.boardId);
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
        const boardId = selectedNotice?.boardId || selectedTicket?.id;
        if (!boardId) return;

        try {
            await adminService.deleteBoardComment(boardId, commentId);
            
            // 상세 정보 다시 로드
            if (selectedNotice) {
                loadNoticeDetail(selectedNotice.boardId);
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
        const boardId = selectedNotice?.boardId || selectedTicket?.id;
        if (!boardId) return;

        try {
            await adminService.createBoardComment(boardId, content, parentId);
            
            // 상세 정보 다시 로드
            if (selectedNotice) {
                loadNoticeDetail(selectedNotice.boardId);
            } else if (selectedTicket) {
                loadTicketDetail(selectedTicket.id);
            }
        } catch (error) {
            console.error('답글 작성 실패:', error);
            alert('답글 작성에 실패했습니다.');
        }
    };

    // 필터링된 공지사항 - 탭별 필터링 적용
    const filteredNotices = notices.filter(notice => {
        let matchesFilter = false;
        
        switch (noticeFilter) {
            case 'all':
                // 전체 탭에서는 모든 게시글 표시
                matchesFilter = true;
                break;
            case 'notice':
                matchesFilter = notice.category === 'notice' && !notice.isDeleted && (notice.boardStatus !== 'Reserved' && notice.boardStatus !== 'reserved');
                break;
            case 'faq':
                matchesFilter = notice.category === 'faq' && !notice.isDeleted && (notice.boardStatus !== 'Reserved' && notice.boardStatus !== 'reserved');
                break;
            case 'reservation':
                // 예약 탭에서는 예약된 게시글만 표시
                matchesFilter = (notice.boardStatus === 'Reserved' || notice.boardStatus === 'reserved') && !notice.isDeleted;
                break;
            case 'deleted':
                // 삭제 탭에서는 삭제된 게시글만 표시
                matchesFilter = notice.isDeleted === true;
                break;
            default:
                matchesFilter = true;
        }
        
        const matchesSearch = notice.boardTitle.toLowerCase().includes(noticeSearchTerm.toLowerCase()) ||
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

    // 페이지네이션 적용 - 고정 10개씩
    const itemsPerPage = 10;
    const totalPages = Math.ceil(sortedNotices.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedNotices = sortedNotices.slice(startIndex, endIndex);

    // 필터나 검색어가 변경되면 첫 페이지로 이동
    useEffect(() => {
        setCurrentPage(0);
    }, [noticeFilter, noticeSearchTerm, noticeSortBy, ticketFilter, ticketSearchTerm, ticketSortBy]);

    // 초기 로드 및 URL 파라미터 처리
    useEffect(() => {
        const tab = searchParams.get('tab');
        
        if (tab === 'tickets') {
            loadCustomerInquiries();
        } else {
            loadNotices();
        }
    }, [searchParams]);

    // 통계 정보 계산 (실제 공지사항만 기준)
    const noticeStats = {
        total: notices.length, // 전체 공지사항 수 (삭제, 예약 포함)
        notice: notices.filter(n => n.category === 'notice' && !n.isDeleted && (n.boardStatus !== 'Reserved' && n.boardStatus !== 'reserved')).length,
        faq: notices.filter(n => n.category === 'faq' && !n.isDeleted && (n.boardStatus !== 'Reserved' && n.boardStatus !== 'reserved')).length,
        withComments: notices.filter(n => n.commentNum > 0 && !n.isDeleted && (n.boardStatus !== 'Reserved' && n.boardStatus !== 'reserved')).length
    };

    // 문의 통계 정보 수정
    const ticketStats = {
        total: tickets.length,
        new: tickets.filter(t => t.status === 'new').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length
    };

    // 문의 목록 자동 로드
    useEffect(() => {
        loadCustomerInquiries();
    }, [ticketSortBy, ticketSearchTerm, ticketFilter]);

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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                    <h1 className="text-2xl font-semibold text-gray-900">고객문의 관리</h1>
                </div>
                <p className="text-gray-600">고객 문의와 공지사항을 관리합니다</p>
            </div>

            <Tabs 
                defaultValue={searchParams.get('tab') || "notices"} 
                className="space-y-4" 
                onValueChange={(value) => {
                    if (value === 'tickets') {
                        loadCustomerInquiries();
                    }
                }}
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
                                    <Label htmlFor="pinned" className={newNotice.category === 'faq' ? 'text-gray-500' : ''}>
                                        고정 공지로 설정 {newNotice.category === 'faq' && '(FAQ는 자동 고정)'}
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
                                    { value: 'all', label: '전체', count: noticeStats.total, icon: MessageCircle, color: 'text-blue-600' },
                                    { value: 'notice', label: '공지', count: noticeStats.notice, icon: Megaphone, color: 'text-green-600' },
                                    { value: 'faq', label: 'FAQ', count: noticeStats.faq, icon: MessageCircle, color: 'text-purple-600' },
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
                                        {/* Search Bar and Sort */}
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
                                        <div className="space-y-2 h-[680px] overflow-hidden flex-1">
                                            {paginatedNotices.length > 0 ? paginatedNotices.map((notice) => (
                                                <div
                                                    key={notice.boardId}
                                                    className={`p-3 border rounded-lg cursor-pointer transition-colors h-20 flex flex-col justify-center ${
                                                        selectedNotice?.boardId === notice.boardId
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedNotice(notice);
                                                        setSelectedNoticeDetail(null); // 기존 상세 정보 초기화
                                                        loadNoticeDetail(notice.boardId);
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-medium text-sm">{notice.boardTitle}</h3>
                                                        </div>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {getCategoryBadge(notice)}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                                        <span>{notice.userName}</span>
                                                        <div className="flex items-center gap-2">
                                                            <MessageCircle className="w-3 h-3" />
                                                            <span>{notice.commentNum}</span>
                                                            <span>{new Date(notice.createdAt).toLocaleString('ko-KR')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center text-gray-500 py-8">
                                                    {noticeFilter === 'all' ? '등록된 공지사항이 없습니다.' : 
                                                     noticeFilter === 'notice' ? '일반 공지사항이 없습니다.' :
                                                     noticeFilter === 'faq' ? 'FAQ가 없습니다.' :
                                                     noticeFilter === 'reservation' ? '예약된 공지가 없습니다.' :
                                                     noticeFilter === 'deleted' ? '삭제된 공지가 없습니다.' :
                                                     '조건에 맞는 공지가 없습니다.'}
                                                </div>
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
                                        <CardTitle>공지 상세</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedNotice ? (
                                            <div className="space-y-4">
                                                {/* 헤더 영역 */}
                                                <div className="border-b border-gray-200 pb-4">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        {getCategoryBadge(selectedNotice)}
                                                    </div>
                                                    <h3 className="font-semibold text-lg mb-2">{selectedNotice.boardTitle}</h3>
                                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                                        <div className="flex items-center gap-3">
                                                            <span>{selectedNotice.userName}</span>
                                                            <span>{new Date(selectedNotice.createdAt).toLocaleString('ko-KR')}</span>
                                                        </div>
                                                        <span className="text-xs">
                                                            {(selectedNoticeDetail?.modifiedAt || selectedNotice.modifiedAt) && 
                                                             new Date(selectedNoticeDetail?.modifiedAt || selectedNotice.modifiedAt).getTime() !== new Date(selectedNotice.createdAt).getTime()
                                                                ? `수정: ${new Date(selectedNoticeDetail?.modifiedAt || selectedNotice.modifiedAt).toLocaleString('ko-KR')}`
                                                                : ''
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 본문 영역 */}
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
                                                                <div className="text-sm text-gray-500">공지 내용을 불러오는 중...</div>
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
                                                        boardId={selectedNotice.boardId}
                                                        adminUser={JSON.parse(localStorage.getItem('adminUser') || '{}')}
                                                        actions={{
                                                            onEdit: handleCommentEdit,
                                                            onDelete: handleCommentDelete,
                                                            onReply: handleCommentReply
                                                        }}
                                                        emptyMessage="등록된 댓글이 없습니다"
                                                    />
                                                </div>

                                                {/* 액션 버튼 영역 */}
                                                <div className="flex gap-2 pt-2 border-t border-gray-200">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="flex items-center gap-2 hover:bg-gray-50"
                                                        onClick={() => handleEditNotice(selectedNotice.boardId)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        수정
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteNotice(selectedNotice.boardId)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        삭제
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500 py-12">
                                                <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                                <p className="text-lg font-medium mb-1">공지를 선택하세요</p>
                                                <p className="text-sm">왼쪽 목록에서 공지를 클릭하면 상세 내용을 확인할 수 있습니다.</p>
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
                            { value: 'all', label: '전체', count: ticketStats.total, icon: MessageCircle, color: 'text-blue-600' },
                            { value: 'new', label: '신규', count: ticketStats.new, icon: AlertCircle, color: 'text-red-600' },
                            { value: 'in_progress', label: '진행중', count: ticketStats.inProgress, icon: Clock, color: 'text-orange-600' },
                            { value: 'resolved', label: '완료', count: ticketStats.resolved, icon: CheckCircle, color: 'text-green-600' },
                            { value: 'closed', label: '삭제', count: tickets.filter(t => t.status === 'closed').length, icon: CheckCircle, color: 'text-gray-600' },
                        ].map((filter) => {
                            const IconComponent = filter.icon;
                            const isActive = ticketFilter === filter.value;
                            return (
                                <Card 
                                    key={filter.value}
                                    className={`cursor-pointer border ${
                                        isActive 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setTicketFilter(filter.value)}
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
                                            placeholder="제목, 고객명으로 검색..."
                                            value={ticketSearchInput}
                                            onChange={(e) => setTicketSearchInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleTicketSearch();
                                                }
                                            }}
                                            className="pl-10"
                                        />
                                    </div>
                                    <select
                                        value={ticketSortBy}
                                        onChange={e => setTicketSortBy(e.target.value)}
                                        className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="latest">최신순</option>
                                        <option value="oldest">오래된순</option>
                                    </select>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[800px] flex flex-col">
                                <div className="space-y-2 h-[680px] overflow-hidden flex-1">
                                    {filteredTickets.length > 0 ? filteredTickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors h-20 flex flex-col justify-center ${
                                                selectedTicket?.id === ticket.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => {
                                                setSelectedTicket(ticket);
                                                setSelectedTicketDetail(null);
                                                loadTicketDetail(ticket.id);
                                            }}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-sm">{ticket.title}</h3>
                                                </div>
                                                <div className="flex gap-2 flex-wrap">
                                                    {getStatusBadge(ticket.status)}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>{ticket.customerInfo.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <MessageCircle className="w-3 h-3" />
                                                    <span>{ticket.commentNum}</span>
                                                    <span>{new Date(ticket.createdAt).toLocaleString('ko-KR')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center text-gray-500 py-8">
                                            {ticketFilter === 'all' ? '등록된 문의가 없습니다.' : 
                                             ticketFilter === 'new' ? '신규 문의가 없습니다.' :
                                             ticketFilter === 'in_progress' ? '진행중인 문의가 없습니다.' :
                                             ticketFilter === 'resolved' ? '완료된 문의가 없습니다.' :
                                             ticketFilter === 'closed' ? '삭제된 문의가 없습니다.' :
                                             '조건에 맞는 문의가 없습니다.'}
                                        </div>
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
                                    <div className="space-y-4">
                                        {/* 헤더 영역 */}
                                        <div className="border-b border-gray-200 pb-4">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                {getStatusBadge(selectedTicket.status)}
                                            </div>
                                            <h3 className="font-semibold text-lg mb-2">{selectedTicket.title}</h3>
                                            <div className="flex justify-between items-center text-sm text-gray-500">
                                                <div className="flex items-center gap-3">
                                                    <span>{selectedTicketDetail?.userName || selectedTicket.customerInfo.name}</span>
                                                    <span>{new Date(selectedTicket.createdAt).toLocaleString('ko-KR')}</span>
                                                </div>
                                                <span className="text-xs">
                                                    {(selectedTicketDetail?.modifiedAt || selectedTicket.lastResponse) && 
                                                     new Date(selectedTicketDetail?.modifiedAt || selectedTicket.lastResponse).getTime() !== new Date(selectedTicket.createdAt).getTime()
                                                        ? `수정: ${new Date(selectedTicketDetail?.modifiedAt || selectedTicket.lastResponse).toLocaleString('ko-KR')}`
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
                                                    placeholder="고객 문의에 대한 답변을 작성해주세요..."
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
                                                emptyMessage="등록된 답변이 없습니다"
                                            />
                                        </div>

                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-12">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                        <p className="text-lg font-medium mb-1">문의를 선택하세요</p>
                                        <p className="text-sm">왼쪽 목록에서 문의를 클릭하면 상세 내용을 확인할 수 있습니다.</p>
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