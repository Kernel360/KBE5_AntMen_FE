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
      return <Badge className="bg-blue-100 text-blue-800">신규</Badge>;
    case 'REAPPLY':
      return <Badge className="bg-orange-100 text-orange-800">재신청</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-';
  return dateString.slice(0, 16).replace('T', ' '); // YYYY-MM-DD HH:mm
};

export const UsersWaiting: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [managerDetail, setManagerDetail] = useState<any>(null);
  const queryClient = useQueryClient();

  // 목록 조회
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ['waiting-managers'],
    queryFn: userService.getWaitingManagers,
  });

  // 상세 정보 조회
  const { data: managerDetailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ['manager-detail', selectedUserId],
    queryFn: () => selectedUserId ? userService.getWaitingManagerDetail(selectedUserId) : null,
    enabled: !!selectedUserId,
  });

  // 상세 정보가 로드되면 상태 업데이트
  useEffect(() => {
    if (managerDetailData) {
      setManagerDetail(managerDetailData);
    }
  }, [managerDetailData]);

  const filteredUsers = (userResponse ?? []).filter((user: any) => {
    const name = user.userName ?? '';
    const email = user.userEmail ?? '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

  if (isLoading) return <div>로딩 중...</div>;

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
              placeholder="이름 또는 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>승인 대기 매니저 목록 ({filteredUsers.length}명)</CardTitle>
          <CardDescription>승인 대기 중인 매니저 회원의 정보와 상태를 확인하고 승인/거절할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
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
              {filteredUsers.map((user: any) => (
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