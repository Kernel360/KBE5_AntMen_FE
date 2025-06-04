import React from "react";
import Link from "next/link";

interface MenuItemProps {
  text: string;
  IconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  href?: string;
}

const MenuItem = ({ text, IconComponent, href }: MenuItemProps) => {
  const content = (
    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200 last:border-b-0 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 flex items-center justify-center">
          <IconComponent className="stroke-black stroke-2" />
        </div>
        <span className="text-base text-gray-800">{text}</span>
      </div>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-gray-400 stroke-2">
        <path d="M7.5 15L12.5 10L7.5 5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
  if (href) {
    return <Link href={href} passHref>{content}</Link>;
  }
  return content;
};

export default MenuItem; 