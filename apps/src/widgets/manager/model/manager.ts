export const MAX_MANAGER_COUNT = 3;

export interface Manager {
  id: string;
  name: string;
  gender: string;
  age: number;
  experience: number;
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
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    content: string;
    date: string;
  }>;
}

export const MANAGER_LIST: Manager[] = [
  {
    id: '1',
    name: '김민지',
    gender: '여성',
    age: 28,
    experience: 5,
    rating: 4.8,
    description: '꼼꼼하고 친절한 서비스로 고객님의 만족을 최우선으로 생각합니다.',
    profileImage: '김',
    reviewCount: 127,
    introduction: '안녕하세요! 5년 경력의 김민지 매니저입니다. 고객한 분 한 분께 최선을 다하는 서비스를 제공하겠습니다. 세심한 배려와 전문적인 지식으로 편안하고 만족스러운 시간을 보내실 수 있도록 도와드리겠습니다.',
    characteristics: [
      { id: '1', label: '친절해요', type: 'kind' },
      { id: '2', label: '시간 엄수', type: 'punctual' },
      { id: '3', label: '꼼꼼해요', type: 'thorough' }
    ],
    reviews: [
      {
        id: '1',
        userName: '김**',
        rating: 5,
        content: '정말 친절하시고 꼼꼼하게 해주셨어요. 다음에도 김민지 매니저님께 부탁드리고 싶습니다!',
        date: '2024.01.15'
      }
    ]
  },
  {
    id: '2',
    name: '이영희',
    gender: '여성',
    age: 32,
    experience: 5,
    rating: 4.9,
    description: '5년간의 경험을 바탕으로 최고의 청소 서비스를 제공해드립니다.',
    profileImage: '이',
    reviewCount: 98,
    introduction: '안녕하세요! 이영희 매니저입니다. 5년간의 경험을 바탕으로 최고의 청소 서비스를 제공해드립니다. 고객님의 소중한 공간을 깨끗하게 관리해드리겠습니다.',
    characteristics: [
      { id: '1', label: '친절해요', type: 'kind' },
      { id: '2', label: '시간 엄수', type: 'punctual' },
      { id: '3', label: '꼼꼼해요', type: 'thorough' }
    ],
    reviews: [
      {
        id: '1',
        userName: '이**',
        rating: 5,
        content: '항상 깔끔하게 청소해주셔서 감사합니다. 다음에도 이용하고 싶어요!',
        date: '2024.01.10'
      }
    ]
  },
  {
    id: '3',
    name: '박지민',
    gender: '여성',
    age: 25,
    experience: 2,
    rating: 4.7,
    description: '성실하고 열정적인 서비스로 깨끗한 공간을 만들어드립니다.',
    profileImage: '박',
    reviewCount: 45,
    introduction: '안녕하세요! 박지민 매니저입니다. 성실하고 열정적인 서비스로 깨끗한 공간을 만들어드립니다. 항상 최선을 다하는 모습 보여드리겠습니다.',
    characteristics: [
      { id: '1', label: '친절해요', type: 'kind' },
      { id: '2', label: '시간 엄수', type: 'punctual' },
      { id: '3', label: '꼼꼼해요', type: 'thorough' }
    ],
    reviews: [
      {
        id: '1',
        userName: '박**',
        rating: 5,
        content: '친절하고 꼼꼼하게 청소해주셨어요. 감사합니다!',
        date: '2024.01.05'
      }
    ]
  },
  {
    id: '4',
    name: '최민수',
    gender: '남성',
    age: 35,
    experience: 7,
    rating: 5.0,
    description: '오랜 경력으로 쌓은 노하우로 완벽한 청소를 약속드립니다.',
    profileImage: '최',
    reviewCount: 156,
    introduction: '안녕하세요! 최민수 매니저입니다. 7년간의 노하우로 완벽한 청소를 약속드립니다. 고객님의 만족을 위해 최선을 다하겠습니다.',
    characteristics: [
      { id: '1', label: '친절해요', type: 'kind' },
      { id: '2', label: '시간 엄수', type: 'punctual' },
      { id: '3', label: '꼼꼼해요', type: 'thorough' }
    ],
    reviews: [
      {
        id: '1',
        userName: '최**',
        rating: 5,
        content: '매번 깔끔하게 청소해주셔서 감사합니다. 최고의 매니저님이에요!',
        date: '2024.01.01'
      }
    ]
  }
];

export const MANAGER_NAMES = {
  '1': '김민지',
  '2': '이영희',
  '3': '박지민',
  '4': '최민수',
} as const; 