import StatusBar from '../chat/StatusBar';
import ChatListHeader from './ChatListHeader';
import ChatList from './ChatList';
import BottomBanner from './BottomBanner';
import HomeIndicator from '../chat/HomeIndicator';
import Link from 'next/link';

export default function ChatListScreen() {
  return (
    <Link href="/chat" className="flex flex-col h-full bg-[#F2F2F7]">
      <StatusBar />
      <ChatListHeader />
      <ChatList />
      <BottomBanner />
      <HomeIndicator />
    </Link>
  );
} 