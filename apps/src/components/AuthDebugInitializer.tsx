'use client'

import { useEffect } from 'react'
import { initAuthDebugTools } from '@/shared/lib/auth-debug'

export const AuthDebugInitializer = () => {
  useEffect(() => {
    initAuthDebugTools()
  }, [])

  return null
} 