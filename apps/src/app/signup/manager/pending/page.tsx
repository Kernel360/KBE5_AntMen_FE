/**
 * 매니저 회원가입 대기 페이지
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const ManagerSignupPendingPage = () => {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-[375px] px-4 pt-4 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="p-2 text-2xl font-bold">회원가입 완료</div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-[#0fbcd6] rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            회원가입이 완료되었습니다!
          </h1>

          {/* Description */}
          <div className="space-y-4 text-center">
            <p className="text-gray-600 text-base leading-relaxed">
              제출해주신 서류를 검토 중입니다.<br />
              승인까지 <span className="font-semibold text-[#0fbcd6]">1~3일</span> 정도 소요됩니다.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">📋 검토 과정</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 신원 확인 서류 검토</li>
                <li>• 자격 요건 확인</li>
                <li>• 승인 완료 알림 발송</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-yellow-900 mb-2">📬 알림 안내</h3>
              <p className="text-sm text-yellow-800">
                승인 결과는 등록하신 <span className="font-semibold">이메일</span>로 안내해 드립니다.<br />
                승인 완료 후 로그인하여 매니저 서비스를 이용하실 수 있습니다.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3 mt-8">
            <button
              onClick={handleGoToLogin}
              className="w-full h-[52px] bg-[#0fbcd6] text-white rounded-lg text-base font-medium hover:bg-[#0eaec5] transition-colors"
            >
              로그인 하러가기
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full h-[52px] bg-gray-100 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-200 transition-colors"
            >
              홈으로 이동
            </button>
          </div>

          {/* Contact Info */}
          <div className="text-center text-sm text-gray-500 mt-6">
            <p>문의사항이 있으시면</p>
            <p className="font-semibold text-[#0fbcd6]">고객센터 1588-0000</p>
            <p>으로 연락해 주세요</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerSignupPendingPage; 