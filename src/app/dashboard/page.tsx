
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Turret_Road } from "next/font/google"
import Calendar from './schedule/Calendar'
import UserChart from './progress/UserChart'


const troad = Turret_Road({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin', 'latin-ext']
});

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
          <div className={`${troad.className} grid auto-rows-min gap-4 md:grid-cols-3`}>
            <Link href='/tabs/draw'>
            <div className="aspect-video  flex items-center justify-center  hover:border-2 rounded-2xl bg-gray-400 text-black opacity-90 hover:opacity-100 duration-100">
              <p className="text-3xl ">Create Note</p>
            </div>
            </Link>
            <Link href='/tabs/schedule'>
            <div className="aspect-video  flex items-center justify-center hover:border-2 rounded-2xl bg-gray-400 text-black opacity-90 hover:opacity-100 duration-100">
              <p className="text-3xl ">Create Schedule</p>
            </div>
            </Link>
            <Link href='/dashboard/playlist'>
            <div className="aspect-video  flex items-center justify-center hover:border-2 rounded-2xl bg-gray-400 text-black opacity-90 hover:opacity-100 duration-100">
              <p className=' text-3xl'>My PlayList</p>
            </div>
            </Link>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" >
          <Calendar view={'timeGridDay'}/>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" >
          <div className="p-10">
            <UserChart/>
          </div>
          </div>
        </div>
        </SidebarInset>
      </>
      )
}
