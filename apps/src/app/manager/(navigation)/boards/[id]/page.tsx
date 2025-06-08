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
  const post = await boardService.getBoardDetail(params.id);
  return <BoardDetail initialData={post} boardType={post.category} />;
} 