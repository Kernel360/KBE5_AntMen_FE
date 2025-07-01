import { Metadata } from 'next';
import { BoardDetail } from '@/widgets/post/components/BoardDetail';
import { boardService } from '@/widgets/post/api/boardService';

interface Props {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: '[매니저] 게시글 상세 | AntMen',
  description: '매니저 페이지에서 게시글의 상세 내용을 확인하실 수 있습니다.',
};

export default async function ManagerBoardDetailPage({ params }: Props) {
  console.log('📄 [매니저] 게시글 상세 페이지 로드:', { id: params.id });
  
  // 임시로 쿠키 없이 요청
  const post = await boardService.getBoardDetail(params.id);
  return <BoardDetail initialData={post} boardType="게시판" />;
} 