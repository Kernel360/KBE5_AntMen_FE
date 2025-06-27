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

export const UsersManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actualSearchTerm, setActualSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('userId'); // 기본값: userId 오름차순
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState('');
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
                  placeholder="이름 또는 이메일로 검색... (엔터키로 검색)"
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
                  <TableRow key={user.userId} className="cursor-pointer hover:bg-gray-50" onClick={() => { setSelectedUser(user); setShowDetail(true); }}>
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
      {/* 상세정보 모달 */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 [&>button]:hidden bg-white">
          <DialogHeader className="border-b border-gray-200 px-6 py-4 bg-white flex-shrink-0 space-y-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0 p-0">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                매니저 상세 정보
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDetail(false)}
                className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
              >
                ✕
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto min-h-0">
            {selectedUser && (
              <div className="space-y-6 px-6 pt-0 pb-8">
                {/* 기본 정보 섹션 */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
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
                        <label className="text-sm font-medium text-gray-500">가입승인일</label>
                        <span className="text-base text-gray-900">{selectedUser.approvedAt?.slice(0, 10) ?? selectedUser.userCreatedDate?.slice(0, 10) ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 개인 통계 섹션 */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-green-400 rounded-full"></div>
                    매칭 통계 (전체 기간)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-blue-600">156건</div>
                      <div className="text-xs text-gray-500">총 매칭</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-green-600">142건</div>
                      <div className="text-xs text-gray-500">성공 완료</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-orange-600">8건</div>
                      <div className="text-xs text-gray-500">진행 중</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-red-600">5건</div>
                      <div className="text-xs text-gray-500">고객 취소</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-gray-600">1건</div>
                      <div className="text-xs text-gray-500">매니저 취소</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">성공률</span>
                        <span className="text-lg font-bold text-green-600">91%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">고객 만족도</span>
                        <span className="text-lg font-bold text-yellow-600">4.7/5</span>
                      </div>
                      <div className="flex mt-2">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className={`text-lg ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">이번 달 순위</span>
                        <span className="text-lg font-bold text-blue-600">#2</span>
                      </div>
                      <div className="text-xs text-gray-400">전체 매니저 중</div>
                    </div>
                  </div>
                </div>

                {/* 최근 매칭 내역 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-blue-400 rounded-full"></div>
                      최근 매칭 내역
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => {/* 전체보기 모달 */}}>
                      전체보기
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { date: '2024-06-25', customer: '김고객', service: '청소 서비스', status: '완료', amount: '150,000원', rating: 5, review: '깔끔하게 잘해주셨어요' },
                      { date: '2024-06-23', customer: '이고객', service: '정리정돈', status: '진행중', amount: '80,000원', rating: null, review: null },
                      { date: '2024-06-20', customer: '박고객', service: '청소 서비스', status: '고객취소', amount: '120,000원', reason: '일정 변경', rating: null }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{item.customer}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-700">{item.service}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.status === '완료' ? 'bg-green-100 text-green-700' :
                                item.status === '진행중' ? 'bg-blue-100 text-blue-700' :
                                item.status === '고객취소' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">{item.date} • {item.amount}</div>
                            {item.reason && (
                              <div className="text-xs text-red-600 mt-1">취소사유: {item.reason}</div>
                            )}
                            {item.rating && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs text-gray-500">평가:</span>
                                <div className="flex">
                                  {[1,2,3,4,5].map(star => (
                                    <span key={star} className={`text-xs ${star <= item.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                  ))}
                                </div>
                                {item.review && <span className="text-xs text-gray-600 ml-1">"{item.review}"</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 리뷰 정보 */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-purple-400 rounded-full"></div>
                      리뷰 정보
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => {/* 전체 리뷰 모달 */}}>
                      전체보기
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 받은 리뷰 (고객이 매니저에게) */}
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-700">고객 평가</h4>
                        <span className="text-sm text-gray-500">총 89개</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { customer: '김고객', rating: 5, comment: '정말 깔끔하게 잘해주셨어요! 추천합니다' },
                          { customer: '이고객', rating: 5, comment: '시간 약속 잘 지키시고 꼼꼼해요' }
                        ].map((review, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{review.customer}</span>
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
                    
                    {/* 작성한 리뷰 (매니저가 고객에게) */}
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-700">고객 평가 작성</h4>
                        <span className="text-sm text-gray-500">총 76개</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { customer: '박고객', rating: 5, comment: '친절하고 배려 깊으신 고객님입니다' },
                          { customer: '최고객', rating: 4, comment: '약속 시간 잘 지키시는 분이에요' }
                        ].map((review, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{review.customer}</span>
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

                {/* 관리 액션 섹션 */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-red-400 rounded-full"></div>
                    관리 액션
                  </h3>
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-500 mb-2">블랙리스트 사유</label>
                      <Input 
                        value={blacklistReason} 
                        onChange={e => setBlacklistReason(e.target.value)} 
                        placeholder="블랙리스트 처리 사유를 입력하세요"
                        className="bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDetail(false)}
                        className="px-6"
                      >
                        취소
                      </Button>
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white px-6"
                        disabled={!blacklistReason.trim()}
                      >
                        블랙리스트 설정
                      </Button>
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