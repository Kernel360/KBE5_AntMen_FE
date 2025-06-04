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
}

export const MANAGER_LIST: Manager[] = [
  {
    id: '1',
    name: '김철수',
    gender: '남성',
    age: 28,
    experience: 3,
    rating: 4.8,
    description: '꼼꼼하고 친절한 서비스로 고객님의 만족을 최우선으로 생각합니다.',
    profileImage: '김',
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
  },
];

export const MANAGER_NAMES = {
  '1': '김철수',
  '2': '이영희',
  '3': '박지민',
  '4': '최민수',
} as const; 