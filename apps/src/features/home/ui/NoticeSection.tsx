interface NoticeItemProps {
  type: string;
  title: string;
  tag?: {
    text: string;
    color: string;
  };
}

function NoticeItem({ type, title, tag }: NoticeItemProps) {
  return (
    <div className="flex justify-between items-center h-10">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[#333333]">{type}</span>
        <span className="text-sm text-[#333333]">{title}</span>
      </div>
      {tag && (
        <div
          className={`w-[50px] h-6 ${tag.color} rounded-xl flex items-center justify-center`}
        >
          <span className="text-xs text-white">{tag.text}</span>
        </div>
      )}
    </div>
  );
}

export function NoticeSection() {
  return (
    <div className="px-4 mt-6 space-y-3">
      <NoticeItem
        type="공지"
        title="여름 필수 '에어컨 청소' 신규 출시"
        tag={{ text: 'NEW', color: 'bg-[#0BBCD6]' }}
      />
      <NoticeItem
        type="이벤트"
        title="100원으로 20,000P 신청하기"
        tag={{ text: 'HOT', color: 'bg-red-500' }}
      />
      <NoticeItem
        type="공지"
        title="가사청소 당일/하루전 '입벽 예약' 안내"
      />
    </div>
  );
} 