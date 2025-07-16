import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface MatchingRequestModalProps {
  open: boolean;
  onClose: () => void;
  reservation: any;
  reservationDetail: any;
  onAcceptMatching: (matchingId: string) => Promise<void>;
  onAdminAcceptMatching?: (matchingId: string) => Promise<void>;
  onSendMatchingRequest?: (matchingId: string) => Promise<void>;
  onCreateNewCandidate?: () => void;
}

const MatchingRequestModal: React.FC<MatchingRequestModalProps> = ({
  open,
  onClose,
  reservation,
  reservationDetail,
  onAcceptMatching,
  onAdminAcceptMatching,
  onSendMatchingRequest,
  onCreateNewCandidate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAcceptMatching = async (matchingId: string) => {
    try {
      setIsSubmitting(true);
      await onAcceptMatching(matchingId);
    } catch (err: any) {
      alert(err.message || '고객 수락 처리 중 오류가 발생했습니다.');
      console.error('고객 수락 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminAcceptMatching = async (matchingId: string) => {
    if (!onAdminAcceptMatching) return;
    
    try {
      setIsSubmitting(true);
      await onAdminAcceptMatching(matchingId);
    } catch (err: any) {
      alert(err.message || '관리자 수락 처리 중 오류가 발생했습니다.');
      console.error('관리자 수락 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 매니저가 응답하지 않은 요청인지 확인 (시간 제한 없음)
  const isManagerNotResponded = (matching: any) => {
    return matching.isRequested && matching.isAccepted === null;
  };

  const handleSendMatchingRequest = async (matchingId: string) => {
    if (!onSendMatchingRequest) return;
    
    try {
      setIsSubmitting(true);
      await onSendMatchingRequest(matchingId);
    } catch (err: any) {
      alert(err.message || '매칭 요청 전송 중 오류가 발생했습니다.');
      console.error('매칭 요청 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] z-[70]">
        <DialogHeader>
          <DialogTitle>매칭 수정</DialogTitle>
        </DialogHeader>
        {reservation && reservationDetail && (
          <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
            {/* 로딩 상태 표시 */}
            {isSubmitting && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-blue-800 font-medium">처리 중입니다...</div>
                <div className="text-blue-600 text-sm mt-1">잠시만 기다려주세요</div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 왼쪽: 매니저가 수락했는데 고객이 응답하지 않은 매칭 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">고객 응답 대기 중</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {reservationDetail.matchingDtoList?.filter((matching: any) => 
                      matching.isAccepted === true && matching.isFinal === null
                    ).map((matching: any) => (
                      <div key={matching.matchingId} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={matching.manager.profileImage} 
                              alt={matching.manager.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">
                                {matching.manager.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {matching.manager.gender} | {matching.manager.age}세 | ★ {matching.manager.avgRating || 0}
                              </div>
                              <div className="text-xs text-gray-500">
                                매니저 수락: {new Date(matching.updatedAt).toLocaleDateString('ko-KR')}
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleAcceptMatching(matching.matchingId)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? '처리 중...' : '고객 수락'}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {reservationDetail.matchingDtoList?.filter((matching: any) => 
                      matching.isAccepted === true && matching.isFinal === null
                    ).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        매니저가 수락하고 고객 응답 대기 중인 매칭이 없습니다.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 오른쪽: 매니저 응답 대기 중인 매칭 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">매니저 응답 대기 중</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {reservationDetail.matchingDtoList?.filter((matching: any) => 
                      matching.isRequested && matching.isAccepted === null
                    ).map((matching: any) => (
                      <div key={matching.matchingId} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={matching.manager.profileImage} 
                              alt={matching.manager.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">
                                {matching.manager.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {matching.manager.gender} | {matching.manager.age}세 | ★ {matching.manager.avgRating || 0}
                              </div>
                              <div className="text-xs text-gray-500">
                                요청 전송: {new Date(matching.updatedAt).toLocaleDateString('ko-KR')}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {isManagerNotResponded(matching) && onAdminAcceptMatching && (
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleAdminAcceptMatching(matching.matchingId)}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? '처리 중...' : '매니저 수락'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {reservationDetail.matchingDtoList?.filter((matching: any) => 
                      matching.isRequested && matching.isAccepted === null
                    ).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        매니저 응답 대기 중인 매칭이 없습니다.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* 요청 대기 중인 매칭 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">요청 대기 중</CardTitle>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onCreateNewCandidate}
                    disabled={isSubmitting}
                  >
                    새 후보 만들기
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {reservationDetail.matchingDtoList?.filter((matching: any) => 
                    !matching.isRequested
                  ).map((matching: any) => (
                    <div key={matching.matchingId} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={matching.manager.profileImage} 
                            alt={matching.manager.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">
                              {matching.manager.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {matching.manager.gender} | {matching.manager.age}세 | ★ {matching.manager.avgRating || 0}
                            </div>
                            <div className="text-xs text-gray-500">
                              후보 지정: {new Date(matching.updatedAt).toLocaleDateString('ko-KR')}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleSendMatchingRequest(matching.matchingId)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? '처리 중...' : '요청 보내기'}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {reservationDetail.matchingDtoList?.filter((matching: any) => 
                    !matching.isRequested
                  ).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      요청 대기 중인 매칭이 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                닫기
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MatchingRequestModal; 