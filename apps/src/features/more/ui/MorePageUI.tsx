'use client'

import { MenuItem } from '@/shared/ui/MenuItem'
import { ProfileSection } from '@/shared/ui/ProfileSection'
import { useAuthStore } from '@/shared/stores/authStore'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface MorePageUIProps {
  user: {
    userName: string
    userEmail: string
    userType: string
    userPoint: number
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
    {
      icon: '/icons/linear-bell.svg',
      label: 'Antwork에서 알림',
      href: '/notifications',
    },
    {
      icon: '/icons/linear-heart.svg',
      label: '찜한 도우미',
      href: '/favorites',
    },
    { icon: '/icons/linear-check.svg', label: '이용내역', href: '/history' },
    { icon: '/icons/linear-review.svg', label: '리뷰관리', href: '/reviews' },
    {
      icon: '/icons/linear-setting.svg',
      label: '로그아웃',
      onClick: handleLogout,
    },
  ]

  // 상단 4개 메뉴 배열
  const topMenus = [
    { icon: '/icons/linear-card.svg', label: '결제수단', href: '/payment' },
    { icon: '/icons/linear-gift.svg', label: '프로모션', href: '/promotions' },
    { icon: '/icons/linear-share.svg', label: '친구초대', href: '/invite' },
    { icon: '/icons/linear-notice.svg', label: '공지사항', href: '/notice' },
  ]

  return (
    <div className="flex flex-col bg-white">
      <h3 className="container text-xl font-bold text-black pt-6 mb-4">
        더보기
      </h3>

      <ProfileSection
        name={user.userName}
        membershipType={user.userType}
        email={user.userEmail}
      />
      <section className="mx-5 mt-4 bg-[#9CDAFB] rounded-xl flex flex-col items-center justify-between py-4 mb-4 gap-4">
        {/* <span className="w-full h-[1px] bg-[#E1F3FE]" /> */}
        <div className="flex flex-col gap-4 w-full px-5">
          <figure className="flex items-center gap-1">
            <img
              src="/icons/fill_point.svg"
              alt="Point"
              className="w-[18px] h-[18px]"
            />
            <figcaption className="text-sm text-gray-900">AntPoint</figcaption>
          </figure>
          <div className="flex items-center justify-between w-full">
            <span className="text-xl font-semibold text-black">{user.userPoint}원</span>
            <ul className="flex gap-2">
              <li className="bg-white rounded-full px-4 py-1 text-sm font-medium text-gray-900 hover:cursor-pointer">
                충전
              </li>
              <li className="bg-white rounded-full px-4 py-1 text-sm font-medium text-gray-900 hover:cursor-pointer">
                출금
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-5 bg-gray-100 rounded-xl shadow-sm py-4 flex flex-col mb-5">
        <div className="container flex justify-between items-center px-4">
          {topMenus.map((menu) => (
            <div
              key={menu.label}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <img src={menu.icon} alt={menu.label} className="w-6 h-6 mb-1" />
              <span className="text-xs text-gray-900 font-medium">
                {menu.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col">
        {menuItems.map((item, index) => (
          <ul key={item.href || index}>
            <MenuItem {...item} />
          </ul>
        ))}
      </section>
    </div>
  )
}
