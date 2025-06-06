import { useRef, useState } from 'react';
import { BoardType, UserRole } from '@/shared/types/board';

interface BoardTabsProps {
  userRole: 'user' | 'manager';
  activeTab: '공지사항' | '서비스 문의' | '업무 문의';
  onTabChange: (tab: '공지사항' | '서비스 문의' | '업무 문의') => void;
}

export const BoardTabs = ({ userRole, activeTab, onTabChange }: BoardTabsProps) => {
  const tabs = userRole === 'user' 
    ? ['공지사항', '서비스 문의'] as const
    : ['공지사항', '업무 문의'] as const;

  return (
    <div className="grid grid-cols-2 bg-white border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative py-3.5 text-sm font-medium transition-colors ${
            activeTab === tab ? 'bg-primary/10' : ''
          }`}
        >
          <span className={activeTab === tab ? 'text-primary' : 'text-gray-600'}>
            {tab}
          </span>
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}; 