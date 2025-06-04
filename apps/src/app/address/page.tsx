"use client";

import React, { useState } from "react";
import Link from 'next/link';
import AddAddressModal from '@/features/address/ui/AddAddressModal';
import AddressManagementPageUI from '@/features/address/ui/AddressManagementPageUI';

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

      {/* Add Address Modal */}
      <AddAddressModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default AddressPageUI; 