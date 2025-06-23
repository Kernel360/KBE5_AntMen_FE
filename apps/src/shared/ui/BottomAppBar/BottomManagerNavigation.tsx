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
import { getMatchingRequests } from '@/entities/matching/api/matchingAPi'

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
        {badgeCount !== undefined && badgeCount > 0 && (
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
  const { user, isLoggedIn, matchingRequestCount, setMatchingRequestCount } = useAuthStore()

  // 매니저 로그인 시 매칭 요청 개수 불러오기
  useEffect(() => {
    const fetchMatchingRequestCount = async () => {
      if (isLoggedIn && user?.userRole === 'MANAGER') {
        try {
          const data = await getMatchingRequests(0, 1) // 첫 페이지만 가져와서 총 개수만 확인
          setMatchingRequestCount(data.totalElements)
        } catch (error) {
          console.error('매칭 요청 개수를 불러오는데 실패했습니다:', error)
          // 에러 시 0으로 설정 (기존 값 유지하지 않고 명시적으로 0 설정)
          setMatchingRequestCount(0)
        }
      } else if (!isLoggedIn || user?.userRole !== 'MANAGER') {
        // 매니저가 아니거나 로그아웃한 경우 0으로 설정
        setMatchingRequestCount(0)
      }
    }

    fetchMatchingRequestCount()
  }, [isLoggedIn, user?.userRole, setMatchingRequestCount])

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
