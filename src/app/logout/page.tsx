'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function Logout() {
  const router = useRouter()

  const handleLogout = () => {
    router.push('/auth/signin') // Redirect to login page
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <Card className="w-full max-w-sm shadow-xl border border-zinc-200 dark:border-zinc-700">
        <CardHeader>
          <CardTitle className="text-center text-lg">Your loged out</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            You will be signed out of your session. Are you sure?
          </p>
          <Button onClick={handleLogout} className="w-full">
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Logout
