'use client';

import {
  updateReservationStatus,
  cancelReservation,
  getOptionsForReservation,
  saveOptionsForReservation,
  createReservation,
  getReservationById,
  updateReservationManager,
  type ReservationRequest,
} from '@/shared/api';

const ApiTestPage = () => {
  const testReservationId = 1; // 테스트할 예약 ID
  const testOptionId = 1; // 테스트할 옵션 ID
  const testManagerId = 1; // 테스트할 매니저 ID

  const handleTest = async (apiCall: () => Promise<any>, description: string) => {
    console.log(`--- [TEST START] ${description} ---`);
    try {
      const result = await apiCall();
      console.log('[SUCCESS]', result);
    } catch (error) {
      console.error('[ERROR]', error);
    } finally {
      console.log(`--- [TEST END] ${description} ---`);
    }
  };

  const mockReservationData: ReservationRequest = {
    customerId: 1,
    addressId: 1, // 중요: DB에 존재하는 주소 ID여야 합니다.
    categoryId: 1,
    reservationDate: '2025-07-15',
    reservationTime: '14:30',
    reservationDuration: 3,
    reservationMemo: '테스트 예약입니다.',
    reservationAmount: 50000,
    additionalDuration: 1,
    optionIds: [1, 2],
    managerIds: [], // 초기에는 빈 배열로 설정
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page - Reservation</h1>
      <p className="mb-4">
        F12를 눌러 개발자 콘솔을 열고 각 버튼을 클릭하여 API 호출 결과를 확인하세요.
      </p>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold pt-4 border-t mt-4">예약 생성/조회/매칭</h2>
        <button
          onClick={() =>
            handleTest(() => createReservation(mockReservationData), 'POST /reservation')
          }
          className="w-full p-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          0. 신규 예약 생성
        </button>
        <button
          onClick={() =>
            handleTest(
              () => getReservationById(testReservationId),
              'GET /reservation/{id}',
            )
          }
          className="w-full p-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          1. 특정 예약 조회
        </button>
        <button
          onClick={() =>
            handleTest(
              () => updateReservationManager(testReservationId, testManagerId),
              'PATCH /reservation/{id}/match',
            )
          }
          className="w-full p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          2. 매니저 매칭
        </button>

        <h2 className="text-xl font-semibold pt-4 border-t mt-4">예약 상태/취소</h2>
        <button
          onClick={() =>
            handleTest(
              () => updateReservationStatus(testReservationId, 'CONFIRMED'),
              'PATCH /reservation/{id}/status',
            )
          }
          className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          3. 예약 상태 변경 (CONFIRMED)
        </button>
        <button
          onClick={() =>
            handleTest(
              () => cancelReservation(testReservationId, '고객 변심'),
              'POST /reservation/{id}/cancel',
            )
          }
          className="w-full p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          4. 예약 취소
        </button>

        <h2 className="text-xl font-semibold pt-4 border-t mt-4">예약 옵션</h2>
        <button
          onClick={() =>
            handleTest(
              () => getOptionsForReservation(testReservationId),
              'GET /reservation-option/{reservationId}',
            )
          }
          className="w-full p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          5. 예약의 옵션 목록 조회
        </button>
        <button
          onClick={() =>
            handleTest(
              () => saveOptionsForReservation(testReservationId, [1, 2, 3]), // 테스트용 옵션 ID 배열
              'POST /reservation-option/{reservationId}',
            )
          }
          className="w-full p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          6. 예약에 옵션 목록 저장
        </button>
      </div>
    </div>
  );
};

export default ApiTestPage; 