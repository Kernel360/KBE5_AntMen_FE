'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { LoginGateway } from '@/features/auth/ui/LoginGateway'
import { useLoginOrigin } from '@/features/auth/ui/LoginOrigin'
import PrimaryButton from '@/shared/ui/Button/PrimaryButton'
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'

interface LoginFormData {
  userLoginId: string
  userPassword: string
}

export function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams?.get('code')

  // 🎯 LoginOrigin Hook 사용
  const { login, loginError } = useLoginOrigin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  // 구글 인가코드 받을 경우 회원 유무 결정 후 로그인 처리
  if (code) {
    return <LoginGateway />
  }

  const onSubmit = async (data: LoginFormData) => {
    // 일반 로그인 처리
    await login(data)
  }

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
    <div className="w-full h-full">
      {/* 헤더 섹션 - 간격 최소화 */}
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
          <span className="text-xl text-white font-bold">🏠</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">AntWork</h1>
        <p className="text-gray-600 text-xs">편리한 생활 서비스의 시작</p>
      </div>

      {/* 로그인 폼 - 패딩과 간격 최소화 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* 아이디 입력 */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              아이디
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                {...register('userLoginId', {
                  required: '아이디를 입력해주세요',
                  minLength: {
                    value: 4,
                    message: '아이디는 4자 이상이어야 합니다',
                  },
                })}
                placeholder="아이디를 입력하세요"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:bg-white transition-colors duration-200 text-gray-800 placeholder-gray-400 text-sm"
              />
            </div>
            {errors.userLoginId && (
              <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                <span>⚠️</span>
                {errors.userLoginId.message}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('userPassword', {
                  required: '비밀번호를 입력해주세요',
                  minLength: {
                    value: 6,
                    message: '비밀번호는 6자 이상이어야 합니다',
                  },
                })}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:bg-white transition-colors duration-200 text-gray-800 placeholder-gray-400 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.userPassword && (
              <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                <span>⚠️</span>
                {errors.userPassword.message}
              </p>
            )}
          </div>

          {/* 로그인 버튼 - 크기 축소 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2.5 px-4 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mt-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                로그인 중...
              </div>
            ) : (
              '로그인하기'
            )}
          </button>
        </form>

        {loginError && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-xs flex items-center gap-1">
              <span>❌</span>
              {loginError}
            </p>
          </div>
        )}
      </div>

      {/* 소셜 로그인 섹션 - 간격 최소화 */}
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-gray-50 text-gray-500 font-medium">또는</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 py-2.5 px-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 shadow-sm"
        >
          <Image src="/google-icon.svg" alt="Google" width={18} height={18} />
          <span className="font-medium text-sm">Google로 시작하기</span>
        </button>
      </div>

      {/* 회원가입 링크 - 간격과 패딩 최소화 */}
      <div className="text-center mt-3 p-3 bg-gray-100 rounded-xl">
        <p className="text-gray-600 mb-1 text-xs">아직 계정이 없으신가요?</p>
        <Link 
          href="/signup" 
          className="inline-flex items-center gap-1 text-primary-700/80 font-semibold text-sm hover:text-primary-700 transition-colors duration-200"
        >
          <span>🚀</span>
          회원가입하기
        </Link>
      </div>
    </div>
  )
}
