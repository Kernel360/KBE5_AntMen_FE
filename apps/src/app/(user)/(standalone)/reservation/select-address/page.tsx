'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchAddresses, createAddress, CustomerAddressResponse } from '@/shared/api/address';
import Image from 'next/image';
import AddAddressModal from '@/features/address/ui/AddAddressModal';
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'

export default function SelectAddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get('categoryId');

  const [addresses, setAddresses] = useState<CustomerAddressResponse[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const getAddresses = async () => {
    try {
      setLoading(true);
      const data = await fetchAddresses();
      setAddresses(data);
    } catch (err) {
      setError('주소 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  const handleNext = () => {
    if (!selectedAddressId) {
      alert('주소를 선택해주세요.');
      return;
    }
    router.push(`/reservation/form?categoryId=${categoryId}&addressId=${selectedAddressId}`);
  };

  const handleAddAddress = async (address: { main: string; detail: string; addressName: string; area: number }) => {
    try {
      await createAddress({
        addressName: address.addressName,
        addressAddr: address.main,
        addressDetail: address.detail,
        addressArea: address.area,
      });
      await getAddresses(); // 주소 목록 새로고침
      setAddModalOpen(false);
    } catch (e) {
      alert('주소 등록에 실패했습니다.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <CommonHeader 
        title="주소 선택"
        showBackButton
      />
      
      {/* 콘텐츠 */}
      <div className="flex-1 p-5 pt-20">
        <div className="space-y-4">
          {loading && <div className="text-center py-20 text-slate-500">주소를 불러오는 중...</div>}
          {error && <div className="text-center py-20 text-red-500">{error}</div>}
          {!loading && !error && addresses.length > 0 && (
            addresses.map(address => {
              const isSelected = selectedAddressId === address.addressId;
              return (
                <button
                  key={address.addressId}
                  onClick={() => setSelectedAddressId(address.addressId)}
                  className={`w-full text-left p-5 border rounded-lg shadow-sm bg-white flex justify-between items-center transition-all ${isSelected ? 'border-cyan-500 ring-2 ring-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}
                >
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{address.addressName} ({address.addressArea}평)</h2>
                    <p className="text-sm text-slate-600 mt-1">{address.addressAddr}</p>
                    <p className="text-sm text-slate-600">{address.addressDetail}</p>
                  </div>
                  {isSelected && (
                    <span className="ml-4 px-3 py-1 bg-cyan-500 text-white rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0">선택됨</span>
                  )}
                </button>
              );
            })
          )}
          {!loading && !error && addresses.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <p>등록된 주소 정보가 없습니다.</p>
              <button 
                onClick={() => setAddModalOpen(true)}
                className="mt-4 inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold"
              >
                + 새 주소 추가하기
              </button>
            </div>
          )}
        </div>
      </div>
      {/* 하단 버튼 */}
      <footer className="p-5 bg-white border-t flex flex-col gap-3">
        {addresses.length > 0 && (
          <button
            onClick={() => setAddModalOpen(true)}
            className="w-full py-4 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors text-center"
          >
            + 새 주소 추가
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!selectedAddressId || loading}
          className="w-full py-4 bg-cyan-500 text-white rounded-lg font-bold text-lg hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          다음
        </button>
      </footer>
      {/* 모달 렌더링 */}
      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddAddress={handleAddAddress}
      />
    </main>
  );
} 