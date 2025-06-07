import { BoardDetail } from '@/widgets/post/components/BoardDetail';
import { boardService } from '@/widgets/post/api/boardService';

interface Props {
  params: {
    id: string;
  };
}

export default async function BoardDetailPage({ params }: Props) {
  const post = await boardService.getBoardDetail(params.id);
  return <BoardDetail initialData={post} boardType={post.category} />;
} 