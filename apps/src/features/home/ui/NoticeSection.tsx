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

function getRouteByType(type: string): string {
  switch (type) {
    case '공지':
      return '/boards'
    case '이벤트':
      return '/events'
    default:
      return '/boards'
  }
}

function NoticeItem({ type, title, tag, id }: NoticeItemProps) {
  const href = getRouteByType(type)
  
  return (
    <li>
      <Link
        href={href}
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
      title: "육아 서비스 신규 출시 20% 할인",
      tag: { text: 'NEW', color: 'bg-primary' },
    },
    {
      id: 2,
      type: '이벤트',
      title: '리뷰 작성하고 1000P 받기',
      tag: { text: 'HOT', color: 'bg-red-500' },
    },
    {
      id: 3,
      type: '이벤트',
      title: "앤트워크 이벤트 참여하고 혜택 받기",
    },
    {
      id: 4,
      type: '공지',
      title: "청소 용품 구매 서비스 곧 출시 예정",
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