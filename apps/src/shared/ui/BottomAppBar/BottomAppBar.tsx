import React from "react";
import Link from "next/link";

export const BottomAppBar = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] h-16 bg-white flex justify-between items-center border-t border-gray-200 z-50 px-4">
      <Link href="/" className="flex flex-col items-center gap-1 text-xs text-gray-900 font-medium">
        홈
      </Link>
      <Link href="/reservation" className="flex flex-col items-center gap-1 text-xs text-gray-900 font-medium">
        내 예약
      </Link>
      <Link href="/chats" className="flex flex-col items-center gap-1 text-xs text-gray-900 font-medium">
        활동소식
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-1 text-xs text-gray-900 font-medium">
        더보기
      </Link>
    </nav>
  );
}; 