'use client'

import {
  HomeIcon,
  CalendarIcon,
  StarIcon,
  EllipsisHorizontalIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/outline'
import { useRouter, usePathname } from 'next/navigation'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  href: string
}

function NavItem({ icon, label, isActive, href }: NavItemProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(href)}
      className="flex flex-1 flex-col items-center gap-1.5"
    >
      <div className="relative">
        <div
          className={`h-7 w-7 ${isActive ? 'text-[#333333]' : 'text-[#999999]'}`}
        >
          {icon}
        </div>
      </div>
      <span
        className={`text-xs whitespace-nowrap ${isActive ? 'text-[#333333]' : 'text-[#999999]'}`}
      >
        {label}
      </span>
    </button>
  )
}

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto flex h-[72px] max-w-mobile items-center justify-between gap-4 border-t bg-white px-2 pt-3 pb-1.5">
      <NavItem
        icon={<HomeIcon className="h-full w-full" />}
        label="홈"
        isActive={pathname === '/manager'}
        href="/manager"
      />
      <NavItem
        icon={<ClipboardDocumentListIcon className="h-full w-full" />}
        label="게시판"
        isActive={pathname === '/manager/boards'}
        href="/manager/boards"
      />
      <NavItem
        icon={<CalendarIcon className="h-full w-full" />}
        label="내 업무"
        isActive={pathname === '/manager/work'}
        href="/manager/work"
      />
      <NavItem
        icon={<HandRaisedIcon className="h-full w-full" />}
        label="매칭 요청"
        isActive={pathname === '/manager/matchingLists'}
        href="/manager/matchingList"
      />
      <NavItem
        icon={<EllipsisHorizontalIcon className="h-full w-full" />}
        label="더보기"
        isActive={pathname === '/manager/more'}
        href="/manager/more"
      />
    </div>
  )
}
