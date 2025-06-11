import Link from 'next/link'
import React from 'react'

interface MenuItemProps {
  icon: string
  label: string
  href?: string
  onClick?: () => void
}

function MenuIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <img
      src={icon}
      alt={label + ' 아이콘'}
      className="w-6 h-6 flex items-center justify-center text-gray-800"
    />
  )
}

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-400"
    >
      <path
        d="M7.5 15L12.5 10L7.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * MenuItem: li 태그는 컴포넌트 외부에서 감싸는 것이 시맨틱하게 더 적합합니다.
 * 내부적으로 button 또는 Link만 반환합니다.
 */
export const MenuItem = ({ icon, label, href, onClick }: MenuItemProps) => {
  const content = (
    <>
      <li className="flex items-center gap-3">
        <MenuIcon icon={icon} label={label} />
        <span className="text-black text-[15px] font-medium">{label}</span>
      </li>
      <ArrowIcon />
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full max-w-screen-md mx-auto hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <span className="container py-4 text-[15px] flex justify-between items-center">
          {content}
        </span>
      </button>
    )
  }

  return (
    <Link
      href={href || '#'}
      className="flex justify-between items-center w-full max-w-screen-md mx-auto hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <span className="container py-4 text-[15px] flex justify-between items-center">
        {content}
      </span>
    </Link>
  )
}
