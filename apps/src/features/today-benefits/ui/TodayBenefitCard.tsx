import { ReactNode } from 'react'

interface TodayBenefitCardProps {
  icon?: ReactNode
  title: string
  description?: ReactNode
  badge?: string
  badgeColor?: string
  bgColor?: string
  className?: string
  children?: ReactNode
  isLargeCard?: boolean
  onClick?: () => void
}

export const TodayBenefitCard = ({
  icon,
  title,
  description,
  badge,
  badgeColor = 'bg-teal-300',
  bgColor = 'bg-gray-50',
  className = '',
  children,
  isLargeCard = false,
  onClick,
}: TodayBenefitCardProps) => {
  const baseClassName = `flex items-center rounded-xl px-4 mb-3 ${bgColor} ${className} ${
    onClick ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : ''
  }`

  if (isLargeCard) {
    return (
      <section
        className={`${baseClassName} py-4 min-h-[120px]`}
        aria-label={title}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyPress={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        } : undefined}
      >
        {icon && <div className="mr-4 flex-shrink-0">{icon}</div>}
        <div className="flex-1 min-w-0">
          <div className="text-[#999999] text-sm font-normal mb-1">{title}</div>
          {description && <div>{description}</div>}
          {children}
        </div>
      </section>
    )
  }

  return (
    <section
      className={`${baseClassName} py-3 h-[60px]`}
      aria-label={title}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {icon && <div className="mr-3 flex-shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-base text-gray-900 truncate">{title}</div>
        {description && (
          <div className="text-sm text-gray-500 leading-tight">{description}</div>
        )}
        {children}
      </div>
      {badge && (
        <span
          className={`ml-3 px-4 py-1 rounded-full text-sm font-black text-white ${badgeColor} whitespace-nowrap`}
        >
          {badge}
        </span>
      )}
    </section>
  )
}