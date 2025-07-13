import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface ReservationDetailModalProps {
  open: boolean;
  onClose: () => void;
  reservation: any; // 실제 타입으로 교체 필요
  reservationDetail: any; // 실제 타입으로 교체 필요
  loading?: boolean;
  mode?: 'manual-matching' | 'status';
  onRefresh?: () => void;
  onOpenMatchingRequestModal?: (reservation: any) => void;
  onOpenCancelModal?: (reservation: any) => void;
}

const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  open,
  onClose,
  reservation,
  reservationDetail,
  loading,
  mode = 'manual-matching',
  onRefresh,
  onOpenMatchingRequestModal,
  onOpenCancelModal,
}) => {
  // 매칭 상태 계산 함수 등은 props로 넘기거나 이곳에 복사해서 사용
  const getMatchingStatusBadge = (status: string) => {
    switch (status) {
      case 'nothing':
        return <Badge className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">요청없음</Badge>;
      case 'ing':
        return <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">매칭중</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">매칭실패</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">예약확정</Badge>;
      case 'cancel':
        return <Badge className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">취소됨</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-center font-medium whitespace-nowrap">{status}</Badge>;
    }
  };

  // 실제 매칭 상태 계산 함수 등도 이곳에 복사
  const getActualMatchingStatus = (matchingList: any[]) => {
    if (!matchingList || matchingList.length === 0) {
      return 'nothing';
    }
    const hasRequested = matchingList.some((matching: any) => matching.isRequested);
    if (!hasRequested) return 'nothing';
    const allRejected = matchingList.filter((m: any) => m.isRequested).every((m: any) => m.isAccepted === false);
    if (allRejected) return 'fail';
    return 'ing';
  };

  // 예약 확정/취소 상태 계산
  const getReservationStatus = (reservationDetail: any) => {
    if (!reservationDetail) return '';
    if (reservationDetail.reservationStatus === 'CANCEL') return 'cancel';
    if (reservationDetail.reservationStatus === 'DONE') return 'confirmed';
    return '';
  };

  const statusBadge = getReservationStatus(reservationDetail)
    ? getMatchingStatusBadge(getReservationStatus(reservationDetail))
    : (reservationDetail?.matchingDtoList
        ? getMatchingStatusBadge(getActualMatchingStatus(reservationDetail.matchingDtoList))
        : null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] p-0 overflow-hidden z-[50]">
        {reservation && (
          <>
            {/* 헤더 */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between" style={{minHeight: 48, height: 48}}>
              <span className="text-lg font-bold text-gray-900">예약 상세정보</span>
              {/* 닫기 버튼은 Dialog/Modal의 기본 버튼만 사용, 별도 구현하지 않음 */}
            </div>
            {/* 본문 스크롤 영역 - 헤더와 간격 없이 붙임 */}
            <div className="overflow-y-auto px-8 pt-8 pb-8" style={{maxHeight: 'calc(80vh - 64px)'}}>
              {loading && (
                <div className="text-center py-8">
                  <div className="text-lg text-gray-600">상세 정보를 불러오는 중...</div>
                </div>
              )}
              {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 왼쪽: 고객/서비스/수동작업 */}
                  <div className="space-y-4">
                    {/* 고객 정보 */}
                    {reservationDetail && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">고객 정보</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4 text-sm">
                            <div>
                              <Label className="text-xs text-gray-500">이름</Label>
                              <div className="font-medium">{reservation?.customerName}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-gray-500">성별</Label>
                                <div>{reservationDetail.customerGender}</div>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500">나이</Label>
                                <div>{reservationDetail.customerAge}세</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-gray-500">연락처</Label>
                                <div>{reservationDetail.customerPhone}</div>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500">이메일</Label>
                                <div>{reservationDetail.customerEmail}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {/* 서비스 정보 */}
                    {reservationDetail && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">서비스 정보</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4 text-sm">
                            {/* 첫째줄: 예약 신청일/서비스 시간 */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-gray-500">예약 신청일</Label>
                                <div className="font-medium">
                                  {reservation?.reservationCreatedAt ? new Date(reservation.reservationCreatedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500">서비스 시간</Label>
                                <div className="font-medium">
                                  {reservation?.reservationDate ? new Date(reservation.reservationDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}
                                  {reservation?.reservationTime ? ` ${reservation.reservationTime.substring(0, 5)}` : ''}
                                  {reservationDetail.reservationDuration ? ` ~ ${reservationDetail.reservationDuration}분 후` : ''}
                                </div>
                              </div>
                            </div>
                            {/* 둘째줄: 서비스명/추가 옵션들 */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-gray-500">서비스명</Label>
                                <div className="font-medium">{reservation?.categoryName}</div>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500">추가 옵션</Label>
                                <div className="flex flex-wrap gap-1">
                                  {reservationDetail.selectedOptions && reservationDetail.selectedOptions.length > 0 ? (
                                    reservationDetail.selectedOptions.map((option: string, index: number) => (
                                      <Badge key={index} variant="outline" className="text-xs">{option}</Badge>
                                    ))
                                  ) : (
                                    <span className="text-gray-400">없음</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* 셋째줄: 서비스 주소 */}
                            <div>
                              <Label className="text-xs text-gray-500">서비스 주소</Label>
                              <div className="text-xs">{reservationDetail.reservationAddress || '주소 정보 없음'}</div>
                            </div>
                            {/* 넷째줄: 메모 */}
                            <div>
                              <Label className="text-xs text-gray-500">메모</Label>
                              <div className="text-xs bg-gray-50 p-2 rounded min-h-[2rem]">
                                {reservationDetail.reservationMemo || '메모 없음'}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {/* 수동 작업 버튼들 (mode에 따라 분기) */}
                    {mode === 'manual-matching' && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">수동 작업</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" onClick={() => onOpenMatchingRequestModal && onOpenMatchingRequestModal(reservation)} className="border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 hover:text-green-700">매칭 수정</Button>
                            <Button variant="outline" onClick={() => onOpenCancelModal && onOpenCancelModal(reservation)} className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700">예약 취소</Button>
                            {onRefresh && <Button variant="outline" onClick={onRefresh}>새로고침</Button>}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  {/* 오른쪽: 매칭 요청 히스토리 또는 매니저 정보 */}
                  <div className="space-y-4">
                    {/* WAITING 상태일 때만 매칭 요청 히스토리 표시 */}
                    {reservationDetail?.reservationStatus === 'WAITING' && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center">
                              매칭 요청 히스토리
                            </CardTitle>
                            <span className="ml-2 text-blue-600 font-semibold text-base align-middle">{reservationDetail?.matchingDtoList?.length || 0}건</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {reservationDetail?.matchingDtoList?.length > 0 ? (
                            <div className="space-y-4">
                              {reservationDetail.matchingDtoList.map((matching: any, index: number) => (
                                <div key={matching.matchingId} className="border rounded-lg p-4 bg-gray-50">
                                  <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {matching.priority}순위
                                      </Badge>
                                      {matching.isRequested && (
                                        <Badge className="bg-blue-100 text-blue-800 text-xs">요청됨</Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {!matching.isRequested && (
                                        <span>후보지정: {new Date(matching.updatedAt).toLocaleDateString('ko-KR')}</span>
                                      )}
                                      {matching.isRequested && matching.isAccepted === null && (
                                        <span>요청: {new Date(matching.updatedAt).toLocaleDateString('ko-KR')}</span>
                                      )}
                                      {matching.isAccepted !== null && matching.isFinal === null && (
                                        <span>매니저 응답: {new Date(matching.updatedAt).toLocaleDateString('ko-KR')}</span>
                                      )}
                                      {matching.isFinal !== null && (
                                        <span>고객 응답: {new Date(matching.updatedAt).toLocaleDateString('ko-KR')}</span>
                                      )}
                                    </div>
                                  </div>
                                  {/* 매니저 정보 */}
                                  <div className="bg-white border rounded-lg p-3 mb-3">
                                    <div className="flex items-center gap-3">
                                      <img src={matching.manager.profileImage} alt={matching.manager.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-200" />
                                      <div className="flex-1">
                                        <div className="font-semibold text-base text-gray-900">
                                          {matching.manager.name} <span className="text-sm font-normal text-gray-600">| {matching.manager.gender} | {matching.manager.age}세</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          리뷰 {matching.manager.totalReviews}개 | 평점 {matching.manager.avgRating || 0}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* 매니저/고객 응답 상태 */}
                                  <div className="space-y-2">
                                    {matching.isRequested && (
                                      <>
                                        {matching.isAccepted === null && (
                                          <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">매니저 응답 대기 중</div>
                                        )}
                                        {matching.isAccepted === false && (
                                          <div className="p-2 bg-red-50 rounded text-xs text-red-700">매니저 거절</div>
                                        )}
                                        {matching.isAccepted === true && (
                                          <div className="p-2 bg-green-50 rounded text-xs text-green-700">매니저 수락</div>
                                        )}
                                      </>
                                    )}
                                    {matching.isAccepted === true && (
                                      <>
                                        {matching.isFinal === null && (
                                          <div className="p-2 bg-yellow-50 rounded text-xs text-yellow-700">고객 응답 대기 중</div>
                                        )}
                                        {matching.isFinal === false && (
                                          <div className="p-2 bg-red-50 rounded text-xs text-red-700">고객이 거절함</div>
                                        )}
                                        {matching.isFinal === true && (
                                          <div className="p-2 bg-purple-50 rounded text-xs text-purple-700">고객이 수락함 (최종 매칭)</div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                  {matching.refuseReason && (
                                    <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">거절 사유: {matching.refuseReason}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">아직 매칭 요청이 없습니다.</div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* WAITING이 아닐 때 매니저 정보 표시 */}
                    {reservationDetail?.reservationStatus !== 'WAITING' && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">매니저 정보</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {reservationDetail?.managerName ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                {reservationDetail.managerProfile && (
                                  <img 
                                    src={reservationDetail.managerProfile} 
                                    alt={reservationDetail.managerName}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" 
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="font-semibold text-lg text-gray-900">
                                    {reservationDetail.managerName}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {reservationDetail.managerGender} | {reservationDetail.managerAge}세
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-500">연락처</Label>
                                  <div>{reservationDetail.managerPhone}</div>
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-500">이메일</Label>
                                  <div>{reservationDetail.managerEmail}</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">매니저 정보가 없습니다.</div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* DONE 상태일 때 리뷰 정보 표시 */}
                    {reservationDetail?.reservationStatus === 'DONE' && reservationDetail?.reviewResponseDtoList && reservationDetail.reviewResponseDtoList.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            리뷰
                            <span className="ml-2 text-green-600 font-semibold text-base align-middle">{reservationDetail.reviewResponseDtoList.length}건</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {reservationDetail.reviewResponseDtoList.map((review: any) => (
                              <div key={review.reviewId} className="border rounded-lg p-4 bg-white">
                                <div className="flex items-start gap-3 mb-3">
                                  <img 
                                    src={review.reviewAuthor === 'CUSTOMER' ? review.reviewCustomerProfile : review.reviewManagerProfile} 
                                    alt={review.reviewAuthor === 'CUSTOMER' ? review.reviewCustomerName : review.reviewManagerName}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-sm">
                                        {review.reviewAuthor === 'CUSTOMER' ? review.reviewCustomerName : review.reviewManagerName}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        {review.reviewAuthor === 'CUSTOMER' ? '고객' : '매니저'}
                                      </Badge>
                                      <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                          <span key={i} className={`text-sm ${i < review.reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                            ★
                                          </span>
                                        ))}
                                        <span className="text-xs text-gray-500 ml-1">({review.reviewRating})</span>
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(review.reviewDate).toLocaleDateString('ko-KR', { 
                                        year: 'numeric', 
                                        month: '2-digit', 
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </div>
                                  </div>
                                </div>
                                {review.reviewComment && (
                                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                    {review.reviewComment}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
  };

export default ReservationDetailModal; 