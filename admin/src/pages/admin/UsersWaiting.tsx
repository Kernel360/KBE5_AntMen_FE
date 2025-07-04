import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../api/userService';
import { Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ManagerDetailModal } from "../../components/modals/ManagerDetailModal";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'WAITING':
      return <Badge className="bg-blue-100 text-blue-800 whitespace-nowrap">신규</Badge>;
    case 'REAPPLY':
      return <Badge className="bg-orange-100 text-orange-800 whitespace-nowrap">재신청</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 whitespace-nowrap">{status}</Badge>;
  }
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-';
  return dateString.slice(0, 16).replace('T', ' '); // YYYY-MM-DD HH:mm
};

export const UsersWaiting: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actualSearchTerm, setActualSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [managerDetail, setManagerDetail] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const queryClient = useQueryClient();

  // 목록 조회
  const { data: userResponse, isLoading, isFetching } = useQuery({
    queryKey: ['waiting-managers', actualSearchTerm, currentPage],
    queryFn: () => userService.getWaitingManagers(actualSearchTerm, currentPage),
    enabled: !!actualSearchTerm || actualSearchTerm === '', // 검색어가 설정되면 자동 실행
    placeholderData: (previousData) => previousData, // 이전 데이터 유지로 깜빡임 방지
  });

  // 검색 실행 함수
  const handleSearch = () => {
    setActualSearchTerm(searchTerm);
    setCurrentPage(0);
  };

  // 엔터키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 페이지 로드 시 초기 검색어 설정 (빈 문자열로 전체 조회)
  React.useEffect(() => {
    if (actualSearchTerm === '' && searchTerm === '') {
      setActualSearchTerm('');
    }
  }, [actualSearchTerm, searchTerm]);

  // 상세 정보 조회
  const { data: managerDetailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ['manager-detail', selectedUserId],
    queryFn: () => selectedUserId ? userService.getWaitingManagerDetail(selectedUserId) : null,
    enabled: !!selectedUserId,
  });

  // 상세 정보가 로드되면 상태 업데이트
  useEffect(() => {
    if (managerDetailData && selectedUserId) {
      setManagerDetail({
        ...managerDetailData,
        userId: selectedUserId
      });
    }
  }, [managerDetailData, selectedUserId]);

  // API 응답에서 페이지네이션 정보와 데이터 추출
  const users = (userResponse as any)?.content || [];
  const totalPages = (userResponse as any)?.totalPages || 0;
  const totalElements = (userResponse as any)?.totalElements || 0;

  const handleOpenModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
    setManagerDetail(null);
  };

  const handleApprove = async (userId: number) => {
    try {
      await userService.approveManager(userId);
      alert("매니저 승인이 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['waiting-managers'] });
      handleCloseModal();
    } catch (error) {
      console.error('승인 실패:', error);
      alert("매니저 승인 중 오류가 발생했습니다.");
    }
  };

  const handleReject = async (userId: number, reason: string) => {
    try {
      await userService.rejectManager(userId, reason);
      alert("매니저 신청이 거절되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['waiting-managers'] });
      handleCloseModal();
    } catch (error) {
      console.error("Error rejecting manager:", error);
      alert("매니저 거절 중 오류가 발생했습니다.");
    }
  };

  if (isLoading && !userResponse) return <div>로딩 중...</div>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>승인 대기 매니저 관리</CardTitle>
          <CardDescription>승인 대기 중인 매니저 회원을 검색하고 관리할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="이름으로 검색... (엔터키로 검색)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            승인 대기 매니저 목록 ({totalElements}명)
            {isFetching && <span className="ml-2 text-sm text-blue-500 animate-pulse">•</span>}
          </CardTitle>
          <CardDescription>승인 대기 중인 매니저 회원의 정보와 상태를 확인하고 승인/거절할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {isFetching && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-gray-600">로딩 중...</span>
                </div>
              </div>
            )}
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>나이/성별</TableHead>
                <TableHead>주소</TableHead>
                <TableHead>신청일시</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>   </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>
                    {user.userAge !== undefined && user.userAge !== null ? `${user.userAge}세` : ''} 
                    {user.userGender ? `/ ${user.userGender}` : '-'}
                  </TableCell>
                  <TableCell>{user.userAddress ?? '-'}</TableCell>
                  <TableCell>{formatDateTime(user.userCreatedAt)}</TableCell>
                  <TableCell>{getStatusBadge(user.managerStatus)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(user.userId)}
                    >
                      승인/거절
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="h-8 px-3 text-sm disabled:opacity-50"
                >
                  이전
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                    const isActive = currentPage === pageNum;
                    return (
                      <Button
                        key={pageNum}
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 p-0 text-sm ${
                          isActive
                            ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="h-8 px-3 text-sm disabled:opacity-50"
                >
                  다음
                </Button>
              </div>
            </div>
                      )}
          </div>
        </CardContent>
      </Card>

      <ManagerDetailModal
        isOpen={isModalOpen && !!managerDetail}
        onClose={handleCloseModal}
        managerData={managerDetail}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* 로딩 상태 표시 */}
      {isModalOpen && isDetailLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div>상세 정보를 불러오는 중...</div>
          </div>
        </div>
      )}
    </>
  );
}; 