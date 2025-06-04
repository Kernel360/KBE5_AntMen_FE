import Image from 'next/image';
import Link from 'next/link';

interface MenuItemProps {
  icon: string;
  label: string;
  href: string;
}

export const MenuItem = ({ icon, label, href }: MenuItemProps) => {
  return (
    <Link href={href} className="flex justify-between items-center w-full">
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 flex items-center justify-center">
          <Image src={icon} alt={label} width={24} height={24} />
        </div>
        <span className="text-black text-base font-medium">{label}</span>
      </div>
      <div className="w-5 h-5">
        <Image
          src="/icons/chevron-right.svg"
          alt="chevron right"
          width={20}
          height={20}
        />
      </div>
    </Link>
  );
}; 