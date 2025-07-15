import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { adminService } from '../../api/adminService';
import { userService } from '../../api/userService';

interface NewCandidateModalProps {
  open: boolean;
  onClose: () => void;
  reservation: any;
  onConfirm: (type: 'manual' | 'auto', managerId?: string) => Promise<void>;
}

const NewCandidateModal: React.FC<NewCandidateModalProps> = ({
  open,
  onClose,
  reservation,
  onConfirm
}) => {
  const [candidateType, setCandidateType] = useState<'manual' | 'auto'>('auto');
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const [managerSearchTerm, setManagerSearchTerm] = useState<string>('');
  const [actualSearchTerm, setActualSearchTerm] = useState<string>('');
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [availableManagers, setAvailableManagers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 매니저 검색 함수
  const fetchManagers = async (search: string, pageNum: number) => {
    if (!search.trim()) {
      setAvailableManagers([]);
      return;
    }

    setIsLoadingManagers(true);
    try {
      const response = await userService.getManagers(search, undefined, pageNum, 6);
      const managersList = response.content || response;
      const mappedManagers = managersList.map((manager: any, idx: number) => ({
        managerId: manager.userId?.toString() ?? (idx + pageNum * 6).toString(),
        name: manager.userName,
        email: manager.userEmail,
        phone: manager.userTel,
        age: manager.age ?? '',
        gender: manager.gender ?? '',
        profileImage: manager.profileImage ?? '',
        totalReviews: manager.totalReviews ?? 0,
        avgRating: manager.avgRating ?? 0,
        location: manager.location ?? '',
        isAvailable: manager.isAvailable ?? true,
      }));
      setAvailableManagers(mappedManagers);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('매니저 검색 오류:', error);
      setAvailableManagers([]);
    } finally {
      setIsLoadingManagers(false);
    }
  };

  // 매니저 선택 처리
  const handleManagerSelect = (manager: any) => {
    setSelectedManagerId(manager.managerId);
    setManagerSearchTerm(manager.name);
    setShowManagerDropdown(false);
  };

  // 페이지네이션 이동
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // 페이지네이션 버튼 범위 계산
  const getPageNumbers = () => {
    const maxButtons = 5;
    let start = Math.max(0, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(0, end - maxButtons);
    }
    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  // 선택된 매니저 정보 표시
  const getSelectedManagerInfo = () => {
    if (!selectedManagerId) return null;
    return availableManagers.find(manager => manager.managerId === selectedManagerId);
  };

  // 확인 버튼 처리
  const handleConfirm = async () => {
    if (candidateType === 'manual' && !selectedManagerId) {
      alert('매니저를 선택해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(candidateType, candidateType === 'manual' ? selectedManagerId : undefined);
      onClose();
    } catch (err: any) {
      alert(err.message || '새 후보 생성 중 오류가 발생했습니다.');
      console.error('새 후보 생성 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // page, actualSearchTerm 바뀔 때마다 fetchManagers 호출
  useEffect(() => {
    if (!open || actualSearchTerm === '') return;
    fetchManagers(actualSearchTerm, page);
  }, [page, actualSearchTerm, open]);

  // 엔터키로만 검색
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setActualSearchTerm(managerSearchTerm.trim());
      setPage(0);
    }
  };

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (open) {
      setCandidateType('auto');
      setSelectedManagerId('');
      setManagerSearchTerm('');
      setActualSearchTerm('');
      setShowManagerDropdown(false);
      setAvailableManagers([]);
      setPage(0);
      setTotalPages(1);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[80]">
        <DialogHeader>
          <DialogTitle>새 후보 만들기</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 예약 정보 */}
          {reservation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">예약 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">예약 ID:</span>
                    <span className="ml-2 text-gray-900">{reservation.reservationId}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">고객명:</span>
                    <span className="ml-2 text-gray-900">{reservation.customerName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">서비스:</span>
                    <span className="ml-2 text-gray-900">{reservation.serviceName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">예약일:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(reservation.reservatedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 후보 생성 방식 선택 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">후보 생성 방식</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 자동 추천 */}
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  id="auto"
                  name="candidateType"
                  value="auto"
                  checked={candidateType === 'auto'}
                  onChange={(e) => setCandidateType(e.target.value as 'auto')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor="auto" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">자동 추천 사용하기</div>
                      <div className="text-sm text-gray-600">알고리즘을 통해 최적의 매니저 3명을 자동으로 추천받습니다</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">3명</Badge>
                  </div>
                </Label>
              </div>

              {/* 직접 지정 */}
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  id="manual"
                  name="candidateType"
                  value="manual"
                  checked={candidateType === 'manual'}
                  onChange={(e) => setCandidateType(e.target.value as 'manual')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor="manual" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">직접 지정하기</div>
                      <div className="text-sm text-gray-600">원하는 매니저를 직접 검색하여 선택합니다</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">1명</Badge>
                  </div>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* 매니저 선택 (직접 지정 시에만 표시) */}
          {candidateType === 'manual' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">매니저 선택</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Label htmlFor="manager-search">매니저 검색</Label>
                  <Input
                    id="manager-search"
                    type="text"
                    placeholder="매니저 이름을 입력하세요 (엔터키로 검색)"
                    value={managerSearchTerm}
                    onChange={(e) => {
                      setManagerSearchTerm(e.target.value);
                    }}
                    onKeyPress={handleKeyPress}
                    className="mt-1"
                  />
                  
                  {/* 매니저 검색 결과 */}
                  {actualSearchTerm && (
                    <div className="mt-4">
                      {isLoadingManagers && availableManagers.length === 0 && (
                        <div className="text-center py-4 text-gray-500">매니저 목록을 불러오는 중...</div>
                      )}
                      {!isLoadingManagers && availableManagers.length === 0 && (
                        <div className="text-center py-4 text-gray-500">조건에 맞는 매니저가 없습니다.</div>
                      )}
                      {!isLoadingManagers && availableManagers.length > 0 && (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {availableManagers.map((manager) => (
                            <div
                              key={manager.managerId}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                selectedManagerId === manager.managerId
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                              onClick={() => handleManagerSelect(manager)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">{manager.name}</div>
                                  <div className="text-sm text-gray-600">{manager.phone}</div>
                                  <div className="text-xs text-gray-500">{manager.email}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* 페이지네이션 */}
                      {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4 flex-wrap">
                          <Button 
                            size="sm"
                            onClick={() => handlePageChange(page - 1)} 
                            disabled={page === 0}
                          >
                            이전
                          </Button>
                          {getPageNumbers().map(idx => (
                            <Button
                              key={idx}
                              size="sm"
                              onClick={() => handlePageChange(idx)}
                              variant={page === idx ? 'default' : 'outline'}
                            >
                              {idx + 1}
                            </Button>
                          ))}
                          <Button 
                            size="sm"
                            onClick={() => handlePageChange(page + 1)} 
                            disabled={page === totalPages - 1}
                          >
                            다음
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 선택된 매니저 정보 */}
                {getSelectedManagerInfo() && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-green-900">
                          선택된 매니저: {getSelectedManagerInfo()?.name}
                        </div>
                        <div className="text-sm text-green-700">{getSelectedManagerInfo()?.phone}</div>
                        <div className="text-xs text-green-600">{getSelectedManagerInfo()?.email}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedManagerId('');
                          setManagerSearchTerm('');
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        선택 해제
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={isSubmitting || (candidateType === 'manual' && !selectedManagerId)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? '처리 중...' : '새 후보 생성'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewCandidateModal; 