// import { AppSidebar } from "@/components/app-sidebar"
// import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Geist } from 'next/font/google'


const geist = Geist({
  subsets: ['latin-ext'],
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section className={geist.className}>
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
      </section>
        
}