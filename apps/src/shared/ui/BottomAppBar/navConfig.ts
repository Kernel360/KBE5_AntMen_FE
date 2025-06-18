import { NavItemConfig, UserRole } from './types'

export const navConfig: Record<UserRole, NavItemConfig[]> = {
  CUSTOMER: [
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
  ],
  MANAGER: [
    {
      icon: '/icons/footer-home.svg',
      activeIcon: '/icons/footer-home-active.svg',
      label: '홈',
      href: '/manager',
    },
    {
      icon: '/icons/footer-chat.svg',
      activeIcon: '/icons/footer-chat-active.svg',
      label: '게시판',
      href: '/manager/boards',
    },
    {
      icon: '/icons/footer-check.svg',
      activeIcon: '/icons/footer-check-active.svg',
      label: '내 업무',
      href: '/manager/reservations',
    },
    {
      icon: '/icons/service-request.svg',
      activeIcon: '/icons/service-request-active.svg',
      label: '매칭 요청',
      href: '/manager/matching',
    },
    {
      icon: '/icons/footer-dot.svg',
      activeIcon: '/icons/footer-dot-active.svg',
      label: '더보기',
      href: '/manager/more',
    },
  ],
  ADMIN: [],
}
