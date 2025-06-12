import { Suspense } from 'react'
import { Login } from '@/features/auth/ui/Login'
import SocialLoginPage from '@/features/auth/ui/SocialLoginPage'

export default function LoginPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className=" w-full max-w-mobile space-y-8">
        <Suspense>
          <Login />
          {/* <SocialLoginPage /> */}
        </Suspense>
      </div>
    </section>
  )
}
