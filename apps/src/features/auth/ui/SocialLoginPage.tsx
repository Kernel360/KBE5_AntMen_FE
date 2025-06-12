'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function SocialLoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)

      // 구글 OAuth URL 생성
      const googleOAuthUrl =
        `${process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL}?` +
        `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&` +
        `response_type=${process.env.NEXT_PUBLIC_GOOGLE_RESPONSE_TYPE}&` +
        `scope=${encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_SCOPE as string)}`

      // 구글 인가코드 받기 위해 구글 로그인 페이지로 이동
      window.location.href = googleOAuthUrl
    } catch (error) {
      console.error('Google login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="mt-12 mb-8">
        {/* 두 번째 첨부 이미지를 public/icons/mascot.svg로 저장했다고 가정 */}
        <Image
          src="/icons/mascot.svg"
          alt="마스코트"
          width={120}
          height={120}
        />
      </div>
      {/* 메인 메시지 */}
      <h1 className="text-2xl font-bold text-center mb-2">
        일상의 작은 변화
        <br />
        지금 시작하세요!
      </h1>
      <p className="text-gray-500 text-center mb-8">청소는 앤트워크와 함께</p>
      {/* 강조 메시지 + 소셜 로그인 버튼 */}
      <div className="w-full flex flex-col items-center">
        <span className="relative inline-block text-sm bg-primary font-medium px-6 py-2 rounded-full text-gray-900 animate-float -translate-y-1 after:content-[''] after:absolute after:left-1/2 after:-bottom-2 after:-translate-x-1/2 after:border-x-8 after:border-t-8 after:border-b-0 after:border-x-transparent after:border-t-[16px] after:[border-top-color:#9CDAFB] after:w-0 after:h-0">
          3초만에 시작하기
        </span>
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full max-w-xs flex items-center justify-center gap-3 mb-2 bg-white text-gray-700 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
          <span>Login with Google</span>
        </button>
      </div>

      {/* 이메일 로그인 */}
      <Link href="/login/email" className="w-full">
        <button className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-900 hover:bg-gray-50 bg-white mb-4">
          이메일 로그인
        </button>
      </Link>
      {/* 하단 링크 */}
      <div className="flex justify-center gap-4 text-sm text-gray-500 mt-2">
        <Link href="/signup" className="font-medium text-gray-900 underline">
          회원가입
        </Link>
        <span className="text-gray-500">|</span>
        <Link href="/help" className="underline">
          문의하기
        </Link>
      </div>
    </div>
  )
}
