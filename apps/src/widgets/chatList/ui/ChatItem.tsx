interface ChatItemProps {
  avatar: {
    emoji: string;
    color: string;
  };
  name: string;
  time: string;
  lastMessage: string;
  hasCheckmark: boolean;
}

export default function ChatItem({ avatar, name, time, lastMessage, hasCheckmark }: ChatItemProps) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div 
        className="w-12 h-12 rounded-[24px] flex items-center justify-center"
        style={{ backgroundColor: avatar.color }}
      >
        <span className="text-[20px] text-white">{avatar.emoji}</span>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-semibold font-[Apple_SD_Gothic_Neo]">{name}</span>
          <span className="text-[13px] text-[#8E8E93] font-[Apple_SD_Gothic_Neo]">{time}</span>
        </div>
        <div className="flex items-center gap-[6px]">
          {hasCheckmark && (
            <div className="w-4 h-4 bg-[#34C759] rounded-lg flex items-center justify-center">
              <span className="text-[10px] font-semibold text-white">✓</span>
            </div>
          )}
          <span className="text-[14px] text-[#8E8E93] font-[Apple_SD_Gothic_Neo]">{lastMessage}</span>
        </div>
      </div>
    </div>
  );
} 