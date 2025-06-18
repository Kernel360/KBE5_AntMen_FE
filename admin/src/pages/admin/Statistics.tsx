import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

const stats = [
  { label: '전체 매칭률', value: '78%', desc: '지난 30일 기준' },
  { label: '예약률', value: '65%', desc: '지난 30일 기준' },
  { label: '취소율', value: '12%', desc: '지난 30일 기준' },
  { label: '평균 만족도', value: '4.6 / 5', desc: '최근 100건 기준' },
  { label: '결제 성공률', value: '91%', desc: '지난 30일 기준' },
];

const trendData = [
  { date: '06-01', matching: 80, reservation: 70, cancel: 10, payment: 90, satisfaction: 4.7 },
  { date: '06-02', matching: 77, reservation: 65, cancel: 12, payment: 92, satisfaction: 4.5 },
  { date: '06-03', matching: 79, reservation: 68, cancel: 11, payment: 89, satisfaction: 4.6 },
  { date: '06-04', matching: 81, reservation: 66, cancel: 13, payment: 91, satisfaction: 4.7 },
  { date: '06-05', matching: 76, reservation: 63, cancel: 14, payment: 90, satisfaction: 4.4 },
  { date: '06-06', matching: 78, reservation: 67, cancel: 12, payment: 93, satisfaction: 4.8 },
  { date: '06-07', matching: 80, reservation: 69, cancel: 10, payment: 94, satisfaction: 4.9 },
];

const regionStats = [
  { region: '서울', matching: 82 },
  { region: '경기', matching: 79 },
  { region: '부산', matching: 75 },
  { region: '대구', matching: 73 },
  { region: '광주', matching: 70 },
];

const topManagers = [
  { name: '김매니저', success: 32 },
  { name: '이매니저', success: 29 },
  { name: '박매니저', success: 27 },
  { name: '최매니저', success: 25 },
  { name: '정매니저', success: 24 },
];

export const Statistics: React.FC = () => (
  <div className="space-y-8">
    <h1 className="text-3xl font-bold text-gray-900">통계</h1>
    <p className="text-gray-600 mb-4">서비스 운영의 주요 지표를 한눈에 확인하세요.</p>

    {/* 주요 지표 카드 */}
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
        <CardTitle>최근 7일간 주요 지표 트렌드</CardTitle>
        <CardDescription>매칭률, 예약률, 취소율, 결제 성공률, 만족도</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">날짜</th>
                <th className="p-2">매칭률(%)</th>
                <th className="p-2">예약률(%)</th>
                <th className="p-2">취소율(%)</th>
                <th className="p-2">결제 성공률(%)</th>
                <th className="p-2">만족도</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((d) => (
                <tr key={d.date} className="border-b">
                  <td className="p-2 font-medium">{d.date}</td>
                  <td className="p-2">{d.matching}</td>
                  <td className="p-2">{d.reservation}</td>
                  <td className="p-2">{d.cancel}</td>
                  <td className="p-2">{d.payment}</td>
                  <td className="p-2">{d.satisfaction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    {/* 지역별 매칭률 */}
    <Card>
      <CardHeader>
        <CardTitle>지역별 매칭률</CardTitle>
        <CardDescription>주요 지역별 매칭 성공률</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {regionStats.map((r) => (
            <div key={r.region} className="flex items-center">
              <div className="w-16 text-sm text-gray-700">{r.region}</div>
              <div className="flex-1 bg-gray-200 rounded h-3 mx-2">
                <div className="bg-blue-500 h-3 rounded" style={{ width: `${r.matching}%` }} />
              </div>
              <div className="w-10 text-right text-sm font-bold text-blue-700">{r.matching}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

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
            {topManagers.map((m, i) => (
              <tr key={m.name} className="border-b">
                <td className="p-2 font-bold">{i + 1}</td>
                <td className="p-2">{m.name}</td>
                <td className="p-2">{m.success}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
); 