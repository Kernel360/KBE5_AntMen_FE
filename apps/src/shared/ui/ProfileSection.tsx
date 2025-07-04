import Image from 'next/image'

interface ProfileSectionProps {
  name: string
  membershipType: string
  email: string
  userProfile?: string
}

export const ProfileSection = ({
  name,
  membershipType,
  email,
  userProfile,
}: ProfileSectionProps) => {
  return (
    <div className="container flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <figure className="w-12 h-12 rounded-[30px] bg-gray-100 flex items-center justify-center overflow-hidden">
          {userProfile ? (
            <Image
              src={userProfile}
              alt="Profile"
              className="w-full h-full object-cover"
              width={48}
              height={48}
            />
          ) : (
          <Image
            src="/icons/profile.png"
            alt="Profile"
            className="w-full h-full object-cover"
            width={48}
            height={48}
          />
          )}
        </figure>
        <div className="flex flex-col  gap-1">
          <span className="text-lg leading-none font-medium text-black">
            {name ?? '로그인 후 이용해주세요'}
          </span>
          <span className="text-sm leading-none font-normal text-[#121212]">
            {email}
          </span>
        </div>
      </div>
      <span className="text-[#999999] text-base">{membershipType}</span>
    </div>
  )
}
