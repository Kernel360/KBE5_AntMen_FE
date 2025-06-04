"use client";

import React from "react";
import { HomeIcon, CardIcon, PercentIcon, PCircleIcon, MCircleIcon, GiftIcon, UserIcon, AddressIcon } from './Icons';
import { MenuItem } from "@/shared/ui/MenuItem";

const MoreMenu = () => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white flex flex-col min-h-screen">
      <section className="flex items-center px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">더보기</h1>
      </section>
      <ul className="flex flex-col flex-grow">
        <MenuItem label="서비스 범위" icon={HomeIcon} />
        <MenuItem label="결제수단 관리" icon={CardIcon} />
        <MenuItem label="쿠폰" icon={PercentIcon} />
        <MenuItem label="가사 포인트" icon={PCircleIcon} />
        <MenuItem label="삼마일리지" icon={MCircleIcon} />
        <MenuItem label="선물하기" icon={GiftIcon} />
        <hr className="w-full h-2 bg-gray-100" />
        <MenuItem label="계정정보" icon={UserIcon} href="/account" />
        <MenuItem label="주소 관리" icon={AddressIcon} href="/address" />
      </ul>
    </div>
  );
};

export default MoreMenu; 