import { NextResponse } from 'next/server';

// 임시 매칭 확인 데이터
// TODO: 실제 데이터베이스 또는 서비스에서 데이터를 가져오도록 수정해야 합니다.
const mockMatchingData = {
  id: 'CL-20230510-1234',
  status: '매칭 요청',
  managers: [
    {
      id: 'manager-1',
      name: '김민지',
      rating: 4.8,
      experience: '5년 경력',
      age: 28,
      gender: '여성',
      avatar: '김',
      description: '고객 만족도가 높으며 세심한 서비스를 제공합니다.',
      status: '매칭 요청',
    },
    {
      id: 'manager-2',
      name: '이수진',
      rating: 4.9,
      experience: '3년 경력',
      age: 25,
      gender: '여성',
      avatar: '이',
      description: '꼼꼼하고 친절한 서비스로 많은 고객들이 재예약합니다.',
      status: '매칭 요청',
    },
  ],
  reservation: {
    service: '기본 청소',
    duration: '4시간',
    date: '2024.02.15 (목)',
    time: '10:00 ~ 14:00',
    location: '서울시 강남구 역삼동',
    floor: '3층',
  },
  options: [
    {
      id: 'option-1',
      name: '냉장고 청소',
      price: 15000,
    },
    {
      id: 'option-2',
      name: '오븐 청소',
      price: 10000,
    },
  ],
  totalAmount: 85000,
};

export async function GET(
  request: Request,
  { params }: { params: { reservationId: string } },
) {
  const { reservationId } = params;
  
  // 현재는 reservationId에 관계없이 mock 데이터를 반환합니다.
  // 실제 구현에서는 reservationId를 사용하여 해당 예약 정보를 조회해야 합니다.
  console.log(`Fetching data for reservation ID: ${reservationId}`);
  
  return NextResponse.json(mockMatchingData);
} 