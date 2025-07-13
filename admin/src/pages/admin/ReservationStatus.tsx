import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
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
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { ReservationMatchingListDto, ReservationStats } from '../../api/types';

// API 타입을 그대로 사용
type Reservation = ReservationMatchingListDto;

// API 상태값을 새로운 상태값으로 매핑
const getStatusInfo = (status: string) => {
    switch (status) {
        case 'ing':
            return { label: '매칭중', color: 'bg-blue-100 text-blue-800' };
        case 'fail':
            return { label: '매칭실패', color: 'bg-red-100 text-red-800' };
        case 'nothing':
            return { label: '요청없음', color: 'bg-gray-100 text-gray-800' };
        default:
            return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
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
    const loadReservations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getReservationStatus(
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
    }, [statusFilter, searchTerm, categoryFilter, startDateFilter, endDateFilter]);

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        loadReservations();
    }, [loadReservations]);

    // 검색 실행 함수
    const handleSearch = useCallback(() => {
        setSearchTerm(searchInput);
    }, [searchInput]);

    // 엔터키 처리
    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    const handleReset = useCallback(() => {
        setSearchTerm('');
        setSearchInput('');
        setStatusFilter('all');
        setCategoryFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
    }, []);

    // 통계 계산
    const totalReservations = stats?.reduce((sum, stat) => sum + stat.count, 0) || 0;
    const ingCount = stats?.find(s => s.status === 'ing')?.count || 0;
    const failCount = stats?.find(s => s.status === 'fail')?.count || 0;
    const nothingCount = stats?.find(s => s.status === 'nothing')?.count || 0;

    // 페이지네이션 계산
    const totalPages = Math.ceil((reservations?.length || 0) / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentReservations = reservations?.slice(startIndex, endIndex) || [];

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
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <Card className="p-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            {totalReservations}
                        </div>
                        <div className="text-sm text-gray-500">전체예약</div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                            {ingCount}
                        </div>
                        <div className="text-sm text-gray-500">매칭중</div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">
                            0
                        </div>
                        <div className="text-sm text-gray-500">매칭완료</div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            0
                        </div>
                        <div className="text-sm text-gray-500">결제완료</div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            0
                        </div>
                        <div className="text-sm text-gray-500">진행완료</div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            0
                        </div>
                        <div className="text-sm text-gray-500">취소</div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            0
                        </div>
                        <div className="text-sm text-gray-500">에러</div>
                    </div>
                </Card>
            </div>

            {/* 검색 및 필터 */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-4">
                            <Label htmlFor="customer-search">고객명 검색</Label>
                            <Input 
                                id="customer-search" 
                                placeholder="고객명 또는 ID를 입력하세요" 
                                value={searchInput} 
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="mt-1 h-10"
                            />
                        </div>
                        
                        {/* 카테고리 필터 */}
                        <div className="col-span-3">
                            <Label htmlFor="category-filter">카테고리</Label>
                            <Input
                                id="category-filter"
                                type="text"
                                placeholder="카테고리 검색"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="mt-1 h-10"
                            />
                        </div>
                        
                        {/* 시작일 필터 */}
                        <div className="col-span-2">
                            <Label htmlFor="start-date-filter">시작일</Label>
                            <Input 
                                id="start-date-filter" 
                                type="date" 
                                value={startDateFilter} 
                                onChange={(e) => setStartDateFilter(e.target.value)}
                                className="mt-1 h-10 cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500"
                                style={{
                                    cursor: 'pointer',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    appearance: 'none',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                                onFocus={(e) => {
                                    e.target.showPicker && e.target.showPicker();
                                }}
                            />
                        </div>
                        
                        {/* 종료일 필터 */}
                        <div className="col-span-2">
                            <Label htmlFor="end-date-filter">종료일</Label>
                            <Input 
                                id="end-date-filter" 
                                type="date" 
                                value={endDateFilter} 
                                onChange={(e) => setEndDateFilter(e.target.value)}
                                className="mt-1 h-10 cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500"
                                style={{
                                    cursor: 'pointer',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    appearance: 'none',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                                onFocus={(e) => {
                                    e.target.showPicker && e.target.showPicker();
                                }}
                            />
                        </div>
                        
                        <div className="col-span-1">
                            <Button 
                                variant="outline" 
                                onClick={handleReset}
                                className="w-full h-10"
                            >
                                초기화
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 예약 목록 테이블 */}
            <Card className="p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">예약 목록</h2>
                    <p className="text-sm text-gray-500">
                        총 {reservations?.length || 0}개의 예약
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
                                        <Badge className={getStatusInfo(reservation.matchingStatus).color}>
                                            {getStatusInfo(reservation.matchingStatus).label}
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

                {!loading && (reservations?.length === 0 || !reservations) && (
                    <div className="text-center py-8 text-gray-500">
                        조건에 맞는 예약이 없습니다.
                    </div>
                )}

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 px-4">
                        <div className="text-sm text-gray-500">
                            {startIndex + 1}-{Math.min(endIndex, reservations?.length || 0)} / {reservations?.length || 0}개
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