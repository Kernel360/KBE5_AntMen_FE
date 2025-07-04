import { BottomNavigation } from '@/shared/ui/BottomAppBar'

export default function NavigationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div id="page-container" className="min-h-screen pb-16">
        {children}
      </div>
      <BottomNavigation userRole="MANAGER" />
    </>
  )
}
