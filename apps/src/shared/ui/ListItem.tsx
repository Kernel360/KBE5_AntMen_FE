import React from "react";
import Link from "next/link";

interface ListItemProps {
  label: string;
  value?: string;
  href?: string;
}

const ListItem = ({ label, value, href }: ListItemProps) => {
  const content = (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0 cursor-pointer">
      <span className="text-base text-gray-800">{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-base text-gray-500">{value}</span>}
        {href && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-gray-400 stroke-2">
            <path d="M7.5 15L12.5 10L7.5 5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  );
  if (href) {
    return <Link href={href} passHref>{content}</Link>;
  }
  return content;
};

export default ListItem; 