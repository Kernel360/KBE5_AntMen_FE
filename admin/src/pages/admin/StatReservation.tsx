import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { adminReservationService } from '../../api/adminReservation';
import { AdminReservationStatisticsResponseDto } from '../../api/types';

export const StatReservation: React.FC = () => {
  const [data, setData] = useState<AdminReservationStatisticsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminReservationService.getReservationStatistics(7)
      .then(setData)
      .catch((e) => setError(e.message || '에러 발생'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>데이터 없음</div>;

  const summary = data.reservationSummary;

  // 예약 상태 한글 변환 및 순서 지정
  const statusOrder = ['WAITING', 'MATCHING', 'DONE', 'CANCEL'];
  const statusLabel: Record<string, string> = {
    WAITING: '대기중',
    MATCHING: '매칭중',
    DONE: '완료',
    CANCEL: '취소'
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">예약 통계 대시보드</h1>
      <p className="text-gray-600 mb-4">예약 현황, 일별/카테고리별 통계를 확인하세요.</p>

      {/* 대시보드 카드 - 2줄 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">전체 예약 건수</CardTitle>
            <CardDescription className="text-xs">누적</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{summary.totalCount.toLocaleString()}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">전체 완료 건수</CardTitle>
            <CardDescription className="text-xs">누적</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{summary.completeCount.toLocaleString()}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">사용자당 평균 예약 수</CardTitle>
            <CardDescription className="text-xs">수요자 1명 평균 예약</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{summary.avgUser}건</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">전체 취소 건수</CardTitle>
            <CardDescription className="text-xs">누적</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.cancelCount.toLocaleString()}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">취소율</CardTitle>
            <CardDescription className="text-xs">누적</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.cancelRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* 예약 상태별 예약 건수 카드형 대시보드 - 별도 섹션 */}
      <div className="bg-white rounded-xl border p-6 mb-8">
        <div className="font-bold text-lg mb-4">예약 상태별 예약 건수</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['WAITING', 'MATCHING', 'DONE', 'CANCEL'].map((statusKey) => {
            const statusLabel: Record<string, string> = {
              WAITING: '대기중',
              MATCHING: '매칭중',
              DONE: '완료',
              CANCEL: '취소',
            };
            const s = data.reservationStatus.find((item) => item.reservationStatus === statusKey);
            return (
              <div key={statusKey} className="flex flex-col items-center py-6 border rounded-lg bg-gray-50">
                <div className="text-base font-medium mb-1">{statusLabel[statusKey]}</div>
                <div className="text-2xl font-bold text-blue-700">{s ? s.count : 0}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 최근 7일간 일자별 예약/취소/완료 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 7일간 일자별 예약 통계</CardTitle>
          <CardDescription>일별 예약 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center text-sm mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2">날짜</th>
                  <th className="p-2">예약 건수</th>
                  <th className="p-2">취소 건수</th>
                  <th className="p-2">완료 건수</th>
                </tr>
              </thead>
              <tbody>
                {data.dailyList.map((d) => (
                  <tr key={d.date} className="border-b">
                    <td className="p-2 font-medium">{d.date}</td>
                    <td className="p-2 text-blue-700 font-bold">{d.dailyReservationsCount}</td>
                    <td className="p-2">{d.dailyCancelCount}</td>
                    <td className="p-2">{d.dailyCompletedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리별 예약 건수 */}
      <Card>
        <CardHeader>
          <CardTitle>카테고리별 예약 건수</CardTitle>
          <CardDescription>서비스별 예약 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">카테고리명</th>
                <th className="p-2">예약 건수</th>
              </tr>
            </thead>
            <tbody>
              {data.categoryList.map((c) => (
                <tr key={c.categoryName} className="border-b">
                  <td className="p-2 font-medium text-black">{c.categoryName}</td>
                  <td className="p-2 text-black">{c.categoryCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}; 