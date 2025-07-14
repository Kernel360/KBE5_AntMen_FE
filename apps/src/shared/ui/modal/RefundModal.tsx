'use client'

import React, { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { requestRefund, RefundRequestDto } from '@/shared/api/refund'

interface RefundModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  refundData: {
    reservationId: number
    refundReason: string
    refundAmount: number
  }
}

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  refundData,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleRefundRequest = async () => {
    try {
      setIsLoading(true)
      setError(null)

      await requestRefund(refundData)
      
      // 환불 요청 성공
      onSuccess()
      onClose()
    } catch (err) {
      console.error('환불 요청 실패:', err)
      setError(err instanceof Error ? err.message : '환불 요청 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[335px] max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-xl">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black">환불 안내</h2>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500" disabled={isLoading}>
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Refund Info */}
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">환불 안내</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 환불 처리는 영업일 기준 3-5일 소요됩니다</li>
                <li>• 결제 수단과 동일한 방법으로 환불됩니다</li>
                <li>• 환불 완료 시 푸시 알림을 보내드립니다</li>
              </ul>
            </div>

            {/* 환불 정보 표시 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">환불 정보</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">환불 금액:</span>
                  <span className="font-medium">{refundData.refundAmount.toLocaleString()}원</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  환불 금액은 영업일 기준 3-5일 내에 입금됩니다.
                </div>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="p-6 pt-0">
            <button
              onClick={handleRefundRequest}
              disabled={isLoading}
              className="w-full py-3.5 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-base transition-colors"
            >
              {isLoading ? '환불 처리 중...' : '환불 신청'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}