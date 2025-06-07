import { NextResponse } from 'next/server';
import type { Reservation } from '@/entities/reservation/model/types';
import { getReservationsFromStore } from '@/shared/data/store';

// 간단한 인메모리 저장소. 실제 프로덕션에서는 데이터베이스를 사용해야 합니다.
const reservations: { [key: string]: any } = {};

// 새로운 예약 ID를 생성하는 함수
const generateReservationId = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `CL-${timestamp}-${random}`;
};

// 임시 데이터 (reservations/page.tsx에서 가져옴)
// MOCK_RESERVATIONS 는 이제 @/shared/data/reservations 에서 import 합니다.

export async function GET() {
  // GET 요청 시 인메모리 스토어의 데이터를 반환합니다.
  const reservations = getReservationsFromStore();
  return NextResponse.json(reservations);
} 