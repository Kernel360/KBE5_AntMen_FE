export type UserRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN'

export interface NavItemConfig {
  icon: string
  activeIcon?: string
  label: string
  href: string
}
