/**
 * 매칭 확인
 * 
 * 예약 폼 -> 매니저 선택 -> 예약 확인 페이지
 * 
 * TODO
 * 매니저 리스트에서 선택한 데이터 전송받기
 */

import ConfirmationView from './ConfirmationView';

interface MatchingConfirmationPageProps {
  params: {
    reservationId: string;
  };
}

async function getMatchingData(reservationId: string) {
  try {
    // API URL을 환경 변수로 관리하는 것이 좋습니다.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/reservation/${reservationId}`, {
      cache: 'no-store', // 매번 최신 데이터를 가져오도록 설정
    });

    if (!res.ok) {
      throw new Error('Failed to fetch matching data');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching matching data:', error);
    // 프로덕션 환경에서는 에러 로깅 서비스를 사용하는 것이 좋습니다.
    return null;
  }
}

export default async function MatchingConfirmationPage({ params }: MatchingConfirmationPageProps) {
  const matchingData = await getMatchingData(params.reservationId);

  if (!matchingData) {
    // TODO: 에러 UI를 별도 컴포넌트로 만들어서 보여주는 것이 좋습니다.
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900">오류</h1>
          <p className="text-sm text-slate-600">
            매칭 정보를 불러오는 데 실패했습니다. 다시 시도해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return <ConfirmationView matchingData={matchingData} />;
} 