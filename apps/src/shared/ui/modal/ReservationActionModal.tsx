'use client'

import React from 'react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface ReservationActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (option: 'cancel' | 'reschedule') => void
  isPaid?: boolean
  title?: string
  description?: string
}

const ReservationActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPaid = false,
  title = '예약을 취소하시겠습니까?',
  description,
}: ReservationActionModalProps) => {
  if (!isOpen) return null

  const defaultDescription = isPaid
    ? '결제가 완료된 예약입니다. 취소 후 진행 방법을 선택해주세요.'
    : '취소 후 진행 방법을 선택해주세요'

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[335px]">
        <div className="bg-white rounded-xl">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-black">{title}</h2>
              <button onClick={onClose} className="text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {description || defaultDescription}
            </p>
          </div>

          {/* Options List */}
          <div className="p-6 space-y-4">
            {/* Option 1: 완전 취소 */}
            <button
              onClick={() => onConfirm('cancel')}
              className="w-full flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-red-500 transition-colors"
            >
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M15 5L5 15M5 5l10 10"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-black">
                  {isPaid ? '예약 취소 및 환불 신청' : '예약 완전 취소'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {isPaid
                    ? '예약을 취소하고 환불을 신청합니다'
                    : '예약을 완전히 취소합니다'}
                </p>
              </div>
            </button>

            {/* Option 2: 일정 변경 */}
            <button
              onClick={() => onConfirm('reschedule')}
              className="w-full flex items-start gap-4 p-4 border border-[#4abed9] rounded-xl relative"
            >
              <div className="w-10 h-10 bg-[#E0F7FA] rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-[#4abed9]"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-left pr-8">
                <h3 className="text-sm font-semibold text-black">
                  일정 변경하기
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  다른 날짜와 시간으로 예약을 변경합니다
                </p>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-[#4abed9] rounded-full flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Modal Actions */}
          <div className="p-6 pt-0">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-lg bg-gray-50 text-gray-600 font-semibold text-base border border-gray-200"
              >
                돌아가기
              </button>
              <button
                onClick={() => onConfirm('reschedule')}
                className="flex-1 py-3.5 rounded-lg bg-[#4abed9] text-white font-semibold text-base"
              >
                일정 변경
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationActionModal
