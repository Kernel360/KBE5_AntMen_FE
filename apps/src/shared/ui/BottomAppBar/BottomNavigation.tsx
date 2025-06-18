'use client'

import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { navConfig } from './navConfig'
import type { UserRole, NavItemConfig } from './types'
import { useAuthStore } from '@/shared/stores/authStore'
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
}: NavItemConfig & { isActive: boolean; onClick?: () => void }) => {
  const router = useRouter()
  return (
    <button
      onClick={onClick ? onClick : () => router.push(href)}
      className="flex flex-1 flex-col items-center"
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="relative flex items-center justify-center w-9 h-9 overflow-hidden">
        <Image
          src={isActive && activeIcon ? activeIcon : icon}
          alt={label}
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </div>
      <span
        className={`text-xs whitespace-nowrap ${isActive ? 'text-[#333333]' : 'text-[#999999]'}`}
      >
        {label}
      </span>
    </button>
  )
}

export const BottomNavigation = ({ userRole }: BottomNavigationProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const [modalOpen, setModalOpen] = useState(false)
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
          // 더보기, 내 예약 버튼만 예외 처리
          if (item.label === '더보기' || item.label === '내 예약') {
            return (
              <NavItem
                key={item.href}
                {...item}
                isActive={pathname === item.href}
                onClick={() => {
                  if (!isLoggedIn) setModalOpen(true)
                  else {
                    router.push(item.href)
                  }
                }}
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
