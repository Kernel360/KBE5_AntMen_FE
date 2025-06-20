'use client'

import { useState, useEffect } from 'react'

interface RejectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
  title?: string
  isProcessing?: boolean
}

export const RejectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = '거절 사유',
  isProcessing = false,
}: RejectionModalProps) => {
  const [reason, setReason] = useState('')

  useEffect(() => {
    // 모달이 닫힐 때 reason 초기화
    if (!isOpen) {
      setReason('')
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('사유를 입력해주세요.')
      return
    }
    onSubmit(reason)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="거절 사유를 입력해주세요"
          className="w-full h-32 p-3 border border-gray-300 rounded-lg mb-4"
          disabled={isProcessing}
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 bg-gray-200 text-gray-800 rounded-xl py-3 font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="flex-1 bg-[#4abed9] text-white rounded-xl py-3 font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isProcessing ? '처리 중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  )
} 