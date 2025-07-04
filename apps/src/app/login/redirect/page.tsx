import { Suspense } from 'react'
import { LoginGateway } from '@/features/auth/ui/LoginGateway'

export default function LoginRedirect() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-mobile space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">로그인 분기점</h1>
        </div>
        <Suspense>
          <LoginGateway />
        </Suspense>
      </div>
    </main>
  )
}
