import ChatItem from './ChatItem';

export default function ChatList() {
  const chats = [
    {
      id: 1,
      avatar: {
        emoji: '👩',
        color: '#FFB366'
      },
      name: '청소서비스 상담톡',
      time: '오전 10:24',
      lastMessage: '안녕하세요. 청소연구소 고객...',
      hasCheckmark: false
    },
    {
      id: 2,
      avatar: {
        emoji: '🛒',
        color: '#00C7BE'
      },
      name: '플러스샵 상담톡',
      time: '오전 10:24',
      lastMessage: '정소서비스 관련 문의는...',
      hasCheckmark: true
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat, index) => (
        <>
          <ChatItem key={chat.id} {...chat} />
          {index < chats.length - 1 && (
            <div className="h-[1px] bg-[#E5E5EA] mx-4" />
          )}
        </>
      ))}
      <div className="flex-1 bg-[#F2F2F7]" /> {/* Empty space */}
    </div>
  );
} 