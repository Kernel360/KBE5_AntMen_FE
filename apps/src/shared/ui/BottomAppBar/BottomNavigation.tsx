'use client';

import { HomeIcon, CalendarIcon, BellIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  href: string;
  hasBadge?: boolean;
}

function NavItem({ icon, label, isActive, href, hasBadge }: NavItemProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="flex flex-1 flex-col items-center gap-1"
    >
      <div className="relative">
        <div className={`h-7 w-7 ${isActive ? 'text-[#333333]' : 'text-[#999999]'}`}>
          {icon}
        </div>
        {hasBadge && (
          <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>
      <span className={`text-xs ${isActive ? 'text-[#333333]' : 'text-[#999999]'}`}>
        {label}
      </span>
    </button>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto flex h-16 max-w-[390px] items-center border-t bg-white px-4">
      <NavItem
        icon={<HomeIcon className="h-full w-full" />}
        label="홈"
        isActive={pathname === '/'}
        href="/"
      />
      <NavItem
        icon={<CalendarIcon className="h-full w-full" />}
        label="실시간 상담"
        isActive={pathname === '/chats'}
        href="/chats"
      />
      <NavItem
        icon={<CalendarIcon className="h-full w-full" />}
        label="내 예약"
        isActive={pathname === '/reservations'}
        href="/reservations"
      />
      <NavItem
        icon={<BellIcon className="h-full w-full" />}
        label="이벤트"
        isActive={pathname === '/events'}
        href="/events"
        hasBadge
      />
      <NavItem
        icon={<EllipsisHorizontalIcon className="h-full w-full" />}
        label="더보기"
        isActive={pathname === '/more'}
        href="/more"
      />
    </div>
  );
} 