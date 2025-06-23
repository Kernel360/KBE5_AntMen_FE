'use client'

import React, { useState } from 'react'
import { checkLoginId } from '@/shared/api/auth'

interface LoginIdInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
  onValidationChange: (isValid: boolean) => void
}

export const LoginIdInput = ({
  value,
  onChange,
  error,
  disabled,
  onValidationChange,
}: LoginIdInputProps) => {
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [checkError, setCheckError] = useState<string | null>(null)

  const handleCheckId = async () => {
    if (!value.trim()) {
      setCheckError('아이디를 입력해주세요')
      onValidationChange(false)
      return
    }

    try {
      setIsChecking(true)
      setCheckError(null)
      const available = await checkLoginId(value)
      setIsAvailable(available)
      onValidationChange(available)
      if (!available) {
        setCheckError('이미 사용중인 아이디입니다')
      }
    } catch (error) {
      console.error('아이디 중복 체크 실패:', error)
      setCheckError('중복 체크 중 오류가 발생했습니다')
      onValidationChange(false)
    } finally {
      setIsChecking(false)
    }
  }

  // 에러 메시지 결정 함수
  const getErrorMessage = () => {
    if (error) return error
    if (checkError) return checkError
    if (value && !isAvailable && !isChecking) return '아이디 중복 확인이 필요합니다'
    return null
  }

  return (
    <div className="space-y-2">
      <label className="block text-base font-medium">아이디</label>
      <div className="flex gap-2">
        <input
          type="text"
          name="username"
          value={value}
          onChange={(e) => {
            onChange(e)
            setIsAvailable(null)
            setCheckError(null)
            onValidationChange(false)
          }}
          disabled={disabled}
          className={`flex-1 h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
            getErrorMessage()
              ? 'border-2 border-red-500'
              : isAvailable
              ? 'border-2 border-green-500'
              : ''
          }`}
          placeholder="아이디를 입력해주세요"
        />
        <button
          type="button"
          onClick={handleCheckId}
          disabled={isChecking || disabled}
          className={`w-24 h-[52px] rounded-lg text-base font-medium ${
            isChecking || disabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#0fbcd6] text-white hover:bg-[#0eaec5]'
          }`}
        >
          {isChecking ? '확인중...' : '중복확인'}
        </button>
      </div>
      {getErrorMessage() && (
        <p className="text-sm text-red-500">{getErrorMessage()}</p>
      )}
      {isAvailable && !getErrorMessage() && (
        <p className="text-sm text-green-500">사용 가능한 아이디입니다</p>
      )}
    </div>
  )
} 