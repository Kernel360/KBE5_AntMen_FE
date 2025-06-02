"use client";

import React from "react";
import Link from 'next/link';

// Figma design reference: https://www.figma.com/design/yv8Rt8IvVj71Shnumxd8Gs/Untitled?node-id=16-35&t=gMPDpQ2Zr5s8zIOJ-11
// 参考ing existing components in apps/src/components

// Mapping Figma styles and layout from metadata to Tailwind classes and inline styles for node-id 16-35
// Colors:
// fill_4Y2ZSZ: #FFFFFF (White)
// fill_XR2SVW: #000000 (Black)
// fill_OWDDPV: #4ADE80 (Green for battery)
// fill_9M7X4M: #E8F4FD (Verification badge background)
// fill_LECDPP: #00BCD4 (Verification badge text/icon, App toggle on)
// fill_U3RU22: #CCCCCC (Chevron/placeholder text)
// fill_I6SC0D: #F0F0F0 (Divider)
// fill_DITQ6F: #E5E7EB (Event toggle off)
// fill_C3879J: #999999 (Description text)

// Layouts and Styles (simplified and mapped to Tailwind/common practices):
// layout_UDYWNL: Main frame (fixed 375x812) -> w-full max-w-sm mx-auto bg-white flex flex-col min-h-screen
// layout_IWXZRX: Status Bar (row, space-between, center, padding 0 16px, fixed height) -> flex justify-between items-center px-4 h-11
// style_3BPEI0: Time (Inter, 600, 17px) -> font-semibold text-base text-black (adjusted size for common scale)
// layout_TIYZAQ: Status Icons (row, justify end, center, gap 4px) -> flex items-center gap-1
// style_AIXLTO: Status Icons Text (Inter, 400, 17px) -> text-base text-black
// layout_79G65S: Battery Frame (fixed 24x12) -> w-6 h-3 (simplified representation)
// style_6ZEFF0: Battery % (Inter, 400, 10px) -> text-xs text-[#4ADE80]
// layout_X9JQX3: Header (row, center, padding 16px 16px 0) -> flex items-center px-4 py-4 border-b border-gray-200 (adjusted padding/border)
// style_HJO766: Back Arrow (Inter, 400, 24px) -> text-2xl font-normal text-black
// layout_NM2MW4: Title Section (row, center, gap 8px, padding 16px) -> flex items-center gap-2 px-4 py-4 (adjusted padding/gap)
// style_NQSS09: Title (Inter, 700, 24px) -> text-xl font-bold text-gray-800 (adjusted size for common scale)
// layout_UO2B86: Verification Badge (row, center, gap 4px, padding 4px 8px, border-radius 12px) -> flex items-center gap-1 px-2 py-1 bg-[#E8F4FD] rounded-full text-[#00BCD4] text-xs font-medium
// style_7Y5WXK: Verification text/icon (Inter, 400/12px) -> text-xs font-medium (adjusted font weight)
// layout_UCTJHU: Content (column, padding 16px) -> flex flex-col px-4 py-4
// layout_VK9YLH: List Item (row, space-between, center) -> flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0
// style_MB0GDP: List Item Text (Inter, 400, 16px) -> text-base text-gray-800
// layout_HUGCHK: Value/Chevron container (row, justify end, center, gap 8px) -> flex items-center gap-2
// fill_U3RU22: Chevron color (#CCCCCC) -> text-gray-400
// layout_LGVMK3: Divider (fixed height 1px, fill) -> w-full h-px bg-gray-200
// layout_LNRQ4L: Logout/Delete Item (row, center, fill) -> flex items-center py-4 text-base text-gray-800
// layout_YEQUFA: Notification Section (column, gap 8px, padding 0 0 24px) -> flex flex-col gap-2 pb-6
// fill_DITQ6F: Event Toggle Off (#E5E7EB) -> bg-gray-200
// fill_LECDPP: App Toggle On (#00BCD4) -> bg-[#00BCD4]
// layout_OMQ0GX, layout_5PHZIJ: Toggle switch (fixed 44x24, padding 2px, border-radius 12px) -> w-11 h-6 rounded-full p-0.5 flex items-center
// layout_KPL4XF: Toggle handle (fixed 20x20) -> w-5 h-5 rounded-full bg-white shadow-md
// fill_C3879J: Description text (#999999) -> text-sm text-gray-500
// layout_7LU5RF: Description layout -> w-full text-wrap
// layout_DKW0M0: Home Indicator -> Removed or simplified

const AccountInfoPageUI = () => {
  // Helper component for list items to reuse styling
  const ListItem = ({ label, value, href }: { label: string, value?: string, href?: string }) => {
    const content = (
      <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0 cursor-pointer">
        <span className="text-base text-gray-800">{label}</span>
        <div className="flex items-center gap-2">
          {value && <span className="text-base text-gray-500">{value}</span>} {/* Adjusted value text color */}
          {href && (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-gray-400 stroke-2">
              <path d="M7.5 15L12.5 10L7.5 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
    );
    if (href) {
      return <Link href={href} passHref>{content}</Link>;
    }
    return content;
  };

  const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean, onToggle: () => void }) => (
    <div
      className={`w-11 h-6 rounded-full p-0.5 flex items-center cursor-pointer ${
        isOn ? 'bg-[#00BCD4] justify-end' : 'bg-gray-200 justify-start'
      }`}
      onClick={onToggle}
    >
      <div className="w-5 h-5 rounded-full bg-white shadow-md" />
    </div>
  );

  // Placeholder for toggle states
  const [isEventNotificationOn, setIsEventNotificationOn] = React.useState(false);
  const [isAppNotificationOn, setIsAppNotificationOn] = React.useState(true); // Default to true based on Figma

  return (
    <div className="w-full max-w-sm mx-auto bg-white flex flex-col min-h-screen">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 h-11">
        <span className="font-semibold text-base text-black">4:40</span>
        {/* Placeholder Icons */}
        <div className="flex items-center gap-1">
          <span className="text-black text-base">📶</span>
          <span className="text-black text-base">📶</span>
          {/* Simplified Battery representation */}
          <div className="w-6 h-3 bg-[#4ADE80] rounded-[2px] flex items-center justify-end p-0.5">
            <div className="w-4 h-2 bg-white rounded-[1px]"/>
          </div>
          <span className="text-xs text-[#4ADE80]">37%</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200">
        {/* Back Arrow Placeholder */}
        <Link href="/more" passHref><span className="text-2xl font-normal text-black mr-4 cursor-pointer">←</span></Link>
        <h1 className="text-xl font-bold text-gray-800">계정정보</h1>
      </div>

      {/* Title Section with Verification */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">계정정보</h2> {/* Repeated Title for layout consistency */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[#E8F4FD] rounded-full text-[#00BCD4] text-xs font-medium">
          <span>✓</span>
          <span>본인인증 완료</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col px-4 py-4 flex-grow">
        {/* Profile Item */}
        <ListItem label="프로필" value="윤예림(윤예림)" href="/profile" /> {/* Added example href */}

        {/* Phone Item */}
        <ListItem label="전화번호" value="010-1111-2222" href="/phone" /> {/* Added example href */}

        {/* Referral Item */}
        <ListItem label="내 추천코드" value="D4F1A6C" href="/referral" /> {/* Added example href */}

        {/* Email Item */}
        <ListItem label="기업용 이메일" value="등록하기" href="/email" /> {/* Added example href */}

        {/* Dividers and Logout/Delete */}
        <div className="w-full h-px bg-gray-200 my-4" /> {/* Adjusted margin */}
        <div className="flex flex-col">
          <div className="flex items-center py-4 text-base text-gray-800 cursor-pointer">로그아웃</div>
          <div className="w-full h-px bg-gray-200" />
          <div className="flex items-center py-4 text-base text-gray-800 cursor-pointer">탈퇴</div>
        </div>
        <div className="w-full h-px bg-gray-200 my-4" /> {/* Adjusted margin */}

        {/* Notification Settings */}
        <div className="flex flex-col gap-2 pb-6">
          {/* Event Notification */}
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-800">이벤트 소식 알림</span>
            <ToggleSwitch isOn={isEventNotificationOn} onToggle={() => setIsEventNotificationOn(!isEventNotificationOn)} />
          </div>
          <span className="text-sm text-gray-500 w-full text-wrap">카카오톡, SMS, 앱푸시를 통해 이벤트 소식을 알려드립니다.</span>

          {/* App Notification */}
          <div className="flex items-center justify-between mt-4"> {/* Added margin top */}
            <span className="text-base text-gray-800">앱 푸시 알림</span>
            <ToggleSwitch isOn={isAppNotificationOn} onToggle={() => setIsAppNotificationOn(!isAppNotificationOn)} />
          </div>
          <span className="text-sm text-gray-500 w-full text-wrap">중요한 서비스 진행 소식을 알려드려요.</span>
        </div>
      </div>

      {/* Home Indicator - Removed based on common web patterns */}
      {/* If needed, add a simple div with background and height */}
      {/* <div className="flex justify-center items-center py-1" style={{ height: '34px' }}>
        <div className="w-[134px] h-[5px] bg-black rounded-full" />
      </div> */}
    </div>
  );
};

export default AccountInfoPageUI; 