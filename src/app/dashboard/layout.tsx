// import { AppSidebar } from "@/components/app-sidebar"
// import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/app-sidebar"
import Loading from "@/components/loading"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Turret_Road } from 'next/font/google'
import { Suspense } from "react"



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
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </SidebarProvider>
      </section>
        
}