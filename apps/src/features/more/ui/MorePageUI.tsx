'use client';

import { MenuItem } from '@/shared/ui/MenuItem'
import { ProfileSection } from '@/shared/ui/ProfileSection'
import { useAuthStore } from '@/shared/stores/authStore'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface MorePageUIProps {
  user: {
    name: string
    points: number
    membershipType: string
  }
}

export const MorePageUI = ({ user }: MorePageUIProps) => {
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      // Zustand 스토어 초기화
      logout()
      
      // 쿠키 삭제
      Cookies.remove('auth-token')
      Cookies.remove('auth-time')

      // 로그인 페이지로 리다이렉트
      router.push('/login')
    }
  }

  const menuItems = [
    { icon: '/icons/point.svg', label: 'Ant Point', href: '/point' },
    {
      icon: '/icons/bell.svg',
      label: 'Antwork에서 알림',
      href: '/notifications',
    },
    {
      icon: '/icons/credit-card.svg',
      label: '결제수단 관리',
      href: '/payment',
    },
    { icon: '/icons/send.svg', label: '친구 초대하기', href: '/invite' },
    {
      icon: '/icons/gift.svg',
      label: '프로모션 코드와 선물',
      href: '/promotions',
    },
    { icon: '/icons/heart.svg', label: '찜한 도우미', href: '/favorites' },
    { icon: '/icons/slash.svg', label: '리뷰 관리', href: '/reviews' },
    { icon: '/icons/clock.svg', label: '이용 내역', href: '/history' },
    { icon: '/icons/settings.svg', label: '로그아웃', onClick: handleLogout },
  ]

  return (
    <div className="flex flex-col gap-8 p-5">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-black">더보기</h1>
        <ProfileSection
          name={user.name}
          points={user.points}
          membershipType={user.membershipType}
        />
      </div>
      <div className="flex flex-col">
        {menuItems.map((item, index) => (
          <div key={item.href || index} className="py-4">
            <MenuItem {...item} />
          </div>
        ))}
      </div>
    </div>
  )
}
