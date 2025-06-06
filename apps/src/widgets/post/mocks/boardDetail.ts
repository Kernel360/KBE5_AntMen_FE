// 게시글 타입 정의
export interface BoardDetail {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    profileImage: string;
  };
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isAnswered: boolean;
  category: string;
  isPinned: boolean;
  order?: number;      // 고정 게시글 순서 (관리자가 지정)
  status?: '답변대기' | '답변완료';  // 문의글 상태
  comments: {
    id: number;
    content: string;
    author: {
      id: number;
      name: string;
      profileImage: string;
    };
    createdAt: string;
    updatedAt: string;
    isAnswer: boolean;
  }[];
}

// 목업 데이터
export const mockBoards: Record<number, BoardDetail> = {
  // 사용자용 공지사항 (1000번대)
  1001: {
    id: 1001,
    title: '[필독] 매칭 서비스 이용 가이드라인 안내',
    content: '안녕하세요, 고객지원팀입니다.\n\n매칭 서비스 이용에 대한 가이드라인을 안내드립니다.\n\n1. 매칭 신청 전 확인사항\n - 서비스 지역 확인\n - 원하는 시간대 확인\n - 특이사항 기재\n\n2. 매칭 후 주의사항\n - 일정 변경은 24시간 전까지\n - 갑작스러운 취소 시 패널티 부과\n\n3. 서비스 이용 팁\n - 미리 원하는 서비스 내용 기재\n - 피드백은 상세히 작성',
    author: {
      id: 1,
      name: '고객지원팀',
      profileImage: '/images/support-team.png'
    },
    createdAt: '2024-03-10T09:00:00.000Z',
    updatedAt: '2024-03-10T09:00:00.000Z',
    viewCount: 1234,
    isAnswered: true,
    category: '공지사항',
    isPinned: true,
    comments: [
      {
        id: 1,
        content: '매칭 서비스 이용 가이드라인 잘 보았습니다. 특히 취소 관련 패널티 부분이 도움이 되었네요.',
        author: {
          id: 101,
          name: '김철수',
          profileImage: '/images/default-profile.png'
        },
        createdAt: '2024-03-10T10:00:00.000Z',
        updatedAt: '2024-03-10T10:00:00.000Z',
        isAnswer: false
      },
      {
        id: 2,
        content: '서비스 지역 확인하는 게 중요하다는 걸 이제 알았네요. 이전에 실수로 다른 지역으로 신청했었거든요.',
        author: {
          id: 102,
          name: '이영희',
          profileImage: '/images/default-profile.png'
        },
        createdAt: '2024-03-10T10:30:00.000Z',
        updatedAt: '2024-03-10T10:30:00.000Z',
        isAnswer: false
      },
      {
        id: 3,
        content: '피드백 작성하는 팁도 좋네요. 앞으로는 더 자세히 작성해야겠어요.',
        author: {
          id: 103,
          name: '박지민',
          profileImage: '/images/default-profile.png'
        },
        createdAt: '2024-03-10T11:00:00.000Z',
        updatedAt: '2024-03-10T11:00:00.000Z',
        isAnswer: false
      }
    ]
  },

  1002: {
    id: 1002,
    title: '[공지] 2024년 4월 정기 시스템 점검 안내',
    content: '안녕하세요, 시스템관리자입니다.\n\n4월 정기 시스템 점검 일정을 안내드립니다.\n\n일시: 2024년 4월 15일 새벽 2시 ~ 6시\n영향: 서비스 일시 중단\n\n더 나은 서비스를 위해 최선을 다하겠습니다.',
    author: {
      id: 2,
      name: '시스템관리자',
      profileImage: '/images/system-team.png'
    },
    createdAt: '2024-03-15T14:30:00.000Z',
    updatedAt: '2024-03-15T14:30:00.000Z',
    viewCount: 856,
    isAnswered: true,
    category: '공지사항',
    isPinned: true,
    comments: [
      {
        id: 4,
        content: '새벽 시간대라 다행이네요. 업무에 큰 영향은 없을 것 같습니다.',
        author: {
          id: 104,
          name: '정민수',
          profileImage: '/images/default-profile.png'
        },
        createdAt: '2024-03-15T15:00:00.000Z',
        updatedAt: '2024-03-15T15:00:00.000Z',
        isAnswer: false
      },
      {
        id: 5,
        content: '시스템 점검 후에는 더 안정적으로 운영되길 바랍니다.',
        author: {
          id: 105,
          name: '최유진',
          profileImage: '/images/default-profile.png'
        },
        createdAt: '2024-03-15T15:30:00.000Z',
        updatedAt: '2024-03-15T15:30:00.000Z',
        isAnswer: false
      }
    ]
  },

  1003: {
    id: 1003,
    title: '[안내] 앱 업데이트 버전 2.5.0 출시',
    content: '안녕하세요, 서비스운영팀입니다.\n\n앱 버전 2.5.0이 출시되었습니다.\n\n주요 업데이트 내용:\n1. UI/UX 개선\n2. 매칭 시스템 성능 향상\n3. 버그 수정\n\n원활한 서비스 이용을 위해 앱 업데이트를 진행해주세요.',
    author: {
      id: 4,
      name: '서비스운영팀',
      profileImage: '/images/service-team.png'
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 456,
    isAnswered: true,
    category: '공지사항',
    isPinned: false,
    comments: [
      {
        id: 6,
        content: 'UI가 훨씬 직관적으로 바뀌었네요. 사용하기 편해졌습니다.',
        author: {
          id: 106,
          name: '강동원',
          profileImage: '/images/default-profile.png'
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isAnswer: false
      },
      {
        id: 7,
        content: '매칭 시스템이 확실히 빨라진 것 같아요. 이전보다 훨씬 쾌적합니다.',
        author: {
          id: 107,
          name: '송혜교',
          profileImage: '/images/default-profile.png'
        },
        createdAt: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000).toISOString(),
        isAnswer: false
      }
    ]
  },

  // 사용자용 서비스 문의 (2000번대)
  2001: {
    id: 2001,
    title: '매칭 취소는 어떻게 하나요?',
    content: '매칭 취소 절차가 궁금합니다.\n당일 취소도 가능한가요?',
    author: {
      id: 101,
      name: '익명의 사용자',
      profileImage: '/images/default-profile.png'
    },
    createdAt: '2024-03-10T10:15:00.000Z',
    updatedAt: '2024-03-10T10:15:00.000Z',
    viewCount: 245,
    isAnswered: true,
    category: '서비스 문의',
    isPinned: true,
    comments: [
      {
        id: 8,
        content: '안녕하세요. 매칭 취소는 다음과 같이 진행됩니다:\n\n1. 24시간 이전 취소: 전액 환불\n2. 당일 취소: 위약금 발생\n\n자세한 내용은 이용약관을 참고해주세요.',
        author: {
          id: 1,
          name: '고객지원팀',
          profileImage: '/images/support-team.png'
        },
        createdAt: '2024-03-10T10:30:00.000Z',
        updatedAt: '2024-03-10T10:30:00.000Z',
        isAnswer: true
      },
      {
        id: 9,
        content: '답변 감사합니다. 취소 정책이 명확해서 좋네요.',
        author: {
          id: 108,
          name: '이병헌',
          profileImage: '/images/default-profile.png'
        },
        createdAt: '2024-03-10T11:00:00.000Z',
        updatedAt: '2024-03-10T11:00:00.000Z',
        isAnswer: false
      }
    ]
  },

  2003: {
    id: 2003,
    title: '매칭 일정 변경 문의드립니다',
    content: '다음 주 수요일 예약했는데, 금요일로 변경하고 싶습니다.\n가능할까요?',
    author: {
      id: 102,
      name: '김서비스',
      profileImage: '/images/default-profile.png'
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    viewCount: 12,
    isAnswered: false,
    category: '서비스 문의',
    isPinned: false,
    comments: Array(2).fill({
      id: 4,
      content: '네, 일정 변경 가능합니다. 고객님과 조율된 시간으로 변경해드리겠습니다.',
      author: {
        id: 1,
        name: '고객지원팀',
        profileImage: '/images/support-team.png'
      },
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      isAnswer: true
    })
  },

  2004: {
    id: 2004,
    title: '결제 오류 발생했어요',
    content: '결제 진행 중 오류가 발생했는데, 카드는 승인된 것 같아요.\n중복 결제가 아닌지 확인 부탁드립니다.',
    author: {
      id: 102,
      name: '김서비스',
      profileImage: '/images/default-profile.png'
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    viewCount: 8,
    isAnswered: true,
    category: '서비스 문의',
    isPinned: false,
    status: '답변완료',
    comments: Array(3).fill({
      id: 4,
      content: '안녕하세요. 결제 내역을 확인해보니 정상 처리된 건이 1건 있습니다.\n중복 결제는 발생하지 않았으니 안심하세요.',
      author: {
        id: 1,
        name: '고객지원팀',
        profileImage: '/images/support-team.png'
      },
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      isAnswer: true
    })
  },

  // 매니저용 공지사항 (3000번대)
  3001: {
    id: 3001,
    title: '[필독] 매니저 서비스 수수료 정책 변경 안내',
    content: '안녕하세요, 매니저운영팀입니다.\n\n2024년 4월부터 적용되는 새로운 수수료 정책을 안내드립니다.\n\n1. 기본 수수료: 20%\n2. 우수 매니저 할인: 최대 5%\n3. 장기 근속 할인: 최대 3%',
    author: {
      id: 3,
      name: '매니저운영팀',
      profileImage: '/images/manager-team.png'
    },
    createdAt: '2024-03-12T11:20:00.000Z',
    updatedAt: '2024-03-12T11:20:00.000Z',
    viewCount: 845,
    isAnswered: true,
    category: '공지사항',
    isPinned: true,
    comments: [
      {
        id: 10,
        content: '우수 매니저 할인율이 늘어나서 좋네요. 더 열심히 해야겠습니다.',
        author: {
          id: 201,
          name: '김매니저',
          profileImage: '/images/default-profile.png'
        },
        createdAt: '2024-03-12T12:00:00.000Z',
        updatedAt: '2024-03-12T12:00:00.000Z',
        isAnswer: false
      },
      {
        id: 11,
        content: '장기 근속 할인도 생겼네요. 꾸준히 일하는 매니저들에게 좋은 혜택인 것 같아요.',
        author: {
          id: 202,
          name: '박매니저',
          profileImage: '/images/default-profile.png'
        },
        createdAt: '2024-03-12T12:30:00.000Z',
        updatedAt: '2024-03-12T12:30:00.000Z',
        isAnswer: false
      },
      {
        id: 12,
        content: '수수료 정책이 전반적으로 합리적으로 개선된 것 같습니다.',
        author: {
          id: 203,
          name: '최매니저',
          profileImage: '/images/default-profile.png'
        },
        createdAt: '2024-03-12T13:00:00.000Z',
        updatedAt: '2024-03-12T13:00:00.000Z',
        isAnswer: false
      }
    ]
  },

  3002: {
    id: 3002,
    title: '[공지] 매니저 등급 평가 기준 개편 안내',
    content: '안녕하세요, 평가관리팀입니다.\n\n2024년 4월부터 적용되는 새로운 매니저 등급 평가 기준을 안내드립니다.\n\n1. 고객 만족도 반영 비중 확대\n2. 서비스 완료율 산정 방식 개선\n3. 클레임 처리 평가 기준 세분화',
    author: {
      id: 5,
      name: '평가관리팀',
      profileImage: '/images/evaluation-team.png'
    },
    createdAt: '2024-03-15T13:40:00.000Z',
    updatedAt: '2024-03-15T13:40:00.000Z',
    viewCount: 632,
    isAnswered: true,
    category: '공지사항',
    isPinned: true,
    order: 2,
    comments: [
      {
        id: 13,
        content: '고객 만족도 비중이 커진 만큼 더 신경 써서 서비스해야겠네요.',
        author: {
          id: 204,
          name: '이매니저',
          profileImage: '/images/default-profile.png'
        },
        createdAt: '2024-03-15T14:00:00.000Z',
        updatedAt: '2024-03-15T14:00:00.000Z',
        isAnswer: false
      },
      {
        id: 14,
        content: '클레임 처리 기준이 세분화되어서 좋습니다. 이제 더 공정한 평가가 가능할 것 같아요.',
        author: {
          id: 205,
          name: '정매니저',
          profileImage: '/images/default-profile.png'
        },
        createdAt: '2024-03-15T14:30:00.000Z',
        updatedAt: '2024-03-15T14:30:00.000Z',
        isAnswer: false
      }
    ]
  },

  3003: {
    id: 3003,
    title: '[안내] 매니저 전용 앱 업데이트 필수',
    content: '안녕하세요, 기술지원팀입니다.\n\n보안 강화를 위한 필수 업데이트가 있어 안내드립니다.\n\n적용 시점: 2024년 4월 1일\n업데이트 내용: 보안 프로토콜 강화, 성능 개선\n\n원활한 서비스 이용을 위해 반드시 업데이트를 진행해주세요.',
    author: {
      id: 6,
      name: '기술지원팀',
      profileImage: '/images/tech-team.png'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 245,
    isAnswered: true,
    category: '공지사항',
    isPinned: false,
    comments: [
      {
        id: 15,
        content: '보안이 강화된다니 다행이네요. 바로 업데이트하겠습니다.',
        author: {
          id: 206,
          name: '한매니저',
          profileImage: '/images/default-profile.png'
        },
        createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        isAnswer: false
      }
    ]
  },

  // 매니저용 업무 문의 (4000번대)
  4001: {
    id: 4001,
    title: '매니저 등급은 어떻게 산정되나요?',
    content: '등급 산정 기준이 궁금합니다.\n우수 매니저 달성을 위한 조건은 무엇인가요?',
    author: {
      id: 201,
      name: '익명의 매니저',
      profileImage: '/images/default-profile.png'
    },
    createdAt: '2024-03-10T08:30:00.000Z',
    updatedAt: '2024-03-10T08:30:00.000Z',
    viewCount: 634,
    isAnswered: true,
    category: '업무 문의',
    isPinned: true,
    comments: [
      {
        id: 16,
        content: '안녕하세요. 매니저 등급은 다음 기준으로 산정됩니다:\n\n1. 고객 만족도: 50%\n2. 서비스 완료율: 30%\n3. 클레임 처리: 20%\n\n자세한 내용은 공지사항을 참고해주세요.',
        author: {
          id: 3,
          name: '매니저운영팀',
          profileImage: '/images/manager-team.png'
        },
        createdAt: '2024-03-10T09:00:00.000Z',
        updatedAt: '2024-03-10T09:00:00.000Z',
        isAnswer: true
      }
    ]
  },

  4002: {
    id: 4002,
    title: '서비스 수수료 정산 기준이 궁금합니다',
    content: '수수료 정산 시 적용되는 할인율과 정산 주기가 궁금합니다.\n우수 매니저 할인은 언제부터 적용되나요?',
    author: {
      id: 203,
      name: '익명의 매니저',
      profileImage: '/images/default-profile.png'
    },
    createdAt: '2024-03-12T15:20:00.000Z',
    updatedAt: '2024-03-12T15:20:00.000Z',
    viewCount: 423,
    isAnswered: true,
    category: '업무 문의',
    isPinned: true,
    order: 2,
    comments: [
      {
        id: 17,
        content: '안녕하세요. 수수료 정산 관련 답변 드립니다:\n\n1. 정산 주기: 매월 1일~말일 기준, 익월 10일 지급\n2. 우수 매니저 할인: 등급 산정 후 익월 1일부터 적용\n3. 할인율: 기본 3%, 우수 매니저 추가 2%\n\n자세한 내용은 공지사항의 수수료 정책을 참고해주세요.',
        author: {
          id: 3,
          name: '매니저운영팀',
          profileImage: '/images/manager-team.png'
        },
        createdAt: '2024-03-12T16:00:00.000Z',
        updatedAt: '2024-03-12T16:00:00.000Z',
        isAnswer: true
      }
    ]
  },

  4003: {
    id: 4003,
    title: '급여 명세서 관련 문의',
    content: '이번 달 급여 명세서에 지급일이 주말인데 언제 입금되나요?',
    author: {
      id: 202,
      name: '매니저김',
      profileImage: '/images/default-profile.png'
    },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    viewCount: 15,
    isAnswered: false,
    category: '업무 문의',
    isPinned: false,
    comments: [
      {
        id: 18,
        content: '주말인 경우 익영업일에 입금됩니다.',
        author: {
          id: 3,
          name: '매니저운영팀',
          profileImage: '/images/manager-team.png'
        },
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isAnswer: true
      }
    ]
  },

  4004: {
    id: 4004,
    title: '스케줄 변경 요청드립니다',
    content: '다음 주 화요일 오후 스케줄을 목요일로 변경하고 싶습니다.\n고객님과 조율 완료했습니다.',
    author: {
      id: 202,
      name: '매니저김',
      profileImage: '/images/default-profile.png'
    },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    viewCount: 12,
    isAnswered: true,
    category: '업무 문의',
    isPinned: false,
    status: '답변완료',
    comments: [
      {
        id: 19,
        content: '스케줄 변경 승인되었습니다. 변경된 일정으로 시스템에 반영해두었으니 확인해주세요.',
        author: {
          id: 3,
          name: '매니저운영팀',
          profileImage: '/images/manager-team.png'
        },
        createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        isAnswer: true
      }
    ]
  }
}; 