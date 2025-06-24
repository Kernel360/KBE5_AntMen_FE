'use client'

import { useEffect } from 'react'
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
import { useAuthStore } from '@/shared/stores/authStore'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  href: string
  badgeCount?: number
}

function NavItem({ icon, label, isActive, href, badgeCount }: NavItemProps) {
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
        {typeof badgeCount === 'number' && badgeCount > 0 && (
          <div className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium px-1">
              {badgeCount > 99 ? '99+' : badgeCount}
            </span>
          </div>
        )}
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
  const { user, isLoggedIn, matchingRequestCount, fetchMatchingRequestCount } = useAuthStore()
  
  // 매니저 로그인 상태일 때만 매칭 요청 개수 갱신 (페이지 접근 시)
  useEffect(() => {
    if (isLoggedIn && user?.userRole === 'MANAGER') {
      // 로그인 시점에 이미 매칭 요청 개수를 가져왔으므로,
      // 여기서는 매칭 페이지 접근 시에만 갱신
      if (pathname === '/manager/matching') {
        fetchMatchingRequestCount()
      }
    }
  }, [isLoggedIn, user?.userRole, pathname, fetchMatchingRequestCount])

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
        isActive={pathname === '/manager/reservations'}
        href="/manager/reservations"
      />
      <NavItem
        icon={<HandRaisedIcon className="h-full w-full" />}
        label="매칭 요청"
        isActive={pathname === '/manager/matching'}
        href="/manager/matching"
        badgeCount={matchingRequestCount}
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
