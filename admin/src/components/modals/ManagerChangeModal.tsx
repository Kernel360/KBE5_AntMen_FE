import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { userService } from '../../api/userService';
import { Search, User, Star, MapPin } from 'lucide-react';

interface ManagerChangeModalProps {
  open: boolean;
  onClose: () => void;
  reservation: any;
  reservationDetail: any;
  onManagerChange?: (newManagerId: number) => Promise<void>;
}

interface Manager {
  userId: number;
  name: string;
  gender: string;
  age: number;
  profileImage?: string;
  profileImg?: string;
  totalReviews?: number;
  avgRating?: number;
  location?: string;
  isAvailable?: boolean;
  email?: string;
  phone?: string;
}

const ManagerChangeModal: React.FC<ManagerChangeModalProps> = ({
  open,
  onClose,
  reservation,
  reservationDetail,
  onManagerChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actualSearchTerm, setActualSearchTerm] = useState('');
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);
  const [changing, setChanging] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setActualSearchTerm('');
      setManagers([]);
      setSelectedManager(null);
      setPage(0);
      setTotalPages(1);
    }
  }, [open]);

  // 데이터 불러오기
  const fetchManagers = async (search: string, pageNum: number) => {
    setLoading(true);
    try {
      const response = await userService.getManagers(search, undefined, pageNum, 6);
      const managersList = response.content || response;
      const mappedManagers = managersList.map((manager: any, idx: number) => ({
        userId: manager.userId ?? idx + pageNum * 6,
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
      const availableManagers = mappedManagers.filter((manager: Manager) => {
        if (reservationDetail?.managerId) {
          return manager.userId !== reservationDetail.managerId;
        }
        return true;
      });
      setManagers(availableManagers);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      alert('매니저 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // page, actualSearchTerm 바뀔 때마다 fetchManagers 호출
  useEffect(() => {
    if (!open || actualSearchTerm === '') return;
    fetchManagers(actualSearchTerm, page);
  }, [page, actualSearchTerm, open, reservationDetail?.managerId]);

  // 엔터키로만 검색
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setActualSearchTerm(searchTerm.trim());
      setPage(0);
    }
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

  const handleManagerSelect = (manager: Manager) => {
    setSelectedManager(manager);
  };

  const handleManagerChange = async () => {
    if (!selectedManager || !onManagerChange) return;
    setChanging(true);
    try {
      await onManagerChange(selectedManager.userId); // 반드시 userId를 넘김
      alert('매니저가 성공적으로 변경되었습니다.');
      onClose();
    } catch (error: any) {
      alert(error.message || '매니저 변경 중 오류가 발생했습니다.');
    } finally {
      setChanging(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl min-w-[700px] max-h-[80vh] p-0 w-full overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-bold">매니저 변경</DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6 w-full">
          {/* 현재 매니저 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">현재 매니저</h3>
            {reservationDetail?.managerName ? (
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium text-gray-900">
                    {reservationDetail.managerName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {reservationDetail.managerGender} | {reservationDetail.managerAge}세
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {reservationDetail.managerPhone} | {reservationDetail.managerEmail}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                현재 배정된 매니저가 없습니다.
              </div>
            )}
          </div>
          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="매니저 이름으로 검색... (엔터키로 검색)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          {/* 매니저 목록 */}
          <div className="space-y-4 w-full">
            <h3 className="font-semibold text-gray-900">새 매니저 선택</h3>
            <div className="w-full">
              {loading && managers.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-600">매니저 목록을 불러오는 중...</div>
                </div>
              )}
              {!loading && managers.length === 0 && actualSearchTerm === '' && (
                <div className="text-center py-8">
                  <div className="text-gray-600">
                    매니저 이름을 검색해주세요.
                  </div>
                </div>
              )}
              {!loading && managers.length === 0 && actualSearchTerm !== '' && (
                <div className="text-center py-8">
                  <div className="text-gray-600">
                    조건에 맞는 매니저가 없습니다.
                  </div>
                </div>
              )}
              {!loading && managers.length > 0 && (
                <div className="grid grid-cols-3 gap-4 w-full">
                  {managers.map((manager) => (
                    <div
                      key={manager.userId}
                      className={`border rounded-lg p-4 cursor-pointer transition-all w-full h-24 ${
                        selectedManager?.userId === manager.userId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleManagerSelect(manager)}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="font-semibold text-gray-900 text-lg truncate">{manager.name}</div>
                        <div className="text-sm text-gray-700 truncate">{manager.phone}</div>
                        <div className="text-sm text-gray-500 break-words">{manager.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>이전</Button>
                {getPageNumbers().map(idx => (
                  <Button
                    key={idx}
                    onClick={() => handlePageChange(idx)}
                    variant={page === idx ? 'default' : 'outline'}
                  >
                    {idx + 1}
                  </Button>
                ))}
                <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>다음</Button>
              </div>
            )}
          </div>
          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button 
              onClick={handleManagerChange}
              disabled={!selectedManager || changing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {changing ? '변경 중...' : '매니저 변경'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManagerChangeModal;