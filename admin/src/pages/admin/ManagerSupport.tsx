import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
    Headphones,
    MessageSquare,
    Send,
    Server,
    Shield,
    Zap,
    Bug,
    Settings,
    Plus,
    Edit,
    Trash2,
    Eye,
    Megaphone
} from 'lucide-react';

interface ManagerTicket {
    id: number;
    title: string;
    category: 'system' | 'security' | 'performance' | 'bug' | 'feature' | 'maintenance';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'new' | 'assigned' | 'in_progress' | 'testing' | 'resolved' | 'closed';
    content: string;
    createdAt: string;
    lastResponse: string;
    assignedTo?: string;
    managerInfo: {
        name: string;
        position: string;
        location?: string;
    };
    affectedSystems?: string[];
    estimatedTime?: number;
    actualTime?: number;
    reporter?: string;
    responses: Array<{
        id: number;
        author: string;
        content: string;
        timestamp: string;
        isStaff: boolean;
    }>;
}

interface Notice {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    isImportant: boolean;
    viewCount: number;
    category: 'general' | 'system' | 'policy' | 'training' | 'maintenance';
}

const sampleTickets: ManagerTicket[] = [
    {
        id: 1,
        title: '서버 과부하 문제',
        category: 'system',
        priority: 'critical',
        status: 'in_progress',
        content: '메인 서버의 CPU 사용률이 90%를 넘어서고 있습니다.',
        createdAt: '2025-06-06 10:15',
        lastResponse: '2025-06-06 11:30',
        assignedTo: '시스템관리자',
        managerInfo: {
            name: '이매니저',
            position: '서울지역 매니저',
            location: '강남점'
        },
        reporter: '모니터링 시스템',
        estimatedTime: 4,
        actualTime: 2,
        affectedSystems: ['웹서버', '데이터베이스'],
        responses: [
            {
                id: 1,
                author: '이매니저',
                content: '서버 과부하 문제가 발생했습니다.',
                timestamp: '2025-06-06 10:15',
                isStaff: true
            },
            {
                id: 2,
                author: '시스템관리자',
                content: '부하 분산을 위해 추가 서버를 배포하겠습니다.',
                timestamp: '2025-06-06 11:30',
                isStaff: true
            }
        ]
    }
];

const sampleNotices: Notice[] = [
    {
        id: 1,
        title: '매니저 교육 일정 안내',
        content: '2025년 6월 15일 오후 2시부터 4시까지 새로운 서비스 정책에 대한 교육이 예정되어 있습니다. 모든 매니저분들의 참석을 부탁드립니다.',
        author: '교육팀',
        createdAt: '2025-06-05 14:00',
        updatedAt: '2025-06-05 14:00',
        isImportant: true,
        viewCount: 450,
        category: 'training'
    },
    {
        id: 2,
        title: '서비스 정책 변경 안내',
        content: '고객 만족도 향상을 위해 서비스 정책이 일부 변경되었습니다. 자세한 내용은 첨부된 문서를 확인해주세요.',
        author: '정책팀',
        createdAt: '2025-06-03 11:30',
        updatedAt: '2025-06-03 11:30',
        isImportant: false,
        viewCount: 320,
        category: 'policy'
    }
];

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'system': return <Server className="h-4 w-4" />;
        case 'security': return <Shield className="h-4 w-4" />;
        case 'performance': return <Zap className="h-4 w-4" />;
        case 'bug': return <Bug className="h-4 w-4" />;
        case 'feature': return <Settings className="h-4 w-4" />;
        case 'maintenance': return <Settings className="h-4 w-4" />;
        default: return <MessageCircle className="h-4 w-4" />;
    }
};

const getCategoryBadge = (category: string) => {
    const categories = {
        general: { label: '일반', color: 'bg-gray-100 text-gray-800' },
        system: { label: '시스템', color: 'bg-blue-100 text-blue-800' },
        policy: { label: '정책', color: 'bg-green-100 text-green-800' },
        training: { label: '교육', color: 'bg-purple-100 text-purple-800' },
        maintenance: { label: '점검', color: 'bg-orange-100 text-orange-800' }
    };

    const cat = categories[category as keyof typeof categories] || categories.general;
    const Icon = getCategoryIcon(category);

    return (
        <Badge className={cat.color}>
            {Icon}
            <span className="ml-1">{cat.label}</span>
        </Badge>
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
            return <Badge variant="outline"><MessageCircle className="w-3 h-3 mr-1" />신규</Badge>;
        case 'assigned':
            return <Badge className="bg-blue-100 text-blue-800">배정됨</Badge>;
        case 'in_progress':
            return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />진행중</Badge>;
        case 'testing':
            return <Badge className="bg-purple-100 text-purple-800">테스트중</Badge>;
        case 'resolved':
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />해결</Badge>;
        case 'closed':
            return <Badge variant="secondary">종료</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

export const ManagerSupport: React.FC = () => {
    const [tickets, setTickets] = useState<ManagerTicket[]>(sampleTickets);
    const [notices, setNotices] = useState<Notice[]>(sampleNotices);
    const [selectedTicket, setSelectedTicket] = useState<ManagerTicket | null>(null);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [isWritingNotice, setIsWritingNotice] = useState(false);
    const [newNotice, setNewNotice] = useState({
        title: '',
        content: '',
        category: 'general' as const,
        isImportant: false
    });

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
        return matchesStatus && matchesPriority;
    });

    const handleStatusChange = (ticketId: number, newStatus: string) => {
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
    };

    const handleSendReply = () => {
        if (!selectedTicket || !replyContent.trim()) return;

        const newResponse = {
            id: selectedTicket.responses.length + 1,
            author: '관리자',
            content: replyContent,
            timestamp: new Date().toLocaleString('ko-KR'),
            isStaff: true
        };

        const updatedTicket = {
            ...selectedTicket,
            responses: [...selectedTicket.responses, newResponse],
            lastResponse: new Date().toLocaleString('ko-KR'),
            status: 'in_progress' as const
        };

        setTickets(tickets.map(ticket =>
            ticket.id === selectedTicket.id ? updatedTicket : ticket
        ));
        setSelectedTicket(updatedTicket);
        setReplyContent('');
    };

    const handleCreateNotice = () => {
        if (!newNotice.title.trim() || !newNotice.content.trim()) return;

        const notice: Notice = {
            id: notices.length + 1,
            title: newNotice.title,
            content: newNotice.content,
            author: '관리자',
            createdAt: new Date().toLocaleString('ko-KR'),
            updatedAt: new Date().toLocaleString('ko-KR'),
            isImportant: newNotice.isImportant,
            viewCount: 0,
            category: newNotice.category
        };

        setNotices([notice, ...notices]);
        setNewNotice({ title: '', content: '', category: 'general', isImportant: false });
        setIsWritingNotice(false);
    };

    const handleDeleteNotice = (noticeId: number) => {
        setNotices(notices.filter(notice => notice.id !== noticeId));
        if (selectedNotice && selectedNotice.id === noticeId) {
            setSelectedNotice(null);
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
            <div>
                <h1 className="text-3xl font-bold text-gray-900">매니저문의</h1>
                <p className="text-gray-600 mt-2">매니저 문의와 공지사항을 관리하세요</p>
            </div>

            <Tabs defaultValue="notices" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                        value="notices" 
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-md transition-all duration-200"
                    >
                        <Megaphone className="w-4 h-4" />
                        공지게시판
                    </TabsTrigger>
                    <TabsTrigger 
                        value="tickets" 
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-md transition-all duration-200"
                    >
                        <MessageCircle className="w-4 h-4" />
                        1:1 문의
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="notices" className="space-y-6">
                    {/* Notice Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">공지게시판</h2>
                            <p className="text-gray-600">중요한 공지사항을 관리하세요</p>
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
                                        value={newNotice.title}
                                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                        placeholder="공지 제목을 입력하세요"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="notice-category">카테고리</Label>
                                    <Select
                                        value={newNotice.category}
                                        onValueChange={(value: any) => setNewNotice({ ...newNotice, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">일반</SelectItem>
                                            <SelectItem value="system">시스템</SelectItem>
                                            <SelectItem value="policy">정책</SelectItem>
                                            <SelectItem value="training">교육</SelectItem>
                                            <SelectItem value="maintenance">점검</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="notice-content">내용</Label>
                                    <Textarea
                                        id="notice-content"
                                        value={newNotice.content}
                                        onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                        placeholder="공지 내용을 입력하세요"
                                        rows={6}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="important"
                                        checked={newNotice.isImportant}
                                        onChange={(e) => setNewNotice({ ...newNotice, isImportant: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <Label htmlFor="important">중요 공지로 설정</Label>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleCreateNotice} className="flex-1">
                                        공지 등록
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsWritingNotice(false);
                                            setNewNotice({ title: '', content: '', category: 'general', isImportant: false });
                                        }}
                                        className="flex-1"
                                    >
                                        취소
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Notice List */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>공지 목록</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {notices.map((notice) => (
                                            <div
                                                key={notice.id}
                                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                    selectedNotice?.id === notice.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => setSelectedNotice(notice)}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {notice.isImportant && (
                                                            <Badge className="bg-red-100 text-red-800">중요</Badge>
                                                        )}
                                                        <h3 className="font-medium text-sm">{notice.title}</h3>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {getCategoryBadge(notice.category)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <span>{notice.author}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Eye className="w-3 h-3" />
                                                        <span>{notice.viewCount}</span>
                                                        <span>{notice.createdAt}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {selectedNotice.isImportant && (
                                                        <Badge className="bg-red-100 text-red-800">중요</Badge>
                                                    )}
                                                    {getCategoryBadge(selectedNotice.category)}
                                                </div>
                                                <h3 className="font-semibold text-lg">{selectedNotice.title}</h3>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {selectedNotice.author} • {selectedNotice.createdAt}
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm whitespace-pre-wrap">{selectedNotice.content}</p>
                                            </div>

                                            <div className="flex justify-between items-center text-sm text-gray-500">
                                                <span>조회수: {selectedNotice.viewCount}</span>
                                                <span>수정일: {selectedNotice.updatedAt}</span>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                    <Edit className="w-4 h-4" />
                                                    수정
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                                                    onClick={() => handleDeleteNotice(selectedNotice.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    삭제
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 py-8">
                                            공지를 선택하세요
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="tickets" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">전체 문의</CardTitle>
                                <MessageCircle className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">긴급 문의</CardTitle>
                                <AlertCircle className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.critical}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">진행중</CardTitle>
                                <Clock className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.inProgress}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">해결완료</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.resolved}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle>필터</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label>상태</Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="상태 선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">전체</SelectItem>
                                            <SelectItem value="new">신규</SelectItem>
                                            <SelectItem value="assigned">배정됨</SelectItem>
                                            <SelectItem value="in_progress">진행중</SelectItem>
                                            <SelectItem value="testing">테스트중</SelectItem>
                                            <SelectItem value="resolved">해결</SelectItem>
                                            <SelectItem value="closed">종료</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1">
                                    <Label>우선순위</Label>
                                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="우선순위 선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">전체</SelectItem>
                                            <SelectItem value="low">낮음</SelectItem>
                                            <SelectItem value="medium">보통</SelectItem>
                                            <SelectItem value="high">높음</SelectItem>
                                            <SelectItem value="critical">긴급</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ticket List and Detail */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Ticket List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>문의 목록</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {filteredTickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                selectedTicket?.id === ticket.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setSelectedTicket(ticket)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium text-sm">{ticket.title}</h3>
                                                <div className="flex gap-1">
                                                    {getPriorityBadge(ticket.priority)}
                                                    {getStatusBadge(ticket.status)}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>{ticket.managerInfo.name}</span>
                                                <span>{ticket.createdAt}</span>
                                            </div>
                                        </div>
                                    ))}
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
                                        <div>
                                            <h3 className="font-semibold text-lg">{selectedTicket.title}</h3>
                                            <div className="flex gap-2 mt-2">
                                                {getCategoryBadge(selectedTicket.category)}
                                                {getPriorityBadge(selectedTicket.priority)}
                                                {getStatusBadge(selectedTicket.status)}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm">{selectedTicket.content}</p>
                                            <div className="text-xs text-gray-500 mt-2">
                                                {selectedTicket.managerInfo.name} • {selectedTicket.createdAt}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>상태 변경</Label>
                                            <Select
                                                value={selectedTicket.status}
                                                onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="new">신규</SelectItem>
                                                    <SelectItem value="assigned">배정됨</SelectItem>
                                                    <SelectItem value="in_progress">진행중</SelectItem>
                                                    <SelectItem value="testing">테스트중</SelectItem>
                                                    <SelectItem value="resolved">해결</SelectItem>
                                                    <SelectItem value="closed">종료</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>답변</Label>
                                            <Textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="답변을 입력하세요..."
                                                rows={3}
                                            />
                                            <Button onClick={handleSendReply} className="w-full">
                                                <Send className="w-4 h-4 mr-2" />
                                                답변 전송
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>대화 내역</Label>
                                            <div className="max-h-40 overflow-y-auto space-y-2">
                                                {selectedTicket.responses.map((response) => (
                                                    <div
                                                        key={response.id}
                                                        className={`p-2 rounded-lg text-sm ${
                                                            response.isStaff
                                                                ? 'bg-blue-100 ml-4'
                                                                : 'bg-gray-100 mr-4'
                                                        }`}
                                                    >
                                                        <div className="font-medium">{response.author}</div>
                                                        <div>{response.content}</div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {response.timestamp}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        문의를 선택하세요
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