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

export const Refunds: React.FC = () => {
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
                    processedDate: newStatus !== 'pending' ? new Date().toLocaleString('ko-KR') : undefined,
                    processedBy: newStatus !== 'pending' ? '관리자' : undefined,
                    notes: notes || refund.notes
                }
                : refund
        ));

        if (selectedRefund && selectedRefund.id === refundId) {
            setSelectedRefund({
                ...selectedRefund,
                status: newStatus as any,
                processedDate: newStatus !== 'pending' ? new Date().toLocaleString('ko-KR') : undefined,
                processedBy: newStatus !== 'pending' ? '관리자' : undefined,
                notes: notes || selectedRefund.notes
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    };

    const totalPendingAmount = refunds
        .filter(refund => refund.status === 'pending')
        .reduce((sum, refund) => sum + refund.refundAmount, 0);

    const totalProcessedAmount = refunds
        .filter(refund => refund.status === 'completed')
        .reduce((sum, refund) => sum + refund.refundAmount, 0);

    const approvalRate = Math.round((refunds.filter(r => r.status === 'approved' || r.status === 'completed').length / refunds.length) * 100);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">환불처리</h1>
                <p className="text-gray-600 mt-2">고객의 환불 요청을 검토하고 처리하세요</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">대기중 환불</CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {refunds.filter(r => r.status === 'pending').length}건
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            {formatCurrency(totalPendingAmount)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">완료된 환불</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {refunds.filter(r => r.status === 'completed').length}건
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            {formatCurrency(totalProcessedAmount)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">승인률</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvalRate}%</div>
                        <p className="text-xs text-gray-600 mt-1">전체 요청 대비</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">평균 처리시간</CardTitle>
                        <Clock className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.3일</div>
                        <p className="text-xs text-gray-600 mt-1">최근 30일 기준</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">환불 요청 필터</CardTitle>
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
                                <SelectItem value="all">모든 상태</SelectItem>
                                <SelectItem value="pending">대기중</SelectItem>
                                <SelectItem value="approved">승인됨</SelectItem>
                                <SelectItem value="rejected">거절됨</SelectItem>
                                <SelectItem value="processing">처리중</SelectItem>
                                <SelectItem value="completed">완료</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Refunds Table */}
            <Card>
                <CardHeader>
                    <CardTitle>환불 요청 목록 ({filteredRefunds.length}건)</CardTitle>
                    <CardDescription>고객의 환불 요청을 검토하고 처리 상태를 관리하세요</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>고객정보</TableHead>
                                <TableHead>주문정보</TableHead>
                                <TableHead>환불금액</TableHead>
                                <TableHead>사유</TableHead>
                                <TableHead>결제수단</TableHead>
                                <TableHead>상태</TableHead>
                                <TableHead>요청일</TableHead>
                                <TableHead className="text-right">작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRefunds.map((refund) => (
                                <TableRow key={refund.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{refund.customerName}</p>
                                            <p className="text-sm text-gray-500">{refund.customerEmail}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{refund.orderId}</p>
                                            <p className="text-sm text-gray-500 max-w-32 truncate" title={refund.productName}>
                                                {refund.productName}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{formatCurrency(refund.refundAmount)}</p>
                                            <p className="text-sm text-gray-500">전체: {formatCurrency(refund.orderAmount)}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900 max-w-32 truncate" title={refund.reason}>
                                            {refund.reason}
                                        </p>
                                    </TableCell>
                                    <TableCell>{getPaymentMethodBadge(refund.paymentMethod)}</TableCell>
                                    <TableCell>{getStatusBadge(refund.status)}</TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {new Date(refund.requestDate).toLocaleDateString('ko-KR')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog open={dialogOpen && selectedRefund?.id === refund.id} onOpenChange={(open) => {
                                            setDialogOpen(open);
                                            if (open) setSelectedRefund(refund);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedRefund(refund);
                                                        setDialogOpen(true);
                                                    }}
                                                >
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    상세
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
                                                <div className="fixed inset-0 bg-white z-50" />
                                                <div className="relative z-50">
                                                    <DialogHeader>
                                                        <DialogTitle>환불 요청 상세정보</DialogTitle>
                                                        <DialogDescription>
                                                            환불 요청의 상세 내용을 확인하고 처리하세요
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    {selectedRefund && (
                                                        <div className="space-y-6">
                                                            {/* Customer & Order Info */}
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="text-sm font-medium text-gray-700">고객정보</label>
                                                                    <div className="mt-1 space-y-1">
                                                                        <p className="text-sm text-gray-900">{selectedRefund.customerName}</p>
                                                                        <p className="text-sm text-gray-500">{selectedRefund.customerEmail}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="text-sm font-medium text-gray-700">주문정보</label>
                                                                    <div className="mt-1 space-y-1">
                                                                        <p className="text-sm text-gray-900">{selectedRefund.orderId}</p>
                                                                        <p className="text-sm text-gray-500">{selectedRefund.productName}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="text-sm font-medium text-gray-700">결제금액</label>
                                                                    <p className="text-sm text-gray-900 mt-1">{formatCurrency(selectedRefund.orderAmount)}</p>
                                                                </div>
                                                                <div>
                                                                    <label className="text-sm font-medium text-gray-700">환불요청금액</label>
                                                                    <p className="text-sm text-gray-900 mt-1">{formatCurrency(selectedRefund.refundAmount)}</p>
                                                                </div>
                                                                <div>
                                                                    <label className="text-sm font-medium text-gray-700">결제수단</label>
                                                                    <div className="mt-1">{getPaymentMethodBadge(selectedRefund.paymentMethod)}</div>
                                                                </div>
                                                                <div>
                                                                    <label className="text-sm font-medium text-gray-700">현재상태</label>
                                                                    <div className="mt-1">{getStatusBadge(selectedRefund.status)}</div>
                                                                </div>
                                                            </div>

                                                            {/* Refund Reason */}
                                                            <div>
                                                                <label className="text-sm font-medium text-gray-700">환불 사유</label>
                                                                <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded">
                                                                    {selectedRefund.reason}
                                                                </p>
                                                            </div>

                                                            {/* Processing Info */}
                                                            {selectedRefund.processedDate && (
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="text-sm font-medium text-gray-700">처리일시</label>
                                                                        <p className="text-sm text-gray-900 mt-1">{selectedRefund.processedDate}</p>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-sm font-medium text-gray-700">처리자</label>
                                                                        <p className="text-sm text-gray-900 mt-1">{selectedRefund.processedBy}</p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Refund Method */}
                                                            {selectedRefund.refundMethod && (
                                                                <div>
                                                                    <label className="text-sm font-medium text-gray-700">환불 방법</label>
                                                                    <p className="text-sm text-gray-900 mt-1">
                                                                        {selectedRefund.refundMethod === 'original' ? '원결제수단 환불' :
                                                                            selectedRefund.refundMethod === 'bank_transfer' ? '계좌이체' :
                                                                                selectedRefund.refundMethod === 'store_credit' ? '적립금 환급' : '기타'}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Notes */}
                                                            {selectedRefund.notes && (
                                                                <div>
                                                                    <label className="text-sm font-medium text-gray-700">처리 메모</label>
                                                                    <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded">
                                                                        {selectedRefund.notes}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Action Buttons */}
                                                            {selectedRefund.status === 'pending' && (
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <label className="text-sm font-medium text-gray-700">처리 메모</label>
                                                                        <Textarea
                                                                            placeholder="처리에 대한 메모를 입력하세요..."
                                                                            className="mt-1"
                                                                            id="processing-notes"
                                                                        />
                                                                    </div>
                                                                    <div className="flex justify-end space-x-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={() => {
                                                                                const notes = (document.getElementById('processing-notes') as HTMLTextAreaElement)?.value;
                                                                                handleStatusChange(selectedRefund.id, 'rejected', notes);
                                                                                setDialogOpen(false);
                                                                            }}
                                                                            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700"
                                                                        >
                                                                            거절
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() => {
                                                                                const notes = (document.getElementById('processing-notes') as HTMLTextAreaElement)?.value;
                                                                                handleStatusChange(selectedRefund.id, 'approved', notes);
                                                                                setDialogOpen(false);
                                                                            }}
                                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                        >
                                                                            승인
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {selectedRefund.status === 'approved' && (
                                                                <div className="flex justify-end">
                                                                    <Button
                                                                        onClick={() => {
                                                                            handleStatusChange(selectedRefund.id, 'completed');
                                                                            setDialogOpen(false);
                                                                        }}
                                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                                    >
                                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                                        환불 완료 처리
                                                                    </Button>
                                                                </div>
                                                            )}

                                                            {selectedRefund.status === 'processing' && (
                                                                <div className="flex justify-end">
                                                                    <Button
                                                                        onClick={() => {
                                                                            handleStatusChange(selectedRefund.id, 'completed');
                                                                            setDialogOpen(false);
                                                                        }}
                                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                                    >
                                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                                        환불 완료 처리
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};