import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export const ManualMatching: React.FC = () => {
    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isMatchingRequestModalOpen, setIsMatchingRequestModalOpen] = useState(false);
    const [matchingType, setMatchingType] = useState<'auto' | 'manual'>('auto');
    const [selectedManagerId, setSelectedManagerId] = useState<string>('');
    const [managerSearchTerm, setManagerSearchTerm] = useState<string>('');
    const [showManagerDropdown, setShowManagerDropdown] = useState(false);
    
    // 검색 및 필터 상태
    const [customerSearch, setCustomerSearch] = useState<string>('');
    const [serviceFilter, setServiceFilter] = useState<string>('all');
    const [matchingStatusFilter, setMatchingStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('');

    // 매칭 전 예약 데이터 (실제로는 API에서 가져올 데이터)
    const allReservations = [
        {
            id: 'R001',
            customerName: '김고객',
            customerId: 'C1001',
            serviceType: '청소',
            address: '서울시 강남구 테헤란로 123',
            scheduledTime: '2024-01-16 10:00',
            createdAt: '2024-01-15 09:30',
            status: 'confirmed',
            matchingRequests: []
        },
        {
            id: 'R002',
            customerName: '이고객',
            customerId: 'C1002',
            serviceType: '세탁',
            address: '서울시 서초구 강남대로 456',
            scheduledTime: '2024-01-16 14:00',
            createdAt: '2024-01-15 11:00',
            status: 'confirmed',
            matchingRequests: [
                {
                    id: 'MR001',
                    status: 'pending',
                    requestedAt: '2024-01-15 11:30',
                    candidateCount: 2,
                    reason: '매칭 진행 중',
                    managerIds: ['M001', 'M002']
                }
            ]
        },
        {
            id: 'R003',
            customerName: '박고객',
            customerId: 'C1003',
            serviceType: '정리정돈',
            address: '서울시 송파구 올림픽로 789',
            scheduledTime: '2024-01-16 16:00',
            createdAt: '2024-01-15 13:15',
            status: 'confirmed',
            matchingRequests: [
                {
                    id: 'MR002',
                    status: 'failed',
                    requestedAt: '2024-01-15 13:45',
                    candidateCount: 0,
                    reason: '해당 지역 매니저 부족',
                    managerIds: []
                },
                {
                    id: 'MR003',
                    status: 'failed',
                    requestedAt: '2024-01-15 15:00',
                    candidateCount: 1,
                    reason: '매니저 응답 없음',
                    managerIds: ['M003']
                },
                {
                    id: 'MR004',
                    status: 'pending',
                    requestedAt: '2024-01-15 16:30',
                    candidateCount: 2,
                    reason: '매칭 진행 중 (3차 시도)',
                    managerIds: ['M004', 'M005']
                }
            ]
        },
        {
            id: 'R004',
            customerName: '최고객',
            customerId: 'C1004',
            serviceType: '청소',
            address: '서울시 마포구 홍대입구',
            scheduledTime: '2024-01-16 18:00',
            createdAt: '2024-01-15 15:20',
            status: 'confirmed',
            matchingRequests: []
        },
        {
            id: 'R005',
            customerName: '정고객',
            customerId: 'C1005',
            serviceType: '세탁',
            address: '서울시 용산구 한강대로',
            scheduledTime: '2024-01-17 09:00',
            createdAt: '2024-01-15 16:00',
            status: 'confirmed',
            matchingRequests: [
                {
                    id: 'MR005',
                    status: 'failed',
                    requestedAt: '2024-01-15 16:30',
                    candidateCount: 0,
                    reason: '매니저 부족',
                    managerIds: []
                },
                {
                    id: 'MR006',
                    status: 'matched',
                    requestedAt: '2024-01-15 17:00',
                    candidateCount: 1,
                    reason: '매칭 완료',
                    managerIds: ['M006'],
                    matchedManagerId: 'M006'
                }
            ]
        },
        {
            id: 'R006',
            customerName: '강민수',
            customerId: 'C1006',
            serviceType: '청소',
            address: '서울시 강남구 역삼동',
            scheduledTime: '2024-01-17 11:00',
            createdAt: '2024-01-16 09:00',
            status: 'confirmed',
            matchingRequests: [
                {
                    id: 'MR007',
                    status: 'failed',
                    requestedAt: '2024-01-16 09:30',
                    candidateCount: 1,
                    reason: '매니저 거절',
                    managerIds: ['M002']
                }
            ]
        },
        {
            id: 'R007',
            customerName: '윤서영',
            customerId: 'C1007',
            serviceType: '정리정돈',
            address: '서울시 서초구 서초동',
            scheduledTime: '2024-01-17 14:00',
            createdAt: '2024-01-16 10:30',
            status: 'pending',
            matchingRequests: []
        },
        {
            id: 'R008',
            customerName: '조현우',
            customerId: 'C1008',
            serviceType: '세탁',
            address: '서울시 송파구 잠실동',
            scheduledTime: '2024-01-18 10:00',
            createdAt: '2024-01-16 12:00',
            status: 'confirmed',
            matchingRequests: [
                {
                    id: 'MR008',
                    status: 'pending',
                    requestedAt: '2024-01-16 12:30',
                    candidateCount: 3,
                    reason: '매칭 진행 중',
                    managerIds: ['M003', 'M005', 'M008']
                }
            ]
        },
        {
            id: 'R009',
            customerName: '한지민',
            customerId: 'C1009',
            serviceType: '청소',
            address: '서울시 마포구 상수동',
            scheduledTime: '2024-01-18 15:00',
            createdAt: '2024-01-16 14:20',
            status: 'confirmed',
            matchingRequests: []
        },
        {
            id: 'R010',
            customerName: '신동엽',
            customerId: 'C1010',
            serviceType: '정리정돈',
            address: '서울시 용산구 이태원동',
            scheduledTime: '2024-01-19 09:00',
            createdAt: '2024-01-16 16:45',
            status: 'confirmed',
            matchingRequests: [
                {
                    id: 'MR009',
                    status: 'failed',
                    requestedAt: '2024-01-16 17:00',
                    candidateCount: 0,
                    reason: '가능한 매니저 없음',
                    managerIds: []
                },
                {
                    id: 'MR010',
                    status: 'failed',
                    requestedAt: '2024-01-16 18:00',
                    candidateCount: 2,
                    reason: '매니저 모두 거절',
                    managerIds: ['M004', 'M007']
                }
            ]
        }
    ];

    // 매칭 완료된 예약 제외
    const allFilteredReservations = allReservations.filter(r => getCurrentMatchingStatus(r) !== 'matched');
    
    // 검색 및 필터 적용
    const reservations = allFilteredReservations.filter(reservation => {
        // 고객명 검색
        const matchesCustomerSearch = !customerSearch || 
            reservation.customerName?.toLowerCase().includes(customerSearch.toLowerCase()) ||
            reservation.customerId?.toLowerCase().includes(customerSearch.toLowerCase());
        
        // 서비스 유형 필터
        const matchesServiceFilter = serviceFilter === 'all' || 
            reservation.serviceType === (serviceFilter === 'cleaning' ? '청소' : 
                                        serviceFilter === 'laundry' ? '세탁' : 
                                        serviceFilter === 'organization' ? '정리정돈' : 
                                        serviceFilter);
        
        // 매칭 상태 필터
        const currentStatus = getCurrentMatchingStatus(reservation);
        const matchesStatusFilter = matchingStatusFilter === 'all' || 
            currentStatus === matchingStatusFilter;
        
        // 예약일 필터
        const matchesDateFilter = !dateFilter || 
            reservation.scheduledTime?.startsWith(dateFilter);
        
        return matchesCustomerSearch && matchesServiceFilter && matchesStatusFilter && matchesDateFilter;
    });

    // 예약의 현재 매칭 상태를 결정하는 함수
    function getCurrentMatchingStatus(reservation: any) {
        if (!reservation?.matchingRequests || reservation.matchingRequests.length === 0) {
            return 'none';
        }
        
        // 가장 최근 매칭 요청의 상태를 반환
        const latestRequest = reservation.matchingRequests[reservation.matchingRequests.length - 1];
        return latestRequest?.status || 'none';
    }

    // 예약의 최신 매칭 요청을 가져오는 함수
    const getLatestMatchingRequest = (reservation: any) => {
        if (!reservation?.matchingRequests || reservation.matchingRequests.length === 0) {
            return null;
        }
        return reservation.matchingRequests[reservation.matchingRequests.length - 1];
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
            case 'none':
                return <Badge className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">요청없음</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">매칭중</Badge>;
            case 'failed':
                return <Badge className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">매칭실패</Badge>;
            case 'matched':
                return <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">매칭완료</Badge>;
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

    const handleCreateMatchingRequest = () => {
        if (!selectedReservation) return;
        
        if (matchingType === 'manual' && !selectedManagerId) {
            alert('매니저를 선택해주세요.');
            return;
        }

        // 실제로는 API 호출로 매칭 요청을 생성
        const action = matchingType === 'auto' ? '자동 매칭 요청' : `매니저 ${selectedManagerId}로 직접 매칭 요청`;
        console.log('매칭 요청 생성:', selectedReservation.id, action);
        alert(`예약 ${selectedReservation.id}에 대한 ${action}을 생성했습니다.`);
        
        setIsMatchingRequestModalOpen(false);
        setIsDetailModalOpen(false);
    };

    const handleRetryMatchingRequest = (reservationId: string) => {
        const reservation = reservations.find(r => r.id === reservationId);
        if (reservation) {
            openMatchingRequestModal(reservation);
        }
    };

    const openDetailModal = (reservation: any) => {
        setSelectedReservation(reservation);
        setIsDetailModalOpen(true);
    };

    // 통계 계산 (매칭 완료 제외)
    const stats = {
        total: reservations?.length || 0,
        noRequest: reservations?.filter(r => getCurrentMatchingStatus(r) === 'none').length || 0,
        pending: reservations?.filter(r => getCurrentMatchingStatus(r) === 'pending').length || 0,
        failed: reservations?.filter(r => getCurrentMatchingStatus(r) === 'failed').length || 0,
        needAction: reservations?.filter(r => ['none', 'failed'].includes(getCurrentMatchingStatus(r))).length || 0
    };

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
        setServiceFilter('all');
        setMatchingStatusFilter('all');
        setDateFilter('');
    };

    // Select 컴포넌트의 안전한 value 처리
    const safeServiceFilter = serviceFilter || 'all';
    const safeMatchingStatusFilter = matchingStatusFilter || 'all';

    // 서비스 유형 매핑
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

            {/* 빠른 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                        <div className="text-sm text-gray-600">전체 예약</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-red-600">{stats.noRequest}</div>
                        <div className="text-sm text-gray-600">요청 없음</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <div className="text-sm text-gray-600">매칭 중</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                        <div className="text-sm text-gray-600">매칭 실패</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">{stats.needAction}</div>
                        <div className="text-sm text-gray-600">조치 필요</div>
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
                        <div className="col-span-4">
                            <Label htmlFor="customer-search">고객명 검색</Label>
                            <Input 
                                id="customer-search" 
                                placeholder="고객명 또는 ID를 입력하세요" 
                                value={customerSearch} 
                                onChange={(e) => setCustomerSearch(e.target.value)}
                                className="mt-1 h-10"
                            />
                        </div>
                        {/* 서비스 유형 필터 */}
                        <div className="col-span-2">
                            <Label htmlFor="service-filter">서비스 유형</Label>
                            <select 
                                id="service-filter"
                                value={safeServiceFilter} 
                                onChange={(e) => setServiceFilter(e.target.value)}
                                className="
                                    mt-1 h-10 w-full 
                                    rounded-md border border-input bg-background 
                                    px-3 py-2 text-sm 
                                    appearance-none 
                                    bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] 
                                    bg-no-repeat bg-center
                                    bg-[position:calc(100%-8px)_center]
                                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                                "
                            >
                                <option value="all">전체</option>
                                <option value="cleaning">청소</option>
                                <option value="laundry">세탁</option>
                                <option value="organization">정리정돈</option>
                            </select>
                        </div>
                        
                        {/* 매칭상태 필터 */}
                        <div className="col-span-2">
                            <Label htmlFor="matching-status-filter">매칭상태</Label>
                            <select 
                                id="matching-status-filter"
                                value={safeMatchingStatusFilter} 
                                onChange={(e) => setMatchingStatusFilter(e.target.value)}
                                className="
                                    mt-1 h-10 w-full 
                                    rounded-md border border-input bg-background 
                                    px-3 py-2 text-sm 
                                    appearance-none 
                                    bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] 
                                    bg-no-repeat bg-center
                                    bg-[position:calc(100%-8px)_center]
                                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                                "
                            >
                                <option value="all">전체</option>
                                <option value="none">요청 없음</option>
                                <option value="pending">매칭 중</option>
                                <option value="failed">매칭 실패</option>
                            </select>
                        </div>
                        
                        {/* 예약일 필터 */}
                        <div className="col-span-2">
                            <Label htmlFor="date-filter">예약일</Label>
                            <Input 
                                id="date-filter" 
                                type="date" 
                                value={dateFilter} 
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="
                                    mt-1 h-10
                                    [&::-webkit-calendar-picker-indicator]:ml-auto
                                    [&::-webkit-calendar-picker-indicator]:mr-2
                                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                                "
                            />
                        </div>
                        <div className="col-span-2">
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
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>매칭 대기 예약 목록</CardTitle>
                            <p className="text-sm text-gray-600">매칭이 필요한 예약들만 표시됩니다. (매칭 완료된 예약 제외)</p>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">{reservations.length}건</div>
                            <div className="text-sm text-gray-500">
                                {allFilteredReservations.length > reservations.length && 
                                    `전체 ${allFilteredReservations.length}건 중`
                                }
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>예약ID</TableHead>
                                <TableHead>고객정보</TableHead>
                                <TableHead>서비스</TableHead>
                                <TableHead>예약일시</TableHead>
                                <TableHead>매칭상태</TableHead>
                                <TableHead>시도횟수</TableHead>
                                <TableHead>최신현황</TableHead>
                                <TableHead>작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reservations?.map((reservation) => {
                                const currentStatus = getCurrentMatchingStatus(reservation);
                                const latestRequest = getLatestMatchingRequest(reservation);
                                const matchingRequestsLength = reservation?.matchingRequests?.length || 0;
                                
                                return (
                                    <TableRow 
                                        key={reservation?.id}
                                        className={
                                            ['none', 'failed'].includes(currentStatus) 
                                                ? 'bg-red-50' 
                                                : currentStatus === 'pending'
                                                ? 'bg-yellow-50'
                                                : ''
                                        }
                                    >
                                        <TableCell className="font-mono">{reservation?.id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{reservation?.customerName}</div>
                                                <div className="text-sm text-gray-500">{reservation?.customerId}</div>
                                                <div className="text-xs text-gray-400">{reservation?.address}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{reservation?.serviceType}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">{reservation?.scheduledTime}</div>
                                                <div className="text-gray-500">생성: {reservation?.createdAt}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getMatchingStatusBadge(currentStatus)}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium text-blue-600">
                                                    {matchingRequestsLength}차 시도
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {matchingRequestsLength > 0 
                                                        ? `총 ${matchingRequestsLength}회 요청`
                                                        : '요청 없음'
                                                    }
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {latestRequest ? (
                                                <div className="text-sm">
                                                    <div className="font-mono text-xs">{latestRequest.id}</div>
                                                    <div>후보: {latestRequest.candidateCount}명</div>
                                                    <div className="text-gray-500 text-xs">
                                                        {latestRequest.requestedAt}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {currentStatus === 'none' && (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => openMatchingRequestModal(reservation)}
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        매칭요청
                                                    </Button>
                                                )}
                                                {currentStatus === 'failed' && (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => handleRetryMatchingRequest(reservation?.id)}
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
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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
                                    <div><span className="font-medium">예약 ID:</span> {selectedReservation.id}</div>
                                    <div><span className="font-medium">고객:</span> {selectedReservation.customerName}</div>
                                    <div><span className="font-medium">서비스:</span> {selectedReservation.serviceType}</div>
                                    <div><span className="font-medium">예약일시:</span> {selectedReservation.scheduledTime}</div>
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
                                            <div className="font-mono">{selectedReservation?.id}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">고객 정보</Label>
                                            <div className="font-medium">{selectedReservation?.customerName}</div>
                                            <div className="text-sm text-gray-600">{selectedReservation?.customerId}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">서비스 유형</Label>
                                            <div>{selectedReservation?.serviceType}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">서비스 주소</Label>
                                            <div>{selectedReservation?.address}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">예약 일시</Label>
                                            <div className="font-medium">{selectedReservation?.scheduledTime}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">예약 생성일</Label>
                                            <div>{selectedReservation?.createdAt}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">예약 상태</Label>
                                            <div>{getReservationStatusBadge(selectedReservation?.status)}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">현재 매칭 상태</Label>
                                            <div>{getMatchingStatusBadge(getCurrentMatchingStatus(selectedReservation))}</div>
                                        </div>

                                        {/* 수동 작업 버튼들 */}
                                        <div className="pt-4 space-y-2">
                                            <Label className="text-sm font-medium text-gray-500">수동 작업</Label>
                                            <div className="flex gap-2">
                                                {getCurrentMatchingStatus(selectedReservation) === 'none' && (
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
                                                {getCurrentMatchingStatus(selectedReservation) === 'failed' && (
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
                                                {getCurrentMatchingStatus(selectedReservation) === 'pending' && (
                                                    <Button variant="outline">
                                                        매칭 진행 중...
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 매칭 요청 히스토리 */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            매칭 요청 히스토리 
                                            <Badge className="ml-2">{selectedReservation?.matchingRequests?.length || 0}건</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {!selectedReservation?.matchingRequests || selectedReservation.matchingRequests.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                아직 매칭 요청이 없습니다.
                                            </div>
                                        ) : (
                                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                                {selectedReservation.matchingRequests.map((request: any, index: number) => (
                                                    <div key={request?.id || index} className="border rounded-lg p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <div className="font-medium flex items-center gap-2">
                                                                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                                        {index + 1}차 시도
                                                                    </span>
                                                                    <span className="font-mono text-sm">{request?.id}</span>
                                                                </div>
                                                            </div>
                                                            <div>{getMatchingStatusBadge(request?.status)}</div>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <Label className="text-xs text-gray-500">요청 시간</Label>
                                                                <div>{request?.requestedAt}</div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-gray-500">후보 매니저</Label>
                                                                <div>{request?.candidateCount || 0}명</div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mt-2">
                                                            <Label className="text-xs text-gray-500">상태 설명</Label>
                                                            <div className="text-sm">{request?.reason}</div>
                                                        </div>
                                                        
                                                        {request?.managerIds && request.managerIds.length > 0 && (
                                                            <div className="mt-2">
                                                                <Label className="text-xs text-gray-500">매니저 ID 목록</Label>
                                                                <div className="text-sm font-mono">
                                                                    {request.managerIds.join(', ')}
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {request?.matchedManagerId && (
                                                            <div className="mt-2">
                                                                <Label className="text-xs text-gray-500">매칭된 매니저</Label>
                                                                <div className="text-sm font-mono text-green-600">
                                                                    {request.matchedManagerId}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}; 