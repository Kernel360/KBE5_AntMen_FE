import { NextResponse } from 'next/server';

interface ReservationRequest {
  customerId: number;
  reservationCreatedAt: string;
  reservationDate: string;
  reservationTime: string;
  categoryId: number;
  reservationDuration: number;
  reservationMemo: string;
  reservationAmount: number;
  additionalDuration: number;
  optionIds: number[];
}

export async function POST(request: Request) {
  try {
    const body: ReservationRequest = await request.json();

    // 실제 구현에서는 여기서 데이터베이스에 저장
    console.log('Received reservation request:', body);

    // 200ms 지연을 추가하여 로딩 상태를 테스트할 수 있게 함
    await new Promise(resolve => setTimeout(resolve, 200));

    // 임시 응답 데이터
    const reservationId = Math.floor(Math.random() * 1000000);
    
    return NextResponse.json({
      success: true,
      message: '예약이 성공적으로 생성되었습니다.',
      data: {
        reservationId,
        ...body,
      }
    });

  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { 
        success: false,
        message: '예약 생성 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
} 