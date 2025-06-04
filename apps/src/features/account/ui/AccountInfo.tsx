"use client";

import React from "react";
import Link from 'next/link';
import ListItem from '@/shared/ui/ListItem';
import ToggleSwitch from '@/shared/ui/ToggleSwitch';

const AccountInfo = () => {
  const [isEventNotificationOn, setIsEventNotificationOn] = React.useState(false);
  const [isAppNotificationOn, setIsAppNotificationOn] = React.useState(true);

  return (
    <div className="w-full max-w-sm mx-auto bg-white flex flex-col min-h-screen">
      <div className="flex justify-between items-center px-4 h-11">
        <span className="font-semibold text-base text-black">4:40</span>
        <div className="flex items-center gap-1">
          <span className="text-black text-base">📶</span>
          <span className="text-black text-base">📶</span>
          <div className="w-6 h-3 bg-[#4ADE80] rounded-[2px] flex items-center justify-end p-0.5">
            <div className="w-4 h-2 bg-white rounded-[1px]"/>
          </div>
          <span className="text-xs text-[#4ADE80]">37%</span>
        </div>
      </div>
      <div className="flex items-center px-4 py-4 border-b border-gray-200">
        <Link href="/more" passHref><span className="text-2xl font-normal text-black mr-4 cursor-pointer">←</span></Link>
        <h1 className="text-xl font-bold text-gray-800">계정정보</h1>
      </div>
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">계정정보</h2>
        <div className="flex items-center gap-1 px-2 py-1 bg-[#E8F4FD] rounded-full text-[#00BCD4] text-xs font-medium">
          <span>✓</span>
          <span>본인인증 완료</span>
        </div>
      </div>
      <div className="flex flex-col px-4 py-4 flex-grow">
        <ListItem label="프로필" value="윤예림(윤예림)" href="/profile" />
        <ListItem label="전화번호" value="010-1111-2222" href="/phone" />
        <ListItem label="내 추천코드" value="D4F1A6C" href="/referral" />
        <ListItem label="기업용 이메일" value="등록하기" href="/email" />
        <div className="w-full h-px bg-gray-200 my-4" />
        <div className="flex flex-col">
          <div className="flex items-center py-4 text-base text-gray-800 cursor-pointer">로그아웃</div>
          <div className="w-full h-px bg-gray-200" />
          <div className="flex items-center py-4 text-base text-gray-800 cursor-pointer">탈퇴</div>
        </div>
        <div className="w-full h-px bg-gray-200 my-4" />
        <div className="flex flex-col gap-2 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-800">이벤트 소식 알림</span>
            <ToggleSwitch isOn={isEventNotificationOn} onToggle={() => setIsEventNotificationOn(!isEventNotificationOn)} />
          </div>
          <span className="text-sm text-gray-500 w-full text-wrap">카카오톡, SMS, 앱푸시를 통해 이벤트 소식을 알려드립니다.</span>
          <div className="flex items-center justify-between mt-4">
            <span className="text-base text-gray-800">앱 푸시 알림</span>
            <ToggleSwitch isOn={isAppNotificationOn} onToggle={() => setIsAppNotificationOn(!isAppNotificationOn)} />
          </div>
          <span className="text-sm text-gray-500 w-full text-wrap">중요한 서비스 진행 소식을 알려드려요.</span>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo; 