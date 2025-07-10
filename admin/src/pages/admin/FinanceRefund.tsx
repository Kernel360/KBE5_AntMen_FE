import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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
} from '../../components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../components/ui/tabs';
import {
    CreditCard,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    TrendingUp,
    FileText,
    AlertTriangle
} from 'lucide-react';
import { adminRefundsService } from '../../api/adminRefunds';
import { AdminRefundResponseDto } from '../../api/types';

const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
        case 'WAITING':
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <Clock className="w-3 h-3 mr-1" />대기중
            </Badge>;
        case 'APPROVED':
            return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />승인됨</Badge>;
        case 'REJECTED':
            return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />거절됨</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

const getPaymentMethodBadge = (method: string) => {
    const methods = {
        CARD: { label: '신용카드', icon: CreditCard, color: 'bg-blue-50 text-blue-700 border-blue-200' },
        BANK: { label: '계좌이체', icon: DollarSign, color: 'bg-green-50 text-green-700 border-green-200' },
        KAKAO: { label: '카카오페이', icon: DollarSign, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
    };

    const methodInfo = methods[method.toUpperCase() as keyof typeof methods] || { 
        label: method, 
        icon: DollarSign, 
        color: 'bg-gray-50 text-gray-700 border-gray-200' 
    };
    const Icon = methodInfo.icon;

    return (
        <Badge variant="outline" className={methodInfo.color}>
            <Icon className="w-3 h-3 mr-1" />
            {methodInfo.label}
        </Badge>
    );
};

export const FinanceRefund: React.FC = () => {
    const [allRefunds, setAllRefunds] = useState<AdminRefundResponseDto[]>([]);
    const [waitingRefunds, setWaitingRefunds] = useState<AdminRefundResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRefund, setSelectedRefund] = useState<AdminRefundResponseDto | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'waiting'>('waiting');
    const [processingPayId, setProcessingPayId] = useState<number | null>(null);

    const fetchRefunds = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // 두 API를 병렬로 호출
            const [allData, waitingData] = await Promise.all([
                adminRefundsService.getAllRefunds(),
                adminRefundsService.getWaitingRefunds()
            ]);
            
            setAllRefunds(allData);
            setWaitingRefunds(waitingData);
        } catch (err: any) {
            console.error('환불 데이터 조회 실패:', err);
            setError(err.message || '환불 데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefunds();
    }, []);

    // 환불 승인 처리
    const handleApprove = async (payId: number) => {
        try {
            setProcessingPayId(payId);
            await adminRefundsService.approveRefund(payId);
            alert('환불이 승인되었습니다.');
            await fetchRefunds(); // 데이터 다시 불러오기
            setDialogOpen(false);
        } catch (error: any) {
            console.error('환불 승인 실패:', error);
            alert(error.message || '환불 승인에 실패했습니다.');
        } finally {
            setProcessingPayId(null);
        }
    };

    // 환불 거절 처리
    const handleReject = async (payId: number) => {
        try {
            setProcessingPayId(payId);
            await adminRefundsService.rejectRefund(payId);
            alert('환불이 거절되었습니다.');
            await fetchRefunds(); // 데이터 다시 불러오기
            setDialogOpen(false);
        } catch (error: any) {
            console.error('환불 거절 실패:', error);
            alert(error.message || '환불 거절에 실패했습니다.');
        } finally {
            setProcessingPayId(null);
        }
    };

    // 현재 탭에 따른 데이터 선택
    const currentRefunds = activeTab === 'all' ? allRefunds : waitingRefunds;

    const filteredRefunds = currentRefunds
        .filter(refund => 
            refund.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            refund.userLoginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            refund.reservationId.toString().includes(searchTerm) ||
            refund.payId.toString().includes(searchTerm)
        )
        .sort((a, b) => new Date(b.refundCreatedAt).getTime() - new Date(a.refundCreatedAt).getTime());

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('ko-KR');
    };

    // 모든 환불건 기준 통계 계산 (고정)
    const totalAmount = allRefunds.reduce((sum, refund) => sum + refund.refundAmount, 0);
    const waitingCount = allRefunds.filter(refund => refund.refundStatus.toUpperCase() === 'WAITING').length;

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">환불 관리</h1>
                        <p className="text-gray-600">환불 요청 현황을 관리합니다</p>
                    </div>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-600">데이터를 불러오는 중...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">환불 관리</h1>
                        <p className="text-gray-600">환불 요청 현황을 관리합니다</p>
                    </div>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-red-600">오류: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">환불 관리</h1>
                    <p className="text-gray-600">환불 요청 현황을 관리합니다</p>
                </div>
            </div>

            {/* 통계 카드 (모든 환불건 기준 고정) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">전체 환불건</p>
                                <p className="text-2xl font-bold text-blue-600">{allRefunds.length}건</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">대기중</p>
                                <p className="text-2xl font-bold text-blue-600">{waitingCount}건</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">총 환불 금액</p>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 탭과 검색 */}
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                    <TabsList className="grid w-full lg:w-auto grid-cols-2">
                        <TabsTrigger value="waiting" className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            대기중인 환불건 ({waitingRefunds.length})
                        </TabsTrigger>
                        <TabsTrigger value="all" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            모든 환불건 ({allRefunds.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* 검색만 남김 */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="고객명, 로그인ID, 예약번호, 결제ID로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full md:w-80"
                        />
                    </div>
                </div>

                {/* 대기중인 환불건 탭 */}
                <TabsContent value="waiting" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                대기중인 환불 요청 ({filteredRefunds.length}건)
                            </CardTitle>
                            <CardDescription>처리가 필요한 환불 요청입니다.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>고객 정보</TableHead>
                                            <TableHead>환불 정보</TableHead>
                                            <TableHead>결제 수단</TableHead>
                                            <TableHead>요청일</TableHead>
                                            <TableHead>환불 사유</TableHead>
                                            <TableHead>상태</TableHead>
                                            <TableHead>승인/거절</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRefunds.length > 0 ? (
                                            filteredRefunds.map((refund) => (
                                                <TableRow key={refund.payId} className="group hover:bg-gray-50">
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-gray-900">{refund.userName}</p>
                                                            <p className="text-sm text-gray-500 max-w-32 truncate" title={refund.userLoginId}>
                                                                ID: {refund.userLoginId}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-bold text-lg text-blue-600">
                                                                {formatCurrency(refund.refundAmount)}
                                                            </p>
                                                            <p className="text-sm text-gray-500">예약#{refund.reservationId}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getPaymentMethodBadge(refund.payMethod)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="text-sm">{formatDateTime(refund.refundCreatedAt)}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="max-w-32 truncate text-sm" title={refund.refundReason}>
                                                            {refund.refundReason}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(refund.refundStatus)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedRefund(refund);
                                                                    setDialogOpen(true);
                                                                }}
                                                            >
                                                                상세
                                                            </Button>
                                                            {refund.refundStatus.toUpperCase() === 'WAITING' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                        disabled={processingPayId === refund.payId}
                                                                        onClick={() => handleApprove(refund.payId)}
                                                                    >
                                                                        {processingPayId === refund.payId ? '처리중...' : '승인'}
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        disabled={processingPayId === refund.payId}
                                                                        onClick={() => handleReject(refund.payId)}
                                                                    >
                                                                        {processingPayId === refund.payId ? '처리중...' : '거절'}
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <CheckCircle className="w-12 h-12 text-green-500" />
                                                        <div>
                                                            <p className="text-lg font-semibold text-gray-900">대기중인 환불 요청이 없습니다</p>
                                                            <p className="text-gray-500">모든 환불 요청이 처리되었습니다.</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 모든 환불건 탭 */}
                <TabsContent value="all" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                전체 환불 현황 ({filteredRefunds.length}건)
                            </CardTitle>
                            <CardDescription>모든 환불 요청의 전체 현황입니다.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>고객 정보</TableHead>
                                            <TableHead>환불 정보</TableHead>
                                            <TableHead>결제 수단</TableHead>
                                            <TableHead>요청일</TableHead>
                                            <TableHead>처리일</TableHead>
                                            <TableHead>환불 사유</TableHead>
                                            <TableHead>상태</TableHead>
                                            <TableHead>승인/거절</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRefunds.length > 0 ? (
                                            filteredRefunds.map((refund) => (
                                                <TableRow key={refund.payId} className="hover:bg-gray-50">
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-gray-900">{refund.userName}</p>
                                                            <p className="text-sm text-gray-500 max-w-32 truncate" title={refund.userLoginId}>
                                                                ID: {refund.userLoginId}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-bold text-lg text-blue-600">
                                                                {formatCurrency(refund.refundAmount)}
                                                            </p>
                                                            <p className="text-sm text-gray-500">예약#{refund.reservationId}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getPaymentMethodBadge(refund.payMethod)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="text-sm">{formatDateTime(refund.refundCreatedAt)}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="text-sm">{formatDateTime(refund.refundProcessedAt)}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="max-w-32 truncate text-sm" title={refund.refundReason}>
                                                            {refund.refundReason}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(refund.refundStatus)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedRefund(refund);
                                                                setDialogOpen(true);
                                                            }}
                                                        >
                                                            상세
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center py-12">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <FileText className="w-12 h-12 text-gray-400" />
                                                        <div>
                                                            <p className="text-lg font-semibold text-gray-900">환불 요청이 없습니다</p>
                                                            <p className="text-gray-500">아직 등록된 환불 요청이 없습니다.</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* 환불 상세 다이얼로그 */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            환불 요청 상세 정보
                        </DialogTitle>
                        <DialogDescription>
                            {selectedRefund && (
                                <div className="space-y-4 mt-4">
                                    {/* 기본 정보 */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-gray-900">고객 정보</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">고객명:</span>
                                                    <span>{selectedRefund.userName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">로그인ID:</span>
                                                    <span>{selectedRefund.userLoginId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">사용자ID:</span>
                                                    <span>{selectedRefund.userId}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-gray-900">결제 정보</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">결제ID:</span>
                                                    <span>{selectedRefund.payId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">예약번호:</span>
                                                    <span>{selectedRefund.reservationId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">결제수단:</span>
                                                    <span>{getPaymentMethodBadge(selectedRefund.payMethod)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 환불 정보 */}
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-3">환불 정보</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">환불금액:</span>
                                                <span className="text-2xl font-bold text-blue-600">
                                                    {formatCurrency(selectedRefund.refundAmount)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">환불사유:</span>
                                                <span className="text-right max-w-xs">{selectedRefund.refundReason}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">상태:</span>
                                                <span>{getStatusBadge(selectedRefund.refundStatus)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">요청일:</span>
                                                <span>{formatDateTime(selectedRefund.refundCreatedAt)}</span>
                                            </div>
                                            {selectedRefund.refundProcessedAt && (
                                                <div className="flex justify-between">
                                                    <span className="font-medium">처리일:</span>
                                                    <span>{formatDateTime(selectedRefund.refundProcessedAt)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 처리 액션 (대기중인 경우만) */}
                                    {selectedRefund.refundStatus.toUpperCase() === 'WAITING' && (
                                        <div className="flex gap-3 pt-4 border-t">
                                            <Button
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                                disabled={processingPayId === selectedRefund.payId}
                                                onClick={() => handleApprove(selectedRefund.payId)}
                                            >
                                                {processingPayId === selectedRefund.payId ? '처리중...' : '환불 승인'}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="flex-1"
                                                disabled={processingPayId === selectedRefund.payId}
                                                onClick={() => handleReject(selectedRefund.payId)}
                                            >
                                                {processingPayId === selectedRefund.payId ? '처리중...' : '환불 거절'}
                                            </Button>
                                        </div>
                                    )}
                                    
                                    <div className="pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            onClick={() => setDialogOpen(false)}
                                            className="w-full"
                                        >
                                            닫기
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}; 