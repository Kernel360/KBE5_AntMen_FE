import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { adminReviewService } from '../../api/adminReview';
import { AdminReviewStatisticsResponseDto } from '../../api/types';

export const StatSatisfaction: React.FC = () => {
  const [data, setData] = useState<AdminReviewStatisticsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminReviewService.getReviewStatistics(3)
      .then(setData)
      .catch((e) => setError(e.message || '에러 발생'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>데이터 없음</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">만족도</h1>
      <p className="text-gray-600 mb-4">평균 만족도, 사용자/매니저별 만족도를 확인하세요.</p>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">평균 만족도</CardTitle>
            <CardDescription className="text-xs">전체 평균</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{data.avgReviewSatisfaction.toFixed(2)} / 5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">사용자 평균 만족도</CardTitle>
            <CardDescription className="text-xs">전체</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{data.avgCustomerReviewSatisfaction.toFixed(2)} / 5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">매니저 평균 만족도</CardTitle>
            <CardDescription className="text-xs">전체</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{data.avgManagerReviewSatisfaction.toFixed(2)} / 5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">총 평가 건수</CardTitle>
            <CardDescription className="text-xs">누적</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{data.totalReviewCount}건</div>
          </CardContent>
        </Card>
      </div>

      {/* 사용자별 만족도 TOP3 */}
      <Card>
        <CardHeader>
          <CardTitle>사용자별 평균 만족도 TOP3</CardTitle>
          <CardDescription>최근 평가 기준</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">ID</th>
                <th className="p-2">이름</th>
                <th className="p-2">평균 평점</th>
                <th className="p-2">평가 건수</th>
              </tr>
            </thead>
            <tbody>
              {(data.topCustomerList || []).map((u) => (
                <tr key={u.userId} className="border-b">
                  <td className="p-2">{u.userId}</td>
                  <td className="p-2 font-medium">{u.userName}</td>
                  <td className="p-2 text-blue-700 font-bold">{u.avgReview}</td>
                  <td className="p-2">{u.totalReviewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 매니저별 만족도 TOP3 */}
      <Card>
        <CardHeader>
          <CardTitle>매니저별 평균 만족도 TOP3</CardTitle>
          <CardDescription>최근 평가 기준</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">ID</th>
                <th className="p-2">이름</th>
                <th className="p-2">평균 평점</th>
                <th className="p-2">평가 건수</th>
              </tr>
            </thead>
            <tbody>
              {(data.topManagerList || []).map((m) => (
                <tr key={m.userId} className="border-b">
                  <td className="p-2">{m.userId}</td>
                  <td className="p-2 font-medium">{m.userName}</td>
                  <td className="p-2 text-blue-700 font-bold">{m.avgReview}</td>
                  <td className="p-2">{m.totalReviewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 리뷰 많은 사용자 TOP3 */}
      <Card>
        <CardHeader>
          <CardTitle>리뷰 많은 사용자 TOP3</CardTitle>
          <CardDescription>누적 리뷰 수 기준</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">ID</th>
                <th className="p-2">이름</th>
                <th className="p-2">평균 평점</th>
                <th className="p-2">리뷰 수</th>
              </tr>
            </thead>
            <tbody>
              {(data.topCustomerByReviewCount || []).map((u) => (
                <tr key={u.userId} className="border-b">
                  <td className="p-2">{u.userId}</td>
                  <td className="p-2 font-medium">{u.userName}</td>
                  <td className="p-2 text-blue-700 font-bold">{u.avgReview}</td>
                  <td className="p-2">{u.totalReviewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 리뷰 많은 매니저 TOP3 */}
      <Card>
        <CardHeader>
          <CardTitle>리뷰 많은 매니저 TOP3</CardTitle>
          <CardDescription>누적 리뷰 수 기준</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">ID</th>
                <th className="p-2">이름</th>
                <th className="p-2">평균 평점</th>
                <th className="p-2">리뷰 수</th>
              </tr>
            </thead>
            <tbody>
              {(data.topManagerByReviewCount || []).map((m) => (
                <tr key={m.userId} className="border-b">
                  <td className="p-2">{m.userId}</td>
                  <td className="p-2 font-medium">{m.userName}</td>
                  <td className="p-2 text-blue-700 font-bold">{m.avgReview}</td>
                  <td className="p-2">{m.totalReviewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}; 