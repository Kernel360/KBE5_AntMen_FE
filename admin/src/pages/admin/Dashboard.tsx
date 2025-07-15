import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
    Users,
    MessageCircle,
    CreditCard,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    DollarSign,
    GitBranch,
    RefreshCw,
    ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { adminService } from '../../api/adminService';
import { userService } from '../../api/userService';
import { adminSalesService } from '../../api/adminSales';
import { adminRefundsService } from '../../api/adminRefunds';
import { fetchAdminMatchingStatistics } from '../../api/adminMatching';
import { adminReservationService } from '../../api/adminReservation';
import { adminReviewService } from '../../api/adminReview';
import { adminInquiryRefundService } from '../../api/adminInquiryRefund';
import { ReservationStats, AdminSalesSummaryResponseDto, AdminRefundStatisticsResponseDto, AdminMatchingStatisticsResponseDto, AdminReservationStatisticsResponseDto, AdminReviewStatisticsResponseDto, AdminInquiryRefundDailyDto } from '../../api/types';

// 샘플 데이터 (API 데이터가 없을 때 사용)
const dailyStats = [
    { date: '01/01', users: 1200, inquiries: 45, refunds: 12 },
    { date: '01/02', users: 1350, inquiries: 52, refunds: 8 },
    { date: '01/03', users: 1180, inquiries: 38, refunds: 15 },
    { date: '01/04', users: 1420, inquiries: 61, refunds: 10 },
    { date: '01/05', users: 1380, inquiries: 48, refunds: 7 },
    { date: '01/06', users: 1520, inquiries: 55, refunds: 9 },
    { date: '01/07', users: 1460, inquiries: 43, refunds: 11 },
];

const recentInquiries = [
    { id: 1, type: '고객상담', content: '결제 관련 문의', status: 'pending', time: '10분 전' },
    { id: 2, type: '운영상담', content: '서비스 장애 신고', status: 'processing', time: '25분 전' },
    { id: 3, type: '고객상담', content: '환불 요청', status: 'completed', time: '1시간 전' },
    { id: 4, type: '운영상담', content: '계정 복구 요청', status: 'pending', time: '2시간 전' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'New':
            return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />신규</Badge>;
        case 'InProgress':
            return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />진행중</Badge>;
        default:
            return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />신규</Badge>;
    }
};

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [matchingStats, setMatchingStats] = useState<ReservationStats[]>([]);
    const [salesData, setSalesData] = useState<AdminSalesSummaryResponseDto | null>(null);
    const [refundData, setRefundData] = useState<AdminRefundStatisticsResponseDto | null>(null);
    const [matchingData, setMatchingData] = useState<AdminMatchingStatisticsResponseDto | null>(null);
    const [reservationData, setReservationData] = useState<AdminReservationStatisticsResponseDto | null>(null);
    const [reviewData, setReviewData] = useState<AdminReviewStatisticsResponseDto | null>(null);
    const [inquiryRefundStats, setInquiryRefundStats] = useState<AdminInquiryRefundDailyDto[]>([]);
    const [userCounts, setUserCounts] = useState({ customers: 0, managers: 0, waiting: 0 });
    const [waitingRefunds, setWaitingRefunds] = useState<number>(0);
    const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
    const [recentManagerInquiries, setRecentManagerInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // 대시보드 데이터 로드
    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 병렬로 모든 API 호출
            const [
                matchingResponse,
                salesResponse,
                refundResponse,
                matchingStatsResponse,
                reservationResponse,
                reviewResponse,
                inquiryRefundResponse,
                customersResponse,
                managersResponse,
                waitingResponse,
                waitingRefundsResponse,
                customerInquiriesResponse,
                managerInquiriesResponse
            ] = await Promise.allSettled([
                adminService.getReservationMatchingList(),
                adminSalesService.getSalesSummary(),
                adminRefundsService.getRefundStatistics(),
                fetchAdminMatchingStatistics(),
                adminReservationService.getReservationStatistics(),
                adminReviewService.getReviewStatistics(),
                adminInquiryRefundService.getInquiryRefundStatistics(),
                userService.getCustomers(),
                userService.getManagers(),
                userService.getWaitingManagers(),
                adminRefundsService.getWaitingRefunds(),
                adminService.getBoardList('customer', 'personal'), // 고객 상담
                adminService.getBoardList('manager', 'personal') // 매니저 상담
            ]);

            // 매칭 통계
            if (matchingResponse.status === 'fulfilled') {
                setMatchingStats(matchingResponse.value.stats);
            }

            // 매출 데이터
            if (salesResponse.status === 'fulfilled') {
                setSalesData(salesResponse.value);
            }

            // 환불 데이터
            if (refundResponse.status === 'fulfilled') {
                setRefundData(refundResponse.value);
            }

            // 매칭 통계
            if (matchingStatsResponse.status === 'fulfilled') {
                setMatchingData(matchingStatsResponse.value);
            }

            // 예약 통계
            if (reservationResponse.status === 'fulfilled') {
                setReservationData(reservationResponse.value);
            }

            // 리뷰 통계
            if (reviewResponse.status === 'fulfilled') {
                setReviewData(reviewResponse.value);
            }

            // 상담 및 환불 통계
            if (inquiryRefundResponse.status === 'fulfilled') {
                setInquiryRefundStats(inquiryRefundResponse.value);
            }

            // 사용자 수
            if (customersResponse.status === 'fulfilled') {
                setUserCounts(prev => ({ ...prev, customers: customersResponse.value.totalElements || 0 }));
            }
            if (managersResponse.status === 'fulfilled') {
                setUserCounts(prev => ({ ...prev, managers: managersResponse.value.totalElements || 0 }));
            }
            if (waitingResponse.status === 'fulfilled') {
                // 승인 대기 매니저는 페이지네이션된 응답이므로 totalElements 사용
                setUserCounts(prev => ({ ...prev, waiting: waitingResponse.value.totalElements || 0 }));
            }

            // 대기중 환불 수
            if (waitingRefundsResponse.status === 'fulfilled') {
                setWaitingRefunds(waitingRefundsResponse.value.length || 0);
            }

            // 최근 고객 상담 요청 (신규, 진행중만)
            if (customerInquiriesResponse.status === 'fulfilled') {
                const filteredInquiries = customerInquiriesResponse.value.filter((inquiry: any) => 
                    inquiry.boardStatus === 'New' || inquiry.boardStatus === 'InProgress'
                );
                // 최신순 정렬
                const sorted = filteredInquiries.sort((a: any, b: any) => {
                    const getDate = (item: any) => new Date(item.boardCreatedAt || item.createdAt || item.modifiedAt).getTime();
                    return getDate(b) - getDate(a);
                });
                const inquiries = sorted.slice(0, 3); // 최근 3개만 표시
                setRecentInquiries(inquiries);
            }

            // 최근 매니저 상담 요청 (신규, 진행중만)
            if (managerInquiriesResponse.status === 'fulfilled') {
                const filteredInquiries = managerInquiriesResponse.value.filter((inquiry: any) => 
                    inquiry.boardStatus === 'New' || inquiry.boardStatus === 'InProgress'
                );
                // 최신순 정렬
                const sorted = filteredInquiries.sort((a: any, b: any) => {
                    const getDate = (item: any) => new Date(item.boardCreatedAt || item.createdAt || item.modifiedAt).getTime();
                    return getDate(b) - getDate(a);
                });
                const inquiries = sorted.slice(0, 3); // 최근 3개만 표시
                setRecentManagerInquiries(inquiries);
            }

        } catch (err: any) {
            setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
            console.error('대시보드 데이터 로드 오류:', err);
        } finally {
            setLoading(false);
        }
    };

    // 새로고침 함수
    const handleRefresh = async () => {
        setRefreshing(true);
        await loadDashboardData();
        setRefreshing(false);
    };

    // 초기 데이터 로드
    useEffect(() => {
        loadDashboardData();
    }, []);

    // 매칭 통계 계산
    const totalReservations = matchingStats.reduce((sum, stat) => sum + stat.count, 0);
    const ingCount = matchingStats.find(s => s.status === 'ing')?.count || 0;
    const failCount = matchingStats.find(s => s.status === 'fail')?.count || 0;
    const nothingCount = matchingStats.find(s => s.status === 'nothing')?.count || 0;
    const needActionCount = failCount + nothingCount;

    // 이번 달 매출
    const currentMonthSales = salesData?.currentMonthSales || 0;
    const currentMonthProfit = salesData?.currentMonthProfit || 0;

    // 총 사용자 수
    const totalUsers = userCounts.customers + userCounts.managers;

    // 매칭 성공률
    const matchingRate = matchingData?.matchingSummary.matchingRating || 0;

    // 상담 및 환불 현황 그래프 데이터 생성
    const getInquiryRefundData = () => {
        if (!inquiryRefundStats || inquiryRefundStats.length === 0) {
            return dailyStats; // API 데이터가 없으면 샘플 데이터 사용
        }

        return inquiryRefundStats.map(item => ({
            date: item.date.slice(5), // MM-DD 형태로 변환
            inquiries: item.dailyCustomerInquiries + item.dailyManagerInquiries, // 고객 + 매니저 상담 건수
            refunds: item.dailyRefunds // 일별 환불 건수
        }));
    };

    const getReservationData = () => {
        if (!reservationData?.dailyList) {
            // 샘플 데이터
            return [
                { date: '12-01', requests: 15, completed: 12, matching: 8 },
                { date: '12-02', requests: 18, completed: 14, matching: 10 },
                { date: '12-03', requests: 12, completed: 10, matching: 6 },
                { date: '12-04', requests: 20, completed: 16, matching: 12 },
                { date: '12-05', requests: 16, completed: 13, matching: 9 },
                { date: '12-06', requests: 14, completed: 11, matching: 7 },
                { date: '12-07', requests: 19, completed: 15, matching: 11 }
            ];
        }

        return reservationData.dailyList.map(item => ({
            date: item.date.slice(5), // MM-DD 형태로 변환
            requests: item.dailyReservationsCount, // 예약 신청수 (실제 데이터)
            completed: item.dailyCompletedCount, // 완료된 예약수 (실제 데이터)
            matching: item.dailyMatchingCount // 매칭완료 수 (실제 데이터)
        }));
    };

    const inquiryRefundData = getInquiryRefundData();
    const reservationChartData = getReservationData();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
                    <p className="text-gray-600 mt-2">시스템 현황과 주요 지표를 확인하세요</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>새로고침</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => navigate('/admin/users/customer')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? '...' : totalUsers.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-600 flex items-center mt-1">
                            <span>고객: {userCounts.customers} | 매니저: {userCounts.managers}</span>
                        </p>
                    </CardContent>
                </Card>

                <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => navigate('/admin/users/waiting')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">승인 대기</CardTitle>
                        <MessageCircle className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? '...' : userCounts.waiting}
                        </div>
                        <p className="text-xs text-orange-600 flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            매니저 승인 대기
                        </p>
                    </CardContent>
                </Card>

                <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => navigate('/admin/finance/refund')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">대기중 환불</CardTitle>
                        <CreditCard className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? '...' : waitingRefunds}
                        </div>
                        <p className="text-xs text-gray-600 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            환불률: {refundData?.refundRate?.toFixed(1) || 0}%
                        </p>
                    </CardContent>
                </Card>

                <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => navigate('/admin/finance/sales')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">이번 달 매출</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? '...' : `₩${currentMonthSales.toLocaleString()}`}
                        </div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            순이익: ₩{currentMonthProfit.toLocaleString()}
                        </p>
                    </CardContent>
                </Card>

                <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => navigate('/admin/matching/manual')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">매칭 성공률</CardTitle>
                        <GitBranch className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {loading ? '...' : `${matchingRate.toFixed(1)}%`}
                        </div>
                        <p className="text-xs text-orange-600 flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            조치 필요: {needActionCount}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Reservation Chart */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>일별 예약 현황</CardTitle>
                        <CardDescription>최근 7일간 예약 신청, 매칭 완료, 진행 현황</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reservationChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fontSize: 12, fill: '#374151' }}
                                        tickLine={{ stroke: '#6b7280' }}
                                        axisLine={{ stroke: '#6b7280' }}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: '#374151' }}
                                        tickLine={{ stroke: '#6b7280' }}
                                        axisLine={{ stroke: '#6b7280' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#ffffff', 
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="requests" fill="#3b82f6" name="예약 신청수" />
                                    <Bar dataKey="matching" fill="#f59e0b" name="매칭완료" />
                                    <Bar dataKey="completed" fill="#10b981" name="완료" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Inquiries Chart */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>상담 및 환불 현황</CardTitle>
                        <CardDescription>최근 7일간 상담과 환불 신청 현황</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={inquiryRefundData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fontSize: 12, fill: '#374151' }}
                                        tickLine={{ stroke: '#6b7280' }}
                                        axisLine={{ stroke: '#6b7280' }}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: '#374151' }}
                                        tickLine={{ stroke: '#6b7280' }}
                                        axisLine={{ stroke: '#6b7280' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#ffffff', 
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="inquiries" fill="#fbbf24" name="상담" />
                                    <Bar dataKey="refunds" fill="#ef4444" name="환불 신청" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 고객 상담 */}
                <Card className="hover:shadow-lg transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>고객 상담</CardTitle>
                            <CardDescription>최근 고객 문의 요청들</CardDescription>
                        </div>
                        <button
                            onClick={() => {
                                window.location.href = '/admin/support/customer?tab=tickets';
                            }}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-white text-gray-700 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <span>전체보기</span>
                            <ArrowRight className="w-3 h-3" />
                        </button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentInquiries.length > 0 ? (
                                recentInquiries.map((inquiry) => (
                                    <div
                                        key={inquiry.boardId || inquiry.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/admin/support/customer?tab=tickets&inquiry=${inquiry.boardId}`)}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                {getStatusBadge(inquiry.boardStatus || 'New')}
                                            </div>
                                            <p className="text-sm text-gray-900 font-medium">
                                                {inquiry.boardTitle || inquiry.content || '제목 없음'}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {inquiry.boardContent ? inquiry.boardContent.substring(0, 50) + '...' : ''}
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {(() => {
                                                const date = inquiry.boardCreatedAt || inquiry.createdAt;
                                                if (date) {
                                                    const now = new Date();
                                                    const createdDate = new Date(date);
                                                    const diffTime = now.getTime() - createdDate.getTime();
                                                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                                    if (diffDays === 0) {
                                                        return '오늘';
                                                    } else if (diffDays === 1) {
                                                        return '어제';
                                                    } else if (diffDays < 7) {
                                                        return `${diffDays}일 전`;
                                                    } else {
                                                        return createdDate.toLocaleDateString('ko-KR');
                                                    }
                                                }
                                                return inquiry.time || '날짜 없음';
                                            })()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {loading ? '상담 데이터를 불러오는 중...' : '최근 고객 문의가 없습니다.'}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 매니저 상담 */}
                <Card className="hover:shadow-lg transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>매니저 상담</CardTitle>
                            <CardDescription>최근 매니저 문의 요청들</CardDescription>
                        </div>
                        <button
                            onClick={() => {
                                window.location.href = '/admin/support/manager?tab=tickets';
                            }}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-white text-gray-700 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <span>전체보기</span>
                            <ArrowRight className="w-3 h-3" />
                        </button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentManagerInquiries.length > 0 ? (
                                recentManagerInquiries.map((inquiry) => (
                                    <div
                                        key={inquiry.boardId || inquiry.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/admin/support/manager?tab=tickets&inquiry=${inquiry.boardId}`)}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                {getStatusBadge(inquiry.boardStatus || 'New')}
                                            </div>
                                            <p className="text-sm text-gray-900 font-medium">
                                                {inquiry.boardTitle || inquiry.content || '제목 없음'}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {inquiry.boardContent ? inquiry.boardContent.substring(0, 50) + '...' : ''}
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {(() => {
                                                const date = inquiry.boardCreatedAt || inquiry.createdAt;
                                                if (date) {
                                                    const now = new Date();
                                                    const createdDate = new Date(date);
                                                    const diffTime = now.getTime() - createdDate.getTime();
                                                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                                    if (diffDays === 0) {
                                                        return '오늘';
                                                    } else if (diffDays === 1) {
                                                        return '어제';
                                                    } else if (diffDays < 7) {
                                                        return `${diffDays}일 전`;
                                                    } else {
                                                        return createdDate.toLocaleDateString('ko-KR');
                                                    }
                                                }
                                                return inquiry.time || '날짜 없음';
                                            })()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {loading ? '상담 데이터를 불러오는 중...' : '최근 매니저 문의가 없습니다.'}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};