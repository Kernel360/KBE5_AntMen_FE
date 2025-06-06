export type UserBoardType = '공지사항' | '서비스 문의';
export type ManagerBoardType = '공지사항' | '업무 문의';
export type BoardType = UserBoardType | ManagerBoardType;
export type UserRole = 'user' | 'manager';

// 공지사항 정렬 옵션
export type NoticeSortOption = 'latest' | 'oldest';

// 문의게시판 정렬 옵션
export type InquirySortOption = 'latest' | 'oldest' | 'mostComments' | 'waiting' | 'completed';

// 게시판 타입에 따른 정렬 옵션
export type SortOption = NoticeSortOption | InquirySortOption;

// 고정 게시글 순서 타입
export interface PinnedPostOrder {
  postId: number;
  order: number;
} 