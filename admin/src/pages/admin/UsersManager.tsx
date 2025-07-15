import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../api/userService';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../../components/ui/table';
import { Search } from 'lucide-react';
import { ManagerListDetailModal } from '../../components/modals/ManagerListDetailModal';

export const UsersManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actualSearchTerm, setActualSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('userId'); // 기본값: userId 오름차순
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [managerDetail, setManagerDetail] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { data: userResponse, isLoading, isFetching } = useQuery({
    queryKey: ['managers', actualSearchTerm, sortBy, currentPage],
    queryFn: () => userService.getManagers(actualSearchTerm, sortBy, currentPage),
    enabled: isInitialized, // 초기화 후에만 실행
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

  // 페이지 로드 시 초기 데이터 로드
  React.useEffect(() => {
    setActualSearchTerm(''); // 빈 문자열로 전체 조회
    setCurrentPage(0); // 페이지 초기화
    setIsInitialized(true); // 초기화 완료
  }, []);

  // 매니저 상세 정보 모달 열기
  const openDetailModal = async (user: any) => {
    setSelectedUser(user);
    setShowDetail(true);
    setIsDetailLoading(true);
    try {
      const detail = await userService.getManagerDetail(user.userId);
      setManagerDetail(detail);
    } catch (err: any) {
      console.error('상세 정보 로드 오류:', err);
      setManagerDetail(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 매니저 상세 정보 모달 닫기
  const handleCloseModal = () => {
    setShowDetail(false);
    setSelectedUser(null);
    setManagerDetail(null);
  };

  // API 응답에서 페이지네이션 정보와 데이터 추출
  const users = userResponse?.content || [];
  const totalPages = userResponse?.totalPages || 0;
  const totalElements = userResponse?.totalElements || 0;

  if (isLoading && !userResponse) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">매니저 관리</h1>
        <p className="text-gray-600 mt-2">매니저 회원을 관리합니다.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
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
            </div>
            <div className="md:w-36">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-10 px-3 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[right_8px_center]"
              >
                <option value="userId">기본</option>
                <option value="userCreatedDate">최근 가입순</option>
                <option value="lastWorkDate">최근 근무순</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            매니저 목록 ({totalElements}명)
            {isFetching && <span className="ml-2 text-sm text-blue-500 animate-pulse">•</span>}
          </CardTitle>
          <CardDescription>등록된 매니저 회원의 정보와 상태를 확인할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%] min-w-[100px]">이름</TableHead>
                  <TableHead className="w-[30%] min-w-[180px]">이메일</TableHead>
                  <TableHead className="w-[20%] min-w-[120px]">전화번호</TableHead>
                  <TableHead className="w-[15%] min-w-[100px]">가입승인일</TableHead>
                  <TableHead className="w-[15%] min-w-[120px] leading-tight">마지막 근무일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.userId} className="cursor-pointer hover:bg-gray-50" onClick={() => openDetailModal(user)}>
                    <TableCell className="w-[20%] min-w-[100px] truncate">{user.userName}</TableCell>
                    <TableCell className="w-[30%] min-w-[180px] truncate">{user.userEmail}</TableCell>
                    <TableCell className="w-[20%] min-w-[120px] truncate">{user.userTel ?? '-'}</TableCell>
                    <TableCell className="w-[15%] min-w-[100px] truncate">{user.approvedAt?.slice(0, 10) ?? user.userCreatedDate?.slice(0, 10) ?? '-'}</TableCell>
                    <TableCell className="w-[15%] min-w-[120px] truncate">{user.lastWorkDate?.slice(0, 10) ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
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
        </CardContent>
      </Card>
      
      {/* 매니저 상세정보 모달 */}
      <ManagerListDetailModal
        isOpen={showDetail}
        onClose={handleCloseModal}
        managerData={managerDetail}
        loading={isDetailLoading}
        selectedUser={selectedUser}
      />
    </div>
  );
}; 