'use client';

import { useAuthStore } from '@/shared/stores/authStore';
import { useEffect, useState } from 'react';
import { MAX_MANAGER_COUNT } from '@/widgets/manager/model/manager';
import { ReservationStorage } from '@/shared/lib/reservationStorage';

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
 * 매니저 선택 관련 로직을 예약 정보와 통합하여 관리하는 커스텀 훅
 * 예약 정보에 매니저 선택을 포함시켜 일관성을 보장합니다.
 *
 * @param {UseManagerSelectionProps} props - 훅의 동작을 설정하는 객체
 * @param {'block-on-max' | 'slide-on-max'} [props.strategy='block-on-max'] - 매니저 선택 전략을 결정
 *
 * @returns {{
 *   selectedManagers: string[];
 *   handleManagerSelect: (managerId: string) => void;
 *   clearSelection: () => void;
 * }} - 선택된 매니저 목록과 선택/해제 핸들러 함수를 반환
 */
export const useManagerSelection = ({ strategy = 'block-on-max' }: UseManagerSelectionProps = {}) => {
  const { user } = useAuthStore();
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 세션에서 매니저 선택 정보 로드
  useEffect(() => {
    const loadSelectedManagers = () => {
      try {
        const reservationStr = sessionStorage.getItem('currentReservation');
        if (reservationStr) {
          const reservation = JSON.parse(reservationStr);
          
          // 먼저 selectedManagerIds를 확인하고, 없으면 기존 selectedManagers에서 추출
          let managerIds: string[] = [];
          
          if (reservation.selectedManagerIds && Array.isArray(reservation.selectedManagerIds)) {
            managerIds = reservation.selectedManagerIds;
          } else if (reservation.selectedManagers && Array.isArray(reservation.selectedManagers)) {
            managerIds = reservation.selectedManagers.map((m: any) => m.id);
          }
          
          setSelectedManagers(managerIds);
        }
        setIsLoaded(true);
      } catch (error) {
        setSelectedManagers([]);
        setIsLoaded(true);
      }
    };

    loadSelectedManagers();
  }, []);

  const handleManagerSelect = async (managerId: string) => {
    const isSelected = selectedManagers.includes(managerId);
    let newSelection: string[];

    // 이미 선택된 매니저일 경우, 목록에서 제거 (선택 해제)
    if (isSelected) {
      newSelection = selectedManagers.filter(id => id !== managerId);
    } else {
      // 최대 선택 가능 인원에 도달하지 않았을 경우, 목록에 추가
      if (selectedManagers.length < MAX_MANAGER_COUNT) {
        newSelection = [...selectedManagers, managerId];
      } else if (strategy === 'slide-on-max') {
        // 최대 인원에 도달했고 'slide-on-max' 전략을 사용할 경우,
        // 가장 오래된 선택을 제거하고 새로운 선택을 추가
        newSelection = [...selectedManagers.slice(1), managerId];
      } else {
        // 'block-on-max' 전략이면 아무것도 하지 않음
        return;
      }
    }

    // 상태 업데이트
    setSelectedManagers(newSelection);
    
    // 실시간으로 sessionStorage에 매니저 선택 정보 저장
    try {
      const reservationStr = sessionStorage.getItem('currentReservation');
      if (reservationStr) {
        const reservation = JSON.parse(reservationStr);
        
        // 선택된 매니저 ID만 저장 (상세 정보는 BottomSection에서 처리)
        const updatedReservation = {
          ...reservation,
          selectedManagerIds: newSelection
        };
        
        sessionStorage.setItem('currentReservation', JSON.stringify(updatedReservation));
      }
    } catch (error) {
      console.error('매니저 선택 저장 실패:', error);
    }
    
  };

  const clearSelection = () => {
    setSelectedManagers([]);
    
    // sessionStorage에서도 매니저 선택 정보 제거
    try {
      const reservationStr = sessionStorage.getItem('currentReservation');
      if (reservationStr) {
        const reservation = JSON.parse(reservationStr);
        const updatedReservation = {
          ...reservation,
          selectedManagerIds: [],
          selectedManagers: []
        };
        sessionStorage.setItem('currentReservation', JSON.stringify(updatedReservation));
      }
    } catch (error) {
    }
    
  };

  return {
    selectedManagers,
    handleManagerSelect,
    clearSelection,
    isLoaded,
  };
}; 