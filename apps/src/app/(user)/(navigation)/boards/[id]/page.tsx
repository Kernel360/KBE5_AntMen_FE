import { Metadata } from 'next';
import { BoardDetail } from '@/widgets/post/components/BoardDetail';
import { boardService } from '@/widgets/post/api/boardService';

interface Props {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: '게시글 상세 | AntMen',
  description: '게시글의 상세 내용을 확인하실 수 있습니다.',
};

export default async function BoardDetailPage({ params }: Props) {
  console.log('📄 게시글 상세 페이지 로드:', { id: params.id });
  // 임시로 쿠키 없이 요청
  const post = await boardService.getBoardDetail(params.id);
  return (
    // 디버그 색상 박스 제거, 게시글 상세만 렌더링
    <BoardDetail initialData={post} boardType="게시판" />
  );
} 