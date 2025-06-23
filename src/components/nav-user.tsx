'use client'

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ModeToggle } from './theme-button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function NavUser({
  user,
}: {
  user: {
    name: string | null
    email: string | null
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const handleLogout = () => {
    toast.success('Logged out', {
      description: 'You have been successfully logged out.',
      duration: 3000,
    })
    router.push('/logout')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="justify-between data-[state=open]:bg-muted/70 data-[state=open]:text-primary"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64 rounded-lg p-1"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            {/* User Info Header */}
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 rounded-md">
                  <AvatarImage src={user.name || ''} alt={user.name || 'User'} />
                  <AvatarFallback className="rounded-md">
                    {user.name?.[0] ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Theme toggle */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="justify-between">
                <span className="flex items-center gap-2">
                  Appearance
                </span>
                <ModeToggle />
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Account Settings */}
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="w-4 h-4 mr-2 text-primary" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="w-4 h-4 mr-2 text-primary" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="w-4 h-4 mr-2 text-primary" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
