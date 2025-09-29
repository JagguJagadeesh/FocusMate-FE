'use client'
import { AppSidebar } from "@/components/app-sidebar"
import Loading from "@/components/Loaders/loading"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Suspense } from "react"
import ChatBotPopup from '@/app/tabs/ChatBox'
import {withAuth} from "@/utils/AuthWarpper"

function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <Suspense 
            fallback={
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-indigo-100/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
                <Loading />
              </div>
            }
          >
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </Suspense>
        </SidebarInset>
        <ChatBotPopup />
      </div>
    </SidebarProvider>
  )
}

export default withAuth(DashboardLayout)