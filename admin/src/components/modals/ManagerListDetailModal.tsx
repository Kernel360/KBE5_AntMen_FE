import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { WorkHistoryModal } from './WorkHistoryModal';
import { ReviewListModal } from './ReviewListModal';

interface ManagerListDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  managerData: any;
  loading: boolean;
  selectedUser: any; // 목록에서 선택된 매니저 정보
}

export function ManagerListDetailModal({
  isOpen,
  onClose,
  managerData,
  loading,
  selectedUser
}: ManagerListDetailModalProps) {

  // 전체보기 모달 상태
  const [showWorkHistoryModal, setShowWorkHistoryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBlacklistForm, setShowBlacklistForm] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState('');

  // 성별 한글 변환 함수
  const getGenderText = (gender: string) => {
    if (!gender) return '-';
    return gender === 'M' ? '남성' : gender === 'F' ? '여성' : gender;
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 [&>button]:hidden bg-white">
          <DialogHeader className="px-6 py-4 bg-white flex-shrink-0 space-y-0 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0 p-0">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                매니저 상세 정보
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
              >
                ✕
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">매니저 정보를 불러오는 중...</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!managerData || !selectedUser) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 [&>button]:hidden bg-white">
          <DialogHeader className="px-6 py-4 bg-white flex-shrink-0 space-y-0 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0 p-0">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                매니저 상세 정보
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
              >
                ✕
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">매니저 정보를 불러올 수 없습니다</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 [&>button]:hidden bg-white">
        <DialogHeader className="px-6 py-4 bg-white flex-shrink-0 space-y-0 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0 p-0">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
              매니저 상세 정보
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
                onClick={onClose}
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
                  onClick={async () => {
                    try {
                      await import('../../api/userService').then(m => m.userService.addToBlacklist(selectedUser.userId, blacklistReason));
                      alert('블랙리스트에 추가되었습니다.');
                      setShowBlacklistForm(false);
                      setBlacklistReason('');
                      onClose();
                      window.location.reload();
                    } catch (error) {
                      console.error('블랙리스트 추가 실패:', error);
                      alert('블랙리스트 추가 중 오류가 발생했습니다.');
                    }
                  }}
                >
                  완료
                </Button>
              </div>
            </div>
          )}
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 px-6 pt-0 pb-8">
            {/* 기본 정보 섹션 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-400 rounded-full"></div>
                기본 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* 프로필 사진 */}
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center">
                    <label className="text-sm font-medium text-gray-500 mb-2">프로필 사진</label>
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      {managerData.userInfo?.userProfile ? (
                        <img
                          src={managerData.userInfo.userProfile}
                          alt="프로필"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center text-gray-400 text-xs ${managerData.userInfo?.userProfile ? 'hidden' : ''}`}>
                        프로필 없음
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 개인정보 */}
                <div className="md:col-span-4">
                  <div className="space-y-4">
                    {/* 첫째줄: 이름, 성별, 생년월일 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">이름</label>
                        <span className="text-base text-gray-900 font-medium">{selectedUser.userName || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">성별</label>
                        <span className="text-base text-gray-900">{getGenderText(managerData.userInfo?.userGender)}</span>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">생년월일</label>
                        <span className="text-base text-gray-900">{managerData.userInfo?.userBirth || '-'}</span>
                      </div>
                    </div>
                    
                    {/* 둘째줄: 이메일, 전화번호, 가입일 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">이메일</label>
                        <span className="text-base text-gray-900">{selectedUser.userEmail || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">전화번호</label>
                        <span className="text-base text-gray-900">{selectedUser.userTel ?? '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">가입일</label>
                        <span className="text-base text-gray-900">{selectedUser.userCreatedDate?.slice(0, 10) || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 매칭 통계 섹션 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-400 rounded-full"></div>
                매칭 통계 (전체 기간)
              </h3>
              {managerData.matchingStatistics ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-blue-600">{managerData.matchingStatistics.totalMatchings}건</div>
                      <div className="text-xs text-gray-500">총 매칭</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-green-600">{managerData.matchingStatistics.completedMatchings}건</div>
                      <div className="text-xs text-gray-500">완료</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-orange-600">{managerData.matchingStatistics.pendingMatchings}건</div>
                      <div className="text-xs text-gray-500">진행중</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-red-600">{managerData.matchingStatistics.cancelledMatchings}건</div>
                      <div className="text-xs text-gray-500">취소</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">성공률</span>
                        <span className="text-lg font-bold text-green-600">{managerData.matchingStatistics.successRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${managerData.matchingStatistics.successRate}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">평균 평점</span>
                        <span className="text-lg font-bold text-yellow-600">{managerData.matchingStatistics.averageRating}/5</span>
                      </div>
                      <div className="flex mt-2">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className={`text-lg ${star <= Math.round(managerData.matchingStatistics.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">매칭 통계를 불러올 수 없습니다</div>
                </div>
              )}
            </div>

            {/* 최근 근무 내역 */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-yellow-400 rounded-full"></div>
                  최근 근무 내역
                </h3>
                <Button variant="outline" size="sm" onClick={() => setShowWorkHistoryModal(true)}>
                  전체보기
                </Button>
              </div>
              {managerData.workHistory && managerData.workHistory.length > 0 ? (
                <div className="space-y-3">
                  {managerData.workHistory.slice(0, 3).map((work: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{work.customerName}</span>
                            <Badge variant="outline" className="text-xs">
                              {work.serviceName}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {work.workDate} • {work.amount?.toLocaleString()}원
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {work.rating ? (
                            <>
                              <span className="text-sm text-gray-500">평점:</span>
                              <div className="flex">
                                {[1,2,3,4,5].map(star => (
                                  <span key={star} className={`text-xs ${star <= work.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                ))}
                              </div>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">평점 없음</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">근무 내역이 없습니다</div>
                </div>
              )}
            </div>

            {/* 리뷰 정보 */}
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-purple-400 rounded-full"></div>
                  리뷰 정보
                </h3>
                <Button variant="outline" size="sm" onClick={() => setShowReviewModal(true)}>
                  전체보기
                </Button>
              </div>
              {managerData.reviewInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 받은 리뷰 (고객이 매니저에게) */}
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-700">받은 리뷰</h4>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">총 {managerData.reviewInfo.totalReceivedReviews}개</span>
                        <div className="text-xs text-gray-400">
                          평균 {managerData.reviewInfo.averageReceivedRating}/5점
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {managerData.reviewInfo.receivedReviews && managerData.reviewInfo.receivedReviews.length > 0 ? (
                        managerData.reviewInfo.receivedReviews.slice(0, 2).map((review: any, idx: number) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{review.targetName}</span>
                              <div className="flex">
                                {[1,2,3,4,5].map(star => (
                                  <span key={star} className={`text-xs ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs">{review.comment}</p>
                            <p className="text-gray-400 text-xs mt-1">{review.reviewDate?.slice(0, 10)}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          받은 리뷰가 없습니다
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 작성한 리뷰 (매니저가 고객에게) */}
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-700">작성한 리뷰</h4>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">총 {managerData.reviewInfo.totalWrittenReviews}개</span>
                        <div className="text-xs text-gray-400">
                          평균 {managerData.reviewInfo.averageWrittenRating}/5점
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {managerData.reviewInfo.writtenReviews && managerData.reviewInfo.writtenReviews.length > 0 ? (
                        managerData.reviewInfo.writtenReviews.slice(0, 2).map((review: any, idx: number) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{review.targetName}</span>
                              <div className="flex">
                                {[1,2,3,4,5].map(star => (
                                  <span key={star} className={`text-xs ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs">{review.comment}</p>
                            <p className="text-gray-400 text-xs mt-1">{review.reviewDate?.slice(0, 10)}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          작성한 리뷰가 없습니다
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">리뷰 정보를 불러올 수 없습니다</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
      
      {/* 전체보기 모달들 */}
      <WorkHistoryModal
        isOpen={showWorkHistoryModal}
        onClose={() => setShowWorkHistoryModal(false)}
        workHistory={managerData?.workHistory || []}
        userName={selectedUser?.userName || ''}
      />
      
      <ReviewListModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        reviewInfo={managerData?.reviewInfo}
        userName={selectedUser?.userName || ''}
        userType="manager"
      />
    </Dialog>
  );
} 