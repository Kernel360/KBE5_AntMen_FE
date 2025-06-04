export const MAX_MANAGER_COUNT = 3;

export const MANAGER_LIST = [
  {
    id: '1',
    name: '김민지',
    profileImage: '김',
    rating: 4.8,
    gender: '여성',
    age: 28,
    experience: 5,
    description: '고객 만족도가 높으며 세심한 서비스를 제공합니다. 친근하고 전문적인 매니저입니다.',
  },
  {
    id: '2',
    name: '박서준',
    profileImage: '박',
    rating: 4.9,
    gender: '남성',
    age: 26,
    experience: 3,
    description: '젊고 활기찬 서비스를 제공합니다. 고객과의 소통을 중시하며 친근한 매니저입니다.',
  },
  {
    id: '3',
    name: '이수현',
    profileImage: '이',
    rating: 4.7,
    gender: '여성',
    age: 32,
    experience: 7,
    description: '7년 경력의 베테랑 매니저로 다양한 상황에 대한 경험이 풍부합니다.',
  },
] as const;

export const MANAGER_NAMES = {
  '1': '김민지',
  '2': '박서준',
  '3': '이수현',
} as const; 