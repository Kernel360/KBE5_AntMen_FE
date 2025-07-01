'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import AddAddressModal from '@/features/address/ui/AddAddressModal'
import type { CustomerAddressResponse, CustomerAddressRequest } from '@/shared/api/address'
import { 
  fetchAddresses, 
  createAddress,
  updateAddress,
  deleteAddress,
} from '@/shared/api/address'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { useDaumPostcode } from '@/shared/hooks'
import { getCoordinatesFromAddress } from '@/utils/kakaoCoords'

const AddressPageUI = () => {
  const router = useRouter()
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [addresses, setAddresses] = useState<CustomerAddressResponse[]>([])
  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddressResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAddresses()
      .then(setAddresses)
      .catch(() => {
        alert('주소 목록을 불러오지 못했습니다.')
      })
  }, [])

  const handleOpenEditModal = (address: CustomerAddressResponse) => {
    setSelectedAddress(address)
    setEditModalOpen(true)
  }
  const handleOpenDeleteModal = (address: CustomerAddressResponse) => {
    setSelectedAddress(address)
    setDeleteModalOpen(true)
  }
  const handleCloseModals = () => {
    setSelectedAddress(null)
    setEditModalOpen(false)
    setDeleteModalOpen(false)
  }

  const handleSaveAddress = (
    id: number,
    data: Omit<CustomerAddressResponse, 'addressId'>,
  ) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.addressId === id ? { addressId: id, ...data } : addr,
      ),
    )
    handleCloseModals()
  }

  const handleDeleteAddress = async () => {
    if (selectedAddress) {
      try {
        setIsLoading(true);
        await deleteAddress(selectedAddress.addressId);
        setAddresses((prev) =>
          prev.filter((addr) => addr.addressId !== selectedAddress.addressId)
        );
        handleCloseModals();
      } catch (error) {
        console.error('주소 삭제 중 오류:', error);
        alert('주소 삭제에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleAddAddress = async (address: {
    main: string
    detail: string
    addressName: string
    area: number
    customerLatitude?: number
    customerLongitude?: number
  }) => {
    try {
      await createAddress({
        addressName: address.addressName,
        addressAddr: address.main,
        addressDetail: address.detail,
        addressArea: address.area,
        customerLatitude: address.customerLatitude,
        customerLongitude: address.customerLongitude,
      })
      const updated = await fetchAddresses()
      setAddresses(updated)
      setAddModalOpen(false)
    } catch (e) {
      alert('주소 등록에 실패했습니다.')
    }
  }

  // 주소 정보 카드
  function AddressInfoBlock({
    address,
    onEdit,
    onDelete,
  }: {
    address: CustomerAddressResponse
    onEdit: (address: CustomerAddressResponse) => void
    onDelete: (address: CustomerAddressResponse) => void
  }) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
      <div className="p-5 border rounded-lg shadow-sm bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {address.addressName} ({address.addressArea}평)
            </h2>
            <p className="text-sm text-slate-600 mt-1">{address.addressAddr}</p>
            <p className="text-sm text-slate-600">{address.addressDetail}</p>
          </div>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
              <EllipsisVerticalIcon className="w-5 h-5 text-slate-500" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-10 border"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    onEdit(address)
                    setMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    onDelete(address)
                    setMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 주소 수정 모달
  function EditAddressModal({
    isOpen,
    onClose,
    address,
    onSave,
  }: {
    isOpen: boolean
    onClose: () => void
    address: CustomerAddressResponse | null
    onSave: (
      id: number,
      data: CustomerAddressRequest,
    ) => void
  }) {
    const [formData, setFormData] = useState<CustomerAddressRequest>({
      addressName: '',
      addressAddr: '',
      addressDetail: '',
      addressArea: 0,
      customerLatitude: undefined,
      customerLongitude: undefined,
    })
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
      if (address) {
        setFormData({
          addressName: address.addressName,
          addressAddr: address.addressAddr,
          addressDetail: address.addressDetail,
          addressArea: address.addressArea,
          customerLatitude: address.customerLatitude,
          customerLongitude: address.customerLongitude,
        })
      }
    }, [address])

    const handleComplete = async (data: any) => {
      let fullAddress = data.address;
      let extraAddress = '';

      if (data.addressType === 'R') {
        if (data.bname !== '') {
          extraAddress += data.bname;
        }
        if (data.buildingName !== '') {
          extraAddress +=
            extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
      }

      console.log('📍 선택된 주소:', fullAddress);

      try {
        console.log('🔄 위경도 변환 시작...');
        const coords = await getCoordinatesFromAddress(fullAddress);
        console.log('📍 위경도 변환 결과:', coords);

        if (coords) {
          const updatedFormData = {
            ...formData,
            addressAddr: fullAddress,
            customerLatitude: coords.lat,
            customerLongitude: coords.lng,
          };
          console.log('✅ 업데이트될 formData:', updatedFormData);
          setFormData(updatedFormData);
        } else {
          console.warn('⚠️ 위경도 변환 실패');
          console.log('⚠️ 현재 formData:', formData);
        }
      } catch (error) {
        console.error('❌ 위경도 변환 중 오류:', error);
      }
      setIsSearching(false);
    };

    useDaumPostcode(isSearching, { onComplete: handleComplete });

    if (!isOpen || !address) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev: CustomerAddressRequest) => ({
        ...prev,
        [name]: name === 'addressArea' ? parseInt(value, 10) || 0 : value,
      }))
    }

    const handleSave = async () => {
      if (!address) return;
      
      try {
        setIsLoading(true);
        
        // 저장 직전 formData 값 확인
        console.log('💾 저장 직전 formData:', {
          ...formData,
          customerLatitude: formData.customerLatitude === undefined ? 'undefined' : formData.customerLatitude,
          customerLongitude: formData.customerLongitude === undefined ? 'undefined' : formData.customerLongitude,
        });

        if (!formData.customerLatitude || !formData.customerLongitude) {
          console.warn('⚠️ 위경도 값이 없습니다:', {
            latitude: formData.customerLatitude,
            longitude: formData.customerLongitude
          });
        }

        await updateAddress(address.addressId, formData);
        console.log('✅ 주소 수정 성공');
        
        const updatedAddresses = await fetchAddresses();
        console.log('📥 업데이트된 주소 목록:', updatedAddresses);
        
        setAddresses(updatedAddresses);
        onClose();
      } catch (error) {
        console.error('❌ 주소 수정 중 오류:', error);
        alert('주소 수정에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">주소 수정</h2>
            <button onClick={onClose}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          {isSearching ? (
            <div id="postcode-container" style={{ height: '500px' }} />
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  주소 별칭
                </label>
                <input
                  type="text"
                  name="addressName"
                  value={formData.addressName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  주소
                </label>
                <div 
                  onClick={() => setIsSearching(true)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 cursor-pointer"
                >
                  {formData.addressAddr || '주소를 검색하려면 클릭하세요'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상세주소
                </label>
                <input
                  type="text"
                  name="addressDetail"
                  value={formData.addressDetail}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  평수 (숫자만 입력해주세요)
                </label>
                <input
                  type="number"
                  name="addressArea"
                  value={formData.addressArea}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
                >
                  저장
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 삭제 확인 모달
  function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
  }) {
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-sm text-center">
          <h2 className="text-lg font-bold mb-4">주소 삭제</h2>
          <p className="text-slate-600 mb-6">
            정말로 이 주소를 삭제하시겠습니까?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-[390px] mx-auto relative">
      <CommonHeader 
        title="주소 관리"
        showBackButton
      />

      {/* 내용 */}
      <main className="pt-[64px] pb-[88px]">
        <div className="px-5">
          <div className="space-y-4 mt-5">
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <AddressInfoBlock
                  key={address.addressId}
                  address={address}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              ))
            ) : (
              <div className="text-center py-20 text-slate-500">
                <p>등록된 주소 정보가 없습니다.</p>
                <p>새 주소를 추가해주세요.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 새 주소 추가 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t">
        <div className="p-5">
          <button
            onClick={() => setAddModalOpen(true)}
            className="w-full py-4 bg-primary-500 text-white rounded-lg font-bold hover:bg-primary-600 transition-colors"
          >
            + 새 주소 추가
          </button>
        </div>
      </div>

      {/* 모달 렌더링 */}
      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddAddress={handleAddAddress}
      />
      <EditAddressModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        address={selectedAddress}
        onSave={handleSaveAddress}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteAddress}
      />
    </div>
  )
}

export default AddressPageUI
