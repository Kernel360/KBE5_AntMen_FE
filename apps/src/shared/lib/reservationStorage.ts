import { useAuthStore } from '@/shared/stores/authStore';

// TODO: 백엔드 API 구현 후 활성화할 서버 동기화 기능
/**
 * 서버와 예약 정보를 동기화하는 API 함수들
 * 현재는 백엔드 미구현으로 주석처리됨
 */
// class ReservationSyncAPI {
//   private static baseURL = 'https://api.antmen.site:9091';

//   /**
//    * 서버에 임시 예약 정보 저장
//    */
//   static async saveToServer(data: any, userId: number): Promise<boolean> {
//     try {
//       const response = await fetch(`${this.baseURL}/api/v1/reservations/draft`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getToken()}`,
//         },
//         body: JSON.stringify({
//           userId,
//           draftData: data,
//           updatedAt: new Date().toISOString(),
//         }),
//       });

//       return response.ok;
//     } catch (error) {
//       console.error('서버 저장 실패:', error);
//       return false;
//     }
//   }

//   /**
//    * 서버에서 임시 예약 정보 가져오기
//    */
//   static async loadFromServer(userId: number): Promise<any | null> {
//     try {
//       const response = await fetch(`${this.baseURL}/api/v1/reservations/draft/${userId}`, {
//         headers: {
//           'Authorization': `Bearer ${this.getToken()}`,
//         },
//       });

//       if (!response.ok) return null;

//       const data = await response.json();
//       return data.draftData || null;
//     } catch (error) {
//       console.error('서버 로드 실패:', error);
//       return null;
//     }
//   }

//   /**
//    * 서버에서 임시 예약 정보 삭제
//    */
//   static async deleteFromServer(userId: number): Promise<boolean> {
//     try {
//       const response = await fetch(`${this.baseURL}/api/v1/reservations/draft/${userId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${this.getToken()}`,
//         },
//       });

//       return response.ok;
//     } catch (error) {
//       console.error('서버 삭제 실패:', error);
//       return false;
//     }
//   }

//   private static getToken(): string {
//     const { user } = useAuthStore.getState();
//     // 실제 구현에서는 적절한 토큰을 반환
//     return localStorage.getItem('auth-token') || '';
//   }
// }

/**
 * 사용자별로 예약 정보를 안전하게 관리하는 유틸리티 클래스
 */
export class ReservationStorage {
  /**
   * 현재 로그인된 사용자의 ID를 가져옵니다
   */
  private static getCurrentUserId(): number | null {
    const { user } = useAuthStore.getState();
    return user?.userId || null;
  }

  /**
   * 사용자별 localStorage key를 생성합니다
   */
  private static getStorageKey(userId: number | null): string {
    return `pendingReservation-${userId || 'anonymous'}`;
  }

  /**
   * 현재 사용자의 예약 정보를 저장합니다 (로컬 저장만, 서버 동기화는 추후 구현)
   */
  static async savePendingReservation(data: any): Promise<void> {
    if (typeof window === 'undefined') return;
    
    const userId = this.getCurrentUserId();
    const key = this.getStorageKey(userId);
    
    // 기존 예약 정보가 있으면 매니저 선택 정보 유지, 없으면 새로 시작
    const existingData = localStorage.getItem(key);
    let selectedManagers: string[] = [];
    
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        // 예약의 핵심 정보(카테고리, 날짜, 시간)가 동일하면 매니저 선택 유지
        if (parsed.categoryId === data.categoryId && 
            parsed.reservationDate === data.reservationDate && 
            parsed.reservationTime === data.reservationTime) {
          selectedManagers = parsed.selectedManagers || [];
        }
      } catch (e) {
        console.error('기존 데이터 파싱 실패:', e);
      }
    }
    
    // 사용자 ID와 매니저 선택 정보를 데이터에 포함
    const dataWithUserId = {
      ...data,
      customerId: userId,
      selectedManagers,
      savedAt: new Date().toISOString(),
    };
    
    // 로컬 저장
    localStorage.setItem(key, JSON.stringify(dataWithUserId));
    console.log('💾 예약 정보 저장 완료 (매니저 선택 포함):', dataWithUserId);

    // TODO: 백엔드 구현 후 활성화 - 서버 동기화 (로그인 상태일 때만)
    // if (userId) {
    //   try {
    //     await ReservationSyncAPI.saveToServer(dataWithUserId, userId);
    //     console.log('✅ 서버에 예약 정보 동기화 완료');
    //   } catch (error) {
    //     console.warn('⚠️ 서버 동기화 실패, 로컬만 저장됨:', error);
    //   }
    // }
  }

  /**
   * 현재 사용자의 예약 정보를 불러옵니다 (로컬 저장소만 사용)
   */
  static async getPendingReservation(): Promise<any | null> {
    if (typeof window === 'undefined') return null;
    
    const userId = this.getCurrentUserId();
    const key = this.getStorageKey(userId);
    
    // 로컬 데이터 로드
    try {
      const localStr = localStorage.getItem(key);
      if (localStr) {
        const localData = JSON.parse(localStr);
        
        // 데이터의 사용자 ID와 현재 사용자 ID가 일치하는지 확인
        if (localData.customerId !== userId) {
          localStorage.removeItem(key);
          return null;
        }
        
        console.log('✅ 로컬에서 예약 정보 로드 성공:', localData);
        return localData;
      }
    } catch (error) {
      console.error('로컬 데이터 파싱 오류:', error);
      localStorage.removeItem(key);
      return null;
    }

    // TODO: 백엔드 구현 후 활성화 - 서버 데이터 로드 및 동기화
    // let serverData: any = null;
    // 
    // // 서버 데이터 로드 (로그인 상태일 때만)
    // if (userId) {
    //   try {
    //     serverData = await ReservationSyncAPI.loadFromServer(userId);
    //     console.log('📥 서버에서 예약 정보 로드:', serverData ? '성공' : '없음');
    //   } catch (error) {
    //     console.warn('⚠️ 서버 데이터 로드 실패:', error);
    //   }
    // }

    // // 서버와 로컬 데이터 비교 및 동기화
    // if (serverData && localData) {
    //   const serverTime = new Date(serverData.savedAt || 0).getTime();
    //   const localTime = new Date(localData.savedAt || 0).getTime();
    //   
    //   // 서버 데이터가 더 최신이면 로컬에 저장
    //   if (serverTime > localTime) {
    //     localStorage.setItem(key, JSON.stringify(serverData));
    //     console.log('🔄 서버 데이터로 로컬 업데이트');
    //     return serverData;
    //   }
    //   // 로컬 데이터가 더 최신이면 서버에 저장
    //   else if (localTime > serverTime && typeof userId === 'number') {
    //     await ReservationSyncAPI.saveToServer(localData, userId);
    //     console.log('🔄 로컬 데이터로 서버 업데이트');
    //     return localData;
    //   }
    //   
    //   return localData;
    // }
    // 
    // // 서버에만 있으면 로컬에 저장
    // if (serverData && !localData) {
    //   localStorage.setItem(key, JSON.stringify(serverData));
    //   console.log('📥 서버 데이터를 로컬에 저장');
    //   return serverData;
    // }
    // 
    // // 로컬에만 있으면 서버에 저장
    // if (!serverData && localData && typeof userId === 'number') {
    //   await ReservationSyncAPI.saveToServer(localData, userId);
    //   console.log('📤 로컬 데이터를 서버에 저장');
    //   return localData;
    // }
    
    console.log('📋 저장된 예약 정보 없음');
    return null;
  }

  /**
   * 현재 사용자의 예약 정보를 삭제합니다 (로컬에서만, 서버 삭제는 추후 구현)
   */
  static async clearPendingReservation(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    const userId = this.getCurrentUserId();
    const key = this.getStorageKey(userId);
    
    // 로컬 삭제
    localStorage.removeItem(key);

    // TODO: 백엔드 구현 후 활성화 - 서버 삭제 (로그인 상태일 때만)
    // if (userId) {
    //   try {
    //     await ReservationSyncAPI.deleteFromServer(userId);
    //     console.log('✅ 서버에서 예약 정보 삭제 완료');
    //   } catch (error) {
    //     console.warn('⚠️ 서버 삭제 실패:', error);
    //   }
    // }
  }

  /**
   * 특정 사용자의 예약 정보를 삭제합니다 (로그아웃 시 사용)
   */
  static async clearUserReservation(userId: number | null): Promise<void> {
    if (typeof window === 'undefined') return;
    
    const key = this.getStorageKey(userId);
    localStorage.removeItem(key);
    
    // 익명 사용자 데이터도 정리
    localStorage.removeItem(this.getStorageKey(null));

    // TODO: 백엔드 구현 후 활성화 - 서버에서도 삭제
    // if (typeof userId === 'number') {
    //   try {
    //     await ReservationSyncAPI.deleteFromServer(userId);
    //   } catch (error) {
    //     console.warn('⚠️ 로그아웃 시 서버 데이터 삭제 실패:', error);
    //   }
    // }
  }

  /**
   * 현재 예약의 매니저 선택 정보를 업데이트합니다
   */
  static async updateSelectedManagers(managers: any[]): Promise<void> {
    if (typeof window === 'undefined') return;
    
    const userId = this.getCurrentUserId();
    const key = this.getStorageKey(userId);
    
    try {
      const existingStr = localStorage.getItem(key);
      if (existingStr) {
        const existingData = JSON.parse(existingStr);
        
        // 사용자 ID 확인
        if (existingData.customerId !== userId) {
          console.warn('사용자 ID 불일치로 매니저 선택 업데이트 중단');
          return;
        }
        
        // 매니저 선택 정보 업데이트
        const updatedData = {
          ...existingData,
          selectedManagers: managers,
          savedAt: new Date().toISOString(),
        };
        
        localStorage.setItem(key, JSON.stringify(updatedData));
        console.log('👥 매니저 선택 정보 업데이트:', managers);
      }
    } catch (error) {
      console.error('매니저 선택 업데이트 실패:', error);
    }
  }

  /**
   * 현재 예약의 매니저 선택 정보를 가져옵니다
   */
  static async getSelectedManagers(): Promise<string[]> {
    if (typeof window === 'undefined') return [];
    
    const reservationData = await this.getPendingReservation();
    return reservationData?.selectedManagers || [];
  }

  /**
   * 모든 예약 관련 localStorage 데이터를 정리합니다
   */
  static clearAllReservationData(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('pendingReservation-')) {
        localStorage.removeItem(key);
      }
    });
  }
}

/**
 * React Hook으로 예약 스토리지를 사용할 수 있게 하는 유틸리티
 */
export const useReservationStorage = () => {
  return {
    savePendingReservation: ReservationStorage.savePendingReservation,
    getPendingReservation: ReservationStorage.getPendingReservation,
    clearPendingReservation: ReservationStorage.clearPendingReservation,
  };
}; 