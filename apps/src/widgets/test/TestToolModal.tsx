'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';
import Cookies from 'js-cookie';

interface User {
  userId: number;
  userName: string;
  userRole: 'CUSTOMER' | 'MANAGER';
}

// 역할별 색상 설정
const ROLE_COLORS = {
  CUSTOMER: {
    primary: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    selected: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  MANAGER: {
    primary: 'bg-emerald-500',
    hover: 'hover:bg-emerald-600',
    selected: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  none: {
    primary: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    selected: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  },
};

export function TestToolModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<'CUSTOMER' | 'MANAGER' | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/v1/test/user');
      if (!response.ok) return;
      const data = await response.json();
      setUsers(data || []);
    } catch (err) {
      console.error('사용자 목록 조회 실패:', err);
      setUsers([]);
    }
  };

  // 역할 변경 시 처리
  const handleRoleChange = async (newRole: 'CUSTOMER' | 'MANAGER' | null) => {
    setUserRole(newRole);
    setUsers([]);
    
    if (!newRole) {
      setSelectedUserId(null);
      Cookies.remove('auth-token');
      Cookies.remove('auth-time');
      return;
    }

    await fetchUsers();
  };

  // 사용자 변경 시 처리
  const handleUserChange = async (userId: number) => {
    try {
      const response = await fetch('http://localhost:9090/api/v1/test/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) return;
      
      const { token } = await response.json();
      setSelectedUserId(userId);
      
      Cookies.set('auth-token', `Bearer ${token}`, {
        expires: 1, // 테스트용이므로 1일만 유지
        secure: false,
        sameSite: 'strict',
        path: '/'
      });
      
      Cookies.set('auth-time', new Date().toISOString(), {
        expires: 1,
        secure: false,
        sameSite: 'strict',
        path: '/'
      });
    } catch (err) {
      console.error('테스트 토큰 발급 실패:', err);
    }
  };

  // 현재 선택된 역할의 사용자만 필터링
  const filteredUsers = userRole ? users.filter(user => user.userRole === userRole) : [];

  const roleColors = userRole ? ROLE_COLORS[userRole] : ROLE_COLORS.none;

  return (
    <>
      {/* 테스트 도구 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 ${roleColors.selected} ${roleColors.text} rounded-full p-3 shadow-lg transition-colors`}
      >
        <span className="flex items-center gap-1">
          <span className="text-lg">🔧</span>
          <span className="text-sm font-medium">테스트 도구</span>
        </span>
      </button>

      {/* 테스트 모달 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[600px] mx-4">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className={`text-lg font-semibold ${roleColors.text}`}>
                🔧 테스트 도구
                {userRole === null && <span className="text-sm font-normal text-gray-500 ml-2">(로그아웃 상태)</span>}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-4">
              {/* 역할 선택 */}
              <div className="mb-4">
                <p className="text-sm mb-2 font-medium text-gray-700">역할 선택</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRoleChange('CUSTOMER')}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      userRole === 'CUSTOMER'
                        ? `${ROLE_COLORS.CUSTOMER.selected} ${ROLE_COLORS.CUSTOMER.text} ${ROLE_COLORS.CUSTOMER.border}`
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    일반 사용자
                  </button>
                  <button
                    onClick={() => handleRoleChange('MANAGER')}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      userRole === 'MANAGER'
                        ? `${ROLE_COLORS.MANAGER.selected} ${ROLE_COLORS.MANAGER.text} ${ROLE_COLORS.MANAGER.border}`
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    매니저
                  </button>
                </div>
              </div>

              {/* 사용자 선택 */}
              {userRole && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">사용자 선택</p>
                    <button
                      onClick={() => handleRoleChange(null)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      로그아웃
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.userId}
                        onClick={() => handleUserChange(user.userId)}
                        className={`p-2 rounded-lg text-sm border transition-colors ${
                          selectedUserId === user.userId
                            ? `${roleColors.selected} ${roleColors.text} ${roleColors.border}`
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                        }`}
                      >
                        <div>{user.userName}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 