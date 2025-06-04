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
      className="flex-1 flex flex-col items-center gap-1"
    >
      <div className="relative">
        <div className={`w-7 h-7 ${isActive ? 'text-[#333333]' : 'text-[#999999]'}`}>
          {icon}
        </div>
        {hasBadge && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
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
    <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto h-16 bg-white border-t flex items-center px-4">
      <NavItem
        icon={<HomeIcon className="w-full h-full" />}
        label="홈"
        isActive={pathname === '/'}
        href="/"
      />
      <NavItem
        icon={<CalendarIcon className="w-full h-full" />}
        label="내 예약"
        isActive={pathname === '/reservations'}
        href="/reservations"
      />
      <NavItem
        icon={<BellIcon className="w-full h-full" />}
        label="활동소식"
        isActive={pathname === '/notifications'}
        href="/notifications"
        hasBadge
      />
      <NavItem
        icon={<EllipsisHorizontalIcon className="w-full h-full" />}
        label="더보기"
        isActive={pathname === '/more'}
        href="/more"
      />
    </div>
  );
} 