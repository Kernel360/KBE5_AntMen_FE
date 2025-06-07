import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
    Headphones,
    AlertTriangle,
    CheckCircle,
    Clock,
    Bug,
    Server,
    Shield,
    Zap,
    Send,
    MessageSquare,
    Settings
} from 'lucide-react';

interface OperationTicket {
    id: number;
    title: string;
    description: string;
    category: 'system' | 'security' | 'performance' | 'bug' | 'feature' | 'maintenance';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'new' | 'assigned' | 'in_progress' | 'testing' | 'resolved' | 'closed';
    reporter: string;
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
    estimatedTime?: number; // hours
    actualTime?: number; // hours
    affectedSystems: string[];
    responses: Array<{
        id: number;
        author: string;
        content: string;
        timestamp: string;
        isInternal: boolean;
    }>;
}

const sampleTickets: OperationTicket[] = [
    {
        id: 1,
        title: '서버 응답 속도 저하',
        description: '최근 24시간 동안 서버 응답 속도가 평소보다 30% 느려짐. 사용자 불편 신고 증가.',
        category: 'performance',
        priority: 'high',
        status: 'in_progress',
        reporter: '모니터링 시스템',
        assignedTo: '시스템 엔지니어A',
        createdAt: '2025-06-06 09:30',
        updatedAt: '2025-06-06 14:15',
        estimatedTime: 4,
        actualTime: 2,
        affectedSystems: ['웹서버', '데이터베이스'],
        responses: [
            {
                id: 1,
                author: '모니터링 시스템',
                content: '서버 응답 시간이 평균 2.5초로 증가했습니다. 정상 범위(0.8초)를 벗어났습니다.',
                timestamp: '2025-06-06 09:30',
                isInternal: true
            },
            {
                id: 2,
                author: '시스템 엔지니어A',
                content: '데이터베이스 쿼리 최적화를 진행 중입니다. 예상 완료 시간은 오후 5시입니다.',
                timestamp: '2025-06-06 14:15',
                isInternal: true
            }
        ]
    },
    {
        id: 2,
        title: '결제 시스템 오류',
        description: '특정 카드사 결제 시 오류 발생. 결제 성공률 95% → 78%로 감소.',
        category: 'system',
        priority: 'critical',
        status: 'new',
        reporter: '운영팀',
        createdAt: '2025-06-06 15:45',
        updatedAt: '2025-06-06 15:45',
        estimatedTime: 2,
        affectedSystems: ['결제게이트웨이', 'PG사 연동'],
        responses: [
            {
                id: 1,
                author: '운영팀',
                content: 'A카드사 결제 시 "처리 불가" 오류가 발생하고 있습니다. 긴급 대응이 필요합니다.',
                timestamp: '2025-06-06 15:45',
                isInternal: true
            }
        ]
    },
    {
        id: 3,
        title: '보안 취약점 패치',
        description: 'CVE-2025-1234 보안 취약점에 대한 긴급 패치 적용 필요.',
        category: 'security',
        priority: 'critical',
        status: 'resolved',
        reporter: '보안팀',
        assignedTo: '보안 엔지니어B',
        createdAt: '2025-06-05 10:00',
        updatedAt: '2025-06-06 08:30',
        estimatedTime: 6,
        actualTime: 8,
        affectedSystems: ['전체 시스템'],
        responses: [
            {
                id: 1,
                author: '보안팀',
                content: '심각도 높은 보안 취약점이 발견되었습니다. 즉시 패치 적용이 필요합니다.',
                timestamp: '2025-06-05 10:00',
                isInternal: true
            },
            {
                id: 2,
                author: '보안 엔지니어B',
                content: '패치 적용 완료했습니다. 전체 시스템 보안 검증도 완료되었습니다.',
                timestamp: '2025-06-06 08:30',
                isInternal: true
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
        default: return <AlertTriangle className="h-4 w-4" />;
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
    switch (priority) {
        case 'critical':
            return <Badge className="bg-red-500 text-white">긴급</Badge>;
        case 'high':
            return <Badge className="bg-orange-100 text-orange-800">높음</Badge>;
        case 'medium':
            return <Badge className="bg-yellow-100 text-yellow-800">보통</Badge>;
        case 'low':
            return <Badge variant="secondary">낮음</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'new':
            return <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" />신규</Badge>;
        case 'assigned':
            return <Badge className="bg-blue-100 text-blue-800">배정됨</Badge>;
        case 'in_progress':
            return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />진행중</Badge>;
        case 'testing':
            return <Badge className="bg-purple-100 text-purple-800">테스트중</Badge>;
        case 'resolved':
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />해결</Badge>;
        case 'closed':
            return <Badge variant="secondary">완료</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

export const OperationSupport: React.FC = () => {
    const [tickets, setTickets] = useState<OperationTicket[]>(sampleTickets);
    const [selectedTicket, setSelectedTicket] = useState<OperationTicket | null>(null);
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
                ? { ...ticket, status: newStatus as any, updatedAt: new Date().toLocaleString('ko-KR') }
                : ticket
        ));
        if (selectedTicket && selectedTicket.id === ticketId) {
            setSelectedTicket({
                ...selectedTicket,
                status: newStatus as any,
                updatedAt: new Date().toLocaleString('ko-KR')
            });
        }
    };

    const handleSendReply = () => {
        if (!selectedTicket || !replyContent.trim()) return;

        const newResponse = {
            id: selectedTicket.responses.length + 1,
            author: '운영자',
            content: replyContent,
            timestamp: new Date().toLocaleString('ko-KR'),
            isInternal: true
        };

        const updatedTicket = {
            ...selectedTicket,
            responses: [...selectedTicket.responses, newResponse],
            updatedAt: new Date().toLocaleString('ko-KR'),
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
                <h1 className="text-3xl font-bold text-gray-900">운영상담</h1>
                <p className="text-gray-600 mt-2">시스템 이슈와 운영 문의를 관리하세요</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">전체 티켓</CardTitle>
                        <Headphones className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">긴급 이슈</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
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
                            <CardTitle className="flex items-center justify-between text-sm">
                                운영 티켓 목록
                                <div className="flex space-x-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-24 h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">전체</SelectItem>
                                            <SelectItem value="new">신규</SelectItem>
                                            <SelectItem value="in_progress">진행중</SelectItem>
                                            <SelectItem value="resolved">해결</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                        <SelectTrigger className="w-24 h-8">
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
                                            <div className="flex items-start justify-between">
                                                <h4 className="font-medium text-sm leading-tight">{ticket.title}</h4>
                                                {getPriorityBadge(ticket.priority)}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getCategoryBadge(ticket.category)}
                                                {getStatusBadge(ticket.status)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                <p>담당: {ticket.assignedTo || '미배정'}</p>
                                                <p>{new Date(ticket.createdAt).toLocaleDateString('ko-KR')}</p>
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
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{selectedTicket.title}</CardTitle>
                                        <CardDescription className="mt-2 space-y-1">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span>티켓 #{selectedTicket.id}</span>
                                                <span>•</span>
                                                <span>신고자: {selectedTicket.reporter}</span>
                                                <span>•</span>
                                                <span>{selectedTicket.createdAt}</span>
                                            </div>
                                            {selectedTicket.assignedTo && (
                                                <p className="text-sm">담당자: {selectedTicket.assignedTo}</p>
                                            )}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        {getCategoryBadge(selectedTicket.category)}
                                        {getPriorityBadge(selectedTicket.priority)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="details" className="space-y-4">
                                    <TabsList>
                                        <TabsTrigger value="details">상세정보</TabsTrigger>
                                        <TabsTrigger value="conversation">대화내용</TabsTrigger>
                                        <TabsTrigger value="progress">진행상황</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="details" className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">문제 설명</label>
                                            <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded">
                                                {selectedTicket.description}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">상태</label>
                                                <div className="mt-1">
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
                                                            <SelectItem value="closed">완료</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">예상 시간</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {selectedTicket.estimatedTime ? `${selectedTicket.estimatedTime}시간` : '미정'}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">영향받는 시스템</label>
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                {selectedTicket.affectedSystems.map((system, index) => (
                                                    <Badge key={index} variant="outline">{system}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="conversation" className="space-y-4">
                                        <div className="space-y-4 max-h-96 overflow-y-auto border rounded p-4">
                                            {selectedTicket.responses.map((response) => (
                                                <div key={response.id} className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium">{response.author}</span>
                                                        <span className="text-xs text-gray-500">{response.timestamp}</span>
                                                        {response.isInternal && (
                                                            <Badge variant="secondary" className="text-xs">내부</Badge>
                                                        )}
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded text-sm">
                                                        {response.content}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <Textarea
                                                placeholder="내부 메모나 진행 상황을 입력하세요..."
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                className="min-h-24"
                                            />
                                            <div className="flex justify-end">
                                                <Button onClick={handleSendReply} disabled={!replyContent.trim()}>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    메모 추가
                                                </Button>
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
                                                <p className="mt-1 text-sm text-gray-900">{selectedTicket.updatedAt}</p>
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
                                    <p>티켓을 선택하여 상세내용을 확인하세요</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};