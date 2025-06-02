"use client";

import React, { useState } from "react";
import Link from 'next/link';
import AddAddressModal from '@/components/address-management/AddAddressModal';
import AddressManagementPageUI from "@/components/address-management/AddressManagementPageUI";

// Figma design reference: https://www.figma.com/design/yv8Rt8IvVj71Shnumxd8Gs/Untitled?node-id=16-7&t=gMPDpQ2Zr5s8zIOJ-11
// FSD structure consideration: Placing main page component here.

// Mapping Figma styles and layout from metadata to Tailwind classes for node-id 16-7
// Colors:
// fill_72U47C: #FFFFFF (White)
// fill_2XALI2: #000000 (Black)
// fill_V2ROVF: #4ADE80 (Green for battery)
// fill_4YPBSN: #00BCD4 (Cyan - Active tab, active tab underline)
// fill_P0HG6B: #999999 (Gray - Inactive tab, address text)
// fill_P7B4M2: #F8F9FA (Add button background)
// stroke_MMAIMW: #E5E7EB (Add button border)
// fill_5GMHY8: #666666 (Add button text/icon)

// Layouts and Styles (simplified and mapped to Tailwind/common practices):
// layout_EZ9B1Y: Main frame (fixed 375x812) -> w-full max-w-sm mx-auto bg-white flex flex-col min-h-screen
// layout_OPWEXC: Status Bar (row, space-between, center, padding 0 16px, fixed height) -> flex justify-between items-center px-4 h-11
// style_K7YK60: Time (Inter, 600, 17px) -> font-semibold text-base text-black
// layout_59COUM: Status Icons (row, justify end, center, gap 4px) -> flex items-center gap-1
// style_W5LMFX: Status Icons Text (Inter, 400, 17px) -> text-base text-black
// layout_PRKW15: Battery Frame (fixed 24x12) -> w-6 h-3
// style_DMQHIU: Battery % (Inter, 400, 10px) -> text-xs text-[#4ADE80]
// layout_0KZZEX: Header (row, center, padding 16px 16px 0) -> flex items-center px-4 py-4 border-b border-gray-200
// style_F5MEPD: Back Arrow (Inter, 400, 24px) -> text-2xl font-normal text-black
// layout_13RMK9: Tab Navigation (row, stretch, padding 0 16px) -> flex justify-around border-b border-gray-200
// layout_EATXJT: Tab Container (row, center) -> flex flex-grow
// layout_NGOXSN: Office Tab (padding 0 32px) -> flex-1 text-center py-3
// layout_2IXBZR: House Tab (column, center, gap 8px) -> flex-1 text-center py-3 border-b-2 border-[#00BCD4]
// style_4W6HKC: Active Tab Text (Inter, 600, 16px) -> font-semibold text-base text-[#00BCD4]
// style_8ULO00: Inactive Tab Text (Inter, 400, 16px) -> text-base text-gray-500
// layout_D4ZO9I: Content (column, gap 24px, padding 16px) -> flex flex-col gap-6 px-4 py-4 flex-grow overflow-y-auto
// layout_0QP08Q: Address Info (column, gap 8px) -> flex flex-col gap-2
// style_40MR1H: Address Title (Inter, 600, 20px) -> text-lg font-semibold text-black
// style_LBCE3P: Address Text (Inter, 400, 14px) -> text-sm text-gray-500
// layout_SYJ8LO: Add Address Button container (row, center) -> flex justify-center mt-4
// layout_6VS62S: Add Button (fixed 120x40, border-radius 20px, border 1px, gap 8px, center) -> flex items-center justify-center gap-2 w-32 h-10 border border-gray-300 rounded-full bg-gray-100 text-gray-600 text-sm
// fill_P7B4M2: Add button background (#F8F9FA) -> bg-gray-100
// stroke_MMAIMW: Add button border (#E5E7EB) -> border-gray-300
// fill_5GMHY8: Add button text/icon (#666666) -> text-gray-600
// layout_DUFGPL: Home Indicator -> Removed or simplified

const AddressPageUI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Helper component for the tab items
  const TabItem = ({ text, isActive }: { text: string, isActive: boolean }) => (
    <div className={`flex-1 text-center py-3 cursor-pointer ${isActive ? 'border-b-2 border-[#00BCD4]' : ''}`}>
      <span className={`text-base ${isActive ? 'font-semibold text-[#00BCD4]' : 'text-gray-500 font-normal'}`}>
        {text}
      </span>
    </div>
  );

  // Helper component for the address info block
  const AddressInfoBlock = ({ title, address }: { title: string, address: string }) => (
    <div className="flex flex-col gap-2">
      <span className="text-lg font-semibold text-black">{title}</span>
      <span className="text-sm text-gray-500">{address}</span>
    </div>
  );

  return (
    <div className="w-full max-w-sm mx-auto bg-white flex flex-col min-h-screen">

      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 h-11">
        <span className="font-semibold text-base text-black">4:39</span>
        {/* Placeholder Icons */}
        <div className="flex items-center gap-1">
           <span className="text-black text-base">📶</span>
           <span className="text-black text-base">📶</span>
            {/* Simplified Battery representation */}
            <div className="w-6 h-3 bg-[#4ADE80] rounded-[2px] flex items-center justify-end p-0.5">
               <div className="w-4 h-2 bg-white rounded-[1px]"/>
            </div>
           <span className="text-xs text-[#4ADE80]">35%</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200">
         {/* Back Arrow Placeholder */}
         <Link href="/more" passHref><span className="text-2xl font-normal text-black mr-4 cursor-pointer">←</span></Link> {/* Added link back to /more */}
        <h1 className="text-xl font-bold text-gray-800">주소관리</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b border-gray-200">
        <TabItem text="집" isActive={true} /> {/* Example: '집' tab is active */}
        <TabItem text="사무실" isActive={false} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 px-4 py-4 flex-grow overflow-y-auto">

        {/* House Address Info */}
        <AddressInfoBlock
          title="우리집(20평)"
          address="서울특별시 강남구 강남대로 364 (역삼동) ㅋ"
        />
        {/* Add more address blocks here if needed */}

        {/* Add Address Button */}
        <div className="flex justify-center mt-4">
           <button
             className="flex items-center justify-center gap-2 w-32 h-10 border border-gray-300 rounded-full bg-gray-100 text-gray-600 text-sm"
             onClick={openModal}
           >
              <span>+</span>
              <span>주소추가</span>
           </button>
        </div>

      </div>

      {/* Home Indicator - Removed based on common web patterns */}
      {/* If needed, add a simple div with background and height */}
      {/* <div className="flex justify-center items-center py-1" style={{ height: '34px' }}>
        <div className="w-[134px] h-[5px] bg-black rounded-full" />
      </div> */}

      {/* Add Address Modal */}
      <AddAddressModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default AddressPageUI; 