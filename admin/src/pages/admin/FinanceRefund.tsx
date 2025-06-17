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
import {
    CreditCard,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Search,
    FileText,
    TrendingUp
} from 'lucide-react';

interface RefundRequest {
    id: number;
    customerName: string;
    customerEmail: string;
    orderId: string;
    productName: string;
    orderAmount: number;
    refundAmount: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
    requestDate: string;
    processedDate?: string;
    processedBy?: string;
    paymentMethod: 'card' | 'bank' | 'paypal' | 'other';
    notes?: string;
    refundMethod?: 'original' | 'bank_transfer' | 'store_credit';
}

const sampleRefunds: RefundRequest[] = [
    {
        id: 1,
        customerName: '김고객',
        customerEmail: 'customer1@example.com',
        orderId: 'ORD-2025-001',
        productName: '프리미엄 서비스 1개월',
        orderAmount: 29900,
        refundAmount: 29900,
        reason: '서비스 불만족',
        status: 'pending',
        requestDate: '2025-06-06 14:30',
        paymentMethod: 'card'
    },
    {
        id: 2,
        customerName: '이사용',
        customerEmail: 'user2@example.com',
        orderId: 'ORD-2025-002',
        productName: '베이직 플랜 3개월',
        orderAmount: 59800,
        refundAmount: 39867,
        reason: '부분 사용 후 해지',
        status: 'approved',
        requestDate: '2025-06-05 16:45',
        processedDate: '2025-06-06 10:30',
        processedBy: '관리자A',
        paymentMethod: 'bank',
        refundMethod: 'original'
    },
    {
        id: 3,
        customerName: '박환불',
        customerEmail: 'refund@example.com',
        orderId: 'ORD-2025-003',
        productName: '엔터프라이즈 플랜 1년',
        orderAmount: 299000,
        refundAmount: 299000,
        reason: '중복 결제',
        status: 'completed',
        requestDate: '2025-06-04 11:20',
        processedDate: '2025-06-05 14:15',
        processedBy: '관리자B',
        paymentMethod: 'card',
        notes: '중복 결제 확인됨. 전액 환불 처리',
        refundMethod: 'original'
    },
    {
        id: 4,
        customerName: '최거절',
        customerEmail: 'rejected@example.com',
        orderId: 'ORD-2025-004',
        productName: '프로 플랜 6개월',
        orderAmount: 149000,
        refundAmount: 0,
        reason: '단순 변심',
        status: 'rejected',
        requestDate: '2025-06-03 09:15',
        processedDate: '2025-06-04 16:30',
        processedBy: '관리자A',
        paymentMethod: 'paypal',
        notes: '환불 정책에 따라 거절됨'
    },
    {
        id: 5,
        customerName: '정처리',
        customerEmail: 'processing@example.com',
        orderId: 'ORD-2025-005',
        productName: '스탠다드 플랜 6개월',
        orderAmount: 119000,
        refundAmount: 119000,
        reason: '기술적 문제',
        status: 'processing',
        requestDate: '2025-06-06 08:15',
        processedDate: '2025-06-06 11:00',
        processedBy: '관리자C',
        paymentMethod: 'card',
        notes: '기술팀 확인 완료. 환불 진행중',
        refundMethod: 'original'
    }
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending':
            return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />대기중</Badge>;
        case 'approved':
            return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />승인됨</Badge>;
        case 'rejected':
            return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />거절됨</Badge>;
        case 'processing':
            return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />처리중</Badge>;
        case 'completed':
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />완료</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

const getPaymentMethodBadge = (method: string) => {
    const methods = {
        card: { label: '신용카드', icon: CreditCard },
        bank: { label: '계좌이체', icon: DollarSign },
        paypal: { label: 'PayPal', icon: DollarSign },
        other: { label: '기타', icon: DollarSign }
    };

    const methodInfo = methods[method as keyof typeof methods] || methods.other;
    const Icon = methodInfo.icon;

    return (
        <Badge variant="secondary">
            <Icon className="w-3 h-3 mr-1" />
            {methodInfo.label}
        </Badge>
    );
};

export const FinanceRefund: React.FC = () => {
    const [refunds, setRefunds] = useState<RefundRequest[]>(sampleRefunds);
    const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const filteredRefunds = refunds.filter(refund => {
        const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
        const matchesSearch =
            refund.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            refund.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            refund.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const handleStatusChange = (refundId: number, newStatus: string, notes?: string) => {
        setRefunds(refunds.map(refund =>
            refund.id === refundId
                ? {
                    ...refund,
                    status: newStatus as any,
                    notes: notes ?? refund.notes,
                    processedDate: new Date().toLocaleString('ko-KR'),
                    processedBy: '관리자',
                }
                : refund
        ));
        setDialogOpen(false);
        setSelectedRefund(null);
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">환불관리</h1>
                    <p className="text-gray-600 mt-2">환불 요청 및 처리 현황을 관리합니다.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>환불 요청 검색 및 필터</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="고객명, 주문번호, 이메일로 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-40">
                                <SelectValue placeholder="상태 필터" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체</SelectItem>
                                <SelectItem value="pending">대기중</SelectItem>
                                <SelectItem value="approved">승인됨</SelectItem>
                                <SelectItem value="processing">처리중</SelectItem>
                                <SelectItem value="completed">완료</SelectItem>
                                <SelectItem value="rejected">거절됨</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>환불 요청 목록 ({filteredRefunds.length}건)</CardTitle>
                    <CardDescription>최근 환불 요청 내역을 확인하고 처리할 수 있습니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>고객명</TableHead>
                                <TableHead>이메일</TableHead>
                                <TableHead>주문번호</TableHead>
                                <TableHead>상품명</TableHead>
                                <TableHead>결제금액</TableHead>
                                <TableHead>환불금액</TableHead>
                                <TableHead>결제수단</TableHead>
                                <TableHead>상태</TableHead>
                                <TableHead>요청일</TableHead>
                                <TableHead>작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRefunds.map((refund) => (
                                <TableRow key={refund.id}>
                                    <TableCell>{refund.customerName}</TableCell>
                                    <TableCell>{refund.customerEmail}</TableCell>
                                    <TableCell>{refund.orderId}</TableCell>
                                    <TableCell>{refund.productName}</TableCell>
                                    <TableCell>{formatCurrency(refund.orderAmount)}</TableCell>
                                    <TableCell>{formatCurrency(refund.refundAmount)}</TableCell>
                                    <TableCell>{getPaymentMethodBadge(refund.paymentMethod)}</TableCell>
                                    <TableCell>{getStatusBadge(refund.status)}</TableCell>
                                    <TableCell>{refund.requestDate}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedRefund(refund);
                                                setDialogOpen(true);
                                            }}
                                        >
                                            상세
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* 환불 상세/처리 다이얼로그 */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>환불 상세 및 처리</DialogTitle>
                        <DialogDescription>
                            {selectedRefund && (
                                <div className="space-y-2 mt-2">
                                    <div className="flex gap-4">
                                        <span className="font-bold">고객명:</span>
                                        <span>{selectedRefund.customerName}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-bold">이메일:</span>
                                        <span>{selectedRefund.customerEmail}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-bold">주문번호:</span>
                                        <span>{selectedRefund.orderId}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-bold">상품명:</span>
                                        <span>{selectedRefund.productName}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-bold">결제금액:</span>
                                        <span>{formatCurrency(selectedRefund.orderAmount)}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-bold">환불금액:</span>
                                        <span>{formatCurrency(selectedRefund.refundAmount)}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-bold">결제수단:</span>
                                        <span>{getPaymentMethodBadge(selectedRefund.paymentMethod)}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-bold">상태:</span>
                                        <span>{getStatusBadge(selectedRefund.status)}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-bold">요청일:</span>
                                        <span>{selectedRefund.requestDate}</span>
                                    </div>
                                    {selectedRefund.processedDate && (
                                        <div className="flex gap-4">
                                            <span className="font-bold">처리일:</span>
                                            <span>{selectedRefund.processedDate}</span>
                                        </div>
                                    )}
                                    {selectedRefund.processedBy && (
                                        <div className="flex gap-4">
                                            <span className="font-bold">처리자:</span>
                                            <span>{selectedRefund.processedBy}</span>
                                        </div>
                                    )}
                                    {selectedRefund.notes && (
                                        <div className="flex gap-4">
                                            <span className="font-bold">비고:</span>
                                            <span>{selectedRefund.notes}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRefund && (
                        <div className="space-y-4 mt-4">
                            <Textarea
                                placeholder="비고를 입력하세요..."
                                value={selectedRefund.notes || ''}
                                onChange={(e) => setSelectedRefund({ ...selectedRefund, notes: e.target.value })}
                            />
                            <div className="flex items-center gap-2">
                                <Select
                                    value={selectedRefund.status}
                                    onValueChange={(value) => handleStatusChange(selectedRefund.id, value, selectedRefund.notes)}
                                >
                                    <SelectTrigger className="w-40 bg-white border-gray-200 hover:bg-gray-50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-200 shadow-lg">
                                        <SelectItem value="pending">대기중</SelectItem>
                                        <SelectItem value="approved">승인됨</SelectItem>
                                        <SelectItem value="processing">처리중</SelectItem>
                                        <SelectItem value="completed">완료</SelectItem>
                                        <SelectItem value="rejected">거절됨</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={() => handleStatusChange(selectedRefund.id, selectedRefund.status, selectedRefund.notes)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    상태 저장
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}; 