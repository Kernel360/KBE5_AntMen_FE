import React from 'react'
import clsx from 'clsx'

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const PrimaryButton = ({
  children,
  className,
  ...rest
}: PrimaryButtonProps) => {
  return (
    <button
      type="button"
      className={clsx(
        'w-full h-12 bg-primary text-gray-900 rounded-lg flex items-center justify-center font-bold text-base transition-colors disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
