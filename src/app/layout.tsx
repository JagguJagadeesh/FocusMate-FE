import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Loading from "@/components/loading";
import { Suspense } from "react";
import { Turret_Road } from "next/font/google";

const troad = Turret_Road({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin', 'latin-ext']
});

export const metadata: Metadata = {
  title: "FocusMate",
  description:
    "Whether you're preparing for exams, managing class deadlines, or just trying to stay productive, FocusMate helps you create personalized study plans, track progress, and stay focused using AI-powered insights and reminders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={troad.className}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
