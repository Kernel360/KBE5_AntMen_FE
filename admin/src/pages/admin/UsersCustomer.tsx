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

export const UsersCustomer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actualSearchTerm, setActualSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('userId'); // 기본값: userId 오름차순
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState('');
  const [showBlacklistForm, setShowBlacklistForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { data: userResponse, isLoading, isFetching } = useQuery({
    queryKey: ['customers', actualSearchTerm, sortBy, currentPage],
    queryFn: () => userService.getCustomers(actualSearchTerm, sortBy, currentPage),
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

  // API 응답에서 페이지네이션 정보와 데이터 추출
  const users = userResponse?.content || [];
  const totalPages = userResponse?.totalPages || 0;
  const totalElements = userResponse?.totalElements || 0;



  if (isLoading && !userResponse) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">수요자 관리</h1>
        <p className="text-gray-600 mt-2">고객(수요자) 회원을 관리합니다.</p>
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
                <option value="lastReservationDate">최근 예약순</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            수요자 목록 ({totalElements}명)
            {isFetching && <span className="ml-2 text-sm text-blue-500 animate-pulse">•</span>}
          </CardTitle>
          <CardDescription>등록된 수요자(고객) 회원의 정보와 상태를 확인할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%] min-w-[100px]">이름</TableHead>
                  <TableHead className="w-[30%] min-w-[180px]">이메일</TableHead>
                  <TableHead className="w-[20%] min-w-[120px]">전화번호</TableHead>
                  <TableHead className="w-[15%] min-w-[100px]">가입일</TableHead>
                  <TableHead className="w-[15%] min-w-[120px] leading-tight">마지막 예약신청일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.userId} className="cursor-pointer hover:bg-gray-50" onClick={() => { setSelectedUser(user); setShowDetail(true); }}>
                    <TableCell className="w-[20%] min-w-[100px] truncate">{user.userName}</TableCell>
                    <TableCell className="w-[30%] min-w-[180px] truncate">{user.userEmail}</TableCell>
                    <TableCell className="w-[20%] min-w-[120px] truncate">{user.userTel ?? '-'}</TableCell>
                    <TableCell className="w-[15%] min-w-[100px] truncate">{user.userCreatedDate?.slice(0, 10)}</TableCell>
                    <TableCell className="w-[15%] min-w-[120px] truncate">{user.lastReservationDate?.slice(0, 10) ?? '-'}</TableCell>
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
      {/* 상세정보 모달 */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 [&>button]:hidden bg-white">
          <DialogHeader className="px-6 py-4 bg-white flex-shrink-0 space-y-0 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0 p-0">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                수요자 상세 정보
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBlacklistForm(!showBlacklistForm)}
                  className="h-8 px-3 text-sm bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                >
                  블랙리스트 설정
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowDetail(false)}
                  className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            {/* 블랙리스트 폼 */}
            {showBlacklistForm && (
              <div className="mt-4 pt-4 space-y-3">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">블랙리스트 사유</label>
                  <Input 
                    value={blacklistReason} 
                    onChange={e => setBlacklistReason(e.target.value)} 
                    placeholder="블랙리스트 처리 사유를 입력하세요"
                    className="bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowBlacklistForm(false);
                      setBlacklistReason('');
                    }}
                    className="px-4"
                  >
                    취소
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white px-4"
                    disabled={!blacklistReason.trim()}
                  >
                    완료
                  </Button>
                </div>
              </div>
            )}
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto min-h-0">
            {selectedUser && (
              <div className="space-y-6 px-6 pt-0 pb-8">
                {/* 기본 정보 섹션 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-blue-400 rounded-full"></div>
                    기본 정보
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">이름</label>
                        <span className="text-base text-gray-900 font-medium">{selectedUser.userName}</span>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">이메일</label>
                        <span className="text-base text-gray-900">{selectedUser.userEmail}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">전화번호</label>
                        <span className="text-base text-gray-900">{selectedUser.userTel ?? '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">가입일</label>
                        <span className="text-base text-gray-900">{selectedUser.userCreatedDate?.slice(0, 10)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 예약 통계 섹션 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-blue-400 rounded-full"></div>
                    예약 통계 (전체 기간)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-blue-600">24건</div>
                      <div className="text-xs text-gray-500">총 신청</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-green-600">18건</div>
                      <div className="text-xs text-gray-500">진행 완료</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-orange-600">2건</div>
                      <div className="text-xs text-gray-500">진행 예정</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-red-600">3건</div>
                      <div className="text-xs text-gray-500">환불 신청</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-gray-600">1건</div>
                      <div className="text-xs text-gray-500">자동 취소</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">성공률</span>
                        <span className="text-lg font-bold text-green-600">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">평균 만족도</span>
                        <span className="text-lg font-bold text-yellow-600">4.2/5</span>
                      </div>
                      <div className="flex mt-2">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className={`text-lg ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 리뷰 정보 */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-yellow-400 rounded-full"></div>
                      리뷰 정보
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => {/* 전체 리뷰 모달 */}}>
                      전체보기
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 작성한 리뷰 */}
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-700">작성한 리뷰</h4>
                        <span className="text-sm text-gray-500">총 12개</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { manager: '김매니저', rating: 5, comment: '정말 깔끔하게 잘해주셨어요!' },
                          { manager: '이매니저', rating: 4, comment: '시간 약속 잘 지키시고 친절하세요' }
                        ].map((review, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{review.manager}</span>
                              <div className="flex">
                                {[1,2,3,4,5].map(star => (
                                  <span key={star} className={`text-xs ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 받은 리뷰 */}
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-700">받은 리뷰</h4>
                        <span className="text-sm text-gray-500">총 8개</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { manager: '박매니저', rating: 4, comment: '약속 시간 잘 지키시는 고객님이에요' },
                          { manager: '최매니저', rating: 5, comment: '친절하고 배려 깊으신 분입니다' }
                        ].map((review, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{review.manager}</span>
                              <div className="flex">
                                {[1,2,3,4,5].map(star => (
                                  <span key={star} className={`text-xs ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 