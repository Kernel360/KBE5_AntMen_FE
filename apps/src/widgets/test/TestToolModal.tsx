'use client';

import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { setCurrentUser, getCurrentUser } from '@/widgets/post/mocks/posts';

// 테스트용 사용자 목록
const TEST_USERS = {
  customer: [
    { id: 'user123', name: '김서비스', tag: '게시글 많음' },
    { id: 'user456', name: '이고객', tag: '댓글 많음' },
    { id: 'user234', name: '최고객', tag: '게시글 없음' },
  ],
  manager: [
    { id: 'manager456', name: '매니저김', tag: '답변 많음' },
    { id: 'manager789', name: '매니저이', tag: '신입' },
    { id: 'manager202', name: '매니저최', tag: '답변 없음' },
  ],
};

// 역할별 색상 설정
const ROLE_COLORS = {
  customer: {
    primary: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    selected: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  manager: {
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
  const [userRole, setUserRole] = useState<'customer' | 'manager' | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // 초기 상태 설정
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUserRole(currentUser.role as 'customer' | 'manager' | null);
    setSelectedUserId(currentUser.userId || null);
  }, []);

  // 역할 변경 시 해당 역할의 첫 번째 사용자로 설정
  const handleRoleChange = (newRole: 'customer' | 'manager' | null) => {
    setUserRole(newRole);
    if (!newRole) {
      setSelectedUserId(null);
      setCurrentUser(null, null);
      return;
    }
    const firstUser = TEST_USERS[newRole][0];
    setSelectedUserId(firstUser.id);
    setCurrentUser(firstUser.id, newRole);
  };

  // 사용자 변경 시 mock 데이터 업데이트
  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentUser(userId, userRole);
  };

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
                    onClick={() => handleRoleChange('customer')}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      userRole === 'customer'
                        ? `${ROLE_COLORS.customer.selected} ${ROLE_COLORS.customer.text} ${ROLE_COLORS.customer.border}`
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    일반 사용자
                  </button>
                  <button
                    onClick={() => handleRoleChange('manager')}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      userRole === 'manager'
                        ? `${ROLE_COLORS.manager.selected} ${ROLE_COLORS.manager.text} ${ROLE_COLORS.manager.border}`
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
                    {TEST_USERS[userRole].map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserChange(user.id)}
                        className={`p-2 rounded-lg text-sm border transition-colors ${
                          selectedUserId === user.id
                            ? `${roleColors.selected} ${roleColors.text} ${roleColors.border}`
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                        }`}
                      >
                        <div>{user.name}</div>
                        <div className="text-xs opacity-75">{user.tag}</div>
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