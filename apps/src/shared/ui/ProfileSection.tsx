import Image from 'next/image';

interface ProfileSectionProps {
  name: string;
  points: number;
  membershipType: string;
}

export const ProfileSection = ({ name, points, membershipType }: ProfileSectionProps) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-[30px] bg-black flex items-center justify-center">
          <Image
            src="/icons/user-profile.svg"
            alt="Profile"
            width={30}
            height={30}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-black text-lg font-black">{name}</span>
          <span className="text-[#2563EB] text-sm font-medium">{points}포인트</span>
        </div>
      </div>
      <span className="text-[#999999] text-base">{membershipType}</span>
    </div>
  );
}; 