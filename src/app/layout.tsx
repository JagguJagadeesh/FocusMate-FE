import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Component } from "@/components/loding";
import { Suspense } from "react";
import { Roboto_Flex } from "next/font/google";

const globalFont = Roboto_Flex({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true
})


export const metadata: Metadata = {
  title: "FocusMate - Smart Study Platform for Students | Focus Timer & AI Planner",
  description: "Stay focused and achieve more with FocusMate's Pomodoro timer, visual note-taking, YouTube playlists, day scheduler, and PDF library. Join 10,000+ students studying smarter.",
  keywords: ["study planner", "focus timer", "pomodoro app", "student productivity", "study app"],
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={globalFont.className}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Component />}>
            {children}
          </Suspense>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
