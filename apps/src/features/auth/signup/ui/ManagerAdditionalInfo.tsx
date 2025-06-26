'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getCoordinatesFromAddress } from "@/utils/kakaoCoords";

// 동적 임포트로 모달 최적화
const AddAddressModal = dynamic(
    () => import('@/features/address/ui/AddAddressModal'),
    {
      ssr: false,
      loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg">Loading...</div>
    }
);

// 디바운스 유틸리티 함수
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ✅ 수정된 인터페이스 - 위경도 분리
export interface ManagerAdditionalData {
  address: string;
  addressDetail: string;
  latitude: number | null;   // 위도 분리
  longitude: number | null;  // 경도 분리
  workHours: {
    start: string;
    end: string;
  };
}

interface ManagerAdditionalInfoProps {
  data: ManagerAdditionalData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onWorkHoursChange: (type: 'start' | 'end', value: string) => void;
  onAddressChange: (address: string) => void;
  onAddressDetailChange: (detail: string) => void;
  onCoordinatesChange: (latitude: number | null, longitude: number | null) => void; // ✅ 수정된 시그니처
  onAddressSelect: (addressData: {
    main: string;
    detail: string;
    addressName: string;
    area: number;
  }) => Promise<void>;
  errors?: {
    [key: string]: string;
  };
}

export const ManagerAdditionalInfo: React.FC<ManagerAdditionalInfoProps> = ({
                                                                              data,
                                                                              onChange,
                                                                              onWorkHoursChange,
                                                                              onAddressChange,
                                                                              onAddressDetailChange,
                                                                              onCoordinatesChange,
                                                                              onAddressSelect,
                                                                              errors = {},
                                                                            }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [coordinateLoading, setCoordinateLoading] = useState(false);

  // ✅ 디바운스를 적용한 좌표 변환 함수 - 분리된 위경도로 저장
  const convertAddressToCoordinates = useCallback(
      debounce(async (fullAddress: string) => {
        if (!fullAddress.trim()) {
          onCoordinatesChange(null, null);
          return;
        }

        try {
          setCoordinateLoading(true);
          const coords = await getCoordinatesFromAddress(fullAddress);

          if (coords) {
            // ✅ 위도와 경도를 각각 저장
            onCoordinatesChange(coords.lat, coords.lng);
          } else {
            console.warn('좌표 변환 실패:', fullAddress);
            onCoordinatesChange(null, null);
          }
        } catch (error) {
          console.error('좌표 변환 중 오류:', error);
          onCoordinatesChange(null, null);
        } finally {
          setCoordinateLoading(false);
        }
      }, 1000), // 1초 디바운스
      [onCoordinatesChange]
  );

  // 주소 또는 상세주소가 변경될 때 좌표 변환 실행
  useEffect(() => {
    const fullAddress = data.addressDetail
        ? `${data.address} ${data.addressDetail}`.trim()
        : data.address;

    if (fullAddress) {
      convertAddressToCoordinates(fullAddress);
    }
  }, [data.address, data.addressDetail, convertAddressToCoordinates]);

  const handleModalAddressSelect = useCallback(async (addressData: {
    main: string;
    detail: string;
    addressName: string;
    area: number;
  }) => {
    try {
      onAddressChange(addressData.main);
      if (addressData.detail) {
        onAddressDetailChange(addressData.detail);
      }
      setAddModalOpen(false);
    } catch (error) {
      console.error('주소 선택 처리 중 오류:', error);
    }
  }, [onAddressChange, onAddressDetailChange]);

  const handleAddressClick = useCallback(() => {
    setAddModalOpen(true);
  }, []);

  const handleAddressDetailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onAddressDetailChange(value);

    if (errors.addressDetail) {
      onChange(e);
    }
  }, [onAddressDetailChange, onChange, errors.addressDetail]);

  return (
      <>
        <div className="space-y-6 pt-6 border-t border-gray-200">
          {/* Address */}
          <div className="space-y-2">
            <label className="block text-base font-medium">
              주소 <span className="text-red-500">*</span>
            </label>
            <textarea
                name="address"
                value={data.address}
                onClick={handleAddressClick}
                readOnly={true}
                onChange={() => {}}
                className={`w-full h-24 p-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none resize-none cursor-pointer transition-colors hover:bg-gray-100 ${
                    errors.address ? 'border-2 border-red-500' : ''
                }`}
                placeholder="주소를 선택하려면 클릭해주세요"
                aria-label="주소 선택 버튼"
            />
            {errors.address && (
                <span className="text-red-500 text-sm" role="alert">
              {errors.address}
            </span>
            )}
          </div>

          {/* Address Detail */}
          <div className="space-y-2">
            <label className="block text-base font-medium">
              상세주소
            </label>
            <input
                type="text"
                name="addressDetail"
                value={data.addressDetail}
                onChange={handleAddressDetailChange}
                className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.addressDetail ? 'border-2 border-red-500' : ''
                }`}
                placeholder="상세주소를 입력해주세요 (동, 호수 등)"
            />
            {errors.addressDetail && (
                <span className="text-red-500 text-sm" role="alert">
              {errors.addressDetail}
            </span>
            )}
          </div>

          {/* Work Hours */}
          <div className="space-y-2">
            <label className="block text-base font-medium">
              근무 가능 시간 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                  type="time"
                  value={data.workHours.start}
                  onChange={(e) => onWorkHoursChange('start', e.target.value)}
                  className={`flex-1 h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.workHours ? 'border-2 border-red-500' : ''
                  }`}
                  aria-label="근무 시작 시간"
              />
              <span className="text-gray-400">~</span>
              <input
                  type="time"
                  value={data.workHours.end}
                  onChange={(e) => onWorkHoursChange('end', e.target.value)}
                  className={`flex-1 h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.workHours ? 'border-2 border-red-500' : ''
                  }`}
                  aria-label="근무 종료 시간"
              />
            </div>
            {errors.workHours && (
                <span className="text-red-500 text-sm" role="alert">
              {errors.workHours}
            </span>
            )}
          </div>
        </div>

        {/* 주소 선택 모달 */}
        {isAddModalOpen && (
            <AddAddressModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAddAddress={async (address) => {
                  console.log('Address added:', address);
                }}
                onAddressSelect={handleModalAddressSelect}
            />
        )}
      </>
  );
};