'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignupSelectPage() {
  const router = useRouter();

  const handleSelectType = (type: 'manager' | 'customer') => {
    router.push(`/signup/${type}`);
  };

  return (
    <div className="w-[375px] mx-auto min-h-screen bg-white">
      <div className="p-5 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="text-base text-[#666666]">회원 유형을 선택해주세요.</p>
        </div>

        {/* Selection Cards */}
        <div className="space-y-4">
          {/* Manager Card */}
          <button
            onClick={() => handleSelectType('manager')}
            className="w-full p-6 border border-[#E5E7EB] rounded-xl space-y-4 text-left hover:border-[#2563EB] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold">매니저로 가입</h2>
                <p className="text-sm text-[#666666]">서비스를 제공하는 매니저로 활동합니다.</p>
              </div>
              <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center">
                <Image 
                  src="/icons/manager.svg"
                  alt="Manager Icon"
                  width={24}
                  height={24}
                  className="text-white"
                />
              </div>
            </div>
            <div className="text-sm text-[#666666]">
              <ul className="list-disc list-inside space-y-1">
                <li>서비스 제공 및 일정 관리</li>
                <li>수익 창출 기회</li>
                <li>전문 매니저로 성장</li>
              </ul>
            </div>
          </button>

          {/* Customer Card */}
          <button
            onClick={() => handleSelectType('customer')}
            className="w-full p-6 border border-[#E5E7EB] rounded-xl space-y-4 text-left hover:border-[#2563EB] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold">고객으로 가입</h2>
                <p className="text-sm text-[#666666]">서비스를 이용하는 고객으로 가입합니다.</p>
              </div>
              <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center">
                <Image 
                  src="/icons/customer.svg"
                  alt="Customer Icon"
                  width={24}
                  height={24}
                  className="text-white"
                />
              </div>
            </div>
            <div className="text-sm text-[#666666]">
              <ul className="list-disc list-inside space-y-1">
                <li>편리한 서비스 예약</li>
                <li>전문 매니저 선택</li>
                <li>맞춤형 서비스 이용</li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 