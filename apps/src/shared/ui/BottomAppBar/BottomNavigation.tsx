'use client'

import {
  HomeIcon,
  CalendarIcon,
  StarIcon,
  EllipsisHorizontalIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

interface NavItemProps {
  icon: string
  activeIcon?: string
  label: string
  isActive?: boolean
  href: string
}

function NavItem({ icon, activeIcon, label, isActive, href }: NavItemProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(href)}
      className="flex flex-1 flex-col items-center gap-[2px]"
    >
      <div className="relative flex items-center justify-center w-9 h-9 overflow-hidden">
        <Image
          src={isActive && activeIcon ? activeIcon : icon}
          alt={label}
          width={28}
          height={28}
          className="w-7 h-7"
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

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      icon: '/icons/footer-home.svg',
      activeIcon: '/icons/footer-home-active.svg',
      label: '홈',
      href: '/',
    },
    {
      icon: '/icons/footer-chat.svg',
      activeIcon: '/icons/footer-chat-active.svg',
      label: '게시판',
      href: '/boards',
    },
    {
      icon: '/icons/footer-check.svg',
      activeIcon: '/icons/footer-check-active.svg',
      label: '내 예약',
      href: '/myreservation',
    },
    {
      icon: '/icons/footer-star.svg',
      activeIcon: '/icons/footer-star-active.svg',
      label: '이벤트',
      href: '/events',
    },
    {
      icon: '/icons/footer-dot.svg',
      activeIcon: '/icons/footer-dot-active.svg',
      label: '더보기',
      href: '/more',
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto flex h-[72px] max-w-mobile items-center justify-between gap-4 border-t bg-white px-2 py-2">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          icon={item.icon}
          activeIcon={item.activeIcon}
          label={item.label}
          isActive={pathname === item.href}
          href={item.href}
        />
      ))}
    </div>
  )
}
