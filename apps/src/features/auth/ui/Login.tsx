'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { LoginGateway } from '../features/auth/ui/LoginGateway';
import { useLoginOrigin } from '../features/auth/ui/LoginOrigin';

interface LoginFormData {
  userLoginId: string;
  userPassword: string;
}

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get('code');

  // 🎯 LoginOrigin Hook 사용
  const { login } = useLoginOrigin();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>();

  // 구글 인가코드 받을 경우 회원 유무 결정 후 로그인 처리
  if (code) {
    return <LoginGateway />;
  }

  const onSubmit = async (data: LoginFormData) => {
    // 일반 로그인 처리
    await login(data);
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      // 구글 OAuth URL 생성
      const googleOAuthUrl = `${process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL}?` +
          `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
          `redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&` +
          `response_type=${process.env.NEXT_PUBLIC_GOOGLE_RESPONSE_TYPE}&` +
          `scope=${encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_SCOPE as string)}`;

      // 구글 인가코드 받기 위해 구글 로그인 페이지로 이동
      window.location.href = googleOAuthUrl;

    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">아이디</label>
          <input
            type="text"
            {...register('userLoginId', {
              required: '아이디를 입력해주세요',
              minLength: {
                value: 4,
                message: '아이디는 4자 이상이어야 합니다'
              }
            })}
            placeholder="아이디를 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fbcd6] text-gray-700"
          />
          {errors.userLoginId && (
            <p className="text-red-500 text-sm mt-1">{errors.userLoginId.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">비밀번호</label>
          <input
            type="password"
            {...register('userPassword', {
              required: '비밀번호를 입력해주세요',
              minLength: {
                value: 6,
                message: '비밀번호는 6자 이상이어야 합니다'
              }
            })}
            placeholder="비밀번호를 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fbcd6] text-gray-700"
          />
          {errors.userPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.userPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#0fbcd6] text-white rounded-lg hover:bg-[#0ca8c0] transition-colors disabled:opacity-50">
          로그인
        </button>
      </form>

      <div className="space-y-4">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50">
          <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
          <span>Login with Google</span>
        </button>

        <div className="text-center text-gray-500">
          <span>계정이 없으신가요? </span>
          <Link href="/signup/select" className="text-[#F97316] hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
} 