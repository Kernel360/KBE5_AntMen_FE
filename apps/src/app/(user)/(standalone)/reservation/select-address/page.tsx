'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addressApi, CustomerAddressResponse, CustomerAddressRequest } from '@/shared/api/address';
import Image from 'next/image';
import AddAddressModal from '@/features/address/ui/AddAddressModal';

export default function SelectAddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [addresses, setAddresses] = useState<CustomerAddressResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const addresses = await addressApi.getAll();
      setAddresses(addresses);
    } catch (error) {
      console.error('주소 목록을 불러오는데 실패했습니다:', error);
      setError('주소 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSelectAddress = (addressId: number) => {
    const categoryId = searchParams.get('categoryId');
    if (!categoryId) {
      setError('카테고리 정보가 없습니다.');
      return;
    }
    router.push(`/reservation/form?categoryId=${categoryId}&addressId=${addressId}`);
  };

  const handleAddAddress = async (addressData: { main: string; detail: string; addressName: string; area: number }) => {
    try {
      setLoading(true);
      const newAddress: CustomerAddressRequest = {
        addressName: addressData.addressName,
        addressDetail: addressData.detail,
        latitude: 0, // TODO: 실제 위도 정보 추가
        longitude: 0, // TODO: 실제 경도 정보 추가
        isDefault: false
      };
      await addressApi.create(newAddress);
      await loadAddresses(); // 주소 목록 새로고침
      setAddModalOpen(false);
    } catch (error) {
      console.error('주소 추가에 실패했습니다:', error);
      setError('주소 추가에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-[375px] min-h-screen flex flex-col bg-slate-50">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <div className="px-4 h-14 flex items-center justify-between">
            <h1 className="text-lg font-semibold">주소 선택</h1>
          </div>
        </header>

        <div className="flex-1 p-4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.addressId}
                className={`p-4 bg-white rounded-xl cursor-pointer ${
                  selectedAddressId === address.addressId ? 'ring-2 ring-cyan-500' : ''
                }`}
                onClick={() => setSelectedAddressId(address.addressId)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{address.addressName}</h3>
                    <p className="mt-1 text-sm text-slate-600">{address.addressDetail}</p>
                  </div>
                  {address.isDefault && (
                    <span className="px-2 py-1 bg-cyan-50 text-cyan-600 text-xs font-medium rounded">
                      기본
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="mt-4 w-full py-4 bg-white border-2 border-cyan-500 text-cyan-500 rounded-lg font-bold text-lg hover:bg-cyan-50 transition-colors"
          >
            + 새 주소 추가
          </button>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200">
          <div className="px-4 py-4">
            <button
              onClick={() => selectedAddressId && handleSelectAddress(selectedAddressId)}
              disabled={!selectedAddressId || loading}
              className="w-full py-4 bg-cyan-500 text-white rounded-lg font-bold text-lg hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '처리 중...' : '다음'}
            </button>
          </div>
        </div>

        <AddAddressModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAddAddress={handleAddAddress}
        />
      </div>
    </div>
  );
} 