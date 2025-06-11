import Link from 'next/link'

interface MenuItemProps {
  icon: string
  label: string
  href?: string
  onClick?: () => void
}

export const MenuItem = ({ icon, label, href = '#', onClick }: MenuItemProps) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
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
        </li>
      </button>
    )
  }

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
      </li>
    </Link>
  )
}
