import { ManagerStatusGuard } from '@/features/manager-status/ui/ManagerStatusGuard'

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ManagerStatusGuard>
      {children}
    </ManagerStatusGuard>
  )
} 