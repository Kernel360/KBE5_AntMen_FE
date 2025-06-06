export interface Post {
  id: number;
  title: string;
  author: string;
  commentCount: number;
  createdAt: string;
  isPinned?: boolean;  // FAQ로 지정된 글인지 여부
  boardType: 'customerNotice' | 'managerNotice' | 'customerInquiry' | 'managerInquiry';
  userId?: string;     // 작성자의 고유 ID (본인 글 필터링용)
  order?: number;      // 고정 게시글 순서 (관리자가 지정)
  status?: '답변대기' | '답변완료';  // 문의글 상태
}

// 사용자용 공지사항 (1000번대)
const USER_NOTICES: Post[] = [
  {
    id: 1001,
    title: '[필독] 매칭 서비스 이용 가이드라인 안내',
    author: '고객지원팀',
    commentCount: 12,
    createdAt: '2024-03-10T09:00:00.000Z',
    isPinned: true,
    boardType: 'customerNotice',
    order: 1,
  },
  {
    id: 1002,
    title: '[공지] 2024년 4월 정기 시스템 점검 안내',
    author: '시스템관리자',
    commentCount: 5,
    createdAt: '2024-03-15T14:30:00.000Z',
    isPinned: true,
    boardType: 'customerNotice',
    order: 2,
  },
  {
    id: 1003,
    title: '[안내] 앱 업데이트 버전 2.5.0 출시',
    author: '서비스운영팀',
    commentCount: 8,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    boardType: 'customerNotice',
  },
];

// 사용자용 서비스 문의 (2000번대)
const USER_INQUIRIES: Post[] = [
  {
    id: 2001,
    title: '매칭 취소는 어떻게 하나요?',
    author: '익명의 사용자',
    commentCount: 3,
    createdAt: '2024-03-10T10:15:00.000Z',
    isPinned: true,
    userId: 'user789',
    boardType: 'customerInquiry',
    order: 1,
  },
  {
    id: 2002,
    title: '결제 취소 및 환불은 언제 처리되나요?',
    author: '익명의 사용자',
    commentCount: 5,
    createdAt: '2024-03-12T16:45:00.000Z',
    isPinned: true,
    userId: 'user456',
    boardType: 'customerInquiry',
    order: 2,
  },
  {
    id: 2003,
    title: '매칭 일정 변경 문의드립니다',
    author: '김서비스',
    commentCount: 2,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30분 전
    userId: 'user123',
    status: '답변대기',
    boardType: 'customerInquiry',
  },
  {
    id: 2004,
    title: '결제 오류 발생했어요',
    author: '김서비스',
    commentCount: 3,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    userId: 'user123',
    status: '답변완료',
    boardType: 'customerInquiry',
  },
];

// 매니저용 공지사항 (3000번대)
const MANAGER_NOTICES: Post[] = [
  {
    id: 3001,
    title: '[필독] 매니저 서비스 수수료 정책 변경 안내',
    author: '매니저운영팀',
    commentCount: 25,
    createdAt: '2024-03-12T11:20:00.000Z',
    isPinned: true,
    boardType: 'managerNotice',
    order: 1,
  },
  {
    id: 3002,
    title: '[공지] 매니저 등급 평가 기준 개편 안내',
    author: '평가관리팀',
    commentCount: 18,
    createdAt: '2024-03-15T13:40:00.000Z',
    isPinned: true,
    boardType: 'managerNotice',
    order: 2,
  },
  {
    id: 3003,
    title: '[안내] 매니저 전용 앱 업데이트 필수',
    author: '기술지원팀',
    commentCount: 7,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    boardType: 'managerNotice',
  },
];

// 매니저용 업무 문의 (4000번대)
const MANAGER_INQUIRIES: Post[] = [
  {
    id: 4001,
    title: '매니저 등급은 어떻게 산정되나요?',
    author: '익명의 매니저',
    commentCount: 8,
    createdAt: '2024-03-10T08:30:00.000Z',
    isPinned: true,
    userId: 'manager789',
    boardType: 'managerInquiry',
    order: 1,
  },
  {
    id: 4002,
    title: '서비스 수수료 정산 기준이 궁금합니다',
    author: '익명의 매니저',
    commentCount: 12,
    createdAt: '2024-03-12T15:20:00.000Z',
    isPinned: true,
    userId: 'manager101',
    boardType: 'managerInquiry',
    order: 2,
  },
  {
    id: 4003,
    title: '급여 명세서 관련 문의',
    author: '매니저김',
    commentCount: 1,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1시간 전
    userId: 'manager456',
    status: '답변대기',
    boardType: 'managerInquiry',
  },
  {
    id: 4004,
    title: '스케줄 변경 요청드립니다',
    author: '매니저김',
    commentCount: 4,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3시간 전
    userId: 'manager456',
    status: '답변완료',
    boardType: 'managerInquiry',
  },
];

// 현재 로그인한 사용자의 ID (임시)
const CURRENT_USER_ID = 'user123';
const CURRENT_MANAGER_ID = 'manager456';

export const getPosts = (
  userRole: 'customer' | 'manager',
  type: '공지사항' | '서비스 문의' | '업무 문의'
): Post[] => {
  if (userRole === 'customer') {
    if (type === '공지사항') {
      return USER_NOTICES;
    } else {
      // 서비스 문의: FAQ(isPinned) + 내 문의글(userId === CURRENT_USER_ID)
      return USER_INQUIRIES.filter(post => post.isPinned || post.userId === CURRENT_USER_ID);
    }
  } else {
    if (type === '공지사항') {
      return MANAGER_NOTICES;
    } else {
      // 업무 문의: FAQ(isPinned) + 내 문의글(userId === CURRENT_MANAGER_ID)
      return MANAGER_INQUIRIES.filter(post => post.isPinned || post.userId === CURRENT_MANAGER_ID);
    }
  }
};

// 한국어 시간 표현을 Date 객체로 변환
const convertKoreanTimeToDate = (koreanTime: string): Date => {
  // YYYY.MM.DD 형식인 경우 직접 파싱
  if (koreanTime.match(/^\d{4}\.\d{2}\.\d{2}$/)) {
    const [year, month, day] = koreanTime.split('.').map(Number);
    return new Date(year, month - 1, day);
  }

  const now = new Date();
  if (koreanTime.includes('분 전')) {
    const minutes = parseInt(koreanTime);
    return new Date(now.getTime() - minutes * 60 * 1000);
  } else if (koreanTime.includes('시간 전')) {
    const hours = parseInt(koreanTime);
    return new Date(now.getTime() - hours * 60 * 60 * 1000);
  } else if (koreanTime.includes('일 전')) {
    const days = parseInt(koreanTime);
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  }
  return now;
};

// 날짜를 표시 형식으로 변환
const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 7) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  } else if (diffDays > 0) {
    return `${diffDays}일 전`;
  } else {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours}시간 전`;
    }
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    if (diffMinutes > 0) {
      return `${diffMinutes}분 전`;
    }
    return '방금 전';
  }
};

// 정렬 함수
export const sortPosts = (
  posts: Post[],
  type: '공지사항' | '서비스 문의' | '업무 문의',
  sortOption: string
): Post[] => {
  // 고정 게시글은 order 기준으로 정렬
  if (posts.some(post => post.isPinned)) {
    return [...posts].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  // 일반 게시글 정렬
  return [...posts].sort((a, b) => {
    // 공통 정렬 옵션
    if (sortOption === 'latest' || sortOption === 'oldest') {
      const timeA = new Date(convertKoreanTimeToDate(a.createdAt)).getTime();
      const timeB = new Date(convertKoreanTimeToDate(b.createdAt)).getTime();
      return sortOption === 'latest' ? timeB - timeA : timeA - timeB;
    }

    // 문의게시판 전용 정렬 옵션
    if (type !== '공지사항') {
      switch (sortOption) {
        case 'mostComments':
          return b.commentCount - a.commentCount;
        case 'waiting':
          return (a.status === '답변대기' ? 0 : 1) - (b.status === '답변대기' ? 0 : 1);
        case 'completed':
          return (a.status === '답변완료' ? 0 : 1) - (b.status === '답변완료' ? 0 : 1);
        default:
          return 0;
      }
    }

    return 0;
  });
}; 