import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
}

export const Avatar = ({ src, alt, className }: AvatarProps) => {
  return (
    <div className={twMerge('relative rounded-full overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}; 