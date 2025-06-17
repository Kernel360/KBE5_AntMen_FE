import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../api/userService';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../../components/ui/table';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

const getRoleBadge = (role: string) => {
  if (role === 'user') return <Badge variant="outline">고객</Badge>;
  if (role === 'admin') return <Badge variant="default">관리자</Badge>;
  if (role === 'moderator') return <Badge variant="secondary">매니저</Badge>;
  return <Badge variant="outline">알 수 없음</Badge>;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800">승인</Badge>;
    case 'inactive':
      return <Badge variant="secondary">비승인</Badge>;
    case 'suspended':
      return <Badge className="bg-red-100 text-red-800">정지</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">대기중</Badge>;
    default:
      return <Badge variant="outline">알 수 없음</Badge>;
  }
};

export const UsersManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState('');
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ['users', searchTerm, 'MANAGER'],
    queryFn: () => userService.getUsers(searchTerm, undefined, 'MANAGER'),
  });

  const filteredUsers = (userResponse ?? []).filter((user: any) => {
    const name = user.userName ?? '';
    const email = user.userEmail ?? '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) return <div>로딩 중...</div>;

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
                  placeholder="이름 또는 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>매니저 목록 ({filteredUsers.length}명)</CardTitle>
          <CardDescription>등록된 매니저 회원의 정보와 상태를 확인할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead>가입승인일</TableHead>
                <TableHead>마지막 접속일</TableHead>
                <TableHead>마지막 근무일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: any) => (
                <TableRow key={user.userId} className="cursor-pointer hover:bg-gray-50" onClick={() => { setSelectedUser(user); setShowDetail(true); }}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.userEmail}</TableCell>
                  <TableCell>{user.userPhone ?? '-'}</TableCell>
                  <TableCell>{user.approvedAt?.slice(0, 10) ?? '-'}</TableCell>
                  <TableCell>{user.lastLoginAt?.slice(0, 10) ?? '-'}</TableCell>
                  <TableCell>{user.lastWorkAt?.slice(0, 10) ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* 상세정보 모달 */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>매니저 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2">
              <div><span className="font-semibold">이름:</span> {selectedUser.userName}</div>
              <div><span className="font-semibold">이메일:</span> {selectedUser.userEmail}</div>
              <div><span className="font-semibold">전화번호:</span> {selectedUser.userPhone ?? '-'}</div>
              <div><span className="font-semibold">가입승인일:</span> {selectedUser.approvedAt?.slice(0, 10) ?? '-'}</div>
              <div><span className="font-semibold">마지막 접속일:</span> {selectedUser.lastLoginAt?.slice(0, 10) ?? '-'}</div>
              <div><span className="font-semibold">마지막 근무일:</span> {selectedUser.lastWorkAt?.slice(0, 10) ?? '-'}</div>
            </div>
          )}
          <div className="mt-6 space-y-2">
            <div className="font-semibold">블랙리스트 사유</div>
            <Input value={blacklistReason} onChange={e => setBlacklistReason(e.target.value)} placeholder="사유를 입력하세요" />
            <Button className="bg-red-600 hover:bg-red-700 text-white mt-2">블랙리스트 설정</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 