import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
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
    Calculator,
    DollarSign,
    Clock,
    CheckCircle,
    TrendingUp,
    FileText,
    CalendarDays,
    Users,
    ChevronDown,
    ChevronUp,
    Calendar,
    User,
    Receipt
} from 'lucide-react';
import { adminCalculationService } from '../../api/adminCalculation';
import { AdminCalculationResponseDto, AdminCalculationItemDto, AdminCalculationDetailDto } from '../../api/types';

// 주차별 정산 그룹
interface WeeklyCalculationGroup {
    weekLabel: string;
    startDate: string;
    endDate: string;
    calculations: AdminCalculationItemDto[];
    totalAmount: number;
    isExpanded: boolean;
}

export const FinanceSettlement: React.FC = () => {
    const [calculationData, setCalculationData] = useState<AdminCalculationResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCalculation, setSelectedCalculation] = useState<AdminCalculationItemDto | null>(null);
    const [calculationDetail, setCalculationDetail] = useState<AdminCalculationDetailDto | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'weekly' | 'all'>('weekly');
    const [weeklyGroups, setWeeklyGroups] = useState<WeeklyCalculationGroup[]>([]);

    useEffect(() => {
        const fetchCalculationData = async () => {
            try {
                setLoading(true);
                const data = await adminCalculationService.getCalculation();
                setCalculationData(data);
                setWeeklyGroups(getWeeklyGroups(data));
            } catch (err) {
                setError(err instanceof Error ? err.message : '정산 데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchCalculationData();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR');
    };

    const formatDateTime = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleString('ko-KR');
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
    };

    // 주차별로 정산 데이터 그룹핑
    const getWeeklyGroups = (data: AdminCalculationResponseDto): WeeklyCalculationGroup[] => {
        if (!data) return [];

        const groups: { [key: string]: WeeklyCalculationGroup } = {};

        data.recentMonthCalculations.forEach(calculation => {
            const startDate = new Date(calculation.startDate);
            const endDate = new Date(calculation.endDate);
            
            // 월과 주차 계산
            const month = startDate.getMonth() + 1;
            const startDay = startDate.getDate();
            const endDay = endDate.getDate();
            
            // 주차 레이블 생성
            let weekNumber;
            if (startDay <= 7) weekNumber = 1;
            else if (startDay <= 14) weekNumber = 2;
            else if (startDay <= 21) weekNumber = 3;
            else if (startDay <= 28) weekNumber = 4;
            else weekNumber = 5;

            const weekLabel = `${month}월 ${weekNumber}주차`;
            const groupKey = `${month}-${weekNumber}`;

            if (!groups[groupKey]) {
                groups[groupKey] = {
                    weekLabel,
                    startDate: calculation.startDate,
                    endDate: calculation.endDate,
                    calculations: [],
                    totalAmount: 0,
                    isExpanded: false
                };
            }

            groups[groupKey].calculations.push(calculation);
            groups[groupKey].totalAmount += calculation.amount;
        });

        return Object.values(groups).sort((a, b) => 
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
    };

    // 주차 펼치기/접기
    const toggleWeekExpansion = (index: number) => {
        setWeeklyGroups(prev => 
            prev.map((group, i) => 
                i === index ? { ...group, isExpanded: !group.isExpanded } : group
            )
        );
    };

    // 정산 상세 정보 조회
    const handleDetailClick = async (calculation: AdminCalculationItemDto) => {
        try {
            setSelectedCalculation(calculation);
            setDialogOpen(true);
            setDetailLoading(true);
            setCalculationDetail(null);
            
            const detail = await adminCalculationService.getCalculationDetail(calculation.calculationId);
            setCalculationDetail(detail);
        } catch (error: any) {
            console.error('상세 정보 조회 실패:', error);
            alert(error.message || '상세 정보를 불러오는데 실패했습니다.');
        } finally {
            setDetailLoading(false);
        }
    };

    // 다이얼로그 닫기
    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedCalculation(null);
        setCalculationDetail(null);
        setDetailLoading(false);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-blue-500" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">매니저 정산</h1>
                        <p className="text-gray-600">매니저별 정산 현황을 관리합니다</p>
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
                    <Calculator className="w-8 h-8 text-blue-500" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">매니저 정산</h1>
                        <p className="text-gray-600">매니저별 정산 현황을 관리합니다</p>
                    </div>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-red-600">오류: {error}</div>
                </div>
            </div>
        );
    }

    if (!calculationData) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-blue-500" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">매니저 정산</h1>
                        <p className="text-gray-600">매니저별 정산 현황을 관리합니다</p>
                    </div>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">데이터가 없습니다.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex items-center gap-3">
                <Calculator className="w-8 h-8 text-blue-500" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">매니저 정산</h1>
                    <p className="text-gray-600">매니저별 정산 현황을 관리합니다</p>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">총 정산 금액</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(calculationData.totalAmount)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">이번 달 정산</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(calculationData.currentMonthAmount)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <CalendarDays className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">지난주 정산</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {formatCurrency(calculationData.currentWeekAmount)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">정산 완료 건수</p>
                                <p className="text-2xl font-bold text-purple-600">{calculationData.calculationCount}건</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 탭 */}
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
                <TabsList className="grid w-full lg:w-auto grid-cols-2">
                    <TabsTrigger value="weekly" className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        주차별 정산 ({weeklyGroups.length}주차)
                    </TabsTrigger>
                    <TabsTrigger value="all" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        전체 정산 내역 ({calculationData.recentMonthCalculations.length})
                    </TabsTrigger>
                </TabsList>

                {/* 주차별 정산 탭 */}
                <TabsContent value="weekly" className="mt-6">
                    <div className="space-y-4">
                        {weeklyGroups.length > 0 ? (
                            weeklyGroups.map((group, index) => (
                                <Card key={index} className="overflow-hidden">
                                    {/* 주차 헤더 - 클릭 가능 */}
                                    <CardHeader 
                                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => toggleWeekExpansion(index)}
                                    >
                                        <CardTitle className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CalendarDays className="w-5 h-5 text-blue-500" />
                                                <div>
                                                    <h3 className="text-lg font-semibold">{group.weekLabel}</h3>
                                                    <p className="text-sm text-gray-500 font-normal">
                                                        {formatDate(group.startDate)} ~ {formatDate(group.endDate)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                    <Users className="w-3 h-3 mr-1" />
                                                    {group.calculations.length}건
                                                </Badge>
                                                <span className="text-xl font-bold text-blue-600">
                                                    {formatCurrency(group.totalAmount)}
                                                </span>
                                                {group.isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </CardTitle>
                                    </CardHeader>

                                    {/* 매니저 목록 - 접었다 펼치기 */}
                                    {group.isExpanded && (
                                        <CardContent className="pt-0">
                                            <div className="border-t pt-4">
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>정산 ID</TableHead>
                                                                <TableHead>매니저명</TableHead>
                                                                <TableHead>매니저 ID</TableHead>
                                                                <TableHead>정산 금액</TableHead>
                                                                <TableHead>요청일</TableHead>
                                                                <TableHead>상세</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {group.calculations.map((calculation) => (
                                                                <TableRow key={calculation.calculationId} className="hover:bg-gray-50">
                                                                    <TableCell className="font-medium">
                                                                        {calculation.calculationId}
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">
                                                                        {calculation.managerName}
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">
                                                                        {calculation.managerId}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className="font-bold text-blue-600">
                                                                            {formatCurrency(calculation.amount)}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">
                                                                        {formatDateTime(calculation.requestedAt)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => handleDetailClick(calculation)}
                                                                        >
                                                                            상세
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <CalendarDays className="w-12 h-12 text-gray-400" />
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">주차별 정산 내역이 없습니다</p>
                                            <p className="text-gray-500">아직 등록된 정산 요청이 없습니다.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* 전체 정산 내역 탭 */}
                <TabsContent value="all" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                전체 정산 현황 ({calculationData.recentMonthCalculations.length}건)
                            </CardTitle>
                            <CardDescription>모든 정산 요청의 전체 현황입니다.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>매니저명</TableHead>
                                            <TableHead>매니저ID</TableHead>
                                            <TableHead>정산 기간</TableHead>
                                            <TableHead>정산 금액</TableHead>
                                            <TableHead>요청일</TableHead>
                                            <TableHead>상세</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {calculationData.recentMonthCalculations.length > 0 ? (
                                            calculationData.recentMonthCalculations
                                                .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
                                                .map((calculation) => (
                                                    <TableRow key={calculation.calculationId} className="hover:bg-gray-50">
                                                        <TableCell className="font-medium">
                                                            {calculation.managerName}
                                                        </TableCell>
                                                        <TableCell className="text-gray-500">
                                                            {calculation.managerId}
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {formatDate(calculation.startDate)} ~ {formatDate(calculation.endDate)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-bold text-blue-600">
                                                                {formatCurrency(calculation.amount)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {formatDateTime(calculation.requestedAt)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleDetailClick(calculation)}
                                                            >
                                                                상세
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-12">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <FileText className="w-12 h-12 text-gray-400" />
                                                        <div>
                                                            <p className="text-lg font-semibold text-gray-900">정산 내역이 없습니다</p>
                                                            <p className="text-gray-500">아직 등록된 정산 요청이 없습니다.</p>
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

            {/* 정산 상세 다이얼로그 */}
            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-blue-500" />
                            정산 요청 상세 정보
                        </DialogTitle>
                        <DialogDescription>
                            {detailLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="text-gray-600">상세 정보를 불러오는 중...</div>
                                </div>
                            ) : calculationDetail ? (
                                <div className="space-y-6 mt-4">
                                    {/* 기본 정보 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                매니저 정보
                                            </h4>
                                            <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">매니저명:</span>
                                                    <span>{calculationDetail.managerName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">매니저ID:</span>
                                                    <span>{calculationDetail.managerId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">로그인ID:</span>
                                                    <span>{calculationDetail.managerLoginId}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                정산 정보
                                            </h4>
                                            <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">정산ID:</span>
                                                    <span>{calculationDetail.calculationId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">정산 기간:</span>
                                                    <span>
                                                        {formatDate(calculationDetail.startDate)} ~ {formatDate(calculationDetail.endDate)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">요청일:</span>
                                                    <span>{formatDateTime(calculationDetail.requestedAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 정산 요약 */}
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Receipt className="w-4 h-4" />
                                            정산 요약
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">총 예약 건수</p>
                                                <p className="text-xl font-bold text-blue-600">{calculationDetail.totalReservationCount}건</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">총 예약 금액</p>
                                                <p className="text-xl font-bold text-blue-600">{formatCurrency(calculationDetail.totalReservationAmount)}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">정산 금액</p>
                                                <p className="text-xl font-bold text-blue-600">{formatCurrency(calculationDetail.amount)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 예약 목록 */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900">예약 목록</h4>
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>예약ID</TableHead>
                                                        <TableHead>예약일</TableHead>
                                                        <TableHead>카테고리</TableHead>
                                                        <TableHead>옵션</TableHead>
                                                        <TableHead>금액</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {calculationDetail.reservations.map((reservation) => (
                                                        <TableRow key={reservation.reservationId}>
                                                            <TableCell className="font-medium">
                                                                {reservation.reservationId}
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatDate(reservation.reservationDate)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {reservation.categoryName}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {reservation.optionNames.map((option, index) => (
                                                                        <Badge key={index} variant="outline" className="text-xs">
                                                                            {option}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="font-bold text-blue-600">
                                                                {formatCurrency(reservation.reservationAmount)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            onClick={handleDialogClose}
                                            className="w-full"
                                        >
                                            닫기
                                        </Button>
                                    </div>
                                </div>
                            ) : selectedCalculation ? (
                                <div className="text-center py-8">
                                    <div className="text-red-600">상세 정보를 불러오는데 실패했습니다.</div>
                                </div>
                            ) : null}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}; 