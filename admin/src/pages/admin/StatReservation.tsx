import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

const stats = [
  { label: '예약률', value: '65%', desc: '지난 30일 기준' },
  { label: '취소율', value: '12%', desc: '지난 30일 기준' },
  { label: '총 예약 건수', value: '1,240건', desc: '누적' },
  { label: '총 취소 건수', value: '150건', desc: '누적' },
];

const trendData = [
  { date: '06-01', reservation: 70, cancel: 10 },
  { date: '06-02', reservation: 65, cancel: 12 },
  { date: '06-03', reservation: 68, cancel: 11 },
  { date: '06-04', reservation: 66, cancel: 13 },
  { date: '06-05', reservation: 63, cancel: 14 },
  { date: '06-06', reservation: 67, cancel: 12 },
  { date: '06-07', reservation: 69, cancel: 10 },
];

export const StatReservation: React.FC = () => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold">예약률 & 취소율</h1>
    <p className="text-gray-600 mb-4">예약 성공률과 취소율을 한눈에 확인하세요.</p>

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

    {/* 트렌드 테이블 (샘플) */}
    <Card>
      <CardHeader>
        <CardTitle>최근 7일간 예약/취소 트렌드</CardTitle>
        <CardDescription>예약률과 취소율의 일별 변화</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">날짜</th>
                <th className="p-2">예약률(%)</th>
                <th className="p-2">취소율(%)</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((d) => (
                <tr key={d.date} className="border-b">
                  <td className="p-2 font-medium">{d.date}</td>
                  <td className="p-2">{d.reservation}</td>
                  <td className="p-2">{d.cancel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    {/* 예약/취소 비율 그래프 (샘플 바) */}
    <Card>
      <CardHeader>
        <CardTitle>예약/취소 비율</CardTitle>
        <CardDescription>전체 예약 대비 취소 비율 시각화</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="w-32 text-sm text-gray-700">예약</div>
          <div className="flex-1 bg-gray-200 rounded h-4">
            <div className="bg-blue-500 h-4 rounded" style={{ width: '88%' }} />
          </div>
          <div className="w-12 text-right text-sm font-bold text-blue-700">88%</div>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="w-32 text-sm text-gray-700">취소</div>
          <div className="flex-1 bg-gray-200 rounded h-4">
            <div className="bg-red-400 h-4 rounded" style={{ width: '12%' }} />
          </div>
          <div className="w-12 text-right text-sm font-bold text-red-600">12%</div>
        </div>
      </CardContent>
    </Card>
  </div>
); 