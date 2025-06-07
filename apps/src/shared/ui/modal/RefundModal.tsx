'use client';

import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title?: string;
  description?: string;
}

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "환불 신청",
  description = "취소 사유를 선택해주세요"
}) => {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const predefinedReasons = [
    '개인 사정으로 인한 취소',
    '일정 변경이 어려워서',
    '서비스가 더 이상 필요하지 않음',
    '다른 업체를 이용하기로 함',
    '기타'
  ];

  const handleConfirm = async () => {
    const finalReason = selectedReason === '기타' ? reason : selectedReason;
    
    if (!finalReason.trim()) {
      alert('취소 사유를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      // 환불 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      onConfirm(finalReason);
    } catch (error) {
      console.error('Refund request failed:', error);
      alert('환불 신청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setSelectedReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[335px] max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-xl">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black">{title}</h2>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              {predefinedReasons.map((reasonOption) => (
                <button
                  key={reasonOption}
                  onClick={() => setSelectedReason(reasonOption)}
                  className={`w-full text-left p-4 border rounded-xl transition-colors ${
                    selectedReason === reasonOption
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-black">{reasonOption}</span>
                    {selectedReason === reasonOption && (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 14 14" fill="none" stroke="currentColor">
                          <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Reason Input */}
            {selectedReason === '기타' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">상세 사유</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="취소 사유를 자세히 입력해주세요."
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={4}
                  maxLength={200}
                />
                <div className="text-right">
                  <span className="text-xs text-gray-500">{reason.length}/200</span>
                </div>
              </div>
            )}

            {/* Refund Info */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">환불 안내</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 환불 처리는 영업일 기준 3-5일 소요됩니다</li>
                <li>• 결제 수단과 동일한 방법으로 환불됩니다</li>
                <li>• 환불 완료 시 SMS로 알림을 보내드립니다</li>
              </ul>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="p-6 pt-0">
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 py-3.5 rounded-lg bg-gray-50 text-gray-600 font-semibold text-base border border-gray-200 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading || !selectedReason}
                className="flex-1 py-3.5 rounded-lg bg-red-500 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>처리 중...</span>
                  </div>
                ) : (
                  '환불 신청'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 