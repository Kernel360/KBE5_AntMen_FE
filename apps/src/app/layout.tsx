import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'
import { AuthDebugInitializer } from '@/components/AuthDebugInitializer'
import { AlertProvider } from '@/features/alerts/ui/AlertProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AntMen',
  description: 'AntMen - 개미들의 공간',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <AlertProvider>
            <AuthDebugInitializer />
            <main
              className={`w-full max-w-mobile mx-auto min-h-screen bg-white relative overflow-x-hidden`}
            >
              {children}
            </main>
            <Script
              src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
              strategy="lazyOnload"
            />
          </AlertProvider>
        </Providers>
      </body>
    </html>
  )
}
