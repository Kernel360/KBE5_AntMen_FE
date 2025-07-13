import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, Calendar } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { ReservationMatchingListDto, ManualMatchingRequest, ReservationStats } from '../../api/types';

const ITEMS_PER_PAGE = 15;

export const ManualMatching: React.FC = () => {
    const [selectedReservation, setSelectedReservation] = useState<ReservationMatchingListDto | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isMatchingRequestModalOpen, setIsMatchingRequestModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelReasonType, setCancelReasonType] = useState<'preset1' | 'preset2' | 'custom'>('preset1');
    const [matchingType, setMatchingType] = useState<'auto' | 'manual'>('auto');
    const [selectedManagerId, setSelectedManagerId] = useState<string>('');
    const [managerSearchTerm, setManagerSearchTerm] = useState<string>('');
    const [showManagerDropdown, setShowManagerDropdown] = useState(false);
    
    // 검색 및 필터 상태
    const [customerSearch, setCustomerSearch] = useState<string>('');
    const [customerSearchInput, setCustomerSearchInput] = useState<string>(''); // 실제 입력값
    const [serviceFilter, setServiceFilter] = useState<string>('all');
    const [matchingStatusFilter, setMatchingStatusFilter] = useState<string>('all');
    const [startDateFilter, setStartDateFilter] = useState<string>('');
    const [endDateFilter, setEndDateFilter] = useState<string>('');

    // API 데이터 상태
    const [allReservations, setAllReservations] = useState<ReservationMatchingListDto[]>([]);
    const [stats, setStats] = useState<ReservationStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // API에서 데이터 로드
    useEffect(() => {
        loadReservations();
    }, [customerSearch, serviceFilter, matchingStatusFilter, startDateFilter, endDateFilter]);

    const loadReservations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminService.getReservationMatchingList(
                matchingStatusFilter !== 'all' ? matchingStatusFilter : undefined,
                customerSearch || undefined,
                serviceFilter !== 'all' ? serviceFilter : undefined,
                startDateFilter || undefined,
                endDateFilter || undefined
            );
            
            setAllReservations(response.reservations);
            setStats(response.stats);
            setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
        } catch (err: any) {
            setError(err.message || '예약 데이터를 불러오는 중 오류가 발생했습니다.');
            console.error('예약 데이터 로드 오류:', err);
        } finally {
            setLoading(false);
        }
    };

    // 검색 실행 함수
    const handleSearch = () => {
        setCustomerSearch(customerSearchInput);
    };

    // 엔터키 처리
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };


    // 현재는 API에서 필터링된 데이터를 받아오므로 그대로 사용
    const reservations = allReservations;

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

    // 예약의 현재 매칭 상태를 결정하는 함수
    function getCurrentMatchingStatus(reservation: ReservationMatchingListDto) {
        return reservation.matchingStatus;
    }

    // 예약의 최신 매칭 요청을 가져오는 함수
    const getLatestMatchingRequest = (reservation: ReservationMatchingListDto) => {
        return null; // 현재 API에서는 매칭 요청 정보가 없음
    };

    const getReservationStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">예약확정</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">예약대기</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">{status}</Badge>;
        }
    };

    const getMatchingStatusBadge = (status: string) => {
        switch (status) {
            case 'nothing':
                return <Badge className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">요청없음</Badge>;
            case 'ing':
                return <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">매칭중</Badge>;
            case 'fail':
                return <Badge className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">매칭실패</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">{status}</Badge>;
        }
    };

    const openMatchingRequestModal = (reservation: any) => {
        setSelectedReservation(reservation);
        setIsMatchingRequestModalOpen(true);
        setMatchingType('auto');
        setSelectedManagerId('');
        setManagerSearchTerm('');
        setShowManagerDropdown(false);
    };

    const handleCreateMatchingRequest = async () => {
        if (!selectedReservation) return;
        
        if (matchingType === 'manual' && !selectedManagerId) {
            alert('매니저를 선택해주세요.');
            return;
        }

        try {
            const matchingRequest: ManualMatchingRequest = {
                reservationId: selectedReservation.reservationId.toString(),
                managerIds: matchingType === 'manual' ? [selectedManagerId] : [],
                matchingType: matchingType
            };

            await adminService.createManualMatching(matchingRequest);
            
            const action = matchingType === 'auto' ? '자동 매칭 요청' : `매니저 ${selectedManagerId}로 직접 매칭 요청`;
            alert(`예약 ${selectedReservation.reservationId}에 대한 ${action}을 생성했습니다.`);
            
            // 데이터 새로고침
            await loadReservations();
            
            setIsMatchingRequestModalOpen(false);
            setIsDetailModalOpen(false);
        } catch (err: any) {
            alert(err.message || '매칭 요청 생성 중 오류가 발생했습니다.');
            console.error('매칭 요청 오류:', err);
        }
    };

    const handleRetryMatchingRequest = async (reservationId: number) => {
        try {
            await adminService.retryMatching(reservationId.toString());
            alert(`예약 ${reservationId}의 매칭을 재시도했습니다.`);
            
            // 데이터 새로고침
            await loadReservations();
        } catch (err: any) {
            alert(err.message || '매칭 재시도 중 오류가 발생했습니다.');
            console.error('매칭 재시도 오류:', err);
        }
    };

    const handleCancelReservation = async () => {
        let finalCancelReason = '';

        if (cancelReasonType === 'preset1') {
            finalCancelReason = '예약날까지 매칭안됨';
        } else if (cancelReasonType === 'preset2') {
            finalCancelReason = '매칭할 매니저 없음';
        } else {
            if (!cancelReason.trim()) {
                alert('취소 사유를 입력해주세요.');
                return;
            }
            finalCancelReason = cancelReason.trim();
        }

        if (!selectedReservation) {
            alert('예약 정보를 찾을 수 없습니다.');
            return;
        }

        try {
            await adminService.cancelReservation(
                selectedReservation.reservationId.toString(),
                {
                    status: 'CANCEL',
                    reason: finalCancelReason
                }
            );

            // 백엔드에서 응답을 보내주지 않으므로 성공으로 처리
            alert(`예약 ${selectedReservation.reservationId}이(가) 취소되었습니다.`);
            
            // 모달 닫기 및 상태 초기화
            setIsCancelModalOpen(false);
            setCancelReason('');
            setCancelReasonType('preset1');
            setSelectedReservation(null);
            
            // 데이터 새로고침
            await loadReservations();
        } catch (err: any) {
            alert(err.message || '예약 취소 중 오류가 발생했습니다.');
            console.error('예약 취소 오류:', err);
        }
    };

    const openCancelModal = (reservation: ReservationMatchingListDto) => {
        setSelectedReservation(reservation);
        setCancelReason('');
        setCancelReasonType('preset1');
        setIsCancelModalOpen(true);
    };

    const openDetailModal = (reservation: any) => {
        setSelectedReservation(reservation);
        setIsDetailModalOpen(true);
    };

    // 백엔드에서 받은 stats 데이터를 사용하여 통계 계산
    const totalReservations = stats.reduce((sum, stat) => sum + stat.count, 0);
    const ingCount = stats.find(s => s.status === 'ing')?.count || 0;
    const failCount = stats.find(s => s.status === 'fail')?.count || 0;
    const nothingCount = stats.find(s => s.status === 'nothing')?.count || 0;
    const needActionCount = failCount + nothingCount;

    // 매니저 목록 (실제로는 API에서 가져올 데이터)
    const availableManagers = [
        { id: 'M001', name: '김매니저', area: '강남구', phone: '010-1234-5678', rating: 4.8 },
        { id: 'M002', name: '이매니저', area: '서초구', phone: '010-2345-6789', rating: 4.9 },
        { id: 'M003', name: '박매니저', area: '송파구', phone: '010-3456-7890', rating: 4.7 },
        { id: 'M004', name: '최매니저', area: '마포구', phone: '010-4567-8901', rating: 4.6 },
        { id: 'M005', name: '정매니저', area: '용산구', phone: '010-5678-9012', rating: 4.9 },
        { id: 'M006', name: '강매니저', area: '강남구', phone: '010-6789-0123', rating: 4.5 },
        { id: 'M007', name: '윤매니저', area: '서초구', phone: '010-7890-1234', rating: 4.8 },
        { id: 'M008', name: '조매니저', area: '송파구', phone: '010-8901-2345', rating: 4.4 },
    ];

    // 매니저 검색 필터링
    const filteredManagers = availableManagers.filter(manager => 
        manager.name.toLowerCase().includes(managerSearchTerm.toLowerCase()) ||
        manager.area.toLowerCase().includes(managerSearchTerm.toLowerCase()) ||
        manager.id.toLowerCase().includes(managerSearchTerm.toLowerCase())
    );

    const handleManagerSelect = (manager: any) => {
        setSelectedManagerId(manager.id);
        setManagerSearchTerm(manager.name);
        setShowManagerDropdown(false);
    };

    const getSelectedManagerInfo = () => {
        return availableManagers.find(m => m.id === selectedManagerId);
    };

    // 검색/필터 초기화
    const handleResetFilters = () => {
        setCustomerSearch('');
        setCustomerSearchInput('');
        setServiceFilter('all');
        setMatchingStatusFilter('all');
        setStartDateFilter('');
        setEndDateFilter('');
        // 필터 초기화 후 데이터 새로고침
        loadReservations();
    };

    // 서비스 유형 매핑 (현재 사용되지 않음)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const serviceTypeMap: { [key: string]: string } = {
        'all': '전체',
        'cleaning': '청소',
        'laundry': '세탁',
        'organization': '정리정돈'
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">수동매칭 관리</h1>
                <p className="text-gray-600">매칭 전 예약들과 매칭 요청 현황을 확인하고 수동으로 매칭을 처리합니다.</p>
            </div>

            {/* 로딩 및 에러 상태 */}
            {loading && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="text-lg text-gray-600">데이터를 불러오는 중...</div>
                    </CardContent>
                </Card>
            )}

            {error && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="text-lg text-red-600 mb-4">{error}</div>
                        <Button onClick={loadReservations} variant="outline">
                            다시 시도
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* 빠른 필터 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card 
                    className={`cursor-pointer transition-colors ${matchingStatusFilter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                        setMatchingStatusFilter('all');
                        loadReservations();
                    }}
                >
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-gray-800">{totalReservations}</div>
                        <div className="text-sm text-gray-600">전체 예약</div>
                    </CardContent>
                </Card>
                <Card 
                    className={`cursor-pointer transition-colors ${matchingStatusFilter === 'nothing' ? 'ring-2 ring-red-500 bg-red-50' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                        setMatchingStatusFilter('nothing');
                        loadReservations();
                    }}
                >
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-red-600">{nothingCount}</div>
                        <div className="text-sm text-gray-600">요청 없음</div>
                    </CardContent>
                </Card>
                <Card 
                    className={`cursor-pointer transition-colors ${matchingStatusFilter === 'ing' ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                        setMatchingStatusFilter('ing');
                        loadReservations();
                    }}
                >
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-yellow-600">{ingCount}</div>
                        <div className="text-sm text-gray-600">매칭 중</div>
                    </CardContent>
                </Card>
                <Card 
                    className={`cursor-pointer transition-colors ${matchingStatusFilter === 'fail' ? 'ring-2 ring-red-500 bg-red-50' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                        setMatchingStatusFilter('fail');
                        loadReservations();
                    }}
                >
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-red-600">{failCount}</div>
                        <div className="text-sm text-gray-600">매칭 실패</div>
                    </CardContent>
                </Card>
            </div>

            {/* 검색 및 필터 */}
            <Card>
                <CardHeader>
                    <CardTitle>검색 및 필터</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-3">
                            <Label htmlFor="customer-search">고객명 검색</Label>
                            <Input 
                                id="customer-search" 
                                placeholder="고객명 또는 ID를 입력하세요" 
                                value={customerSearchInput} 
                                onChange={(e) => setCustomerSearchInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="mt-1 h-10"
                            />
                        </div>
                        {/* 서비스 유형 필터 */}
                        <div className="col-span-2">
                            <Label htmlFor="service-filter">서비스 유형</Label>
                            <Select value={serviceFilter} onValueChange={(value) => setServiceFilter(value)}>
                                <SelectTrigger className="w-full h-10">
                                    <SelectValue placeholder="서비스 유형을 선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">전체</SelectItem>
                                    <SelectItem value="cleaning">청소</SelectItem>
                                    <SelectItem value="laundry">세탁</SelectItem>
                                    <SelectItem value="organization">정리정돈</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* 매칭상태 필터 */}
                        <div className="col-span-2">
                            <Label htmlFor="matching-status-filter">매칭상태</Label>
                            <Select value={matchingStatusFilter} onValueChange={(value) => setMatchingStatusFilter(value)}>
                                <SelectTrigger className="w-full h-10">
                                    <SelectValue placeholder="매칭상태를 선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">전체</SelectItem>
                                    <SelectItem value="nothing">요청 없음</SelectItem>
                                    <SelectItem value="ing">매칭 중</SelectItem>
                                    <SelectItem value="fail">매칭 실패</SelectItem>
                                </SelectContent>
                            </Select>
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
                                onClick={handleResetFilters}
                                className="w-full h-10"
                            >
                                초기화
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 예약 및 매칭 현황 목록 */}
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>매칭 대기 예약 목록</CardTitle>
                        <p className="text-sm text-gray-600">매칭이 필요한 예약들만 표시됩니다. (매칭 완료된 예약 제외)</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>예약ID</TableHead>
                                <TableHead>고객정보</TableHead>
                                <TableHead>서비스</TableHead>
                                <TableHead>서비스요청일</TableHead>
                                <TableHead>매칭상태</TableHead>
                                <TableHead>시도횟수</TableHead>
                                <TableHead>매니저 현황</TableHead>
                                <TableHead>작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentReservations?.map((reservation) => {
                                const currentStatus = getCurrentMatchingStatus(reservation);
                                
                                return (
                                    <TableRow 
                                        key={reservation?.reservationId}
                                        className={
                                            ['nothing', 'fail'].includes(currentStatus) 
                                                ? 'bg-red-50' 
                                                : currentStatus === 'ing'
                                                ? 'bg-yellow-50'
                                                : ''
                                        }
                                    >
                                        <TableCell className="font-mono">{reservation?.reservationId}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{reservation?.customerName}</div>
                                                <div className="text-sm text-gray-500">고객 ID: {reservation?.customerId}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{reservation?.categoryName}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">{reservation?.reservationDate} {reservation?.reservationTime}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getMatchingStatusBadge(currentStatus)}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium text-blue-600">
                                                    {reservation?.totalRequests}차 시도
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {reservation?.totalRequests > 0 ? `${reservation.totalRequests}회 요청` : '요청 없음'}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium text-green-600">
                                                    응답: {reservation?.totalManagerResponses}명
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    수락: {reservation?.totalManagerAccepts}명
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {currentStatus === 'nothing' && (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => openMatchingRequestModal(reservation)}
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        매칭요청
                                                    </Button>
                                                )}
                                                {currentStatus === 'fail' && (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => handleRetryMatchingRequest(reservation?.reservationId)}
                                                        className="bg-orange-600 hover:bg-orange-700"
                                                    >
                                                        재시도
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => openDetailModal(reservation)}
                                                >
                                                    상세보기
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => openCancelModal(reservation)}
                                                    className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700"
                                                >
                                                    취소
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    
                    {!loading && !error && reservations.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            조건에 맞는 예약이 없습니다.
                        </div>
                    )}
                </CardContent>
            </Card>

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

            {/* 매칭 요청 생성 모달 */}
            <Dialog open={isMatchingRequestModalOpen} onOpenChange={setIsMatchingRequestModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>매칭 요청 생성</DialogTitle>
                    </DialogHeader>
                    {selectedReservation && (
                        <div className="space-y-6">
                                                            <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium mb-2">예약 정보</h3>
                                    <div className="text-sm space-y-1">
                                        <div><span className="font-medium">예약 ID:</span> {selectedReservation.reservationId}</div>
                                        <div><span className="font-medium">고객명:</span> {selectedReservation.customerName}</div>
                                        <div><span className="font-medium">고객 ID:</span> {selectedReservation.customerId}</div>
                                        <div><span className="font-medium">서비스:</span> {selectedReservation.categoryName}</div>
                                        <div><span className="font-medium">서비스요청일:</span> {selectedReservation.reservationDate} {selectedReservation.reservationTime}</div>
                                    </div>
                                </div>
                            
                            <div>
                                <Label className="text-base font-medium">매칭 방식 선택</Label>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="auto"
                                            name="matchingType"
                                            value="auto"
                                            checked={matchingType === 'auto'}
                                            onChange={(e) => setMatchingType(e.target.value as 'auto' | 'manual')}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="auto" className="text-sm">
                                            <span className="font-medium">자동 추천</span>
                                            <div className="text-gray-500">알고리즘이 최적의 매니저를 자동으로 찾아 매칭 요청을 보냅니다.</div>
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="manual"
                                            name="matchingType"
                                            value="manual"
                                            checked={matchingType === 'manual'}
                                            onChange={(e) => setMatchingType(e.target.value as 'auto' | 'manual')}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="manual" className="text-sm">
                                            <span className="font-medium">직접 지정</span>
                                            <div className="text-gray-500">관리자가 직접 매니저를 선택하여 매칭 요청을 보냅니다.</div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            {matchingType === 'manual' && (
                                <div className="relative">
                                    <Label htmlFor="manager-search">매니저 검색 및 선택</Label>
                                    <Input
                                        id="manager-search"
                                        type="text"
                                        placeholder="매니저 이름, 지역, ID로 검색..."
                                        value={managerSearchTerm}
                                        onChange={(e) => {
                                            setManagerSearchTerm(e.target.value);
                                            setShowManagerDropdown(true);
                                            if (!e.target.value) {
                                                setSelectedManagerId('');
                                            }
                                        }}
                                        onFocus={() => setShowManagerDropdown(true)}
                                        className="w-full"
                                    />
                                    
                                    {/* 선택된 매니저 정보 */}
                                    {selectedManagerId && getSelectedManagerInfo() && (
                                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-medium text-blue-900">
                                                        {getSelectedManagerInfo()?.name}
                                                    </div>
                                                    <div className="text-sm text-blue-700">
                                                        {getSelectedManagerInfo()?.area} | ★ {getSelectedManagerInfo()?.rating}
                                                    </div>
                                                    <div className="text-xs text-blue-600">
                                                        {getSelectedManagerInfo()?.phone}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedManagerId('');
                                                        setManagerSearchTerm('');
                                                    }}
                                                    className="text-xs"
                                                >
                                                    변경
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* 검색 결과 드롭다운 */}
                                    {showManagerDropdown && managerSearchTerm && !selectedManagerId && (
                                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                            {filteredManagers.length > 0 ? (
                                                filteredManagers.map((manager) => (
                                                    <div
                                                        key={manager.id}
                                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                        onClick={() => handleManagerSelect(manager)}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {manager.name}
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {manager.area} | 평점: ★ {manager.rating}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    ID: {manager.id} | {manager.phone}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-gray-500 text-center">
                                                    검색 결과가 없습니다.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* 드롭다운 외부 클릭시 닫기 */}
                                    {showManagerDropdown && (
                                        <div 
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowManagerDropdown(false)}
                                        />
                                    )}
                                </div>
                            )}
                            
                            <div className="flex justify-end gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsMatchingRequestModalOpen(false)}
                                >
                                    취소
                                </Button>
                                <Button onClick={handleCreateMatchingRequest}>
                                    매칭 요청 생성
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* 상세보기 모달 */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                    {selectedReservation && (
                        <>
                            <DialogHeader>
                                <DialogTitle>예약 상세정보 및 매칭 요청 히스토리</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 예약 정보 */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">예약 정보</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">예약 ID</Label>
                                            <div className="font-mono">{selectedReservation?.reservationId}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">고객 정보</Label>
                                            <div className="font-medium">{selectedReservation?.customerName}</div>
                                            <div className="text-sm text-gray-600">고객 ID: {selectedReservation?.customerId}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">서비스 유형</Label>
                                            <div>{selectedReservation?.categoryName}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">예약 일시</Label>
                                            <div className="font-medium">{selectedReservation?.reservationDate} {selectedReservation?.reservationTime}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">매칭 상태</Label>
                                            <div>{getMatchingStatusBadge(selectedReservation?.matchingStatus)}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">매칭 요청 횟수</Label>
                                            <div>{selectedReservation?.totalRequests}회</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">매니저 응답</Label>
                                            <div>{selectedReservation?.totalManagerResponses}명</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">매니저 수락</Label>
                                            <div>{selectedReservation?.totalManagerAccepts}명</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">현재 매칭 상태</Label>
                                            <div>{getMatchingStatusBadge(getCurrentMatchingStatus(selectedReservation))}</div>
                                        </div>

                                        {/* 수동 작업 버튼들 */}
                                        <div className="pt-4 space-y-2">
                                            <Label className="text-sm font-medium text-gray-500">수동 작업</Label>
                                            <div className="flex gap-2 flex-wrap">
                                                {getCurrentMatchingStatus(selectedReservation) === 'nothing' && (
                                                    <Button 
                                                        onClick={() => {
                                                            setIsDetailModalOpen(false);
                                                            openMatchingRequestModal(selectedReservation);
                                                        }}
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        첫 매칭 요청 생성
                                                    </Button>
                                                )}
                                                {getCurrentMatchingStatus(selectedReservation) === 'fail' && (
                                                    <Button 
                                                        onClick={() => {
                                                            setIsDetailModalOpen(false);
                                                            openMatchingRequestModal(selectedReservation);
                                                        }}
                                                        className="bg-orange-600 hover:bg-orange-700"
                                                    >
                                                        새 매칭 요청 생성
                                                    </Button>
                                                )}
                                                {getCurrentMatchingStatus(selectedReservation) === 'ing' && (
                                                    <Button variant="outline">
                                                        매칭 진행 중...
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="outline"
                                                    onClick={() => {
                                                        setIsDetailModalOpen(false);
                                                        openCancelModal(selectedReservation);
                                                    }}
                                                    className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700"
                                                >
                                                    예약 취소
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 매칭 요청 히스토리 */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            매칭 요청 히스토리 
                                            <Badge className="ml-2">{selectedReservation?.totalRequests || 0}건</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {!selectedReservation?.totalRequests || selectedReservation.totalRequests === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                아직 매칭 요청이 없습니다.
                                            </div>
                                        ) : (
                                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                                <div className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <div className="font-medium flex items-center gap-2">
                                                                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                                    {selectedReservation.totalRequests}차 시도
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>{getMatchingStatusBadge(selectedReservation.matchingStatus)}</div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <Label className="text-xs text-gray-500">매니저 응답</Label>
                                                            <div>{selectedReservation.totalManagerResponses}명</div>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-gray-500">매니저 수락</Label>
                                                            <div>{selectedReservation.totalManagerAccepts}명</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-2">
                                                        <Label className="text-xs text-gray-500">현재 상태</Label>
                                                        <div className="text-sm">
                                                            {selectedReservation.matchingStatus === 'ing' && '매칭 진행 중'}
                                                            {selectedReservation.matchingStatus === 'fail' && '매칭 실패'}
                                                            {selectedReservation.matchingStatus === 'nothing' && '매칭 요청 없음'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* 예약 취소 모달 */}
            <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>예약 취소</DialogTitle>
                    </DialogHeader>
                    {selectedReservation && (
                        <div className="space-y-6">
                            <div className="bg-red-50 p-4 rounded-lg">
                                <h3 className="font-medium text-red-900 mb-2">취소할 예약 정보</h3>
                                <div className="text-sm space-y-1 text-red-800">
                                    <div><span className="font-medium">예약 ID:</span> {selectedReservation.reservationId}</div>
                                    <div><span className="font-medium">고객명:</span> {selectedReservation.customerName}</div>
                                    <div><span className="font-medium">서비스:</span> {selectedReservation.categoryName}</div>
                                    <div><span className="font-medium">서비스요청일:</span> {selectedReservation.reservationDate} {selectedReservation.reservationTime}</div>
                                </div>
                            </div>
                            
                            <div>
                                <Label className="text-base font-medium">
                                    취소 사유 선택 <span className="text-red-500">*</span>
                                </Label>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="preset1"
                                            name="cancelReasonType"
                                            value="preset1"
                                            checked={cancelReasonType === 'preset1'}
                                            onChange={(e) => setCancelReasonType('preset1')}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="preset1" className="text-sm">
                                            <span className="font-medium">예약날까지 매칭안됨</span>
                                            <div className="text-gray-500">예약 신청한 날이 지났는데도 매칭이 진행되지 않은 경우</div>
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="preset2"
                                            name="cancelReasonType"
                                            value="preset2"
                                            checked={cancelReasonType === 'preset2'}
                                            onChange={(e) => setCancelReasonType('preset2')}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="preset2" className="text-sm">
                                            <span className="font-medium">매칭할 매니저 없음</span>
                                            <div className="text-gray-500">해당 지역이나 서비스에 매칭 가능한 매니저가 없는 경우</div>
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="custom"
                                            name="cancelReasonType"
                                            value="custom"
                                            checked={cancelReasonType === 'custom'}
                                            onChange={(e) => setCancelReasonType('custom')}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="custom" className="text-sm">
                                            <span className="font-medium">직접 입력</span>
                                            <div className="text-gray-500">예약 취소 사유를 직접 입력합니다.</div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            {cancelReasonType === 'custom' && (
                                <div>
                                    <Label htmlFor="cancel-reason" className="text-base font-medium">
                                        취소 사유 입력 <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="cancel-reason"
                                        placeholder="예약 취소 사유를 입력해주세요..."
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        className="mt-2 min-h-[100px]"
                                        maxLength={500}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        {cancelReason.length}/500자
                                    </div>
                                </div>
                            )}

                            <div className="bg-yellow-50 p-3 rounded-lg">
                                <div className="text-sm text-yellow-800">
                                    <strong>주의사항:</strong>
                                    <ul className="mt-1 space-y-1">
                                        <li>• 예약 취소 시 자동으로 환불 처리가 진행됩니다.</li>
                                        <li>• 취소된 예약은 복구할 수 없습니다.</li>
                                        <li>• 고객에게 취소 알림이 발송됩니다.</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setIsCancelModalOpen(false);
                                        setCancelReason('');
                                        setCancelReasonType('preset1');
                                        setSelectedReservation(null);
                                    }}
                                >
                                    취소
                                </Button>
                                <Button 
                                    onClick={handleCancelReservation}
                                    disabled={
                                        cancelReasonType === 'preset1' 
                                            ? false // 미리 정의된 사유는 항상 유효
                                            : cancelReasonType === 'preset2'
                                            ? false // 미리 정의된 사유는 항상 유효
                                            : !cancelReason.trim()
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    예약 취소
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}; 