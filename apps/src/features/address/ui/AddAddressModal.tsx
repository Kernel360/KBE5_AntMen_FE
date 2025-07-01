"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDaumPostcode } from "@/shared/hooks";
import { getCoordinatesFromAddress } from "@/utils/kakaoCoords";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAddress: (address: { main: string; detail: string; addressName: string; area: number; customerLatitude?: number; customerLongitude?: number; }) => void;
  onAddressSelect?: (address: { main: string; detail: string; addressName: string; area: number; customerLatitude?: number; customerLongitude?: number; }) => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onAddAddress,
  onAddressSelect,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [addressName, setAddressName] = useState("");
  const [area, setArea] = useState(0);
  const [coordinates, setCoordinates] = useState<{customerLatitude?: number, customerLongitude?: number}>({});


  const handleComplete = async (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    // ✅ 위경도 정보 추출 (기존 getCoordinatesFromAddress 함수 활용)
    try {
      const coords = await getCoordinatesFromAddress(fullAddress);

      if (coords) {
        const customerLatitude = coords.lat;
        const customerLongitude = coords.lng;

        setCoordinates({ customerLatitude, customerLongitude });
        console.log('추출된 좌표:', { customerLatitude, customerLongitude });
      } else {
        console.warn('좌표 변환 실패:', fullAddress);
        setCoordinates({});
      }
    } catch (error) {
      console.error('좌표 변환 중 오류:', error);
      setCoordinates({});
    }

    if (onAddressSelect) {
      onAddressSelect({
        main: fullAddress,
        detail: "", // 상세주소는 빈 값
        addressName: data.buildingName || "선택된 주소",
        area: 0, // 기본값
        customerLatitude: coordinates.customerLatitude,
        customerLongitude: coordinates.customerLongitude
      });
      //onClose();
      return; // 여기서 함수 종료하여 기존 폼으로 넘어가지 않음
    }

    setSelectedAddress(fullAddress);
    setIsSearching(false);
  };

  useDaumPostcode(isSearching, { onComplete: handleComplete });

  const handleAddClick = () => {
    if (selectedAddress && detailAddress && addressName && area > 0) {
      onAddAddress({
        main: selectedAddress,
        detail: detailAddress, addressName, area,
        customerLatitude: coordinates.customerLatitude,
        customerLongitude: coordinates.customerLongitude});
      setSelectedAddress("");
      setDetailAddress("");
      setAddressName("");
      setArea(0);
      setCoordinates({});
        onClose();
    } else {
      alert("모든 정보를 입력해주세요.");
    }
  };

  const handleStartSearch = () => setIsSearching(true);

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

        {isSearching ? (
          <div id="postcode-container" style={{ height: "500px" }} />
        ) : selectedAddress ? (
          <div className="flex flex-col gap-4 px-5 pb-5">
            <h1 className="font-inter text-2xl font-bold text-[#333333]">상세 주소 및 정보를 입력해주세요</h1>
            <div className="rounded-xl bg-[#F5F5F5] p-4">{selectedAddress}</div>

            {/* ✅ 개발 환경에서만 좌표 정보 표시 */}
            {/* {process.env.NODE_ENV === 'development' && coordinates.customerLatitude && (
                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                  📍 위도: {coordinates.customerLatitude}, 경도: {coordinates.customerLongitude}
                </div>
            )} */}

            <input
              type="text"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              placeholder="상세 주소 입력"
              className="rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              value={addressName}
              onChange={(e) => setAddressName(e.target.value)}
              placeholder="주소 별칭 (예: 우리집, 사무실)"
              className="rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="number"
              value={area === 0 ? '' : area}
              onChange={(e) => setArea(Number(e.target.value))}
              placeholder="평수 (숫자만 입력해주세요, 예: 50)"
              min={1}
              className="rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleAddClick}
              className="rounded-xl bg-primary-500 py-4 text-white font-bold"
            >
              주소 추가
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 px-5">
              <h1 className="font-inter text-2xl font-bold text-[#333333]">지번, 도로명, 건물명으로</h1>
              <h2 className="font-inter text-2xl font-bold text-[#333333]">검색해 주세요.</h2>
            </div>
            <div className="px-5 pt-6">
              <button
                onClick={handleStartSearch}
                className="flex w-full items-center gap-3 rounded-xl bg-[#F5F5F5] p-4 text-left"
              >
                <Image src="/icons/search.svg" alt="검색" width={20} height={20} className="text-[#999999]" />
                <span className="text-base text-[#999999] font-inter">청연동 12-3 또는 청연아파트</span>
              </button>
            </div>
          </>
        )}

        {/* Service Notice */}
        <div className="flex justify-center py-4">
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