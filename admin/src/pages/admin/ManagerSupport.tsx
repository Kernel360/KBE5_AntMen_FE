import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
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
    Settings
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
        system: { label: '시스템', color: 'bg-blue-100 text-blue-800' },
        security: { label: '보안', color: 'bg-red-100 text-red-800' },
        performance: { label: '성능', color: 'bg-yellow-100 text-yellow-800' },
        bug: { label: '버그', color: 'bg-orange-100 text-orange-800' },
        feature: { label: '기능', color: 'bg-green-100 text-green-800' },
        maintenance: { label: '유지보수', color: 'bg-gray-100 text-gray-800' }
    };

    const cat = categories[category as keyof typeof categories] || categories.system;
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
    const [selectedTicket, setSelectedTicket] = useState<ManagerTicket | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

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
                <p className="text-gray-600 mt-2">매니저 문의를 관리하세요</p>
            </div>

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
                        <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">진행중</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inProgress}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">해결됨</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resolved}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Ticket List */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                문의 목록
                                <div className="flex space-x-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-24">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">상태</SelectItem>
                                            <SelectItem value="new">신규</SelectItem>
                                            <SelectItem value="assigned">배정됨</SelectItem>
                                            <SelectItem value="in_progress">진행중</SelectItem>
                                            <SelectItem value="testing">테스트중</SelectItem>
                                            <SelectItem value="resolved">해결</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                        <SelectTrigger className="w-24">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">우선순위</SelectItem>
                                            <SelectItem value="critical">긴급</SelectItem>
                                            <SelectItem value="high">높음</SelectItem>
                                            <SelectItem value="medium">보통</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-96 overflow-y-auto">
                                {filteredTickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedTicket?.id === ticket.id ? 'bg-blue-50 border-blue-200' : ''
                                        }`}
                                        onClick={() => setSelectedTicket(ticket)}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-sm truncate">{ticket.title}</h4>
                                                {getPriorityBadge(ticket.priority)}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Headphones className="h-3 w-3 text-gray-400" />
                                                <span className="text-xs text-gray-600">
                                                    {ticket.managerInfo.name} ({ticket.managerInfo.position})
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                {getStatusBadge(ticket.status)}
                                                <span className="text-xs text-gray-500">
                                                    {new Date(ticket.createdAt).toLocaleDateString('ko-KR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel - Ticket Detail */}
                <div className="lg:col-span-2">
                    {selectedTicket ? (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{selectedTicket.title}</CardTitle>
                                        <CardDescription className="flex items-center space-x-4 mt-2">
                                            <span>
                                                {selectedTicket.managerInfo.name} ({selectedTicket.managerInfo.position})
                                                {selectedTicket.managerInfo.location && ` - ${selectedTicket.managerInfo.location}`}
                                            </span>
                                            <span>•</span>
                                            <span>{selectedTicket.createdAt}</span>
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {getCategoryBadge(selectedTicket.category)}
                                        {getPriorityBadge(selectedTicket.priority)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="conversation" className="space-y-4">
                                    <TabsList>
                                        <TabsTrigger value="conversation">대화내용</TabsTrigger>
                                        <TabsTrigger value="details">상세정보</TabsTrigger>
                                        <TabsTrigger value="progress">진행상황</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="conversation" className="space-y-4">
                                        {/* Conversation History */}
                                        <div className="space-y-4 max-h-96 overflow-y-auto border rounded p-4">
                                            {selectedTicket.responses.map((response) => (
                                                <div
                                                    key={response.id}
                                                    className={`flex ${response.isStaff ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] rounded-lg p-3 ${
                                                            response.isStaff
                                                                ? 'bg-blue-100 text-blue-900'
                                                                : 'bg-gray-100 text-gray-900'
                                                        }`}
                                                    >
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="text-sm font-medium">{response.author}</span>
                                                            <span className="text-xs text-gray-500">{response.timestamp}</span>
                                                            {response.isStaff && (
                                                                <Badge variant="secondary" className="text-xs">관리자</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm">{response.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Reply Input */}
                                        <div className="space-y-4">
                                            <Textarea
                                                placeholder="답변을 입력하세요..."
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                className="min-h-24"
                                            />
                                            <div className="flex items-center justify-between">
                                                <Select
                                                    value={selectedTicket.status}
                                                    onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                                                >
                                                    <SelectTrigger className="w-40 bg-white border-gray-200 hover:bg-gray-50">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border-gray-200 shadow-lg">
                                                        <SelectItem value="new" className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900">신규</SelectItem>
                                                        <SelectItem value="assigned" className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900">배정됨</SelectItem>
                                                        <SelectItem value="in_progress" className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900">진행중</SelectItem>
                                                        <SelectItem value="testing" className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900">테스트중</SelectItem>
                                                        <SelectItem value="resolved" className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900">해결</SelectItem>
                                                        <SelectItem value="closed" className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900">종료</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button onClick={handleSendReply} disabled={!replyContent.trim()}>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    답변 전송
                                                </Button>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="details" className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">카테고리</label>
                                                <div className="mt-1">{getCategoryBadge(selectedTicket.category)}</div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">우선순위</label>
                                                <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">상태</label>
                                                <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">담당자</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedTicket.assignedTo || '미배정'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">위치</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedTicket.managerInfo.location || '미정'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">예상 시간</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {selectedTicket.estimatedTime ? `${selectedTicket.estimatedTime}시간` : '미정'}
                                                </p>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-sm font-medium text-gray-700">영향받는 시스템</label>
                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    {selectedTicket.affectedSystems?.map((system, index) => (
                                                        <Badge key={index} variant="outline">{system}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-sm font-medium text-gray-700">최초 문의내용</label>
                                                <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded">
                                                    {selectedTicket.content}
                                                </p>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="progress" className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">생성일시</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedTicket.createdAt}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">최종 업데이트</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedTicket.lastResponse}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">소요 시간</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {selectedTicket.actualTime ? `${selectedTicket.actualTime}시간` : '진행중'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">진행률</label>
                                                <div className="mt-1">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                                            style={{
                                                                width: selectedTicket.status === 'resolved' ? '100%' :
                                                                    selectedTicket.status === 'in_progress' ? '60%' :
                                                                        selectedTicket.status === 'assigned' ? '30%' : '10%'
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="flex items-center justify-center h-64">
                                <div className="text-center text-gray-500">
                                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>문의를 선택하여 상세내용을 확인하세요</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}; 