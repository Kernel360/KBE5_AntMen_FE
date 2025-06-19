import { cookies } from 'next/headers'
import { MorePageUI } from '@/features/more/ui/MorePageUI'

export default async function MorePage() {
  const user = {
    userName: '김고객',
    userPoint: 1000,
    userType: 'Gold',
    userEmail: 'customer@test.com',
  }
  return <MorePageUI user={user} />
}
