import { cookies } from 'next/headers'
import { MorePageUI } from '@/features/more/ui/MorePageUI'

async function getUserData(token: string) {
  const res = await fetch(`https://api.antmen.site:9091/customers/confirm`, {
    next: {
      revalidate: 3600,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch user data')
  }

  return res.json()
}

export default async function MorePage() {
  const token = cookies().get('auth-token')?.value

  if (!token) {
    return <div>로그인 후 이용해주세요.</div>
  }

  const userData = await getUserData(token)

  return <MorePageUI user={userData} />
}
