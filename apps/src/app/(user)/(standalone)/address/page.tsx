'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AddAddressModal from '@/features/address/ui/AddAddressModal'
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid'
import {
  addressApi,
  CustomerAddressResponse,
  CustomerAddressRequest,
} from '@/shared/api/address'

interface AddressForm {
  addressName: string
  main: string
  detail: string
  latitude: number
  longitude: number
}

const AddressPageUI = () => {
  const router = useRouter()
  const [addresses, setAddresses] = useState<CustomerAddressResponse[]>([])
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newAddress, setNewAddress] = useState<AddressForm>({
    addressName: '',
    main: '',
    detail: '',
    latitude: 0,
    longitude: 0,
  })
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      const data = await addressApi.getAll()
      setAddresses(data)
    } catch (error) {
      console.error('주소 목록을 불러오는데 실패했습니다:', error)
    }
  }

  const handleAddAddress = async (address: {
    main: string
    detail: string
    addressName: string
    area: number
  }) => {
    console.log('[DEBUG] handleAddAddress 함수 진입', address)
    if (!address.addressName || !address.main) {
      setErrorMsg('주소 이름과 주소를 모두 입력해주세요.')
      return
    }
    try {
      const addressData: CustomerAddressRequest = {
        addressName: address.addressName,
        addressDetail: `${address.main} ${address.detail}`,
        addressAddr: address.main,
        addressArea: address.area ?? 0,
        latitude: 0,
        longitude: 0,
        isDefault: addresses.length === 0, // 첫 주소인 경우 기본 주소로 설정
      }
      console.log('[주소 등록] addressAddr:', addressData.addressAddr)
      console.log('[주소 등록] addressData 전체:', addressData)
      const newAddressResponse = await addressApi.create(addressData)
      setAddresses((prev) => [...prev, newAddressResponse])
      setAddModalOpen(false)
      setErrorMsg(null)
    } catch (error) {
      setErrorMsg('주소 등록에 실패했습니다.')
      console.error('주소 등록에 실패했습니다:', error)
    }
  }

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await addressApi.delete(addressId)
      setAddresses((prev) =>
        prev.filter((addr) => addr.addressId !== addressId),
      )
    } catch (error) {
      console.error('주소 삭제에 실패했습니다:', error)
    }
  }

  const handleSetDefault = async (addressId: number) => {
    try {
      const updatedAddress = await addressApi.setDefault(addressId)
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.addressId === addressId
            ? updatedAddress
            : { ...addr, isDefault: false },
        ),
      )
    } catch (error) {
      console.error('기본 주소 설정에 실패했습니다:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">내 주소 관리</h1>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.addressId}
            className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{address.addressName}</h3>
              <p className="text-gray-600">{address.addressDetail}</p>
              {address.isDefault && (
                <span className="text-sm text-blue-600">기본 주소</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.addressId)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  기본 주소로 설정
                </button>
              )}
              <button
                onClick={() => handleDeleteAddress(address.addressId)}
                className="text-red-600 hover:text-red-800"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setAddModalOpen(true)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        새 주소 추가
      </button>

      {addModalOpen && (
        <AddAddressModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAddAddress={handleAddAddress}
        />
      )}
    </div>
  )
}

export default AddressPageUI
