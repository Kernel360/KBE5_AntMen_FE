import StatusBar from '../../../features/chat/ui/StatusBar';
import ChatListHeader from './ChatListHeader';
import ChatList from './ChatList';
import HomeIndicator from '../../../features/chat/ui/HomeIndicator';
import Link from 'next/link';

export default function ChatListScreen() {
  return (
    <Link href="/chat" className="flex flex-col h-full bg-[#F2F2F7]">
      <StatusBar />
      <ChatListHeader />
      <ChatList />
      <HomeIndicator />
    </Link>
  );
} 