import { PostCard } from '@/entities/post/ui/PostCard';

const MOCK_POSTS = [
  {
    id: 1,
    title: '공지사항입니다',
    author: 'Admin Team',
    commentCount: 3,
    createdAt: '2h ago',
    isPinned: true,
  },
  {
    id: 2,
    title: '두 번째 공지사항',
    author: 'Admin Team',
    commentCount: 3,
    createdAt: '2h ago',
  },
  {
    id: 3,
    title: '세 번째 공지사항',
    author: 'Admin Team',
    commentCount: 3,
    createdAt: '2h ago',
  },
];

export const PostList = () => {
  return (
    <div className="flex flex-col">
      {MOCK_POSTS.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}; 