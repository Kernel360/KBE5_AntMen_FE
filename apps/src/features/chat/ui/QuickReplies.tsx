export default function QuickReplies() {
  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center gap-2 overflow-x-auto">
        <button className="h-9 px-4 bg-white rounded-[18px] border border-[#E5E5EA] whitespace-nowrap">
          <span className="text-[14px] font-[Apple_SD_Gothic_Neo]">자주묻는 질문</span>
        </button>
        <button className="h-9 px-4 bg-white rounded-[18px] border border-[#E5E5EA] flex items-center gap-1 whitespace-nowrap">
          <span className="text-[14px] font-[Apple_SD_Gothic_Neo]">삼 마일리지로 추가 할인받기</span>
          <span className="text-[14px]">🛍️</span>
        </button>
        <button className="h-9 px-4 bg-white rounded-[18px] border border-[#E5E5EA] whitespace-nowrap">
          <span className="text-[14px] font-[Apple_SD_Gothic_Neo]">구매</span>
        </button>
      </div>
    </div>
  );
} 