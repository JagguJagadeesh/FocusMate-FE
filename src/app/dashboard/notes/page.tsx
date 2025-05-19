import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator";
import NotesCard from "./NotesCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
      </header>
      </SidebarInset>
      <div className="flex items-center justify-center mb-4">
        <Link href='/tabs/draw'><Button className="cursor-pointer">Create Note <span className="text-2xl">+</span></Button></Link>
      </div>
      <div className="pl-6 pr-4 grid auto-rows-min gap-4 md:grid-cols-3">
        <NotesCard/>
        <NotesCard/>
        <NotesCard/>
        <NotesCard/>
        <NotesCard/>
      </div>
    </div>
  );
}
