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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { ReservationAdminListDto, ReservationStatDto } from '../../api/types';
import ReservationDetailModal from '../../components/modals/ReservationDetailModal';
import ReservationCancelModal from '../../components/modals/ReservationCancelModal';
import MatchingRequestModal from '../../components/modals/MatchingRequestModal';

// API 타입을 그대로 사용
type Reservation = ReservationAdminListDto;

// API 상태값을 새로운 상태값으로 매핑
const getStatusInfo = (status: string) => {
    switch (status) {
        case 'WAITING':
            return { label: '대기중', color: 'bg-yellow-100 text-yellow-800' };
        case 'MATCHING':
            return { label: '매칭완료', color: 'bg-blue-100 text-blue-800' };
        // case 'PAY':
        //     return { label: '결제완료', color: 'bg-purple-100 text-purple-800' };
        case 'DONE':
            return { label: '완료', color: 'bg-green-100 text-green-800' };
        case 'CANCEL':
            return { label: '취소', color: 'bg-red-100 text-red-800' };
        case 'ERROR':
            return { label: '에러', color: 'bg-orange-100 text-orange-800' };
        default:
            return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
};

const ITEMS_PER_PAGE = 15;

export const ReservationStatus: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [stats, setStats] = useState<ReservationStatDto[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState(''); // 실제 입력값
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [categoryInput, setCategoryInput] = useState<string>(''); // 실제 입력값
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    // 모달 관련 상태
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [reservationDetail, setReservationDetail] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    
    // 매칭 수정 모달 상태
    const [isMatchingRequestModalOpen, setIsMatchingRequestModalOpen] = useState(false);
    
    // 예약 취소 모달 상태
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    
    // 매니저 변경 모달 상태
    const [isManagerChangeModalOpen, setIsManagerChangeModalOpen] = useState(false);

    // 상태 변경 추적을 위한 플래그
    const [needsRefresh, setNeedsRefresh] = useState(false);

    // 데이터 로드 함수
    const loadReservations = useCallback(async (selectedStatus?: string) => {
        setLoading(true);
        try {
            const currentStatus = selectedStatus || statusFilter;
            const response = await adminService.getReservationStatus(
                currentStatus === 'all' ? undefined : currentStatus,
                searchTerm || undefined,
                categoryFilter || undefined,
                startDateFilter || undefined,
                endDateFilter || undefined
            );
            setReservations(response.reservationAdminListDtos);
            setStats(response.reservationStatDtoList);
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
        setCategoryFilter(categoryInput);
    }, [searchInput, categoryInput]);

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
        setCategoryInput('');
        setStartDateFilter('');
        setEndDateFilter('');
        loadReservations('all');
    }, [loadReservations]);

    // 상세보기 모달 열기
    const openDetailModal = async (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setIsDetailModalOpen(true);
        setDetailLoading(true);
        try {
            const detail = await adminService.getReservationDetail(reservation.reservationId.toString());
            setReservationDetail(detail);
        } catch (err: any) {
            console.error('상세 정보 로드 오류:', err);
            setReservationDetail(null);
        } finally {
            setDetailLoading(false);
        }
    };

    // 상세보기 모달 새로고침
    const refreshDetailModal = async () => {
        if (selectedReservation) {
            setDetailLoading(true);
            try {
                const detail = await adminService.getReservationDetail(selectedReservation.reservationId.toString());
                setReservationDetail(detail);
            } catch (err: any) {
                console.error('상세 정보 로드 오류:', err);
                setReservationDetail(null);
            } finally {
                setDetailLoading(false);
            }
        }
    };

    // 매칭 수정 모달 열기
    const openMatchingRequestModal = async (reservation: any) => {
        setSelectedReservation(reservation);
        setIsMatchingRequestModalOpen(true);
        
        // 예약 상세 정보 로드
        try {
            const detail = await adminService.getReservationDetail(reservation.reservationId.toString());
            setReservationDetail(detail);
        } catch (err: any) {
            console.error('예약 상세 정보 로드 오류:', err);
            setReservationDetail(null);
        }
    };

    // 예약 취소 모달 열기
    const openCancelModal = (reservation: any) => {
        setSelectedReservation(reservation);
        setIsCancelModalOpen(true);
    };

    // 고객 수락 처리
    const handleAcceptMatching = async (matchingId: string) => {
        try {
            await adminService.acceptMatching(matchingId);
            
            // 모달 닫기 및 상태 변경 플래그 설정
            setIsMatchingRequestModalOpen(false);
            setNeedsRefresh(true);
            
            // 상세 정보 새로고침 (병렬 처리로 개선)
            if (selectedReservation) {
                try {
                    const detail = await adminService.getReservationDetail(selectedReservation.reservationId.toString());
                    setReservationDetail(detail);
                } catch (err) {
                    console.error('상세 정보 새로고침 실패:', err);
                }
            }
            
            alert('고객 수락 처리가 완료되었습니다.');
        } catch (err: any) {
            alert(err.message || '고객 수락 처리 중 오류가 발생했습니다.');
            console.error('고객 수락 오류:', err);
        }
    };

    // 매칭 요청 보내기
    const handleSendMatchingRequest = async (matchingId: string) => {
        try {
            await adminService.sendMatchingRequest(matchingId);
            
            // 모달 닫기 및 상태 변경 플래그 설정
            setIsMatchingRequestModalOpen(false);
            setNeedsRefresh(true);
            
            // 상세 정보 새로고침 (병렬 처리로 개선)
            if (selectedReservation) {
                try {
                    const detail = await adminService.getReservationDetail(selectedReservation.reservationId.toString());
                    setReservationDetail(detail);
                } catch (err) {
                    console.error('상세 정보 새로고침 실패:', err);
                }
            }
            
            alert('매칭 요청이 전송되었습니다.');
        } catch (err: any) {
            alert(err.message || '매칭 요청 전송 중 오류가 발생했습니다.');
            console.error('매칭 요청 오류:', err);
        }
    };

    // 새 후보 만들기
    const handleCreateNewCandidate = async () => {
        try {
            // 새 후보 만들기 로직 구현 필요
            alert('새 후보 만들기 기능은 추후 구현 예정입니다.');
            setNeedsRefresh(true);
        } catch (err: any) {
            alert(err.message || '새 후보 만들기 중 오류가 발생했습니다.');
            console.error('새 후보 만들기 오류:', err);
        }
    };

    // 예약 취소 처리
    const handleCancelReservation = async (reservationId: string, cancelData: { status: string; reason: string }) => {
        try {
            await adminService.cancelReservation(reservationId, cancelData);
            alert('예약이 취소되었습니다.');
            
            // 모달 닫기 및 상태 변경 플래그 설정
            setIsCancelModalOpen(false);
            setNeedsRefresh(true);
        } catch (err: any) {
            alert(err.message || '예약 취소 중 오류가 발생했습니다.');
            console.error('예약 취소 오류:', err);
        }
    };

    // 매니저 변경 모달 열기
    const openManagerChangeModal = (reservation: any) => {
        setSelectedReservation(reservation);
        setIsManagerChangeModalOpen(true);
    };

    // 통계 계산
    const totalReservations = stats?.reduce((sum, stat) => sum + stat.count, 0) || 0;
    const waitingCount = stats?.find(s => s.status === 'WAITING')?.count || 0;
    const matchingCount = stats?.find(s => s.status === 'MATCHING')?.count || 0;
    const doneCount = stats?.find(s => s.status === 'DONE')?.count || 0;
    const cancelCount = stats?.find(s => s.status === 'CANCEL')?.count || 0;

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

    // 상세 모달 닫기 핸들러
    const handleDetailModalClose = () => {
        setIsDetailModalOpen(false);
        // 상태 변경이 있었으면 목록 새로고침
        if (needsRefresh) {
            loadReservations();
            setNeedsRefresh(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">예약현황</h1>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-6 gap-4">
                <Card 
                    className={`p-6 cursor-pointer transition-colors ${statusFilter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                        setStatusFilter('all');
                        loadReservations('all');
                    }}
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            {totalReservations}
                        </div>
                        <div className="text-sm text-gray-500">전체예약</div>
                    </div>
                </Card>
                <Card 
                    className={`p-6 cursor-pointer transition-colors ${statusFilter === 'WAITING' ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                        setStatusFilter('WAITING');
                        loadReservations('WAITING');
                    }}
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                            {waitingCount}
                        </div>
                        <div className="text-sm text-gray-500">대기중</div>
                    </div>
                </Card>
                <Card 
                    className={`p-6 cursor-pointer transition-colors ${statusFilter === 'MATCHING' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                        setStatusFilter('MATCHING');
                        loadReservations('MATCHING');
                    }}
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {matchingCount}
                        </div>
                        <div className="text-sm text-gray-500">매칭완료</div>
                    </div>
                </Card>
                <Card 
                    className={`p-6 cursor-pointer transition-colors ${statusFilter === 'DONE' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                        setStatusFilter('DONE');
                        loadReservations('DONE');
                    }}
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {doneCount}
                        </div>
                        <div className="text-sm text-gray-500">완료</div>
                    </div>
                </Card>
                <Card 
                    className={`p-6 cursor-pointer transition-colors ${statusFilter === 'CANCEL' ? 'ring-2 ring-red-500 bg-red-50' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                        setStatusFilter('CANCEL');
                        loadReservations('CANCEL');
                    }}
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {cancelCount}
                        </div>
                        <div className="text-sm text-gray-500">취소</div>
                    </div>
                </Card>
                <Card 
                    className={`p-6 cursor-pointer transition-colors ${statusFilter === 'ERROR' ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                        setStatusFilter('ERROR');
                        loadReservations('ERROR');
                    }}
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {stats?.find(s => s.status === 'ERROR')?.count || 0}
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
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                onKeyPress={handleKeyPress}
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
                                <TableHead>고객정보</TableHead>
                                <TableHead>서비스명</TableHead>
                                <TableHead>예약상태</TableHead>
                                <TableHead>예약생성일</TableHead>
                                <TableHead>서비스 요청일</TableHead>
                                <TableHead>작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentReservations.map((reservation) => (
                                <TableRow key={reservation.reservationId}>
                                    <TableCell className="font-medium">
                                        {reservation.reservationId}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{reservation.customerName}</div>
                                            <div className="text-sm text-gray-500">고객 ID: {reservation.customerId}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{reservation.categoryName}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusInfo(reservation.reservationStatus).color}>
                                            {getStatusInfo(reservation.reservationStatus).label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(reservation.reservationCreatedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{reservation.reservationDate} {reservation.reservationTime}</TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => openDetailModal(reservation)}
                                        >
                                            상세보기
                                        </Button>
                                    </TableCell>
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

            {/* 상세보기 모달 */}
            <ReservationDetailModal
                open={isDetailModalOpen}
                onClose={handleDetailModalClose}
                reservation={selectedReservation}
                reservationDetail={reservationDetail}
                loading={detailLoading}
                onRefresh={refreshDetailModal}
                onOpenMatchingRequestModal={openMatchingRequestModal}
                onOpenCancelModal={openCancelModal}
                onOpenManagerChangeModal={openManagerChangeModal}
                onCancelReservation={handleCancelReservation}
                onAcceptMatching={handleAcceptMatching}
                onSendMatchingRequest={handleSendMatchingRequest}
                onCreateNewCandidate={handleCreateNewCandidate}
            />

            {/* 매칭 수정 모달 */}
            <MatchingRequestModal
                open={isMatchingRequestModalOpen}
                onClose={() => setIsMatchingRequestModalOpen(false)}
                reservation={selectedReservation}
                reservationDetail={reservationDetail}
                onAcceptMatching={handleAcceptMatching}
                onSendMatchingRequest={handleSendMatchingRequest}
                onCreateNewCandidate={handleCreateNewCandidate}
            />

            {/* 예약 취소 모달 */}
            <ReservationCancelModal
                open={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                reservation={selectedReservation}
                onCancel={handleCancelReservation}
                source="list"
            />

            {/* 매니저 변경 모달 */}
            <Dialog open={isManagerChangeModalOpen} onOpenChange={setIsManagerChangeModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>매니저 변경</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-gray-600">매니저 변경 기능은 추후 구현 예정입니다.</p>
                        <div className="flex justify-end gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsManagerChangeModalOpen(false)}
                            >
                                닫기
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}; 