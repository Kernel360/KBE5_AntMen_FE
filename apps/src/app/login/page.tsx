import { Suspense } from 'react'
import { Login } from '@/features/auth/ui/Login'
import SocialLoginPage from '@/features/auth/ui/SocialLoginPage'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-mobile">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Login />
          {/* <SocialLoginPage /> */}
        </Suspense>
      </div>
    </div>
  )
}
