// import { AppSidebar } from "@/components/app-sidebar"
// import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/app-sidebar"
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
      </section>
        
}