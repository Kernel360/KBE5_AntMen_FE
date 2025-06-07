import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../components/ui/table';
import {
    Search,
    User,
    Mail,
    Phone,
    Calendar,
    CreditCard,
    Activity,
    MapPin,
    ShoppingBag
} from 'lucide-react';

interface Member {
    id: number;
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    lastLoginDate: string;
    status: 'active' | 'inactive' | 'suspended';
    plan: 'basic' | 'premium' | 'enterprise';
    totalOrders: number;
    totalSpent: number;
    address: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other';
    loginHistory: Array<{
        date: string;
        ip: string;
        device: string;
    }>;
    orderHistory: Array<{
        id: string;
        date: string;
        amount: number;
        status: string;
        items: string;
    }>;
}

const sampleMember: Member = {
    id: 1,
    name: '김회원',
    email: 'member@example.com',
    phone: '010-1234-5678',
    joinDate: '2024-01-15',
    lastLoginDate: '2025-06-06 14:30',
    status: 'active',
    plan: 'premium',
    totalOrders: 12,
    totalSpent: 458000,
    address: '서울시 강남구 테헤란로 123',
    birthDate: '1990-05-15',
    gender: 'male',
    loginHistory: [
        { date: '2025-06-06 14:30', ip: '192.168.1.100', device: 'Chrome on Windows' },
        { date: '2025-06-05 09:15', ip: '192.168.1.100', device: 'Safari on iPhone' },
        { date: '2025-06-04 16:45', ip: '10.0.0.50', device: 'Chrome on Android' },
    ],
    orderHistory: [
        { id: 'ORD-2025-001', date: '2025-06-01', amount: 29900, status: 'completed', items: '프리미엄 플랜 1개월' },
        { id: 'ORD-2025-002', date: '2025-05-15', amount: 59800, status: 'completed', items: '베이직 플랜 3개월' },
        { id: 'ORD-2025-003', date: '2025-05-01', amount: 149000, status: 'refunded', items: '엔터프라이즈 플랜 6개월' },
    ]
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'active':
            return <Badge className="bg-green-100 text-green-800">활성</Badge>;
        case 'inactive':
            return <Badge variant="secondary">비활성</Badge>;
        case 'suspended':
            return <Badge className="bg-red-100 text-red-800">정지</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

const getPlanBadge = (plan: string) => {
    switch (plan) {
        case 'basic':
            return <Badge variant="outline">베이직</Badge>;
        case 'premium':
            return <Badge className="bg-blue-100 text-blue-800">프리미엄</Badge>;
        case 'enterprise':
            return <Badge className="bg-purple-100 text-purple-800">엔터프라이즈</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

const getOrderStatusBadge = (status: string) => {
    switch (status) {
        case 'completed':
            return <Badge className="bg-green-100 text-green-800">완료</Badge>;
        case 'pending':
            return <Badge className="bg-yellow-100 text-yellow-800">대기</Badge>;
        case 'refunded':
            return <Badge className="bg-red-100 text-red-800">환불</Badge>;
        case 'cancelled':
            return <Badge variant="secondary">취소</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

export const MemberSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState<Member | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setIsSearching(true);

        // 실제 API 호출 시뮬레이션
        setTimeout(() => {
            if (searchTerm.includes('member') || searchTerm.includes('김회원')) {
                setSearchResult(sampleMember);
            } else {
                setSearchResult(null);
            }
            setIsSearching(false);
        }, 1000);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">회원조회</h1>
                <p className="text-gray-600 mt-2">회원 정보를 검색하고 상세 내용을 확인하세요</p>
            </div>

            {/* Search Section */}
            <Card>
                <CardHeader>
                    <CardTitle>회원 검색</CardTitle>
                    <CardDescription>이메일, 이름, 전화번호, 회원ID로 검색할 수 있습니다</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="이메일, 이름, 전화번호, 회원ID를 입력하세요..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={isSearching || !searchTerm.trim()}>
                            {isSearching ? '검색중...' : '검색'}
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        💡 테스트용: "member@example.com" 또는 "김회원"으로 검색해보세요
                    </p>
                </CardContent>
            </Card>

            {/* Search Results */}
            {searchResult ? (
                <div className="space-y-6">
                    {/* Member Profile Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src="/placeholder-avatar.jpg" />
                                    <AvatarFallback className="text-lg">{searchResult.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <h2 className="text-2xl font-bold text-gray-900">{searchResult.name}</h2>
                                        {getStatusBadge(searchResult.status)}
                                        {getPlanBadge(searchResult.plan)}
                                    </div>
                                    <p className="text-gray-600 mt-1">회원ID: {searchResult.id}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">이메일</p>
                                        <p className="text-sm text-gray-900">{searchResult.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">전화번호</p>
                                        <p className="text-sm text-gray-900">{searchResult.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">가입일</p>
                                        <p className="text-sm text-gray-900">
                                            {new Date(searchResult.joinDate).toLocaleDateString('ko-KR')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Activity className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">최근 로그인</p>
                                        <p className="text-sm text-gray-900">{searchResult.lastLoginDate}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">총 주문 횟수</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{searchResult.totalOrders}회</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">총 결제 금액</CardTitle>
                                <CreditCard className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(searchResult.totalSpent)}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">평균 주문 금액</CardTitle>
                                <CreditCard className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(searchResult.totalSpent / searchResult.totalOrders)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Information Tabs */}
                    <Card>
                        <CardContent className="p-0">
                            <Tabs defaultValue="personal" className="w-full">
                                <div className="border-b px-6 pt-6">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="personal">개인정보</TabsTrigger>
                                        <TabsTrigger value="orders">주문내역</TabsTrigger>
                                        <TabsTrigger value="login">로그인 기록</TabsTrigger>
                                        <TabsTrigger value="notes">관리자 메모</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="personal" className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">생년월일</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(searchResult.birthDate).toLocaleDateString('ko-KR')}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">성별</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {searchResult.gender === 'male' ? '남성' : searchResult.gender === 'female' ? '여성' : '기타'}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium text-gray-700">주소</label>
                                            <div className="mt-1 flex items-center space-x-2">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <p className="text-sm text-gray-900">{searchResult.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="orders" className="p-6">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>주문번호</TableHead>
                                                <TableHead>주문일</TableHead>
                                                <TableHead>상품</TableHead>
                                                <TableHead>금액</TableHead>
                                                <TableHead>상태</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {searchResult.orderHistory.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">{order.id}</TableCell>
                                                    <TableCell>{new Date(order.date).toLocaleDateString('ko-KR')}</TableCell>
                                                    <TableCell>{order.items}</TableCell>
                                                    <TableCell>{formatCurrency(order.amount)}</TableCell>
                                                    <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>

                                <TabsContent value="login" className="p-6">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>로그인 시간</TableHead>
                                                <TableHead>IP 주소</TableHead>
                                                <TableHead>디바이스/브라우저</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {searchResult.loginHistory.map((login, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{login.date}</TableCell>
                                                    <TableCell className="font-mono text-sm">{login.ip}</TableCell>
                                                    <TableCell>{login.device}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>

                                <TabsContent value="notes" className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">관리자 메모</label>
                                            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">관리자 메모가 없습니다.</p>
                                            </div>
                                        </div>
                                        <Button variant="outline">
                                            메모 추가
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            ) : searchTerm && !isSearching ? (
                <Card>
                    <CardContent className="flex items-center justify-center h-32">
                        <div className="text-center text-gray-500">
                            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>검색 결과가 없습니다.</p>
                            <p className="text-sm">다른 검색어로 시도해보세요.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
};