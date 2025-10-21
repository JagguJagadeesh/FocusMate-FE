import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Component } from "@/components/loding";
import { Suspense } from "react";
import { Roboto_Flex } from "next/font/google";

const globalFont = Roboto_Flex({
  weight: ['400'],
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: "FocusMate",
  icons:{
    icon:'./HatIcon.png'
  },
  description:
    "Whether you're preparing for exams, managing class deadlines, or just trying to stay productive, FocusMate helps you create personalized study plans, track progress, and stay focused using AI-powered insights and reminders.",
};

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
