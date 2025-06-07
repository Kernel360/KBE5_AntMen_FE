'use client';

import { useState } from 'react';
import { MAX_MANAGER_COUNT } from '@/widgets/manager/model/manager';

/**
 * 매니저 선택 전략을 정의
 * - `block-on-max`: 최대 선택 수에 도달하면 더 이상 선택을 막음
 * - `slide-on-max`: 최대 선택 수에 도달하면 가장 오래된 선택을 제거하고 새 선택을 추가
 */
type SelectionStrategy = 'block-on-max' | 'slide-on-max';

interface UseManagerSelectionProps {
  /**
   * 사용할 선택 전략을 지정
   * @default 'block-on-max'
   */
  strategy?: SelectionStrategy;
}

/**
 * 매니저 선택 관련 로직을 캡슐화한 커스텀 훅
 *
 * @param {UseManagerSelectionProps} props - 훅의 동작을 설정하는 객체
 * @param {'block-on-max' | 'slide-on-max'} [props.strategy='block-on-max'] - 매니저 선택 전략을 결정
 *
 * @returns {{
 *   selectedManagers: string[];
 *   handleManagerSelect: (managerId: string) => void;
 * }} - 선택된 매니저 목록과 선택/해제 핸들러 함수를 반환
 */
export const useManagerSelection = ({ strategy = 'block-on-max' }: UseManagerSelectionProps = {}) => {
  // 현재 선택된 매니저들의 ID를 담는 배열 상태
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);

  /**
   * 특정 매니저를 선택하거나 선택 해제하는 함수
   *
   * @param {string} managerId - 처리할 매니저의 고유 ID
   */
  const handleManagerSelect = (managerId: string) => {
    setSelectedManagers(prev => {
      const isSelected = prev.includes(managerId);

      // 이미 선택된 매니저일 경우, 목록에서 제거 (선택 해제)
      if (isSelected) {
        return prev.filter(id => id !== managerId);
      }

      // 최대 선택 가능 인원에 도달하지 않았을 경우, 목록에 추가
      if (prev.length < MAX_MANAGER_COUNT) {
        return [...prev, managerId];
      }

      // 최대 인원에 도달했고 'slide-on-max' 전략을 사용할 경우,
      // 가장 오래된 선택을 제거하고 새로운 선택을 추가
      if (strategy === 'slide-on-max') {
        return [...prev.slice(1), managerId];
      }
      
      // 'block-on-max' 전략이거나 다른 조건에 해당하지 않으면, 현재 상태를 유지
      return prev;
    });
  };

  return {
    selectedManagers,
    handleManagerSelect,
  };
}; 