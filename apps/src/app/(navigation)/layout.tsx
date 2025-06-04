import { BottomNavigation } from "@/shared/ui/BottomAppBar/BottomNavigation";

export default function NavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BottomNavigation />
    </>
  );
}