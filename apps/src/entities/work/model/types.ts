export type WorkStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type WorkType = 'today' | 'scheduled';

export interface Work {
  id: string;
  
  // 카드 표시용 핵심 정보
  serviceName: string; // '가사 청소', '사무실 청소' 등
  reservationDate: string;
  reservationTime: string;
  duration: number; // 소요 시간 (시간 단위)
  location: {
    district: string; // '서울시 강남구'
  };
  customerName: string; // 고객명
  status: WorkStatus;
  
  // 상세페이지용 추가 정보 (선택사항)
  reservationId?: string;
  address?: string;
  customerPhone?: string;
  amount?: number; // 급여
  memo?: string;
  requirements?: string[];
  createdAt?: string;
  completedAt?: string;
}

export type WorkFilterTab = 'today' | 'scheduled'; 