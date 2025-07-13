import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Calendar, Search, Filter, Download, ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { ReservationMatchingListDto, ReservationStats } from '../../api/types';

interface Reservation {
    reservationId: number;
    customerId: number;
    customerName: string;
    categoryName: string;
    reservationDate: string;
    reservationTime: string;
    totalRequests: number;
    totalManagerResponses: number;
    totalManagerAccepts: number;
    matchingStatus: 'ing' | 'fail' | 'nothing';
}

const statusMap = {
    ing: { label: '매칭중', color: 'bg-blue-100 text-blue-800' },
    fail: { label: '매칭실패', color: 'bg-red-100 text-red-800' },
    nothing: { label: '요청없음', color: 'bg-gray-100 text-gray-800' }
};

const ITEMS_PER_PAGE = 15;

export const ReservationStatus: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [stats, setStats] = useState<ReservationStats[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState(''); // 실제 입력값
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // 데이터 로드 함수
    const loadReservations = async () => {
        setLoading(true);
        try {
            const response = await adminService.getReservationMatchingList(
                statusFilter === 'all' ? undefined : statusFilter,
                searchTerm || undefined,
                categoryFilter || undefined,
                startDateFilter || undefined,
                endDateFilter || undefined
            );
            setReservations(response.reservations);
            setStats(response.stats);
            setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
        } catch (error: any) {
            console.error('예약 데이터 로드 실패:', error);
            alert('예약 데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        loadReservations();
    }, []);

    // 필터 변경 시 데이터 다시 로드
    useEffect(() => {
        loadReservations();
    }, [statusFilter, searchTerm, categoryFilter, startDateFilter, endDateFilter]);

    // 검색 실행 함수
    const handleSearch = () => {
        setSearchTerm(searchInput);
    };

    // 엔터키 처리
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleExport = () => {
        // CSV 내보내기 로직
        alert('예약현황을 CSV로 내보내기 기능은 준비 중입니다.');
    };

    const handleReset = () => {
        setSearchTerm('');
        setSearchInput('');
        setStatusFilter('all');
        setCategoryFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
    };

    // 통계 계산
    const totalReservations = stats.reduce((sum, stat) => sum + stat.count, 0);
    const ingCount = stats.find(s => s.status === 'ing')?.count || 0;
    const failCount = stats.find(s => s.status === 'fail')?.count || 0;
    const nothingCount = stats.find(s => s.status === 'nothing')?.count || 0;

    // 페이지네이션 계산
    const totalPages = Math.ceil(reservations.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentReservations = reservations.slice(startIndex, endIndex);

    // 페이지 변경 함수
    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // 페이지 번호 배열 생성 (5개씩 그룹)
    const getPageNumbers = () => {
        const pages = [];
        const groupSize = 5;
        const currentGroup = Math.ceil(currentPage / groupSize);
        const startPage = (currentGroup - 1) * groupSize + 1;
        const endPage = Math.min(startPage + groupSize - 1, totalPages);
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    // 그룹 이동 함수
    const goToPreviousGroup = () => {
        const currentGroup = Math.ceil(currentPage / 5);
        if (currentGroup > 1) {
            const newPage = (currentGroup - 2) * 5 + 1;
            setCurrentPage(newPage);
        }
    };

    const goToNextGroup = () => {
        const currentGroup = Math.ceil(currentPage / 5);
        const totalGroups = Math.ceil(totalPages / 5);
        if (currentGroup < totalGroups) {
            const newPage = currentGroup * 5 + 1;
            setCurrentPage(Math.min(newPage, totalPages));
        }
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">예약현황</h1>
                <Button onClick={handleExport} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    내보내기
                </Button>
            </div>

            {/* 필터 섹션 */}
            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            검색
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="고객명 검색"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            매칭상태
                        </label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="상태 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체</SelectItem>
                                <SelectItem value="ing">매칭중</SelectItem>
                                <SelectItem value="fail">매칭실패</SelectItem>
                                <SelectItem value="nothing">요청없음</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            카테고리
                        </label>
                        <Input
                            type="text"
                            placeholder="카테고리 검색"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            시작일
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="date"
                                value={startDateFilter}
                                onChange={(e) => setStartDateFilter(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            종료일
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="date"
                                value={endDateFilter}
                                onChange={(e) => setEndDateFilter(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex items-end">
                        <Button 
                            variant="outline" 
                            onClick={handleReset}
                            className="w-full"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            초기화
                        </Button>
                    </div>
                </div>
            </Card>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {totalReservations}
                        </div>
                        <div className="text-sm text-gray-500">전체 예약</div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {ingCount}
                        </div>
                        <div className="text-sm text-gray-500">매칭중</div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {failCount}
                        </div>
                        <div className="text-sm text-gray-500">매칭실패</div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                            {nothingCount}
                        </div>
                        <div className="text-sm text-gray-500">요청없음</div>
                    </div>
                </Card>
            </div>

            {/* 예약 목록 테이블 */}
            <Card className="p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">예약 목록</h2>
                    <p className="text-sm text-gray-500">
                        총 {reservations.length}개의 예약
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>예약번호</TableHead>
                                <TableHead>고객명</TableHead>
                                <TableHead>카테고리</TableHead>
                                <TableHead>예약일시</TableHead>
                                <TableHead>매칭상태</TableHead>
                                <TableHead>요청수</TableHead>
                                <TableHead>응답수</TableHead>
                                <TableHead>수락수</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentReservations.map((reservation) => (
                                <TableRow key={reservation.reservationId}>
                                    <TableCell className="font-medium">
                                        {reservation.reservationId}
                                    </TableCell>
                                    <TableCell>{reservation.customerName}</TableCell>
                                    <TableCell>{reservation.categoryName}</TableCell>
                                    <TableCell>
                                        {reservation.reservationDate} {reservation.reservationTime}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={statusMap[reservation.matchingStatus].color}>
                                            {statusMap[reservation.matchingStatus].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{reservation.totalRequests}</TableCell>
                                    <TableCell>{reservation.totalManagerResponses}</TableCell>
                                    <TableCell>{reservation.totalManagerAccepts}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {loading && (
                    <div className="text-center py-8 text-gray-500">
                        데이터를 불러오는 중...
                    </div>
                )}

                {!loading && reservations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        조건에 맞는 예약이 없습니다.
                    </div>
                )}

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 px-4">
                        <div className="text-sm text-gray-500">
                            {startIndex + 1}-{Math.min(endIndex, reservations.length)} / {reservations.length}개
                        </div>
                        <div className="flex items-center space-x-1">
                            {/* 첫 페이지 버튼 */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToFirstPage}
                                disabled={currentPage === 1}
                                className="h-8 w-8 p-0"
                            >
                                <SkipBack className="h-4 w-4" />
                            </Button>
                            
                            {/* 이전 그룹 버튼 */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToPreviousGroup}
                                disabled={currentPage <= 5}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            {/* 페이지 번호들 */}
                            {getPageNumbers().map((page) => (
                                <Button
                                    key={page}
                                    variant={page === currentPage ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => goToPage(page)}
                                    className={`h-8 w-8 p-0 ${
                                        page === currentPage 
                                            ? 'border-2 border-blue-600 bg-blue-600 text-white' 
                                            : 'border border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    {page}
                                </Button>
                            ))}
                            
                            {/* 다음 그룹 버튼 */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToNextGroup}
                                disabled={currentPage > totalPages - 5}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            
                            {/* 마지막 페이지 버튼 */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToLastPage}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 p-0"
                            >
                                <SkipForward className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}; 