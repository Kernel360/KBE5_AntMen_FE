import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { adminRefundsService } from '../../api/adminRefunds';
import { AdminRefundStatisticsResponseDto } from '../../api/types';

// 환불 사유 분포 - 추후 API 연동 예정
const reasonData = [
  { reason: '서비스 불만족', count: 38 },
  { reason: '예약 실수', count: 24 },
  { reason: '매니저 미배정', count: 18 },
  { reason: '기타', count: 22 },
];

// 사용자별 환불률 - 추후 API 연동 예정
const userRefunds = [
  { name: '홍길동', refunds: 3, total: 20, rate: 15 },
  { name: '김철수', refunds: 2, total: 18, rate: 11 },
  { name: '이영희', refunds: 1, total: 25, rate: 4 },
  { name: '박민수', refunds: 1, total: 12, rate: 8 },
];

// 매니저별 환불률 - 추후 API 연동 예정
const managerRefunds = [
  { name: '김매니저', refunds: 5, total: 40, rate: 12 },
  { name: '이매니저', refunds: 2, total: 35, rate: 6 },
  { name: '박매니저', refunds: 1, total: 30, rate: 3 },
];

export const StatRefund: React.FC = () => {
  const [refundStatistics, setRefundStatistics] = useState<AdminRefundStatisticsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRefundStatistics = async () => {
      try {
        setLoading(true);
        const data = await adminRefundsService.getRefundStatistics();
        setRefundStatistics(data);
        setError(null);
      } catch (err: any) {
        console.error('환불 통계 조회 실패:', err);
        setError(err.message || '환불 통계를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRefundStatistics();
  }, []);

  // 통계 카드 데이터 생성
  const getRefundStatsCards = () => {
    if (!refundStatistics) return [];
    
    return [
      { 
        label: '전체 환불률', 
        value: `${refundStatistics.refundRate.toFixed(1)}%`, 
        desc: '누적 기준' 
      },
      { 
        label: '총 환불 건수', 
        value: `${refundStatistics.totalRefundCount}건`, 
        desc: '누적 전체 환불 건수' 
      },
      { 
        label: '승인된 환불 건수', 
        value: `${refundStatistics.approveRefundCount}건`, 
        desc: '승인된 누적 환불 건수' 
      },
      { 
        label: '환불 금액', 
        value: `₩${refundStatistics.totalRefundAmount.toLocaleString()}`, 
        desc: '승인된 누적 환불 금액' 
      },
    ];
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">환불 분석</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">환불 분석</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">오류: {error}</div>
        </div>
      </div>
    );
  }

  const refundStatsCards = getRefundStatsCards();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">환불 분석</h1>
      <p className="text-gray-600 mb-4">환불 사유, 사용자/매니저별 환불률 등 다양한 환불 통계를 확인하세요.</p>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {refundStatsCards.map((s) => (
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

      {/* 환불 사유 분포 */}
      <Card>
        <CardHeader>
          <CardTitle>환불 사유 분포</CardTitle>
          <CardDescription>최근 30일 기준 (추후 API 연동 예정)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {reasonData.map((r) => (
              <div key={r.reason} className="flex items-center">
                <div className="w-32 text-sm text-gray-700">{r.reason}</div>
                <div className="flex-1 bg-gray-200 rounded h-3 mx-2">
                  <div className="bg-red-400 h-3 rounded" style={{ width: `${r.count * 2}%` }} />
                </div>
                <div className="w-10 text-right text-sm font-bold text-red-600">{r.count}건</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 사용자별 환불률 */}
      <Card>
        <CardHeader>
          <CardTitle>사용자별 환불률 TOP4</CardTitle>
          <CardDescription>최근 30일 기준 (추후 API 연동 예정)</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">이름</th>
                <th className="p-2">환불 건수</th>
                <th className="p-2">총 이용 건수</th>
                <th className="p-2">환불률(%)</th>
              </tr>
            </thead>
            <tbody>
              {userRefunds.map((u) => (
                <tr key={u.name} className="border-b">
                  <td className="p-2 font-medium">{u.name}</td>
                  <td className="p-2">{u.refunds}</td>
                  <td className="p-2">{u.total}</td>
                  <td className="p-2 text-red-600 font-bold">{u.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 매니저별 환불률 */}
      <Card>
        <CardHeader>
          <CardTitle>매니저별 환불률 TOP3</CardTitle>
          <CardDescription>최근 30일 기준 (추후 API 연동 예정)</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">이름</th>
                <th className="p-2">환불 건수</th>
                <th className="p-2">총 매칭 건수</th>
                <th className="p-2">환불률(%)</th>
              </tr>
            </thead>
            <tbody>
              {managerRefunds.map((m) => (
                <tr key={m.name} className="border-b">
                  <td className="p-2 font-medium">{m.name}</td>
                  <td className="p-2">{m.refunds}</td>
                  <td className="p-2">{m.total}</td>
                  <td className="p-2 text-red-600 font-bold">{m.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}; 