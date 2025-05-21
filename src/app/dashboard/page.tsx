
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"

export default function Page() {
  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Link href='/tabs/draw'>
            <div className="aspect-video  flex items-center justify-center shadow-2xl bg-gradient-to-r  from-slate-100 to-slate-300 rounded-lg hover:border-b hover:border-r hover:text-gray-800 border-gray-500 duration-150">
              <p className="text-3xl font-stretch-ultra-expanded ">Create Notes +</p>
            </div>
            </Link>
            <Link href='/tabs/schedule'>
            <div className="aspect-video  flex items-center justify-center shadow-2xl bg-gradient-to-l  from-slate-100 to-slate-300 rounded-lg hover:border-t hover:border-l hover:text-gray-800 border-gray-500 duration-150">
              <p className="text-3xl font-stretch-ultra-expanded ">Create Schedule +</p>
            </div>
            </Link>
            <Link href='/tabs/draw'>
            <div className="aspect-video  flex items-center justify-center shadow-2xl bg-gradient-to-r  from-slate-100 to-slate-300 rounded-lg hover:border-b hover:border-r hover:text-gray-800 border-gray-500 duration-150">
              <p className="text-3xl font-stretch-ultra-expanded ">Add PlayList +</p>
            </div>
            </Link>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
        </SidebarInset>
      </>
      )
}
