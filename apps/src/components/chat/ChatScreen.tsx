import StatusBar from './StatusBar';
import Header from './Header';
import ChatContent from './ChatContent';
import QuickReplies from './QuickReplies';
import InputArea from './InputArea';
import HomeIndicator from './HomeIndicator';

export default function ChatScreen() {
  return (
    <div className="flex flex-col h-full bg-[#F2F2F7]">
      <StatusBar />
      <Header />
      <ChatContent />
      <QuickReplies />
      <InputArea />
      <HomeIndicator />
    </div>
  );
} 