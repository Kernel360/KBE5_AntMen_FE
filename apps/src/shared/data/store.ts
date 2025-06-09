import type { Reservation } from '@/entities/reservation/model/types';
import { MOCK_RESERVATIONS } from './reservations';

/**
 * 이 파일은 임시 인메모리 데이터베이스 역할을 합니다.
 * 서버가 실행되는 동안에는 데이터 변경 사항이 유지됩니다.
 * 실제 프로덕션 환경에서는 PostgreSQL, MySQL, MongoDB 같은 실제 데이터베이스를 사용해야 합니다.
 */

// 원본 목업 데이터를 깊은 복사하여 초기 상태를 만듭니다.
let reservationsStore: Reservation[] = JSON.parse(
  JSON.stringify(MOCK_RESERVATIONS),
);

export const getReservationsFromStore = (): Reservation[] => {
  return reservationsStore;
};

export const getReservationByIdFromStore = (
  id: string,
): Reservation | undefined => {
  return reservationsStore.find((r) => r.id === id);
};

export const updateReservationInStore = (
  id: string,
  updatedData: Partial<Reservation>,
): Reservation | null => {
  const reservationIndex = reservationsStore.findIndex((r) => r.id === id);
  if (reservationIndex === -1) {
    return null;
  }

  const updatedReservation = {
    ...reservationsStore[reservationIndex],
    ...updatedData,
  };

  reservationsStore[reservationIndex] = updatedReservation;
  console.log(`Reservation ${id} updated in store:`, updatedReservation);
  return updatedReservation;
};

// 테스트나 데모를 위해 스토어를 초기 상태로 되돌리는 함수
export const resetReservationsStore = () => {
  reservationsStore = JSON.parse(JSON.stringify(MOCK_RESERVATIONS));
  console.log('Reservations store has been reset.');
}; 