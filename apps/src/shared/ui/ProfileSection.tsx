import Image from 'next/image'

interface ProfileSectionProps {
  name: string
  membershipType: string
  email: string
}

export const ProfileSection = ({
  name,
  membershipType,
  email,
}: ProfileSectionProps) => {
  return (
    <div className="container flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <figure className="w-12 h-12 rounded-[30px] bg-gray-100 flex items-center justify-center overflow-hidden">
          <Image
            src="/icons/profile.png"
            alt="Profile"
            className="w-full h-full object-cover"
            width={48}
            height={48}
          />
        </figure>
        <span className="text-white text-lg font-medium">{name}</span>
        <span className="text-white text-sm font-medium">{email}</span>
      </div>
      <span className="text-[#999999] text-base">{membershipType}</span>
    </div>
  )
}
