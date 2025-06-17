import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

const stats = [
  { label: '전체 매칭률', value: '78%', desc: '지난 30일 기준' },
  { label: '총 매칭 시도', value: '1,500건', desc: '누적' },
  { label: '매칭 성공', value: '1,170건', desc: '누적' },
  { label: '매칭 실패', value: '330건', desc: '누적' },
];

const trendData = [
  { date: '06-01', matching: 80 },
  { date: '06-02', matching: 77 },
  { date: '06-03', matching: 79 },
  { date: '06-04', matching: 81 },
  { date: '06-05', matching: 76 },
  { date: '06-06', matching: 78 },
  { date: '06-07', matching: 80 },
];

const regionStats = [
  { region: '서울', matching: 82 },
  { region: '경기', matching: 79 },
  { region: '부산', matching: 75 },
  { region: '대구', matching: 73 },
  { region: '광주', matching: 70 },
];

const topManagers = [
  { name: '김매니저', matching: 32 },
  { name: '이매니저', matching: 29 },
  { name: '박매니저', matching: 27 },
  { name: '최매니저', matching: 25 },
  { name: '정매니저', matching: 24 },
];

export const StatMatching: React.FC = () => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold">매칭률</h1>
    <p className="text-gray-600 mb-4">전체 및 지역/매니저별 매칭률을 확인하세요.</p>

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
        <CardTitle>최근 7일간 매칭률 트렌드</CardTitle>
        <CardDescription>일별 매칭률 변화</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">날짜</th>
                <th className="p-2">매칭률(%)</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((d) => (
                <tr key={d.date} className="border-b">
                  <td className="p-2 font-medium">{d.date}</td>
                  <td className="p-2">{d.matching}</td>
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
                <td className="p-2">{m.matching}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
); 