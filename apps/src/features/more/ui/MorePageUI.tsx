'use client'

import { MenuItem } from '@/shared/ui/MenuItem'
import { ProfileSection } from '@/shared/ui/ProfileSection'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { useAuthStore } from '@/shared/stores/authStore'
import { useSecureAuth } from '@/shared/hooks/useSecureAuth'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Image from 'next/image'

interface MorePageUIProps {
  user: {
    userName: string;
    userPoint: number;
    userType: string;
    userEmail: string;
  };
}

export const MorePageUI = ({ user }: MorePageUIProps) => {
  // 🛡️ 보안 강화: JWT 기반 사용자 정보 (최우선)
  const { user: secureUser, logout: secureLogout } = useSecureAuth()
  // 🔄 기존 호환성: localStorage 기반
  const { logout, user: authUser } = useAuthStore()
  const router = useRouter()
  
  // JWT 기반 정보 우선 사용
  const actualUser = secureUser || authUser

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout()
      Cookies.remove('auth-token')
      Cookies.remove('auth-time')
      router.push('/login')
    }
  }

  const handleReviewManageClick = () => {
    if (actualUser?.userRole === 'MANAGER') {
      router.push('/manager/reviews')
    } else {
      router.push('/reviews')
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
    {
      icon: '/icons/linear-review.svg',
      label: '리뷰관리',
      onClick: handleReviewManageClick,
    },
    {
      icon: '/icons/linear-setting.svg',
      label: '로그아웃',
      onClick: handleLogout,
    },
  ]

  const topMenus = [
    { icon: '/icons/linear-card.svg', label: '결제수단', href: '/payment' },
    { icon: '/icons/linear-gift.svg', label: '프로모션', href: '/promotions' },
    { icon: '/icons/linear-share.svg', label: '친구초대', href: '/invite' },
    { icon: '/icons/linear-notice.svg', label: '공지사항', href: '/notice' },
  ]

  return (
    <>
      <CommonHeader
        title="더보기"
        showCloseButton={true}
      />
      <div className="flex flex-col bg-gray-50 pt-16 pb-20 min-h-screen">
        <div className="bg-white px-5 py-6">
          <ProfileSection
            name={user.userName}
            membershipType={user.userType}
            email={user.userEmail}
          />

          <section className="mt-4 bg-[#9CDAFB] rounded-xl flex flex-col items-center justify-between py-4 mb-4 gap-4">
            <div className="flex flex-col gap-4 w-full px-5">
              <figure className="flex items-center gap-1">
                <Image
                  src="/icons/fill_point.svg"
                  alt="Point"
                  className="w-[18px] h-[18px]"
                  width={18}
                  height={18}
                />
                <figcaption className="text-sm text-gray-900">AntPoint</figcaption>
              </figure>
              <div className="flex items-center justify-between w-full">
                <span className="text-xl font-semibold text-black">
                  {user.userPoint}원
                </span>
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

          <section className="bg-gray-100 rounded-xl shadow-sm py-4 flex flex-col mb-5">
            <div className="container flex justify-between items-center px-4">
              {topMenus.map((menu) => (
                <div
                  key={menu.label}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <Image
                    src={menu.icon}
                    alt={menu.label}
                    className="w-6 h-6 mb-1"
                    width={24}
                    height={24}
                  />
                  <span className="text-xs text-gray-900 font-medium">
                    {menu.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="flex flex-col bg-white">
          {menuItems.map((item, index) => (
            <ul key={item.href || index}>
              <MenuItem {...item} />
            </ul>
          ))}
        </section>
      </div>
    </>
  )
}
