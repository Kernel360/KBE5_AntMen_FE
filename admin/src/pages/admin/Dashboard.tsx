import React from 'react';
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
    DollarSign
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// 샘플 데이터
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
        case 'pending':
            return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />대기중</Badge>;
        case 'processing':
            return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />처리중</Badge>;
        case 'completed':
            return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />완료</Badge>;
        default:
            return <Badge variant="secondary">알 수 없음</Badge>;
    }
};

export const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
                <p className="text-gray-600 mt-2">시스템 현황과 주요 지표를 확인하세요</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,847</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +12.5% 전월 대비
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">미처리 상담</CardTitle>
                        <MessageCircle className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-xs text-red-600 flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            긴급 처리 필요
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">대기중 환불</CardTitle>
                        <CreditCard className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-gray-600 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            평균 처리시간 2.3일
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">이번 달 매출</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₩45.2M</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +8.2% 전월 대비
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Users Chart */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>일별 사용자 현황</CardTitle>
                        <CardDescription>최근 7일간 사용자 활동 추이</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailyStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ fill: '#3b82f6' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Inquiries Chart */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>상담 및 환불 현황</CardTitle>
                        <CardDescription>최근 7일간 상담 접수와 환불 요청</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="inquiries" fill="#f59e0b" name="상담" />
                                    <Bar dataKey="refunds" fill="#ef4444" name="환불" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>최근 상담 요청</CardTitle>
                    <CardDescription>실시간으로 접수된 상담 요청들</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentInquiries.map((inquiry) => (
                            <div
                                key={inquiry.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <Badge variant="outline">{inquiry.type}</Badge>
                                        {getStatusBadge(inquiry.status)}
                                    </div>
                                    <p className="text-sm text-gray-900 font-medium">{inquiry.content}</p>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {inquiry.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};