'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import AddAddressModal from '@/features/address/ui/AddAddressModal'
import type { CustomerAddressResponse } from '@/shared/api/address'
import { 
  fetchAddresses, 
  createAddress,
} from '@/shared/api/address'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'

const AddressPageUI = () => {
  const router = useRouter()
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [addresses, setAddresses] = useState<CustomerAddressResponse[]>([])
  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddressResponse | null>(null)

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

  const handleDeleteAddress = () => {
    if (selectedAddress) {
      setAddresses((prev) =>
        prev.filter((addr) => addr.addressId !== selectedAddress.addressId),
      )
      handleCloseModals()
    }
  }

  const handleAddAddress = async (address: {
    main: string
    detail: string
    addressName: string
    area: number
  }) => {
    try {
      await createAddress({
        addressName: address.addressName,
        addressAddr: address.main,
        addressDetail: address.detail,
        addressArea: address.area,
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
      data: Omit<CustomerAddressResponse, 'addressId'>,
    ) => void
  }) {
    const [formData, setFormData] = useState({
      addressName: '',
      addressAddr: '',
      addressDetail: '',
      addressArea: 0,
    })

    useEffect(() => {
      if (address) {
        setFormData({
          addressName: address.addressName,
          addressAddr: address.addressAddr,
          addressDetail: address.addressDetail,
          addressArea: address.addressArea,
        })
      }
    }, [address])

    if (!isOpen || !address) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'addressArea' ? parseInt(value, 10) || 0 : value,
      }))
    }

    const handleSave = () => {
      onSave(address.addressId, { ...formData })
      onClose()
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">주소 수정</h2>
            <button onClick={onClose}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
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
              <input
                type="text"
                name="addressAddr"
                value={formData.addressAddr}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
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
                평수
              </label>
              <input
                type="number"
                name="addressArea"
                value={formData.addressArea}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
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
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium"
            >
              저장
            </button>
          </div>
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
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="주소 관리"
        showBackButton
      />

      {/* 내용 */}
      <main className="pt-0 px-5 pb-20 min-h-[calc(100vh-64px-80px)]">
        <div className="space-y-4 pt-5">
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
      </main>

      {/* 새 주소 추가 버튼 */}
      <footer className="fixed bottom-[64px] left-0 right-0 p-5 bg-white border-t">
        <button
          onClick={() => setAddModalOpen(true)}
          className="w-full py-4 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600 transition-colors"
        >
          + 새 주소 추가
        </button>
      </footer>

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
