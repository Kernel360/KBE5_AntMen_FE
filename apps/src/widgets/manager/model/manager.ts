import type { Review } from '@/entities/review';

export const MAX_MANAGER_COUNT = 3;

export const MANAGER_SELECTION_COLORS = {
  FIRST: '#3b82f6',   // 파란색 (1순위)
  SECOND: '#10b981',  // 초록색 (2순위) 
  THIRD: '#f59e0b',   // 주황색 (3순위)
  DEFAULT: '#e2e8f0'  // 기본색
} as const;

export const MANAGER_SELECTION_PRIORITIES = {
  FIRST: '1순위',
  SECOND: '2순위', 
  THIRD: '3순위'
} as const;

export interface Manager {
  id: string;
  name: string;
  gender: string;
  age: number;
  rating: number;
  description: string;
  profileImage: string;
  reviewCount: number;
  introduction: string;
  characteristics: Array<{
    id: string;
    label: string;
    type: 'kind' | 'punctual' | 'thorough';
  }>;
  reviews: Review[];
}

export const MANAGER_LIST: Manager[] = [];

export const MANAGER_NAMES = {
  '1': '김민지',
  '2': '이영희',
  '3': '박지민',
  '4': '최민수',
} as const; 