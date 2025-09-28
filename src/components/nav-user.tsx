'use client'

import { useState } from 'react'
import {
  Bell,
  ChevronsUpDown,
  LogOut,
  User,
  Palette
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { Badge } from '@/components/ui/badge'
import { ModeToggle } from './theme-button'
import { useRouter } from 'next/navigation'
import { logoutUser } from '@/services/authService'
import { toast } from 'sonner'

// Types
interface User {
  name: string | null
  email: string | null
  avatar?: string | null
  plan?: 'free' | 'pro' | 'enterprise'
  notifications?: number
}

interface NavUserProps {
  user: User
}

// Simple Menu Items - Account only
const menuItems = [
  {
    icon: User,
    label: 'Profile',
    href: '/user/profile',
    description: 'Manage your profile'
  },
  {
    icon: Bell,
    label: 'Notifications',
    href: '#',
    description: 'Manage your notifications',
    badge: true
  }
]

// Plan Badge Component
const PlanBadge = ({ plan }: { plan?: string }) => {
  if (!plan) return null

  const planConfig = {
    free: { label: 'Free', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
    pro: { label: 'Pro', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
    enterprise: { label: 'Enterprise', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' }
  }

  const config = planConfig[plan as keyof typeof planConfig] || planConfig.free

  return (
    <Badge className={`text-xs font-medium px-2 py-0.5 ${config.color} border-0`}>
      {config.label}
    </Badge>
  )
}

// Menu Item Component
const MenuItem = ({ 
  item, 
  onClick, 
  notifications 
}: { 
  item: any
  onClick?: () => void
  notifications?: number 
}) => {
  const Icon = item.icon
  
  return (
    <DropdownMenuItem 
      onClick={onClick}
      className="group cursor-pointer p-3 focus:bg-accent/80 transition-colors rounded-lg"
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{item.label}</span>
            {item.badge && notifications && notifications > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center rounded-full">
                {notifications > 99 ? '99+' : notifications}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {item.description}
          </p>
        </div>
      </div>
    </DropdownMenuItem>
  )
}

// Main Component
export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success("We'll miss u")
      router.push('/auth/signin')
    } catch (e) {
      console.log(e)
    }
  }

  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group h-12 justify-between data-[state=open]:bg-accent/80 data-[state=open]:text-accent-foreground hover:bg-accent/60 transition-all duration-200"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-8 w-8 border-2 border-border group-hover:border-primary/20 transition-colors">
                  <AvatarImage 
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                    alt={user.name || 'User'} 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">{user.name || 'User'}</span>
                    <PlanBadge plan={user.plan} />
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email || 'No email'}
                  </span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <AnimatePresence>
            {isOpen && (
              <DropdownMenuContent
                className="w-80 rounded-2xl p-2 shadow-2xl border border-border/50 bg-card/95 backdrop-blur-xl"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={8}
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {/* User Info Header */}
                  <DropdownMenuLabel className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl mb-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-border/50">
                        <AvatarImage 
                          src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                          alt={user.name || 'User'} 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-base truncate">{user.name || 'User'}</h4>
                          <PlanBadge plan={user.plan} />
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  {/* Theme Toggle */}
                  <DropdownMenuGroup className="mb-2">
                    <DropdownMenuItem className="p-3 focus:bg-accent/80 rounded-lg">
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
                          <Palette className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium flex-1">Appearance</span>
                        <ModeToggle />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="my-2" />

                  {/* Account Menu Items */}
                  <DropdownMenuGroup>
                    {menuItems.map((item) => (
                      <MenuItem
                        key={item.label}
                        item={item}
                        onClick={() => handleNavigation(item.href)}
                        notifications={item.label === 'Notifications' ? user.notifications : undefined}
                      />
                    ))}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="my-2" />

                  {/* Logout */}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="group cursor-pointer p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 group-hover:bg-red-200 dark:group-hover:bg-red-900/40 transition-colors">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-sm">Sign out</span>
                        <p className="text-xs text-red-500">End your current session</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            )}
          </AnimatePresence>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
