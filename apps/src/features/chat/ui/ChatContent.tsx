export default function ChatContent() {
  return (
    <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">
      {/* System Message */}
      <div className="bg-white rounded-xl p-4 w-full">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#E5E5EA] rounded-xl flex items-center justify-center">
            <span className="text-xs text-[#8E8E93]">💬</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-[Apple_SD_Gothic_Neo]">문의 중가로 상담 지연되고 있습니다.</p>
            <div className="flex items-center gap-1">
              <span className="text-[15px]">🙇</span>
              <p className="text-[15px] font-[Apple_SD_Gothic_Neo]">순차적으로 답변드리겠습니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today Label */}
      <div className="flex justify-center">
        <span className="text-[13px] text-[#8E8E93] font-[Apple_SD_Gothic_Neo]">오늘</span>
      </div>

      {/* Bot Message */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-[#34C759] rounded-[20px] flex items-center justify-center">
            <span className="text-[20px] text-white">🤖</span>
          </div>
          <div className="bg-white rounded-[18px] p-4 max-w-[280px]">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <span className="text-[16px] text-[#34C759]">✓</span>
                <p className="text-[15px] font-[Apple_SD_Gothic_Neo]">정소서비스 관련 문의는 으로 문의 바랍니다.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[16px] text-[#34C759]">✓</span>
                <p className="text-[15px] font-[Apple_SD_Gothic_Neo]">정확한 상담을 위해 구매하신 문의 와 함께 문의 내용을 말씀 부탁드립니다.</p>
              </div>
              <p className="text-[15px] font-[Apple_SD_Gothic_Neo]">----------</p>
              <p className="text-[15px] font-[Apple_SD_Gothic_Neo]">안녕하세요.</p>
              <p className="text-[15px] font-[Apple_SD_Gothic_Neo]">청소연구소 플러스샵입니다.</p>
              <p className="text-[15px] font-[Apple_SD_Gothic_Neo]">무엇을 도와드릴까요?</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <span className="text-xs text-[#8E8E93] font-[Apple_SD_Gothic_Neo]">오전 10:24</span>
        </div>
      </div>
    </div>
  );
} 