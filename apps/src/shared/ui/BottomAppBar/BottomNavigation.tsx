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
      <div className="relative flex items-center justify-center w-9 h-9 overflow-hidden">
        <Image
          src={icon}
          alt={label}
          width={72}
          height={36}
          className={`transition-transform duration-300 ${isActive ? '-translate-x-9' : 'translate-x-0'}`}
          style={{ width: 72, height: 36 }}
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
      label: '홈',
      href: '/',
    },
    {
      icon: '/icons/footer-chat.svg',
      label: '게시판',
      href: '/boards',
    },
    {
      icon: '/icons/footer-check.svg',
      label: '내 예약',
      href: '/myreservation',
    },
    {
      icon: '/icons/footer-star.svg',
      label: '이벤트',
      href: '/events',
    },
    {
      icon: '/icons/footer-dot.svg',
      label: '더보기',
      href: '/more',
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto flex h-[72px] max-w-mobile items-center justify-between gap-4 border-t bg-white px-2 pt-3 pb-1.5">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          isActive={pathname === item.href}
          href={item.href}
        />
      ))}
    </div>
  )
}
