import { mockBoards } from '../mocks/boardDetail';

// 게시글 작성 요청 타입
export interface BoardRequestDto {
  boardTitle: string;
  boardContent: string;
  boardIsPinned: boolean;
  boardReservatedAt: string | null;
}

// 게시글 기본 정보
export interface BoardPost {
  boardId: number;
  userName: string;
  boardTitle: string;
  createdAt: string;
  modifiedAt: string;
  commentNum: number;
}

// 페이징된 게시글 응답
export interface PagedBoardResponse {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: BoardPost[];
  number: number;
  numberOfElements: number;
  empty: boolean;
}

// 전체 게시글 목록 응답
export interface BoardListResponse {
  pinnedPosts: BoardPost[];
  posts: PagedBoardResponse;
}

// 댓글 타입 (무한 중첩 구조)
export interface Comment {
  commentId: number;
  userName: string;
  commentContent: string;
  createdAt: string;
  modifiedAt: string;
  subComments: Comment[]; // 자기 참조로 무한 중첩 가능
}

// 게시글 상세 응답
export interface BoardDetailResponse {
  boardId: number;
  userName: string;
  boardTitle: string;
  boardContent: string;
  createdAt: string;
  modifiedAt: string;
  comments: Comment[] | null;
}

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
  async getBoardDetail(id: string, serverCookies?: string): Promise<BoardDetailResponse> {
    console.log('🚀 게시글 상세 조회 시작:', { id });
    
    // 임시로 인증 없이 요청 (게시글 읽기는 공개 API일 가능성 높음)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const url = `https://api.antmen.site:9090/api/v1/board/${id}`;
    console.log('📤 게시글 상세 요청 (인증 없음):', {
      url,
      boardId: id,
      isServer: typeof window === 'undefined'
    });

    try {
      const fetchOptions: RequestInit = { 
        headers,
      };

      // 클라이언트 환경에서만 credentials 설정
      if (typeof window !== 'undefined') {
        fetchOptions.credentials = 'include';
      }

      console.log('🚀 API 요청 시작...');
      const response = await fetch(url, fetchOptions);

      console.log('📥 응답 받음:');
      console.log('- 상태 코드:', response.status);
      console.log('- 상태 텍스트:', response.statusText);
      console.log('- 성공 여부:', response.ok);
      console.log('- 리다이렉트 여부:', response.redirected);
      console.log('- 최종 URL:', response.url);
      console.log('- 응답 헤더:');
      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });

      if (!response.ok) {
        let errorMessage = `게시글 상세 조회 실패: ${response.status}`;
        try {
          const errorBody = await response.text();
          console.error('❌ 에러 응답 내용:', errorBody);
          errorMessage += ` - ${errorBody}`;
        } catch (e) {
          console.error('❌ 에러 응답 파싱 실패:', e);
        }
        throw new Error(errorMessage);
      }

      const data: BoardDetailResponse = await response.json();
      console.log('📥 게시글 상세 응답:', data);
      return data;
      
    } catch (error) {
      console.error('❌ 게시글 상세 조회 중 오류:', error);
      throw error;
    }
  }



  // 댓글 작성
  async createComment(boardId: string, content: string): Promise<void> {
    // TODO: 실제 API 연동 시 여기만 수정하면 됨
    console.log('댓글 작성:', { boardId, content });
    await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
  }

  // 게시글 목록 조회 (정렬 포함)
  async getBoardList(
    boardType: string,
    userRole: 'customer' | 'manager', 
    sortBy?: string, 
    searchName?: string,
    page: number = 0, 
    size: number = 5
  ): Promise<BoardListResponse> {
    const authToken = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = authToken;
    }

    // URL 파라미터 구성
    const params = new URLSearchParams();
    if (sortBy) params.append('sortBy', sortBy);
    if (searchName) params.append('name', searchName);
    params.append('page', page.toString());
    params.append('size', size.toString());

    // 백엔드 boardType으로 변환
    const backendBoardType = this.getBoardTypeParam(boardType, userRole);
    const url = `https://api.antmen.site:9090/api/v1/board/${backendBoardType}/list?${params.toString()}`;
    console.log('📤 게시글 목록 요청:', { 
      frontendBoardType: boardType, 
      backendBoardType, 
      userRole,
      sortBy, 
      searchName, 
      page, 
      size, 
      url 
    });

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`게시글 목록 조회 실패: ${response.status}`);
    }

    const data: BoardListResponse = await response.json();
    console.log('📥 게시글 목록 응답:', data);
    return data;
  }

  // 프론트엔드 게시판 타입을 백엔드 boardType으로 변환
  private getBoardTypeParam(boardType: string, userRole: 'customer' | 'manager'): string {
    if (boardType === '공지사항') {
      return userRole === 'customer' ? 'customer-notice' : 'manager-notice';
    } else if (boardType === '서비스 문의') {
      return 'customer';
    } else if (boardType === '업무 문의') {
      return 'manager';
    }
    
    // 기본값
    return userRole === 'customer' ? 'customer-notice' : 'manager-notice';
  }

  // 쿠키에서 auth-token 가져오기 (클라이언트 환경에서만)
  private getAuthToken(): string | null {
    try {
      // 클라이언트 환경에서만 동작
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'auth-token') {
            return decodeURIComponent(value);
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ 인증 토큰 조회 중 오류:', error);
      return null;
    }
  }

  // 고객 게시글 작성
  async createCustomerBoard(title: string, content: string): Promise<void> {
    const requestData: BoardRequestDto = {
      boardTitle: title,
      boardContent: content,
      boardIsPinned: false,
      boardReservatedAt: null
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 쿠키에서 토큰 가져오기
    const authToken = this.getAuthToken();
    if (authToken) {
      headers['Authorization'] = authToken;
      console.log('🔑 고객 API 요청 토큰:', authToken);
    } else {
      console.warn('⚠️ 쿠키에서 auth-token을 찾을 수 없습니다!');
    }

    console.log('📤 고객 게시글 요청:', { headers, requestData });

    const response = await fetch('https://api.antmen.site:9090/api/v1/board/customer', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });

    console.log('📥 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 응답 에러:', errorText);
      throw new Error(`게시글 작성 실패: ${response.status}`);
    }
  }

  // 매니저 게시글 작성
  async createManagerBoard(title: string, content: string): Promise<void> {
    const requestData: BoardRequestDto = {
      boardTitle: title,
      boardContent: content,
      boardIsPinned: false,
      boardReservatedAt: null
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 쿠키에서 토큰 가져오기
    const authToken = this.getAuthToken();
    if (authToken) {
      headers['Authorization'] = authToken;
      console.log('🔑 매니저 API 요청 토큰:', authToken);
    } else {
      console.warn('⚠️ 쿠키에서 auth-token을 찾을 수 없습니다!');
    }

    console.log('📤 매니저 게시글 요청:', { headers, requestData });

    const response = await fetch('https://api.antmen.site:9090/api/v1/board/manager', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });

    console.log('📥 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 응답 에러:', errorText);
      throw new Error(`게시글 작성 실패: ${response.status}`);
    }
  }
}

export const boardService = new BoardService(); 