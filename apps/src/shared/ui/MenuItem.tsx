import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface MenuItemProps {
  icon: string
  label: string
  href?: string
  onClick?: () => void
}

export const MenuItem = ({
  icon,
  label,
  href = '#',
  onClick,
}: MenuItemProps) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full"
      >
        <li className="flex justify-between items-center w-full hover:bg-gray-100 px-4 py-4">
          <div className="flex items-center gap-4">
            <Image
              src={icon}
              alt={label + ' 아이콘'}
              className="w-6 h-6 flex items-center justify-center text-gray-800"
              width={24}
              height={24}
            />
            <span className="text-black text-base font-medium">{label}</span>
          </div>
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
        </li>
      </button>
    )
  }

  return (
    <Link href={href} className="flex justify-between items-center w-full">
      <li className="flex justify-between items-center w-full hover:bg-gray-100 px-4 py-4">
        <div className="flex items-center gap-4">
          <Image
            src={icon}
            alt={label + ' 아이콘'}
            className="w-6 h-6 flex items-center justify-center text-gray-800"
            width={24}
            height={24}
          />
          <span className="text-black text-base font-medium">{label}</span>
        </div>
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
      </li>
    </Link>
  )
}
