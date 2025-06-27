'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface SignUpFormData {
  id: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: string;
  email: string;
  gender: string;
}

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SignUpFormData>();

  const password = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    console.log('SignUp attempt with:', data);
    // TODO: Implement signup logic
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Google signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      setIsLoading(true);
      await signIn('facebook', { callbackUrl: '/' });
    } catch (error) {
      console.error('Facebook signup error:', error);
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
            {...register('id', {
              required: '아이디를 입력해주세요',
              minLength: {
                value: 4,
                message: '아이디는 4자 이상이어야 합니다'
              }
            })}
            placeholder="아이디를 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
          />
          {errors.id && (
            <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-600">비밀번호</label>
          <input
            type="password"
            {...register('password', {
              required: '비밀번호를 입력해주세요',
              minLength: {
                value: 6,
                message: '비밀번호는 6자 이상이어야 합니다'
              }
            })}
            placeholder="비밀번호를 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-600">비밀번호 확인</label>
          <input
            type="password"
            {...register('passwordConfirm', {
              required: '비밀번호를 다시 입력해주세요',
              validate: value => value === password || '비밀번호가 일치하지 않습니다'
            })}
            placeholder="비밀번호를 다시 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
          />
          {errors.passwordConfirm && (
            <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-600">전화번호</label>
          <input
            type="tel"
            {...register('phoneNumber', {
              required: '전화번호를 입력해주세요',
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: '올바른 전화번호 형식이 아닙니다'
              }
            })}
            placeholder="전화번호를 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-600">이메일</label>
          <input
            type="email"
            {...register('email', {
              required: '이메일을 입력해주세요',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '올바른 이메일 형식이 아닙니다'
              }
            })}
            placeholder="이메일을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-600">성별</label>
          <select
            {...register('gender', {
              required: '성별을 선택해주세요'
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
          >
            <option value="">성별을 선택하세요</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary text-white rounded-lg hover:bg-[#0ca8c0] transition-colors disabled:opacity-50">
          가입하기
        </button>
      </form>

      <div className="space-y-4">
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50">
          <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
          <span>Sign up with Google</span>
        </button>

        <button
          onClick={handleFacebookSignUp}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 px-4 rounded-lg border border-gray-300 hover:bg-[#1864D6] transition-colors disabled:opacity-50">
          <Image src="/facebook-icon.svg" alt="Facebook" width={20} height={20} />
          <span>Sign up with Facebook</span>
        </button>

        <div className="text-center text-gray-500">
          <span>이미 계정이 있으신가요? </span>
          <Link href="/login" className="text-primary hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
} 