"use client";

import React from "react";
import MenuItem from '@/shared/ui/MenuItem';
import { HomeIcon, CardIcon, PercentIcon, PCircleIcon, MCircleIcon, GiftIcon, UserIcon, AddressIcon } from './Icons';

const MoreMenu = () => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white flex flex-col min-h-screen">
      <div className="flex justify-between items-center px-4 h-11">
        <span className="font-semibold text-sm text-black">4:40</span>
        <div className="flex items-center gap-1">
           <span className="text-black text-sm">📶</span>
           <span className="text-black text-sm">📶</span>
           <span className="text-black text-sm">🔋</span>
        </div>
      </div>
      <div className="flex items-center px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">더보기</h1>
      </div>
      <div className="flex flex-col flex-grow">
        <MenuItem text="서비스 범위" IconComponent={HomeIcon} />
        <MenuItem text="결제수단 관리" IconComponent={CardIcon} />
        <MenuItem text="쿠폰" IconComponent={PercentIcon} />
        <MenuItem text="가사 포인트" IconComponent={PCircleIcon} />
        <MenuItem text="삼마일리지" IconComponent={MCircleIcon} />
        <MenuItem text="선물하기" IconComponent={GiftIcon} />
        <div className="w-full h-2 bg-gray-100" />
        <MenuItem text="계정정보" IconComponent={UserIcon} href="/account" />
        <MenuItem text="주소 관리" IconComponent={AddressIcon} href="/address" />
      </div>
    </div>
  );
};

export default MoreMenu; 