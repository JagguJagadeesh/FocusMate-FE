// import { AppSidebar } from "@/components/app-sidebar"
// import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Turret_Road } from 'next/font/google'



const geist = Turret_Road({
  subsets: ['latin'],
  weight:'400',
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