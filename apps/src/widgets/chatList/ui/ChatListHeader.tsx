export default function ChatListHeader() {
  return (
    <div className="flex justify-between items-center px-4 py-2">
      <button className="text-[20px]">✕</button>
      <h1 className="text-[17px] font-semibold font-[Apple_SD_Gothic_Neo]">채팅</h1>
      <div className="w-5 h-5" /> {/* Empty space to balance the layout */}
    </div>
  );
} 