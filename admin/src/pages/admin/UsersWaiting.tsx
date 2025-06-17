import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Search, ZoomIn } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

export const UsersWaiting: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [approvalReason, setApprovalReason] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);

  // 목업용 프로필/신분증 경로
  const profileUrl = selectedUser?.profileImageUrl || 'https://randomuser.me/api/portraits/men/32.jpg';
  const idFile = selectedUser?.idFile || { url: '/sample-id.pdf', name: '신분증.pdf', type: 'pdf' };

  const { data: userResponse, isLoading } = useQuery({
    queryKey: ['users', searchTerm, 'WAITING_MANAGER'],
    queryFn: () => userService.getWaitingManagers(),
  });

  const approveManagerMutation = useMutation({
    mutationFn: (userId: number) => userService.approveManager(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowApprovalDialog(false);
      setSelectedUser(null);
      setApprovalReason('');
    },
  });
  const rejectManagerMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
      userService.rejectManager(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowApprovalDialog(false);
      setSelectedUser(null);
      setApprovalReason('');
    },
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
        <h1 className="text-3xl font-bold text-gray-900">승인 대기 매니저</h1>
        <p className="text-gray-600 mt-2">승인 대기 중인 매니저 회원을 관리합니다.</p>
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
          <CardTitle>승인 대기 매니저 목록 ({filteredUsers.length}명)</CardTitle>
          <CardDescription>승인 대기 중인 매니저 회원의 정보와 상태를 확인하고 승인/거절할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>나이</TableHead>
                <TableHead>성별</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead>주소</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: any) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.userAge ?? '-'}</TableCell>
                  <TableCell>{user.userGender ?? '-'}</TableCell>
                  <TableCell>{user.userEmail}</TableCell>
                  <TableCell>{user.userPhone ?? '-'}</TableCell>
                  <TableCell>{user.userAddress ?? '-'}</TableCell>
                  <TableCell>{user.userCreatedAt?.slice(0, 10)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowApprovalDialog(true);
                      }}
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
      {/* 매니저 승인/거절 다이얼로그 */}
      <Dialog open={showApprovalDialog} onOpenChange={(open) => {
        setShowApprovalDialog(open);
        if (!open) {
          setShowRejectReason(false);
          setApprovalReason('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>매니저 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedUser?.userName}님의 상세 정보를 확인하고 승인 또는 거절할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 mb-6">
              {/* 프로필 사진 */}
              <div>
                <span className="font-semibold">프로필 사진:</span>
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={profileUrl}
                    alt="프로필"
                    className="w-20 h-20 rounded-full object-cover border cursor-pointer hover:shadow-lg"
                    onClick={() => setShowProfileModal(true)}
                  />
                  <Button size="icon" variant="outline" onClick={() => setShowProfileModal(true)}>
                    <ZoomIn className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              {/* 신분증 파일 */}
              <div>
                <span className="font-semibold">신분증 파일:</span>
                <div className="mt-2 flex items-center gap-2">
                  {idFile.type === 'pdf' ? (
                    <Button variant="outline" onClick={() => setShowIdModal(true)}>
                      PDF 미리보기
                    </Button>
                  ) : (
                    <img
                      src={idFile.url}
                      alt="신분증"
                      className="w-20 h-14 object-cover border cursor-pointer hover:shadow-lg"
                      onClick={() => setShowIdModal(true)}
                    />
                  )}
                  <a href={idFile.url} download={idFile.name} className="text-blue-600 underline ml-2 text-sm">다운로드</a>
                </div>
              </div>
              <div><span className="font-semibold">이름:</span> {selectedUser.userName}</div>
              <div><span className="font-semibold">나이:</span> {selectedUser.userAge ?? '-'}</div>
              <div><span className="font-semibold">성별:</span> {selectedUser.userGender ?? '-'}</div>
              <div><span className="font-semibold">이메일:</span> {selectedUser.userEmail}</div>
              <div><span className="font-semibold">전화번호:</span> {selectedUser.userPhone ?? '-'}</div>
              <div><span className="font-semibold">주소:</span> {selectedUser.userAddress ?? '-'}</div>
              <div><span className="font-semibold">가입일:</span> {selectedUser.userCreatedAt?.slice(0, 10)}</div>
            </div>
          )}
          {/* 프로필 사진 확대 모달 */}
          <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
            <DialogContent>
              <img src={profileUrl} alt="프로필 확대" className="w-full max-w-xs mx-auto rounded-lg" />
            </DialogContent>
          </Dialog>
          {/* 신분증 미리보기 모달 */}
          <Dialog open={showIdModal} onOpenChange={setShowIdModal}>
            <DialogContent>
              {idFile.type === 'pdf' ? (
                <div className="w-full h-[60vh] overflow-auto">
                  <Document file={idFile.url} loading="로딩 중...">
                    <Page pageNumber={1} width={400} />
                  </Document>
                </div>
              ) : (
                <img src={idFile.url} alt="신분증 확대" className="w-full max-w-xs mx-auto rounded-lg" />
              )}
            </DialogContent>
          </Dialog>
          {/* 승인/거절 버튼 및 거절 사유 입력 */}
          {showRejectReason ? (
            <div className="space-y-4">
              <Input
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                placeholder="거절 사유를 입력하세요 (필수)"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectReason(false);
                    setApprovalReason('');
                  }}
                  className=""
                >
                  취소
                </Button>
                <Button
                  onClick={() => {
                    if (selectedUser && approvalReason.trim()) {
                      rejectManagerMutation.mutate({
                        userId: selectedUser.userId,
                        reason: approvalReason,
                      });
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={!approvalReason.trim()}
                >
                  전송
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowRejectReason(true)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                거절
              </Button>
              <Button
                onClick={() => {
                  if (selectedUser) {
                    approveManagerMutation.mutate(selectedUser.userId);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                승인
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 