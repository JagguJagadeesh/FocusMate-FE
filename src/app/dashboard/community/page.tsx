import UnderConstructionPage from "@/components/myuicomponents/UnderConstruction";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function CommunityPage() {

  return (
    <div className=''>
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Join Community
                </h2>

              </div>
            </div>
          </div>
        </header>
      </SidebarInset>
      <main className='h-96 flex items-center justify-center'>
        <UnderConstructionPage />
      </main>
    </div>
  )
}
