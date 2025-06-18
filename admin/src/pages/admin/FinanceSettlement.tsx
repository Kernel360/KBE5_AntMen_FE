import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

const settlementStats = [
  { label: '총 정산 금액', value: '₩8,900,000', desc: '누적' },
  { label: '이번 달 정산', value: '₩1,500,000', desc: '2025-06 기준' },
  { label: '정산 완료 건수', value: '320건', desc: '누적' },
];

const managerSettlements = [
  { name: '김매니저', amount: 400000, count: 10 },
  { name: '이매니저', amount: 350000, count: 8 },
  { name: '박매니저', amount: 300000, count: 7 },
  { name: '최매니저', amount: 250000, count: 6 },
];

export const FinanceSettlement: React.FC = () => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold">매니저 정산</h1>
    <p className="text-gray-600 mb-4">매니저별 정산 현황을 확인하세요.</p>

    {/* 주요 지표 카드 */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {settlementStats.map((s) => (
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

    {/* 매니저별 정산 테이블 */}
    <Card>
      <CardHeader>
        <CardTitle>매니저별 정산 내역</CardTitle>
        <CardDescription>최근 1개월 기준</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="min-w-full text-center text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">매니저명</th>
              <th className="p-2">정산 금액(₩)</th>
              <th className="p-2">정산 건수</th>
            </tr>
          </thead>
          <tbody>
            {managerSettlements.map((m) => (
              <tr key={m.name} className="border-b">
                <td className="p-2 font-medium">{m.name}</td>
                <td className="p-2">{m.amount.toLocaleString()}</td>
                <td className="p-2">{m.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
); 