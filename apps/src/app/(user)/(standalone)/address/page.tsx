"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AddAddressModal from '@/features/address/ui/AddAddressModal';
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid';

// 타입 정의
interface AddressDetail {
  id: string;
  addressName: string; // 주소 별칭
  addr: string;
  detail: string;
  area: number;
}

// 목 데이터 예시
const MOCK_ADDRESSES: AddressDetail[] = [
  { id: 'addr1', addressName: '우리집', addr: '서울특별시 강남구 강남대로 364', detail: '1201호', area: 20 },
  { id: 'addr2', addressName: '사무실', addr: '서울특별시 서초구 서초대로 77길 54', detail: 'W타워 10층', area: 30 },
];

const AddressPageUI = () => {
  const router = useRouter();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<AddressDetail | null>(null);

  const handleOpenEditModal = (address: AddressDetail) => { setSelectedAddress(address); setEditModalOpen(true); };
  const handleOpenDeleteModal = (address: AddressDetail) => { setSelectedAddress(address); setDeleteModalOpen(true); };
  const handleCloseModals = () => { setSelectedAddress(null); setEditModalOpen(false); setDeleteModalOpen(false); };

  const handleSaveAddress = (id: string, data: Omit<AddressDetail, 'id'>) => {
    setAddresses(prev => prev.map(addr => addr.id === id ? { id, ...data } : addr));
    handleCloseModals();
  };
  
  const handleDeleteAddress = () => {
    if (selectedAddress) {
      setAddresses(prev => prev.filter(addr => addr.id !== selectedAddress.id));
      handleCloseModals();
    }
  };

  const handleAddAddress = (address: { main: string; detail: string; addressName: string; area: number }) => {
    setAddresses(prev => [
      ...prev,
      {
        id: `addr${prev.length + 1}`,
        addressName: address.addressName,
        addr: address.main,
        detail: address.detail,
        area: address.area,
      },
    ]);
    setAddModalOpen(false);
  };

  // 주소 정보 카드
  function AddressInfoBlock({ 
    address, onEdit, onDelete 
  }: { 
    address: AddressDetail,
    onEdit: (address: AddressDetail) => void,
    onDelete: (address: AddressDetail) => void
  }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
      <div className="p-5 border rounded-lg shadow-sm bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{address.addressName} ({address.area}평)</h2>
            <p className="text-sm text-slate-600 mt-1">{address.addr}</p>
            <p className="text-sm text-slate-600">{address.detail}</p>
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
                <button onClick={() => { onEdit(address); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100">수정</button>
                <button onClick={() => { onDelete(address); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">삭제</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 주소 수정 모달
  function EditAddressModal({
    isOpen, onClose, address, onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    address: AddressDetail | null;
    onSave: (id: string, data: Omit<AddressDetail, 'id'>) => void;
  }) {
    const [formData, setFormData] = useState({ addressName: '', addr: '', detail: '', area: 0 });

    useEffect(() => {
      if (address) {
        setFormData({ addressName: address.addressName, addr: address.addr, detail: address.detail, area: address.area });
      }
    }, [address]);
    
    if (!isOpen || !address) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: name === 'area' ? parseInt(value, 10) || 0 : value }));
    };

    const handleSave = () => {
      onSave(address.id, { ...formData });
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">주소 수정</h2>
            <button onClick={onClose}><XMarkIcon className="w-6 h-6"/></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주소 별칭</label>
              <input type="text" name="addressName" value={formData.addressName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
              <input type="text" name="addr" value={formData.addr} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상세주소</label>
              <input type="text" name="detail" value={formData.detail} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">평수</label>
              <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium">취소</button>
            <button onClick={handleSave} className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium">저장</button>
          </div>
        </div>
      </div>
    );
  }

  // 삭제 확인 모달
  function DeleteConfirmModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; }) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-sm text-center">
          <h2 className="text-lg font-bold mb-4">주소 삭제</h2>
          <p className="text-slate-600 mb-6">정말로 이 주소를 삭제하시겠습니까?</p>
          <div className="flex justify-center gap-4">
             <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium">취소</button>
             <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">삭제</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-5 bg-white border-b">
        <button onClick={() => router.back()} className="p-1">
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">주소 관리</h1>
        <div className="w-6" />
      </header>

      {/* 내용 */}
      <main className="flex-grow p-5">
        <div className="space-y-4">
          {addresses.length > 0 ? (
            addresses.map(address => (
              <AddressInfoBlock
                key={address.id}
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
      <footer className="p-5 bg-white border-t">
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
      <EditAddressModal isOpen={isEditModalOpen} onClose={handleCloseModals} address={selectedAddress} onSave={handleSaveAddress} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={handleCloseModals} onConfirm={handleDeleteAddress} />
    </div>
  );
};

export default AddressPageUI; 