import { NextResponse } from 'next/server';

// 임시 데이터 (실제로는 DB나 외부 API에서 가져와야 함)
const categoryOptions = {
  '1': [ // 대청소
    { id: 1, name: "요리", price: 20000, time: 60, description: "요리와 청소가 필요하신 경우" },
    { id: 2, name: "다림질", price: 15000, time: 60, description: "다림질 서비스가 필요하신 경우" },
    { id: 3, name: "화장실 청소", price: 30000, time: 60, description: "화장실 청소가 필요하신 경우" }
  ],
  '2': [ // 사무실 청소
    { id: 4, name: "유리창 청소", price: 40000, time: 60, description: "유리창 청소가 필요하신 경우" },
    { id: 5, name: "카페트 청소", price: 30000, time: 60, description: "카페트 청소가 필요하신 경우" }
  ],
  '3': [ // 부분 청소
    { id: 6, name: "베란다 청소", price: 20000, time: 30, description: "베란다 청소가 필요하신 경우" },
    { id: 7, name: "곰팡이 제거", price: 40000, time: 60, description: "곰팡이 제거가 필요하신 경우" },
    { id: 8, name: "냉장고 청소", price: 20000, time: 30, description: "냉장고 청소가 필요하신 경우" }
  ]
};

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = params;
    
    // 카테고리 ID에 해당하는 옵션이 없는 경우
    if (!categoryOptions[categoryId as keyof typeof categoryOptions]) {
      return NextResponse.json(
        { error: '해당 카테고리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 200ms 지연을 추가하여 로딩 상태를 테스트할 수 있게 함
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json(categoryOptions[categoryId as keyof typeof categoryOptions]);
  } catch (error) {
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
} 