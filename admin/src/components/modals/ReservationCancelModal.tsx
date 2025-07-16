import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface ReservationCancelModalProps {
  open: boolean;
  onClose: () => void;
  reservation: any;
  onCancel: (reservationId: string, cancelData: { status: string; reason: string }) => Promise<void>;
  onSuccess?: () => void;
  source?: 'list' | 'detail';
}

const ReservationCancelModal: React.FC<ReservationCancelModalProps> = ({
  open,
  onClose,
  reservation,
  onCancel,
  onSuccess,
  source = 'list'
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonType, setCancelReasonType] = useState<'preset1' | 'preset2' | 'custom'>('preset1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancelReservation = async () => {
    let finalCancelReason = '';

    if (cancelReasonType === 'preset1') {
      finalCancelReason = '예약날까지 매칭안됨';
    } else if (cancelReasonType === 'preset2') {
      finalCancelReason = '매칭할 매니저 없음';
    } else {
      if (!cancelReason.trim()) {
        alert('취소 사유를 입력해주세요.');
        return;
      }
      finalCancelReason = cancelReason.trim();
    }

    if (!reservation) {
      alert('예약 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onCancel(reservation.reservationId.toString(), {
        status: 'CANCEL',
        reason: finalCancelReason
      });

      // 성공 시 모달 닫기 및 상태 초기화
      onClose();
      setCancelReason('');
      setCancelReasonType('preset1');
      
      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      alert(err.message || '예약 취소 중 오류가 발생했습니다.');
      console.error('예약 취소 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setCancelReason('');
      setCancelReasonType('preset1');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`max-w-md max-h-[90vh] ${source === 'detail' ? 'z-[60]' : 'z-[50]'}`}>
        <DialogHeader>
          <DialogTitle>예약 취소</DialogTitle>
        </DialogHeader>
        {reservation && (
          <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-900 mb-2">취소할 예약 정보</h3>
              <div className="text-sm space-y-1 text-red-800">
                <div><span className="font-medium">예약 ID:</span> {reservation.reservationId}</div>
                <div><span className="font-medium">고객명:</span> {reservation.customerName}</div>
                <div><span className="font-medium">서비스:</span> {reservation.categoryName}</div>
                <div><span className="font-medium">서비스요청일:</span> {reservation.reservationDate} {reservation.reservationTime}</div>
              </div>
            </div>
            
            <div>
              <Label className="text-base font-medium">
                취소 사유 선택 <span className="text-red-500">*</span>
              </Label>
              <div className="mt-3 space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="preset1"
                    name="cancelReasonType"
                    value="preset1"
                    checked={cancelReasonType === 'preset1'}
                    onChange={(e) => setCancelReasonType('preset1')}
                    className="w-4 h-4"
                  />
                  <label htmlFor="preset1" className="text-sm">
                    <span className="font-medium">예약날까지 매칭안됨</span>
                    <div className="text-gray-500">예약 신청한 날이 지났는데도 매칭이 진행되지 않은 경우</div>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="preset2"
                    name="cancelReasonType"
                    value="preset2"
                    checked={cancelReasonType === 'preset2'}
                    onChange={(e) => setCancelReasonType('preset2')}
                    className="w-4 h-4"
                  />
                  <label htmlFor="preset2" className="text-sm">
                    <span className="font-medium">매칭할 매니저 없음</span>
                    <div className="text-gray-500">해당 지역이나 서비스에 매칭 가능한 매니저가 없는 경우</div>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="custom"
                    name="cancelReasonType"
                    value="custom"
                    checked={cancelReasonType === 'custom'}
                    onChange={(e) => setCancelReasonType('custom')}
                    className="w-4 h-4"
                  />
                  <label htmlFor="custom" className="text-sm">
                    <span className="font-medium">직접 입력</span>
                    <div className="text-gray-500">예약 취소 사유를 직접 입력합니다.</div>
                  </label>
                </div>
              </div>
            </div>
            
            {cancelReasonType === 'custom' && (
              <div>
                <Label htmlFor="cancel-reason" className="text-base font-medium">
                  취소 사유 입력 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="cancel-reason"
                  placeholder="예약 취소 사유를 입력해주세요..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mt-2 min-h-[100px]"
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {cancelReason.length}/500자
                </div>
              </div>
            )}

            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-sm text-yellow-800">
                <strong>주의사항:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• 예약 취소 시 자동으로 환불 처리가 진행됩니다.</li>
                  <li>• 취소된 예약은 복구할 수 없습니다.</li>
                  <li>• 고객에게 취소 알림이 발송됩니다.</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button 
                onClick={handleCancelReservation}
                disabled={
                  isSubmitting ||
                  (cancelReasonType === 'preset1' 
                    ? false 
                    : cancelReasonType === 'preset2'
                    ? false 
                    : !cancelReason.trim())
                }
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? '처리 중...' : '예약 취소'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReservationCancelModal; 