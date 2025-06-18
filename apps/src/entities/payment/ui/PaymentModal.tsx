import React, { useState } from 'react';
import { PaymentRequestDto } from '../model/types';
import { requestPayment } from '../api/paymentApi';
import { getAuthToken } from '@/features/auth/lib/auth';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: number;
  amount: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  reservationId,
  amount
}) => {
  const [payMethod, setPayMethod] = useState<string>('CARD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('인증 정보가 없습니다.');
      }

      const requestDto: PaymentRequestDto = {
        reservationId,
        payMethod,
        payAmount: amount
      };

      await requestPayment(requestDto, token);
      onClose();
    } catch (e: any) {
      setError(e.message || '결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">결제</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            결제 수단
          </label>
          <select
            value={payMethod}
            onChange={(e) => setPayMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="CARD">신용카드</option>
            <option value="BANK_TRANSFER">계좌이체</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            결제 금액
          </label>
          <div className="text-xl font-bold">{amount.toLocaleString()}원</div>
        </div>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handlePayment}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? '처리중...' : '결제하기'}
          </button>
        </div>
      </div>
    </div>
  )
}