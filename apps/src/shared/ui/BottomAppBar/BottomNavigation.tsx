'use client'

import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { navConfig } from './navConfig'
import type { UserRole, NavItemConfig } from './types'
import { useAuthStore } from '@/shared/stores/authStore'
import { useSecureAuth } from '@/shared/hooks/useSecureAuth'
import { useState } from 'react'
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal'

interface BottomNavigationProps {
  userRole?: UserRole
}

const NavItem = ({
  icon,
  activeIcon,
  label,
  isActive,
  href,
  onClick,
  badgeCount,
}: NavItemConfig & { isActive: boolean; onClick?: () => void; badgeCount?: number }) => {
  const router = useRouter()
  return (
    <button
      onClick={onClick ? onClick : () => router.push(href)}
      className="flex flex-1 flex-col items-center px-1"
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="relative flex items-center justify-center w-8 h-8">
        <Image
          src={isActive && activeIcon ? activeIcon : icon}
          alt={label}
          width={24}
          height={24}
          className="w-6 h-6"
        />
        {typeof badgeCount === 'number' && badgeCount > 0 && (
          <div className="absolute top-0 right-0 min-w-[16px] h-[16px] bg-red-500 rounded-full flex items-center justify-center z-10 shadow-md">
            <span className="text-xs text-white font-medium leading-none px-0.5">
              {badgeCount > 99 ? '99+' : badgeCount}
            </span>
          </div>
        )}
      </div>
      <span
        className={`text-xs whitespace-nowrap mt-0.5 ${isActive ? 'text-[#333333]' : 'text-[#999999]'}`}
      >
        {label}
      </span>
    </button>
  )
}

export const BottomNavigation = ({ userRole }: BottomNavigationProps) => {
  const pathname = usePathname()
  const router = useRouter()
  // 🛡️ 보안 강화: JWT 기반 인증 상태 (최우선)
  const { isLoggedIn: secureIsLoggedIn, isLoading } = useSecureAuth()
  // 🔄 기존 호환성: localStorage 기반 (매칭 요청 수용)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const matchingRequestCount = useAuthStore((state) => state.matchingRequestCount)
  const [modalOpen, setModalOpen] = useState(false)
  
  // JWT 기반 로그인 상태 우선 사용
  const actualIsLoggedIn = isLoading ? false : secureIsLoggedIn
  // MANAGER만 별도, 나머지는 모두 CUSTOMER로 처리
  const bottomNav =
    userRole === 'MANAGER' ? navConfig['MANAGER'] : navConfig['CUSTOMER']

  if (!bottomNav.length) return null

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 mx-auto flex h-[64px] max-w-mobile items-center justify-between gap-4 border-t bg-white px-2 py-2 z-50"
        aria-label="하단 네비게이션"
      >
        {bottomNav.map((item) => {
          // 내 정보, 내 예약, 게시판 버튼만 예외 처리
          if (item.label === '내 정보' || item.label === '내 예약' || item.label === '게시판') {
            return (
              <NavItem
                key={item.href}
                {...item}
                isActive={pathname === item.href}
                onClick={() => {
                  if (!actualIsLoggedIn) setModalOpen(true)
                  else {
                    router.push(item.href)
                  }
                }}
              />
            )
          }
          // 매니저의 매칭 요청 탭에 배지 표시
          if (userRole === 'MANAGER' && item.label === '매칭 요청') {
            return (
              <NavItem
                key={item.href}
                {...item}
                isActive={pathname === item.href}
                badgeCount={matchingRequestCount}
              />
            )
          }
          return (
            <NavItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
            />
          )
        })}
      </nav>
      <LoginRequiredModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
