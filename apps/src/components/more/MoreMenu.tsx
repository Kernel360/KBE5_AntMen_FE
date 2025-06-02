"use client";

import React from "react";
import Link from 'next/link';

// Based on Figma design (node-id 29-2) and 참고ing existing components in apps/src/components

const MoreMenu = () => {
  // Function to render menu item with icon, text, and chevron, similar to common list items in the codebase
  const renderMenuItem = (text: string, IconComponent: React.FC<React.SVGProps<SVGSVGElement>>, href?: string) => {
    const content = (
      <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200 last:border-b-0 cursor-pointer">
        <div className="flex items-center gap-4">
          {/* Icon Styling based on common patterns - black stroke, appropriate size */}
          <div className="w-6 h-6 flex items-center justify-center">
            <IconComponent className="stroke-black stroke-2" />
          </div>
          {/* Text Styling based on common patterns - dark text, medium size */}
          <span className="text-base text-gray-800">{text}</span>
        </div>
        {/* Chevron Icon - consistent color and size */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-gray-400 stroke-2">
          <path d="M7.5 15L12.5 10L7.5 5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );

    if (href) {
      return <Link href={href} passHref>{content}</Link>;
    }
    return content;
  };

  // SVG icons (simplified and adjusted based on common practices/readability)
  // Using consistent stroke/fill properties
  const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 15H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const PercentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="17.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const PCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 16V8H13C14.0609 8 15.0783 8.42086 15.8284 9.17157C16.5791 9.92228 17 10.9391 17 12C17 13.0609 16.5791 14.0777 15.8284 14.8284C15.0783 15.5791 14.0609 16 13 16H9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const MCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 16V8L12 13L16 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const GiftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14 6H10C8.93913 6 7.92172 6.42086 7.17157 7.17157C6.42086 7.92228 6 8.93913 6 10V20C6 20.5304 6.21071 21.0391 6.58579 21.4142C6.96086 21.7893 7.46957 22 8 22H16C16.5304 22 17.0391 21.7893 17.4142 21.4142C17.7893 21.0391 18 20.5304 18 20V10C18 8.93913 17.5791 7.92228 16.8284 7.17157C16.0777 6.42086 15.0609 6 14 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 10V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 10V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const AddressIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Bottom Tab Icons (colors derived from common usage in codebase)
  const BottomHomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const BottomMyBookingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const BottomPlusShopIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const BottomMoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
      <circle cx="19" cy="12" r="1" fill="currentColor"/>
      <circle cx="5" cy="12" r="1" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="w-full max-w-sm mx-auto bg-white flex flex-col min-h-screen">
      {/* Status Bar - simplified or use system component if available */}
      {/* Keeping a placeholder based on Figma but simplifying structure */}
      <div className="flex justify-between items-center px-4 h-11">
        <span className="font-semibold text-sm text-black">4:40</span>
        {/* Placeholder icons for signal, wifi, battery */}
        <div className="flex items-center gap-1">
           <span className="text-black text-sm">📶</span>
           <span className="text-black text-sm">📶</span>
           <span className="text-black text-sm">🔋</span>
        </div>
      </div>

      {/* Header - simplified */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">더보기</h1>
      </div>

      {/* Menu Items - using the render function */}
      <div className="flex flex-col flex-grow">
        {renderMenuItem('서비스 범위', HomeIcon)}
        {renderMenuItem('결제수단 관리', CardIcon)}
        {renderMenuItem('쿠폰', PercentIcon)}
        {renderMenuItem('가사 포인트', PCircleIcon)}
        {renderMenuItem('삼마일리지', MCircleIcon)}
        {renderMenuItem('선물하기', GiftIcon)}
        <div className="w-full h-2 bg-gray-100" />
        {renderMenuItem('계정정보', UserIcon, '/account')}
        {renderMenuItem('주소 관리', AddressIcon, '/address')}
        {/* Add more menu items as needed */}
      </div>

      {/* Bottom Tab Bar - simplified based on common app patterns */}
      {/* This might be a separate shared component if used across the app */}
      <div className="flex justify-around items-center bg-white border-t border-gray-200 h-16">
         <div className="flex flex-col items-center gap-1">
           <BottomHomeIcon className="w-6 h-6 stroke-gray-400 stroke-2" />
           <span className="text-xs text-gray-500">홈</span>
         </div>
         <div className="flex flex-col items-center gap-1">
           <BottomMyBookingIcon className="w-6 h-6 stroke-gray-400 stroke-2" />
           <span className="text-xs text-gray-500">내 예약</span>
         </div>
         <div className="flex flex-col items-center gap-1 relative">
            <BottomPlusShopIcon className="w-6 h-6 stroke-gray-400 stroke-2" />
            {/* Notification Badge */}
            <span className="absolute -top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-xs text-gray-500">플러스샵</span>
         </div>
         <div className="flex flex-col items-center gap-1">
           <BottomMoreIcon className="w-6 h-6 fill-black" />
           <span className="text-xs text-black">더보기</span>
         </div>
      </div>
    </div>
  );
};

export default MoreMenu; 