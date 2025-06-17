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
    User,
    MessageSquare,
    Send
} from 'lucide-react';

interface CustomerInquiry {
    id: number;
    customerName: string;
    customerEmail: string;
    subject: string;
    category: 'general' | 'billing' | 'technical' | 'refund' | 'account';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'new' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
    content: string;
    createdAt: string;
    lastResponse: string;
    assignedTo?: string;
    responses: Array<{
        id: number;
        author: string;
        content: string;
        timestamp: string;
        isStaff: boolean;
    }>;
}

const sampleInquiries: CustomerInquiry[] = [
    {
        id: 1,
        customerName: '김고객',
        customerEmail: 'customer1@example.com',
        subject: '결제가 안돼요',
        category: 'billing',
        priority: 'high',
        status: 'new',
        content: '결제를 시도했는데 계속 오류가 발생합니다. 도움이 필요합니다.',
        createdAt: '2025-06-06 14:30',
        lastResponse: '2025-06-06 14:30',
        responses: [
            {
                id: 1,
                author: '김고객',
                content: '결제를 시도했는데 계속 오류가 발생합니다. 도움이 필요합니다.',
                timestamp: '2025-06-06 14:30',
                isStaff: false
            }
        ]
    },
    {
        id: 2,
        customerName: '이사용',
        customerEmail: 'user2@example.com',
        subject: '계정 접속 문제',
        category: 'account',
        priority: 'medium',
        status: 'in_progress',
        content: '로그인이 되지 않습니다. 비밀번호를 재설정해도 같은 문제가 발생해요.',
        createdAt: '2025-06-06 10:15',
        lastResponse: '2025-06-06 11:30',
        assignedTo: '상담원A',
        responses: [
            {
                id: 1,
                author: '이사용',
                content: '로그인이 되지 않습니다. 비밀번호를 재설정해도 같은 문제가 발생해요.',
                timestamp: '2025-06-06 10:15',
                isStaff: false
            },
            {
                id: 2,
                author: '상담원A',
                content: '안녕하세요. 계정 문제를 확인해보겠습니다. 사용하시는 브라우저와 기기 정보를 알려주실 수 있나요?',
                timestamp: '2025-06-06 11:30',
                isStaff: true
            }
        ]
    },
    {
        id: 3,
        customerName: '박문의',
        customerEmail: 'inquiry@example.com',
        subject: '서비스 이용 방법',
        category: 'general',
        priority: 'low',
        status: 'resolved',
        content: '새로 가입했는데 서비스를 어떻게 이용하는지 모르겠어요.',
        createdAt: '2025-06-05 16:45',
        lastResponse: '2025-06-06 09:20',
        assignedTo: '상담원B',
        responses: [
            {
                id: 1,
                author: '박문의',
                content: '새로 가입했는데 서비스를 어떻게 이용하는지 모르겠어요.',
                timestamp: '2025-06-05 16:45',
                isStaff: false
            },
            {
                id: 2,
                author: '상담원B',
                content: '안녕하세요! 가입을 환영합니다. 도움말 페이지 링크를 보내드리겠습니다.',
                timestamp: '2025-06-06 09:20',
                isStaff: true
            }
        ]
    }
];

const getCategoryBadge = (category: string) => {
    const categories = {
        general: { label: '일반문의', color: 'bg-gray-100 text-gray-800' },
        billing: { label: '결제문의', color: 'bg-blue-100 text-blue-800' },
        technical: { label: '기술문의', color: 'bg-purple-100 text-purple-800' },
        refund: { label: '환불문의', color: 'bg-red-100 text-red-800' },
        account: { label: '계정문의', color: 'bg-green-100 text-green-800' }
    };

    const cat = categories[category as keyof typeof categories] || categories.general;
    return <Badge className={cat.color}>{cat.label}</Badge>;
};

const getPriorityBadge = (priority: string) => {
    switch (priority) {
        case 'urgent':
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
            return <Badge variant="outline"><MessageCircle className="w-3 h-3 mr-1" />신규</Badge>;
        case 'in_progress':
            return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />진행중</Badge>;
        case 'waiting':
            return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />대기</Badge>;
        case 'resolved':
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />해결</Badge>;
        case 'closed':
            return <Badge variant="secondary">종료</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

export const CustomerSupport: React.FC = () => {
    const [inquiries, setInquiries] = useState<CustomerInquiry[]>(sampleInquiries);
    const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredInquiries = inquiries.filter(inquiry =>
        statusFilter === 'all' || inquiry.status === statusFilter
    );

    const handleStatusChange = (inquiryId: number, newStatus: string) => {
        setInquiries(inquiries.map(inquiry =>
            inquiry.id === inquiryId ? { ...inquiry, status: newStatus as any } : inquiry
        ));
        if (selectedInquiry && selectedInquiry.id === inquiryId) {
            setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
        }
    };

    const handleSendReply = () => {
        if (!selectedInquiry || !replyContent.trim()) return;

        const newResponse = {
            id: selectedInquiry.responses.length + 1,
            author: '상담원',
            content: replyContent,
            timestamp: new Date().toLocaleString('ko-KR'),
            isStaff: true
        };

        const updatedInquiry = {
            ...selectedInquiry,
            responses: [...selectedInquiry.responses, newResponse],
            lastResponse: new Date().toLocaleString('ko-KR'),
            status: 'in_progress' as const
        };

        setInquiries(inquiries.map(inquiry =>
            inquiry.id === selectedInquiry.id ? updatedInquiry : inquiry
        ));
        setSelectedInquiry(updatedInquiry);
        setReplyContent('');
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">고객상담</h1>
                <p className="text-gray-600 mt-2">고객 문의사항을 확인하고 응답하세요</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Inquiry List */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                문의 목록
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">전체</SelectItem>
                                        <SelectItem value="new">신규</SelectItem>
                                        <SelectItem value="in_progress">진행중</SelectItem>
                                        <SelectItem value="waiting">대기</SelectItem>
                                        <SelectItem value="resolved">해결</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-96 overflow-y-auto">
                                {filteredInquiries.map((inquiry) => (
                                    <div
                                        key={inquiry.id}
                                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedInquiry?.id === inquiry.id ? 'bg-blue-50 border-blue-200' : ''
                                        }`}
                                        onClick={() => setSelectedInquiry(inquiry)}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-sm truncate">{inquiry.subject}</h4>
                                                {getPriorityBadge(inquiry.priority)}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <User className="h-3 w-3 text-gray-400" />
                                                <span className="text-xs text-gray-600">{inquiry.customerName}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                {getStatusBadge(inquiry.status)}
                                                <span className="text-xs text-gray-500">
                          {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel - Inquiry Detail */}
                <div className="lg:col-span-2">
                    {selectedInquiry ? (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{selectedInquiry.subject}</CardTitle>
                                        <CardDescription className="flex items-center space-x-4 mt-2">
                                            <span>{selectedInquiry.customerName} ({selectedInquiry.customerEmail})</span>
                                            <span>•</span>
                                            <span>{selectedInquiry.createdAt}</span>
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {getCategoryBadge(selectedInquiry.category)}
                                        {getPriorityBadge(selectedInquiry.priority)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="conversation" className="space-y-4">
                                    <TabsList>
                                        <TabsTrigger value="conversation">대화내용</TabsTrigger>
                                        <TabsTrigger value="details">상세정보</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="conversation" className="space-y-4">
                                        {/* Conversation History */}
                                        <div className="space-y-4 max-h-96 overflow-y-auto border rounded p-4">
                                            {selectedInquiry.responses.map((response) => (
                                                <div
                                                    key={response.id}
                                                    className={`flex ${response.isStaff ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                            response.isStaff
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-100 text-gray-900'
                                                        }`}
                                                    >
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="text-xs font-medium">{response.author}</span>
                                                            <span className="text-xs opacity-75">{response.timestamp}</span>
                                                        </div>
                                                        <p className="text-sm">{response.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Reply Form */}
                                        <div className="space-y-4">
                                            <Textarea
                                                placeholder="답변을 입력하세요..."
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                className="min-h-24"
                                            />
                                            <div className="flex items-center justify-between">
                                                <Select
                                                    value={selectedInquiry.status}
                                                    onValueChange={(value) => handleStatusChange(selectedInquiry.id, value)}
                                                >
                                                    <SelectTrigger className="w-40 bg-white border-gray-200 hover:bg-gray-50">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border-gray-200 shadow-lg">
                                                        <SelectItem value="new" className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900">신규</SelectItem>
                                                        <SelectItem value="in_progress" className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900">진행중</SelectItem>
                                                        <SelectItem value="waiting" className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900">대기</SelectItem>
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
                                                <div className="mt-1">{getCategoryBadge(selectedInquiry.category)}</div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">우선순위</label>
                                                <div className="mt-1">{getPriorityBadge(selectedInquiry.priority)}</div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">상태</label>
                                                <div className="mt-1">{getStatusBadge(selectedInquiry.status)}</div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">담당자</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedInquiry.assignedTo || '미배정'}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-sm font-medium text-gray-700">최초 문의내용</label>
                                                <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded">
                                                    {selectedInquiry.content}
                                                </p>
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