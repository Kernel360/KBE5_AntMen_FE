import { NextResponse } from 'next/server';

// 간단한 인메모리 저장소. 실제 프로덕션에서는 데이터베이스를 사용해야 합니다.
const reservations: { [key: string]: any } = {};

// 새로운 예약 ID를 생성하는 함수
const generateReservationId = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `CL-${timestamp}-${random}`;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { selectedManagers, reservationId: existingId } = body;

    if (!selectedManagers || !Array.isArray(selectedManagers) || selectedManagers.length === 0) {
      return NextResponse.json(
        { message: '매칭을 완료하려면 최소 1명의 매니저를 선택해야 합니다.' },
        { status: 400 }
      );
    }

    if (existingId) {
      // 업데이트 플로우: 기존 예약에 매니저 정보 업데이트
      if (!reservations[existingId]) {
        return NextResponse.json({ message: '업데이트할 예약을 찾을 수 없습니다.' }, { status: 404 });
      }
      console.log(`기존 예약(${existingId})에 매니저를 업데이트합니다:`, selectedManagers);
      reservations[existingId].selectedManagers = selectedManagers;
      reservations[existingId].updatedAt = new Date();
      return NextResponse.json({ reservationId: existingId });
    } else {
      // 생성 플로우: 새로운 예약 및 매칭 생성
      const newReservationId = generateReservationId();
      reservations[newReservationId] = {
        id: newReservationId,
        ...body,
        createdAt: new Date(),
      };
      console.log('새로운 예약 및 매칭이 생성되었습니다:', reservations[newReservationId]);
      return NextResponse.json({ reservationId: newReservationId });
    }
  } catch (error) {
    console.error('예약 및 매칭 생성/업데이트 중 오류 발생:', error);
    return NextResponse.json(
      { message: '요청 처리 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 