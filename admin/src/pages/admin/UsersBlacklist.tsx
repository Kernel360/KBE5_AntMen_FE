import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../api/userService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

import { Search, Shield, ShieldOff, UserX, UserCheck } from 'lucide-react';

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'CUSTOMER':
      return <Badge variant="outline">고객</Badge>;
    case 'MANAGER':
      return <Badge variant="outline" className="border-blue-200 text-blue-700">매니저</Badge>;
    default:
      return <Badge variant="outline">알 수 없음</Badge>;
  }
};

// 탭 컴포넌트
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      active
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const UsersBlacklist: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'customer' | 'manager'>('customer');
  const [searchTerm, setSearchTerm] = useState('');
  const [actualSearchTerm, setActualSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  // 현재 탭에 따른 역할 필터
  const currentRole = activeTab === 'customer' ? 'CUSTOMER' : 'MANAGER';

  const { data: blacklistResponse, isLoading, isFetching } = useQuery({
    queryKey: ['blacklist-users', actualSearchTerm, currentRole, currentPage],
    queryFn: () => userService.getBlacklistUsers(actualSearchTerm, currentRole, currentPage),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
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

  // 탭 변경 시 검색어 초기화 및 데이터 새로고침
  const handleTabChange = (tab: 'customer' | 'manager') => {
    setActiveTab(tab);
    setSearchTerm('');
    setActualSearchTerm('');
    setCurrentPage(0);
  };

  // 페이지 로드 시 초기 데이터 로드
  useEffect(() => {
    setActualSearchTerm('');
    setCurrentPage(0);
  }, []);

  // 블랙리스트에서 제거
  const removeFromBlacklistMutation = useMutation({
    mutationFn: (userId: number) => userService.removeFromBlacklist(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blacklist-users'] });
      setShowRemoveDialog(false);
      setSelectedUser(null);
    },
  });

  const handleRemoveFromBlacklist = async (userId: number) => {
    try {
      await removeFromBlacklistMutation.mutateAsync(userId);
      alert('블랙리스트에서 제거되었습니다.');
    } catch (error) {
      console.error('블랙리스트 제거 실패:', error);
      alert('블랙리스트 제거 중 오류가 발생했습니다.');
    }
  };

  // API 응답에서 페이지네이션 정보와 데이터 추출
  const users = blacklistResponse?.content || [];
  const totalPages = blacklistResponse?.totalPages || 0;
  const totalElements = blacklistResponse?.totalElements || 0;

  if (isLoading && !blacklistResponse) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">블랙리스트 관리</h1>
        <p className="text-gray-600 mt-2">블랙리스트에 등록된 회원을 관리합니다.</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex space-x-2">
        <TabButton
          active={activeTab === 'customer'}
          onClick={() => handleTabChange('customer')}
        >
          고객 블랙리스트
        </TabButton>
        <TabButton
          active={activeTab === 'manager'}
          onClick={() => handleTabChange('manager')}
        >
          매니저 블랙리스트
        </TabButton>
      </div>

      {/* 검색 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="이름으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="w-auto">
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 블랙리스트 회원 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'customer' ? '고객' : '매니저'} 블랙리스트 목록 ({totalElements}명)
            {isFetching && <span className="ml-2 text-sm text-blue-500 animate-pulse">•</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>전화번호</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>블랙리스트 사유</TableHead>
                  <TableHead>블랙리스트 등록일</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">{user.userName}</TableCell>
                      <TableCell>{user.userEmail}</TableCell>
                      <TableCell>{user.userTel || '-'}</TableCell>
                      <TableCell>{getRoleBadge(user.userRole)}</TableCell>
                      <TableCell className="max-w-xs truncate" title={user.blacklistReason || ''}>
                        {user.blacklistReason || '-'}
                      </TableCell>
                      <TableCell>{user.blacklistDate?.slice(0, 10) || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowRemoveDialog(true);
                          }}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <UserCheck className="w-3 h-3 mr-1" />
                          블랙리스트 해제
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {isLoading ? '데이터를 불러오는 중...' : `${activeTab === 'customer' ? '고객' : '매니저'} 블랙리스트에 등록된 회원이 없습니다.`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                이전
              </Button>
              <span className="text-sm text-gray-600">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
              >
                다음
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 블랙리스트 해제 확인 다이얼로그 */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>블랙리스트 해제</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              <strong>{selectedUser?.userName}</strong>님을 블랙리스트에서 해제하시겠습니까?
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowRemoveDialog(false)}
              >
                취소
              </Button>
              <Button
                onClick={() => handleRemoveFromBlacklist(selectedUser?.userId)}
                disabled={removeFromBlacklistMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {removeFromBlacklistMutation.isPending ? '처리 중...' : '해제'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersBlacklist; 