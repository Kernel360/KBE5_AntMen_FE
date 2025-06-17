import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

const stats = [
  { label: '평균 만족도', value: '4.6 / 5', desc: '최근 100건 기준' },
  { label: '5점 비율', value: '68%', desc: '최근 100건 기준' },
  { label: '4점 비율', value: '22%', desc: '최근 100건 기준' },
  { label: '3점 이하 비율', value: '10%', desc: '최근 100건 기준' },
];

const scoreDist = [
  { score: 5, count: 68 },
  { score: 4, count: 22 },
  { score: 3, count: 7 },
  { score: 2, count: 3 },
  { score: 1, count: 0 },
];

const recentReviews = [
  { user: '홍길동', score: 5, comment: '매우 만족합니다!' },
  { user: '김철수', score: 4, comment: '좋아요. 친절했어요.' },
  { user: '이영희', score: 3, comment: '보통이에요.' },
  { user: '박민수', score: 5, comment: '정말 최고입니다.' },
];

const userSatisfaction = [
  { name: '홍길동', avg: 4.8, count: 12 },
  { name: '김철수', avg: 4.5, count: 10 },
  { name: '이영희', avg: 4.2, count: 15 },
];

const managerSatisfaction = [
  { name: '김매니저', avg: 4.9, count: 20 },
  { name: '이매니저', avg: 4.7, count: 18 },
  { name: '박매니저', avg: 4.6, count: 16 },
];

export const StatSatisfaction: React.FC = () => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold">만족도</h1>
    <p className="text-gray-600 mb-4">평균 만족도, 평점 분포, 최근 평가, 사용자/매니저별 만족도를 확인하세요.</p>

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

    {/* 평점 분포 바 */}
    <Card>
      <CardHeader>
        <CardTitle>평점 분포</CardTitle>
        <CardDescription>최근 100건 기준</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {scoreDist.map((s) => (
            <div key={s.score} className="flex items-center">
              <div className="w-10 text-sm text-gray-700">{s.score}점</div>
              <div className="flex-1 bg-gray-200 rounded h-3 mx-2">
                <div className="bg-blue-500 h-3 rounded" style={{ width: `${s.count}%` }} />
              </div>
              <div className="w-10 text-right text-sm font-bold text-blue-700">{s.count}건</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* 최근 평가 */}
    <Card>
      <CardHeader>
        <CardTitle>최근 평가</CardTitle>
        <CardDescription>최신 4건</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recentReviews.map((r, i) => (
            <li key={i} className="flex items-center gap-4">
              <span className="font-bold text-blue-700">{r.user}</span>
              <span className="text-yellow-500">{'★'.repeat(r.score)}{'☆'.repeat(5 - r.score)}</span>
              <span className="text-gray-700">{r.comment}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>

    {/* 사용자별 만족도 */}
    <Card>
      <CardHeader>
        <CardTitle>사용자별 평균 만족도 TOP3</CardTitle>
        <CardDescription>최근 30일 기준</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="min-w-full text-center text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">이름</th>
              <th className="p-2">평균 평점</th>
              <th className="p-2">평가 건수</th>
            </tr>
          </thead>
          <tbody>
            {userSatisfaction.map((u) => (
              <tr key={u.name} className="border-b">
                <td className="p-2 font-medium">{u.name}</td>
                <td className="p-2 text-blue-700 font-bold">{u.avg}</td>
                <td className="p-2">{u.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>

    {/* 매니저별 만족도 */}
    <Card>
      <CardHeader>
        <CardTitle>매니저별 평균 만족도 TOP3</CardTitle>
        <CardDescription>최근 30일 기준</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="min-w-full text-center text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">이름</th>
              <th className="p-2">평균 평점</th>
              <th className="p-2">평가 건수</th>
            </tr>
          </thead>
          <tbody>
            {managerSatisfaction.map((m) => (
              <tr key={m.name} className="border-b">
                <td className="p-2 font-medium">{m.name}</td>
                <td className="p-2 text-blue-700 font-bold">{m.avg}</td>
                <td className="p-2">{m.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
); 