'use client'

import React from 'react'
import Link from 'next/link'

export default function FooterLayout() {
  return (
    <footer className="w-full  text-foreground">
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-screen-xl mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} <Link href="/" className="hover:underline font-medium">FocusMate</Link>. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
