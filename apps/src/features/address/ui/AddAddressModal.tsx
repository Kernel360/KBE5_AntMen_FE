"use client";

import React, { useState } from "react";
import Image from "next/image";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/25"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed bottom-0 left-1/2 z-50 w-[390px] -translate-x-1/2 rounded-t-[20px] bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5">
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center"
          >
            <Image
              src="/icons/close.svg"
              alt="닫기"
              width={24}
              height={24}
              className="text-[#333333]"
            />
          </button>
        </div>

        {/* Title Section */}
        <div className="flex flex-col gap-2 px-5">
          <h1 className="font-inter text-2xl font-bold text-[#333333]">
            지번, 도로명, 건물명으로
          </h1>
          <h2 className="font-inter text-2xl font-bold text-[#333333]">
            검색해 주세요.
          </h2>
        </div>

        {/* Search Container */}
        <form onSubmit={handleSubmit} className="px-5 pt-6">
          <div className="flex items-center gap-3 rounded-xl bg-[#F5F5F5] p-4">
            <Image
              src="/icons/search.svg"
              alt="검색"
              width={20}
              height={20}
              className="text-[#999999]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="청연동 12-3 또는 청연아파트"
              className="flex-1 bg-transparent text-base font-inter placeholder:text-[#999999] focus:outline-none"
            />
          </div>
        </form>

        {/* Empty Space */}
        <div className="flex h-[400px] items-center justify-center" />

        {/* Service Notice */}
        <div className="flex justify-center">
          <span className="font-inter text-sm font-medium text-[#666666]">
            서비스 가능지역
          </span>
        </div>

        {/* Bottom Safe Area */}
        <div className="flex h-[34px] items-center justify-center">
          <div className="h-[5px] w-[134px] rounded-[2.5px] bg-black" />
        </div>
      </div>
    </>
  );
};

export default AddAddressModal; 