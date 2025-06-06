import { MenuItem } from '@/shared/ui/MenuItem'
import { ProfileSection } from '@/shared/ui/ProfileSection'

interface MorePageUIProps {
  user: {
    name: string
    points: number
    membershipType: string
  }
}

export const MorePageUI = ({ user }: MorePageUIProps) => {
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
    { icon: '/icons/slash.svg', label: '블랙리스트', href: '/blacklist' },
    { icon: '/icons/clock.svg', label: '이용 내역', href: '/history' },
    { icon: '/icons/settings.svg', label: '설정', href: '/settings' },
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
          <div key={item.href} className="py-4">
            <MenuItem {...item} />
          </div>
        ))}
      </div>
    </div>
  )
}
