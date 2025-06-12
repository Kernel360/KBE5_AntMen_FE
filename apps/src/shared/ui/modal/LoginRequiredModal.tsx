'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginRequiredModal = ({ isOpen, onClose }: LoginRequiredModalProps) => {
  const [show, setShow] = useState(isOpen)
  const [animate, setAnimate] = useState<'in' | 'out'>('in')

  useEffect(() => {
    if (isOpen) {
      setShow(true)
      setAnimate('in')
    } else if (show) {
      setAnimate('out')
      const timeout = setTimeout(() => setShow(false), 380)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center ${
        animate === 'in' ? 'bg-black bg-opacity-50' : 'animate-fade-out'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className={`w-full max-w-mobile bg-white rounded-t-[20px] ${
          animate === 'in' ? 'animate-slide-up-in' : 'animate-slide-up-out'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <header className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-lg font-black text-[#333333]">로그인 필요</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center"
            aria-label="닫기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18"
                stroke="#666666"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 6L18 18"
                stroke="#666666"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        {/* 내용 */}
        <main className="px-6 pt-6 pb-4 space-y-4">
          <div className="flex flex-col mb-12 mt-8">
            <p className="text-base text-[#333333] leading-[160%] text-center font-semibold">
              로그인 후 이용 가능합니다
            </p>
            <p className="text-sm text-[#666666] leading-none text-center">
              서비스 이용을 위해 로그인이 필요합니다.
            </p>
          </div>

          <Link
            href="/login"
            className="w-full h-12 bg-primary rounded-lg flex items-center justify-center font-bold text-base text-gray-900 mt-4  transition-colors"
          >
            로그인
          </Link>
        </main>
      </div>
    </div>
  )
}

export default LoginRequiredModal
