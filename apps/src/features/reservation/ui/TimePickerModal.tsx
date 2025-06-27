'use client'

import type { RecommendedTime } from '@/shared/types/reservation'
import { calculatePrice } from '@/shared/lib/utils'
import { Transition } from '@headlessui/react'
import React from 'react'

interface TimePickerModalProps {
  isOpen: boolean
  onClose: () => void
  selectedHours: number
  standardHours: number
  recommendedTime: RecommendedTime | null
  onTimeChange: (increment: boolean) => void
  basePrice: number
  pricePerHour: number
  showTimeWarning: boolean
}

export const TimePickerModal = ({
  isOpen,
  onClose,
  selectedHours,
  standardHours,
  recommendedTime,
  onTimeChange,
  basePrice,
  pricePerHour,
  showTimeWarning,
}: TimePickerModalProps) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <div className="fixed inset-0 z-40">
        {/* Backdrop */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
        </Transition.Child>

        {/* Modal */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <div className="fixed bottom-0 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 w-full max-w-mobile bg-white rounded-t-2xl z-50 shadow-2xl pb-safe-bottom">
            <div
              className="py-3 flex justify-center cursor-pointer"
              onClick={onClose}
            >
              <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <button className="text-gray-500" onClick={onClose}>
                취소
              </button>
              <h3 className="text-lg font-bold">서비스 시간</h3>
              <button className="text-primary-600 font-medium" onClick={onClose}>
                확인
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {recommendedTime && (
                <div className="mb-6 bg-primary-200/50 text-primary-700 p-4 rounded-xl">
                  <div className="mb-2">
                    <span className="text-sm font-semibold">
                      💡 사용자 맞춤 알고리즘 기반
                    </span>
                  </div>
                  <p className="text-sm break-keep">
                    고객님의 공간({recommendedTime.area}평)에 
                    최적화된 청소 시간은 {recommendedTime.time}시간입니다. 
                    실제 현장 상황에 따라 추가 시간이 필요할 수 있습니다.
                  </p>
                </div>
              )}

              <div className="flex justify-center items-center gap-6 mb-6">
                <button
                  onClick={() => onTimeChange(false)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                    ${
                      selectedHours <= standardHours
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-2 border-primary-500 text-primary-500 active:bg-white'
                    }`}
                  disabled={selectedHours <= standardHours}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M3 8h10" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div className="text-center min-w-[80px]">
                  <p className="text-3xl font-bold text-gray-800">
                    {selectedHours}시간
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    최소 {standardHours}시간, 
                    최대 {12}시간
                  </p>
                </div>
                <button
                  onClick={() => onTimeChange(true)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                    ${
                      selectedHours >= 12
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-2 border-primary-500 text-primary-500 active:bg-white'
                    }`}
                  disabled={selectedHours >= 12}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M8 3v10M3 8h10" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Price Information */}
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      기본 요금 ({standardHours}시간)
                    </p>
                    <p className="text-base font-medium text-gray-800">
                      {basePrice.toLocaleString()}원
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">추가 시간당</p>
                    <p className="text-base font-bold text-gray-800">
                      {pricePerHour.toLocaleString()}원
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      총 서비스 시간
                    </span>
                    <span className="text-xl font-bold text-gray-800">
                      {calculatePrice(
                        selectedHours,
                        basePrice,
                        pricePerHour,
                        standardHours,
                      ).toLocaleString()}
                      원
                    </span>
                  </div>
                  {showTimeWarning && recommendedTime && (
                    <p className="text-xs text-red-500 mt-2 text-right break-keep">
                      * 추천 시간({recommendedTime.time}
                      시간)보다 부족할 수 있어요.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}
