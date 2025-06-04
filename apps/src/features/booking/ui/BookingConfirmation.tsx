import React from 'react';

interface BookingConfirmationProps {
  bookingDate: string;
  address: string;
  entryMethod: string;
  details: string;
  cleaningToolsLocation?: string;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingDate,
  address,
  entryMethod,
  details,
  cleaningToolsLocation,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2">
        <span className="font-semibold text-[17px]">15:09 🌙</span>
        <div className="flex items-center gap-1">
          <span className="text-[17px]">•••</span>
          <span className="text-[17px]">📶</span>
          <span className="text-[17px]">📶</span>
          <div className="flex items-center justify-center w-6 h-3 bg-[#666666] rounded">
            <span className="text-[10px] text-white">43</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center px-4 pt-4">
        <button className="text-2xl">←</button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-6 p-4">
        {/* Title Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-[28px] font-bold">매주 일, 월</h1>
          <h2 className="text-[28px] font-bold">예약을 완료해 주세요.</h2>
          <div className="flex flex-col gap-2">
            <p className="text-[16px] text-[#666666]">{bookingDate}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[16px] text-[#666666]">스마트 매칭으로 예약</span>
            <div className="w-[60px] h-[60px] rounded-full bg-[#E8F4FD] flex items-center justify-center">
              <span className="text-2xl">👩‍💼</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#E5E7EB]" />

        {/* House Info Section */}
        <div className="flex flex-col gap-5">
          <h3 className="text-xl font-semibold">집 정보</h3>
          
          {/* Address Section */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[16px] font-semibold">주소</span>
              <button className="text-[14px] text-[#4A90E2]">변경</button>
            </div>
            <p className="text-[16px] text-[#666666]">{address}</p>
          </div>

          {/* Entry Method Section */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[16px] font-semibold">출입방법</span>
              <button className="text-[14px] text-[#4A90E2]">변경</button>
            </div>
            <p className="text-[16px] text-[#666666]">{entryMethod}</p>
          </div>

          {/* Detail Info Section */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[16px] font-semibold">상세정보</span>
              <button className="text-[14px] text-[#4A90E2]">변경</button>
            </div>
            <p className="text-[16px] text-[#CCCCCC]">{details}</p>
          </div>
        </div>

        {/* Warning Section */}
        <div className="flex justify-center items-center bg-[#2C2C2C] rounded-lg p-4 w-full">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-white">유의사항을 꼭 확인해주세요!</span>
            <div className="w-5 h-5 rounded-[10px] bg-white flex items-center justify-center">
              <span className="text-xs font-semibold text-[#2C2C2C]">!</span>
            </div>
          </div>
        </div>

        {/* Cleaning Location Section */}
        {cleaningToolsLocation && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[16px] font-semibold">청소도구 위치</span>
              <button className="text-[14px] text-[#4A90E2]">변경</button>
            </div>
          </div>
        )}
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center items-center w-full">
        <div className="w-[134px] h-[5px] bg-black rounded"></div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 