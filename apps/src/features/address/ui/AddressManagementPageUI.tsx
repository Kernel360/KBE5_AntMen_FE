"use client";

import React from "react";
import Link from 'next/link';
import AddAddressModal from '@/features/address/ui/AddAddressModal';

const AddressManagementPageUI = () => {
  const [activeTab, setActiveTab] = React.useState('집');
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);

  const renderTab = (tabName: string) => (
    <button
      key={tabName}
      className={`flex flex-col items-center py-3 focus:outline-none ${activeTab === tabName ? 'text-[#00BCD4] font-semibold' : 'text-gray-500 font-normal'}`}
      onClick={() => setActiveTab(tabName)}
    >
      <span>{tabName}</span>
      {activeTab === tabName && <div className="w-15 h-0.5 bg-[#00BCD4] mt-1" />}
    </button>
  );

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-sm mx-auto bg-white flex flex-col min-h-screen">
        <div className="flex justify-between items-center px-4 h-11">
          <span className="font-semibold text-base text-black">4:39</span>
          <div className="flex items-center gap-1">
             <span className="text-black text-base">📶</span>
             <span className="text-black text-base">📶</span>
              <div className="w-6 h-3 bg-[#4ADE80] rounded-[2px] flex items-center justify-end p-0.5">
                 <div className="w-4 h-2 bg-white rounded-[1px]"/>
              </div>
             <span className="text-xs text-[#4ADE80]">35%</span>
          </div>
        </div>
        <div className="flex items-center px-4 py-4 border-b border-gray-200">
           <Link href="/more" passHref className="text-2xl font-normal text-black mr-4 cursor-pointer">←</Link>
          <h1 className="text-xl font-bold text-gray-800">주소관리</h1>
        </div>
        <div className="flex w-full justify-around border-b border-gray-200 px-4">
           {renderTab('집')}
           {renderTab('사무실')}
        </div>
        <div className="flex flex-col gap-6 px-4 py-4 flex-grow">
           {activeTab === '집' && (
             <div className="flex flex-col gap-2">
                <span className="font-semibold text-lg text-gray-800">우리집(20평)</span>
                <span className="text-sm text-gray-600">서울특별시 강남구 강남대로 364 (역삼동)</span>
             </div>
           )}
           {activeTab === '사무실' && (
              <div className="flex flex-col gap-2 text-gray-600 text-sm">
                 <span>등록된 사무실 주소가 없습니다.</span>
              </div>
           )}
           <div className="flex justify-center mt-auto pb-6">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-full text-[#666666] text-sm focus:outline-none" onClick={openSearchModal}>
                 <span>+</span>
                 <span>주소추가</span>
              </button>
           </div>
        </div>
      </div>
      <AddAddressModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />
    </>
  );
};

export default AddressManagementPageUI; 