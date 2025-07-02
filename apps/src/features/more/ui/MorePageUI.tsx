'use client'

import { MenuItem } from '@/shared/ui/MenuItem'
import { ProfileSection } from '@/shared/ui/ProfileSection'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { useAuthStore } from '@/shared/stores/authStore'
import { useSecureAuth } from '@/shared/hooks/useSecureAuth'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'
import { 
  UserCircleIcon, 
  BellIcon, 
  HeartIcon, 
  CheckCircleIcon, 
  ChatBubbleBottomCenterTextIcon, 
  ArrowRightOnRectangleIcon,
  CreditCardIcon,
  GiftIcon,
  ShareIcon,
  MegaphoneIcon,
  MapPinIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

interface MorePageUIProps {
  user: {
    userName: string;
    userPoint: number;
    userType: string;
    userEmail: string;
    userProfile?: string;
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

  const handleBoardsClick = () => {
    if (authUser?.userRole === 'MANAGER') {
      router.push('/manager/boards')
    } else {
      router.push('/boards')
    }
  }

  const handlePaymentClick = () => {
    router.push('/payment');
  };

  const handleInviteClick = () => {
    router.push('/invite');
  };

  const handleEventsClick = () => {
    router.push('/events');
  };

  // 수요자용 메뉴 아이템
  const customerMenuItems = [
    {
      icon: <BellIcon className="w-6 h-6" />,
      label: 'Antwork에서 알림',
      href: '/notifications',
    },
    {
      icon: <HeartIcon className="w-6 h-6" />,
      label: '찜한 도우미',
      href: '/favorites',
    },
    {
      icon: <CheckCircleIcon className="w-6 h-6" />,
      label: '이용 내역',
      href: '/myreservation'
    },
    {
      icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />,
      label: '리뷰 관리',
      onClick: handleReviewManageClick,
    },
    {
      icon: <UserCircleIcon className="w-6 h-6" />,
      label: '계정 관리',
      href: '/account',
    },
    {
      icon: <MapPinIcon className="w-6 h-6" />,
      label: '주소 관리',
      href: '/address',
    },
    {
      icon: <ArrowRightOnRectangleIcon className="w-6 h-6" />,
      label: '로그아웃',
      onClick: handleLogout,
    },
  ]

  // 매니저용 메뉴 아이템
  const managerMenuItems = [
    {
      icon: <BellIcon className="w-6 h-6" />,
      label: 'Antwork에서 알림',
      href: '/notifications',
    },
    {
      icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
      label: '업무 내역',
      href: '/manager/reservations',
    },
    {
      icon: <BanknotesIcon className="w-6 h-6" />,
      label: '정산 내역',
      href: '/manager/salary',
    },
    {
      icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />,
      label: '리뷰 관리',
      onClick: handleReviewManageClick,
    },
    {
      icon: <CalendarDaysIcon className="w-6 h-6" />,
      label: '근무 설정',
      href: '/manager/work-settings',
    },
    {
      icon: <UserCircleIcon className="w-6 h-6" />,
      label: '계정 관리',
      href: '/manager/account',
    },
    {
      icon: <ArrowRightOnRectangleIcon className="w-6 h-6" />,
      label: '로그아웃',
      onClick: handleLogout,
    },
  ]

  const menuItems = authUser?.userRole === 'MANAGER' ? managerMenuItems : customerMenuItems

  const topMenus = [
    { icon: <CreditCardIcon className="w-6 h-6" />, label: '결제수단', onClick: handlePaymentClick },
    { icon: <GiftIcon className="w-6 h-6" />, label: '프로모션', onClick: handleEventsClick },
    { icon: <ShareIcon className="w-6 h-6" />, label: '친구초대', onClick: handleInviteClick },
    { icon: <MegaphoneIcon className="w-6 h-6" />, label: '공지사항', onClick: handleBoardsClick },
  ]

  return (
    <>
      <CommonHeader
        title="내 정보"
        showCloseButton={true}
      />
      <div className="flex flex-col bg-gray-50 pt-16 pb-20 min-h-screen">
        <div className="bg-white px-5 py-6">
      <ProfileSection
        name={user.userName}
        membershipType={user.userType}
        email={user.userEmail}
            userProfile={user.userProfile}
      />

          {/* 포인트/정산금액 섹션 */}
          <section className="mt-4 bg-[#9CDAFB] rounded-xl flex flex-col items-center justify-between py-4 mb-4 gap-4">
        <div className="flex flex-col gap-4 w-full px-5">
          <figure className="flex items-center gap-1">
            <Image
              src="/icons/fill_point.svg"
                  alt={authUser?.userRole === 'MANAGER' ? '정산금액' : 'Point'}
              className="w-[18px] h-[18px]"
              width={18}
              height={18}
            />
                <figcaption className="text-sm text-gray-900">
                  {authUser?.userRole === 'MANAGER' ? '이번주 정산금액' : 'AntPoint'}
                </figcaption>
          </figure>
          <div className="flex items-center justify-between w-full">
            <span className="text-xl font-semibold text-black">
              {user.userPoint}원
            </span>
            <ul className="flex gap-2">
                  {authUser?.userRole === 'MANAGER' ? (
                    <li 
                      className="bg-white rounded-full px-4 py-1 text-sm font-medium text-gray-900 hover:cursor-pointer"
                      onClick={() => router.push('/manager/salary')}
                    >
                      정산내역
                    </li>
                  ) : (
                    <>
              <li className="bg-white rounded-full px-4 py-1 text-sm font-medium text-gray-900 hover:cursor-pointer">
                충전
              </li>
              <li className="bg-white rounded-full px-4 py-1 text-sm font-medium text-gray-900 hover:cursor-pointer">
                출금
              </li>
                    </>
                  )}
            </ul>
          </div>
        </div>
      </section>

          <section className="bg-gray-100 rounded-xl shadow-sm py-4 flex flex-col mb-5">
        <div className="container flex justify-between items-center px-4">
          {topMenus.map((menu) => (
            <div
              key={menu.label}
              onClick={menu.onClick}
              className="flex flex-1 flex-col items-center gap-1 cursor-pointer"
            >
              {menu.icon}
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
