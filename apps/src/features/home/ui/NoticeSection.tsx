import Link from 'next/link'

interface NoticeItemProps {
  type: string
  title: string
  tag?: {
    text: string
    color: string
  }
  id: number
}

function NoticeItem({ type, title, tag, id }: NoticeItemProps) {
  return (
    <li>
      <Link
        href={`/notice/${id}`}
        className="flex justify-between items-center"
      >
        <p className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#333333]">{type}</span>
          <span className="text-sm text-[#333333]">{title}</span>
        </p>
        {tag && (
          <div
            className={`w-[40px] h-5 ${tag.color} rounded-xl flex items-center justify-center`}
          >
            <span className="text-[12px] text-white">{tag.text}</span>
          </div>
        )}
      </Link>
    </li>
  )
}

export function NoticeSection() {
  const noticeList = [
    {
      id: 1,
      type: '공지',
      title: "여름 필수 '에어컨 청소' 신규 출시",
      tag: { text: 'NEW', color: 'bg-primary' },
    },
    {
      id: 2,
      type: '이벤트',
      title: '100원으로 20,000P 신청하기',
      tag: { text: 'HOT', color: 'bg-red-500' },
    },
    {
      id: 3,
      type: '공지',
      title: "가사청소 당일/하루전 '입벽 예약' 안내",
    },
    // 필요시 더 추가
  ]

  return (
    <ul className="px-4 mt-6 space-y-3">
      {noticeList.map((item) => (
        <NoticeItem
          key={item.id}
          type={item.type}
          title={item.title}
          tag={item.tag}
          id={item.id}
        />
      ))}
    </ul>
  )
}