import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

const mockBlacklist = [
  { id: 1, name: '홍길동', email: 'hong@example.com', reason: '악성 리뷰 반복', date: '2024-06-18' },
  { id: 2, name: '김철수', email: 'kim@example.com', reason: '서비스 방해', date: '2024-06-10' },
];

const UsersBlacklist: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">블랙리스트 관리</h1>
    <p className="text-gray-600 mb-4">블랙리스트에 등록된 회원을 관리합니다.</p>
    <Card>
      <CardHeader>
        <CardTitle>블랙리스트 회원 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="min-w-full text-center text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">이름</th>
              <th className="p-2">이메일</th>
              <th className="p-2">사유</th>
              <th className="p-2">등록일</th>
            </tr>
          </thead>
          <tbody>
            {mockBlacklist.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-2 font-medium">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.reason}</td>
                <td className="p-2">{user.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
    <div className="text-xs text-gray-400">※ 실제 데이터 및 기능은 추후 연동 예정</div>
  </div>
);

export default UsersBlacklist; 