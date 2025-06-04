export default function InputArea() {
  return (
    <div className="flex items-center gap-2 p-4 bg-white">
      <button className="w-8 h-8 bg-[#E5E5EA] rounded-2xl flex items-center justify-center">
        <span className="text-[16px] text-[#8E8E93]">📷</span>
      </button>
      <div className="flex-1 h-9 bg-[#F2F2F7] rounded-[18px] px-3 flex items-center">
        <input
          type="text"
          placeholder="메세지를 입력해주세요."
          className="w-full bg-transparent text-[14px] font-[Apple_SD_Gothic_Neo] placeholder-[#8E8E93] outline-none"
        />
      </div>
      <button className="w-8 h-8 bg-[#E5E5EA] rounded-2xl flex items-center justify-center">
        <span className="text-[16px] text-[#8E8E93]">↗</span>
      </button>
    </div>
  );
} 