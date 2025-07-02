'use client'

import React from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface RefundModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

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
                <div className="w-10 h-10화 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black">환불 안내</h2>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500">
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
                <li>• 환불 완료 시 SMS로 알림을 보내드립니다</li>
              </ul>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="p-6 pt-0"></div>
            <button
              onClick={onConfirm}
              className="w-full py-3.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-base transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
  )
}