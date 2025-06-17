import { BottomNavigation } from '@/shared/ui/BottomAppBar/BottomNavigation'

export default function NavigationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div id="page-container" className="min-h-screen pb-[72px]">
        {children}
      </div>
      <BottomNavigation />
    </>
  )
}
