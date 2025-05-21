'use client'
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator";
import NotesCard from "./NotesCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllNotesData } from "@/services/userService";
import useUserStore from "@/stores/useUserStore";
import { Caveat } from "next/font/google";

const caveat = Caveat({
  subsets: ['latin']
})

type Note = {
  id: string;
  title: string;
  description: string;
  imgData: string;
  ownerID: string;
};

export default function Page() {
  const userData = useUserStore(s=>s.user)
  const [notesData,setNotesData] = useState<Note[]>([])

  async function getnotes(id:string) {
    const res = await getAllNotesData(id)
    setNotesData(res.notes)
  }
  useEffect(()=>{
    getnotes(userData.id)
  },[userData])
// console.log(notesData)
  return (
    <div >
      <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
      </header>
      </SidebarInset>
      <div className="absolute top-6 right-10">
        <Link href='/tabs/draw'><Button className="cursor-pointer hover:p-5 duration-150">Create Note <span className="text-2xl">+</span></Button></Link>
      </div>
      <div className={caveat.className}>
        {notesData.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-center text-muted-foreground">No notes found.</p>
          </div>
        ) : (
          <div className="pl-6 pr-4 gap-4 grid auto-rows-min md:grid-cols-4">
          {notesData.map((item) => (
            <div className="w-60 h-40" key={item.id}>
              <NotesCard {...item}/>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
