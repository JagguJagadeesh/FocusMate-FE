

import { AppSidebar } from "@/components/app-sidebar"
import Loading from "@/components/loading"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Suspense } from "react"



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section >
    <SidebarProvider>
      <AppSidebar />
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </SidebarProvider>
      </section>
        
}