'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import ChatBotPopup from '@/app/tabs/ChatBox'
import { withAuth } from "@/utils/AuthWarpper"

function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <ChatBotPopup />
      </div>
    </SidebarProvider>
  )
}

export default withAuth(DashboardLayout)