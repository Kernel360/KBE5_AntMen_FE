import { mockBoards } from '../mocks/boardDetail';

// 나중에 실제 API 연동 시 사용할 타입들
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
  status?: '답변대기' | '답변완료';
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

class BoardService {
  // 게시글 상세 조회
  async getBoardDetail(id: string): Promise<BoardDetail> {
    // TODO: 실제 API 연동 시 여기만 수정하면 됨
    const board = mockBoards[Number(id)];
    if (!board) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    return board;
  }

  // 댓글 작성
  async createComment(boardId: string, content: string): Promise<void> {
    // TODO: 실제 API 연동 시 여기만 수정하면 됨
    console.log('댓글 작성:', { boardId, content });
    await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
  }
}

export const boardService = new BoardService(); 