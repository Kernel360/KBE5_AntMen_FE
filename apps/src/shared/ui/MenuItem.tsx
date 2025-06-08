import Link from 'next/link'

interface MenuItemProps {
  icon: string
  label: string
  href?: string
}

export const MenuItem = ({ icon, label, href = '#' }: MenuItemProps) => {
  return (
    <Link
      href={href}
      className="flex justify-between items-center w-full px-4 py-4"
    >
      <li>
        <div className="flex items-center gap-4">
          <img
            src={icon}
            alt={label + ' 아이콘'}
            className="w-6 h-6 flex items-center justify-center text-gray-800"
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
