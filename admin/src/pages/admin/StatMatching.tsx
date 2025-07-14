import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { adminMatchingService } from '../../api/adminMatching';
import { AdminMatchingStatisticsResponseDto } from '../../api/types';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const StatMatching: React.FC = () => {
  const [data, setData] = useState<AdminMatchingStatisticsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminMatchingService.getMatchingStatistics()
      .then(setData)
      .catch((e) => setError(e.message || '에러 발생'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>데이터 없음</div>;

  const stats = [
    { label: '전체 매칭률', value: `${data.matchingSummary.matchingRating}%`, desc: '누적' },
    { label: '총 매칭 시도', value: `${data.matchingSummary.totalMatchingCount}건`, desc: '누적' },
    { label: '매칭 성공', value: `${data.matchingSummary.successCount}건`, desc: '누적' },
    { label: '매칭 실패', value: `${data.matchingSummary.failCount}건`, desc: '누적' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">매칭률</h1>
      <p className="text-gray-600 mb-4">전체 및 매니저별 매칭률을 확인하세요.</p>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle className="text-base font-medium">{s.label}</CardTitle>
              <CardDescription className="text-xs">{s.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 수요자/매니저 무응답·거절률 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">수요자 무응답·거절률</CardTitle>
            <CardDescription className="text-xs">매칭 요청에 응답하지 않거나 거절한 비율</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.matchingSummary.customerRefuseRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">매니저 무응답·거절률</CardTitle>
            <CardDescription className="text-xs">매칭 요청에 응답하지 않거나 거절한 비율</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.matchingSummary.managerRefuseRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* 매니저별 매칭 성공 TOP5 */}
      <Card>
        <CardHeader>
          <CardTitle>매니저별 매칭 성공 TOP5</CardTitle>
          <CardDescription>최근 한 달 기준</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">순위</th>
                <th className="p-2">매니저명</th>
                <th className="p-2">매칭 성공 건수</th>
              </tr>
            </thead>
            <tbody>
              {data.topManagerList.map((m, i) => (
                <tr key={m.managerId} className="border-b">
                  <td className="p-2 font-bold">{i + 1}</td>
                  <td className="p-2">{m.managerName}</td>
                  <td className="p-2">{m.successCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 일별 매칭률 트렌드 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 7일간 매칭률 트렌드</CardTitle>
          <CardDescription>일별 매칭률, 시도/성공 건수</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center text-sm mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2">날짜</th>
                  <th className="p-2">매칭률(%)</th>
                  <th className="p-2">시도 건수</th>
                  <th className="p-2">성공 건수</th>
                </tr>
              </thead>
              <tbody>
                {data.dailyMatchingList.map((d) => (
                  <tr key={d.date} className="border-b">
                    <td className="p-2 font-medium">{d.date}</td>
                    <td className="p-2 text-blue-700 font-bold">{d.matchingRate}</td>
                    <td className="p-2">{d.requestCount}</td>
                    <td className="p-2">{d.successCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* 막대+선 그래프 */}
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dailyMatchingList} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="requestCount" fill="#a3a3a3" name="시도 건수" barSize={24} />
                  <Bar yAxisId="left" dataKey="successCount" fill="#3b82f6" name="성공 건수" barSize={24} />
                  <Line yAxisId="right" type="monotone" dataKey="matchingRate" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb' }} name="매칭률(%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 