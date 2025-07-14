import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, Calendar } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { ReservationMatchingListDto, ManualMatchingRequest, ReservationStats } from '../../api/types';
import ReservationDetailModal from '../../components/modals/ReservationDetailModal';
import ReservationCancelModal from '../../components/modals/ReservationCancelModal';
import MatchingRequestModal from '../../components/modals/MatchingRequestModal';
import NewCandidateModal from '../../components/modals/NewCandidateModal';

const ITEMS_PER_PAGE = 15;

export const ManualMatching: React.FC = () => {
    const [selectedReservation, setSelectedReservation] = useState<ReservationMatchingListDto | null>(null);
    const [reservationDetail, setReservationDetail] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isMatchingRequestModalOpen, setIsMatchingRequestModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isManagerChangeModalOpen, setIsManagerChangeModalOpen] = useState(false);
    const [isNewCandidateModalOpen, setIsNewCandidateModalOpen] = useState(false);

    const [cancelModalSource, setCancelModalSource] = useState<'list' | 'detail'>('list');
    const [matchingType, setMatchingType] = useState<'auto' | 'manual'>('auto');
    const [selectedManagerId, setSelectedManagerId] = useState<string>('');
    const [managerSearchTerm, setManagerSearchTerm] = useState<string>('');
    const [showManagerDropdown, setShowManagerDropdown] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    
    // 검색 및 필터 상태
    const [customerSearch, setCustomerSearch] = useState<string>('');
    const [customerSearchInput, setCustomerSearchInput] = useState<string>(''); // 실제 입력값
    const [serviceSearch, setServiceSearch] = useState<string>('');
    const [serviceSearchInput, setServiceSearchInput] = useState<string>(''); // 실제 입력값
    const [matchingStatusFilter, setMatchingStatusFilter] = useState<string>('all');
    const [startDateFilter, setStartDateFilter] = useState<string>('');
    const [endDateFilter, setEndDateFilter] = useState<string>('');

    // API 데이터 상태
    const [allReservations, setAllReservations] = useState<ReservationMatchingListDto[]>([]);
    const [stats, setStats] = useState<ReservationStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // 상태 변경 추적을 위한 플래그
    const [needsRefresh, setNeedsRefresh] = useState(false);

    // API에서 데이터 로드
    const loadReservations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminService.getReservationMatchingList(
                matchingStatusFilter !== 'all' ? matchingStatusFilter : undefined,
                customerSearch || undefined,
                serviceSearch || undefined,
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
    }, [matchingStatusFilter, customerSearch, serviceSearch, startDateFilter, endDateFilter]);

    useEffect(() => {
        loadReservations();
    }, [loadReservations]);

    // 검색 실행 함수
    const handleSearch = useCallback(() => {
        setCustomerSearch(customerSearchInput);
        setServiceSearch(serviceSearchInput);
    }, [customerSearchInput, serviceSearchInput]);

    // 엔터키 처리
    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);


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

    // 고객 수락 처리
    const handleAcceptMatching = async (matchingId: string) => {
        try {
            await adminService.acceptMatching(matchingId);
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
            
            alert('고객 수락이 완료되었습니다.');
        } catch (err: any) {
            alert(err.message || '고객 수락 처리 중 오류가 발생했습니다.');
            console.error('고객 수락 오류:', err);
        }
    };

    const handleCancelReservation = async (reservationId: string, cancelData: { status: string; reason: string }) => {
        try {
            await adminService.cancelReservation(reservationId, cancelData);
            
            // 백엔드에서 응답을 보내주지 않으므로 성공으로 처리
            alert(`예약 ${reservationId}이(가) 취소되었습니다.`);
            
            // 상태 변경 플래그 설정
            setNeedsRefresh(true);
        } catch (err: any) {
            alert(err.message || '예약 취소 중 오류가 발생했습니다.');
            console.error('예약 취소 오류:', err);
        }
    };

    const openCancelModal = (reservation: ReservationMatchingListDto, source: 'list' | 'detail' = 'list') => {
        setSelectedReservation(reservation);
        setCancelModalSource(source);
        setIsCancelModalOpen(true);
    };

    const openManagerChangeModal = (reservation: any) => {
        setSelectedReservation(reservation);
        setIsManagerChangeModalOpen(true);
    };

    // 새 후보 만들기 모달 열기
    const openNewCandidateModal = (reservation: any) => {
        setSelectedReservation(reservation);
        setIsNewCandidateModalOpen(true);
    };

    // 새 후보 만들기 처리
    const handleCreateNewCandidate = async (type: 'manual' | 'auto', managerId?: string) => {
        if (!selectedReservation) return;

        try {
            if (type === 'auto') {
                await adminService.createAutoCandidate(selectedReservation.reservationId.toString());
            } else {
                if (!managerId) {
                    alert('매니저를 선택해주세요.');
                    return;
                }
                await adminService.createManualCandidate(selectedReservation.reservationId.toString(), managerId);
            }
            
            const action = type === 'auto' ? '자동 추천으로 새 후보 3명' : '직접 지정으로 새 후보 1명';
            alert(`예약 ${selectedReservation.reservationId}에 대한 ${action}을 생성했습니다.`);
            
            // 모달 닫기 및 상태 변경 플래그 설정
            setIsNewCandidateModalOpen(false);
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
        } catch (err: any) {
            alert(err.message || '새 후보 생성 중 오류가 발생했습니다.');
            console.error('새 후보 생성 오류:', err);
        }
    };

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

    // 상세 모달에서 실제 매칭 상태 계산
    const getActualMatchingStatus = (matchingList: any[]) => {
        if (!matchingList || matchingList.length === 0) {
            return 'nothing'; // 매칭 없음
        }

        // 요청이 보내진 매칭이 있는지 확인
        const hasRequested = matchingList.some((matching: any) => matching.isRequested);
        
        if (!hasRequested) {
            return 'nothing'; // 요청이 없음
        }

        // 모든 요청이 거절당했는지 확인
        const allRejected = matchingList
            .filter((matching: any) => matching.isRequested) // 요청이 보내진 것만
            .every((matching: any) => matching.isAccepted === false); // 모두 거절

        if (allRejected) {
            return 'fail'; // 매칭 실패
        }

        return 'ing'; // 매칭 중
    };

    // 검색/필터 초기화
    const handleResetFilters = useCallback(() => {
        setCustomerSearch('');
        setCustomerSearchInput('');
        setServiceSearch('');
        setServiceSearchInput('');
        setMatchingStatusFilter('all');
        setStartDateFilter('');
        setEndDateFilter('');
    }, []);

    // 서비스 유형 매핑 (현재 사용되지 않음)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const serviceTypeMap: { [key: string]: string } = {
        'all': '전체',
        'cleaning': '청소',
        'laundry': '세탁',
        'organization': '정리정돈'
    };

    // openDetailModal 함수 복구
    const openDetailModal = async (reservation: any) => {
        setSelectedReservation(reservation);
        setIsDetailModalOpen(true);
        setDetailLoading(true);
        try {
            const detail = await adminService.getReservationDetail(reservation.reservationId.toString());
            setReservationDetail(detail);
        } catch (err: any) {
            setReservationDetail(null);
        } finally {
            setDetailLoading(false);
        }
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
            <div>
                <h1 className="text-2xl font-bold text-gray-900">수동매칭 관리</h1>
                <p className="text-gray-600">매칭 전 예약들과 매칭 요청 현황을 확인하고 수동으로 매칭을 처리합니다.</p>
            </div>

            {/* 빠른 필터 카드 */}
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
                        {/* 서비스 이름 검색 */}
                        <div className="col-span-3">
                            <Label htmlFor="service-search">서비스 이름</Label>
                            <Input 
                                id="service-search" 
                                placeholder="서비스 이름을 입력하세요" 
                                value={serviceSearchInput} 
                                onChange={(e) => setServiceSearchInput(e.target.value)}
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
                                onClick={handleSearch}
                                className="w-full h-10"
                            >
                                검색
                            </Button>
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
                                <TableHead>예약 신청일</TableHead>
                                <TableHead>서비스요청일</TableHead>
                                <TableHead>매칭상태</TableHead>
                                <TableHead>요청횟수</TableHead>
                                <TableHead>매니저 응답</TableHead>
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
                                                <div className="font-medium">
                                                    {reservation?.reservationCreatedAt ? 
                                                        new Date(reservation.reservationCreatedAt).toLocaleDateString('ko-KR', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit'
                                                        }) : '-'
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {reservation?.reservationCreatedAt ? 
                                                        new Date(reservation.reservationCreatedAt).toLocaleTimeString('ko-KR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : '-'
                                                    }
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">
                                                    {reservation?.reservationDate ? 
                                                        new Date(reservation.reservationDate).toLocaleDateString('ko-KR', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit'
                                                        }) : '-'
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {reservation?.reservationTime ? 
                                                        (() => {
                                                            const [hours, minutes] = reservation.reservationTime.split(':').map(Number);
                                                            const period = hours >= 12 ? '오후' : '오전';
                                                            const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                                                            return `${period} ${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                                                        })()
                                                        : '-'
                                                    }
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getMatchingStatusBadge(currentStatus)}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="text-sm font-medium text-blue-600">
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
                                                    onClick={() => openCancelModal(reservation, 'list')}
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

            {/* 매칭 수정 모달 */}
            <MatchingRequestModal
                open={isMatchingRequestModalOpen}
                onClose={() => setIsMatchingRequestModalOpen(false)}
                reservation={selectedReservation}
                reservationDetail={reservationDetail}
                onAcceptMatching={handleAcceptMatching}
                onSendMatchingRequest={async (matchingId: string) => {
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
                }}
                onCreateNewCandidate={() => {
                    openNewCandidateModal(selectedReservation);
                }}
            />

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
                onSendMatchingRequest={async (matchingId: string) => {
                    try {
                        await adminService.sendMatchingRequest(matchingId);
                        
                        // 상태 변경 플래그 설정
                        setNeedsRefresh(true);
                        
                        // 상세 정보 새로고침
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
                }}
                onCreateNewCandidate={() => {
                    openNewCandidateModal(selectedReservation);
                }}
            />

            {/* 예약 취소 모달 */}
            <ReservationCancelModal
                open={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                reservation={selectedReservation}
                onCancel={handleCancelReservation}
                source={cancelModalSource}
            />

            {/* 새 후보 만들기 모달 */}
            <NewCandidateModal
                open={isNewCandidateModalOpen}
                onClose={() => setIsNewCandidateModalOpen(false)}
                reservation={selectedReservation}
                onConfirm={handleCreateNewCandidate}
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