'use client'

import { useState, useEffect } from 'react'
import { getCoordinatesFromAddress } from '@/utils/kakaoCoords'
import Script from 'next/script'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: {
    name: string
    phone: string
    birthDate: string
    email: string
    address?: string
  }
  showAddressField?: boolean  // 주소 필드 표시 여부
  onSubmit: (data: {
    name: string
    phone: string
    birthDate: string
    email: string
    address?: string
    addressDetail?: string
    latitude?: number | null
    longitude?: number | null
  }) => void
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  initialData,
  showAddressField = false,
  onSubmit,
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthDate: '',
    email: '',
    address: '',
    addressDetail: '',
    latitude: null as number | null,
    longitude: null as number | null,
  })

  // 새로 주소를 선택했는지 여부를 추적
  const [isNewAddress, setIsNewAddress] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name,
        phone: initialData.phone,
        birthDate: initialData.birthDate,
        email: initialData.email,
        address: initialData.address || '',
        addressDetail: '',
        latitude: null,
        longitude: null,
      });
      setIsNewAddress(false);  // 모달이 열릴 때마다 초기화
    }
  }, [isOpen, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddressClick = () => {
    new window.daum.Postcode({
      oncomplete: async (data: any) => {
        const address = data.address || data.roadAddress || data.jibunAddress;
        
        try {
          // 주소로 위경도 조회
          const coords = await getCoordinatesFromAddress(address);
          
          if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
            setFormData(prev => ({
              ...prev,
              address,
              addressDetail: '',
              latitude: coords.lat,
              longitude: coords.lng,
            }));
            setIsNewAddress(true);  // 새로운 주소가 선택됨
          } else {
            setFormData(prev => ({
              ...prev,
              address,
              addressDetail: '',
              latitude: null,
              longitude: null,
            }));
            setIsNewAddress(true);  // 새로운 주소가 선택됨
          }
        } catch (error) {
          console.error('주소 좌표 변환 중 오류:', error);
          setFormData(prev => ({
            ...prev,
            address,
            addressDetail: '',
            latitude: null,
            longitude: null,
          }));
          setIsNewAddress(true);  // 새로운 주소가 선택됨
        }
      }
    }).open();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 주소 필드가 비활성화된 경우 주소 관련 데이터 제외
    if (!showAddressField) {
      const { address, addressDetail, latitude, longitude, ...rest } = formData;
      onSubmit(rest);
    } else {
      // 새로 선택한 주소인 경우에만 주소와 상세주소를 합침
      const fullAddress = isNewAddress && formData.addressDetail
        ? `${formData.address} ${formData.addressDetail}`.trim()
        : formData.address;

      onSubmit({
        ...formData,
        address: fullAddress,
        addressDetail: '',  // addressDetail은 제출 시 비움
      });
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">정보 수정</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fbcd6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전화번호
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fbcd6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              생년월일
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fbcd6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fbcd6]"
            />
          </div>

          {showAddressField && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  주소
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    readOnly
                    onClick={handleAddressClick}
                    placeholder="주소 검색"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fbcd6] cursor-pointer"
                  />
                </div>
              </div>

              {isNewAddress && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상세주소
                  </label>
                  <input
                    type="text"
                    name="addressDetail"
                    value={formData.addressDetail}
                    onChange={handleChange}
                    placeholder="상세주소 입력"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fbcd6]"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[52px] border border-gray-300 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 h-[52px] bg-primary-500 text-white rounded-lg"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 