'use client'

import { useState } from 'react'
import {
  ChevronsUpDown,
  LogOut,
  User,
  Palette,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
import { useRouter } from 'next/navigation'
import { logoutUser } from '@/services/authService'
import { toast } from 'sonner'
import useUserStore from '@/stores/useUserStore'
import { useTheme } from 'next-themes'

interface User {
  name: string | null
  email: string | null
  avatar?: string | null
  plan?: 'free' | 'pro' | 'enterprise'
}

interface NavUserProps {
  user: User
}

const menuItems = [
  {
    icon: User,
    label: 'Profile',
    href: '/user/profile',
    description: 'Manage your profile settings'
  }
]

const PlanBadge = ({ plan }: { plan?: string }) => {
  if (!plan) return null

  const planConfig = {
    free: { 
      label: 'Free', 
      class: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    },
    pro: { 
      label: 'Pro', 
      class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
    },
    enterprise: { 
      label: 'Enterprise', 
      class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
    }
  }

  const config = planConfig[plan as keyof typeof planConfig] || planConfig.free

  return (
    <Badge className={`text-xs font-semibold px-3 py-1 rounded-full border-0 ${config.class}`}>
      {config.label}
    </Badge>
  )
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { clearUser } = useUserStore()
  const { theme, setTheme } = useTheme()

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      clearUser()
      toast.success("Logged out successfully")
      router.push('/auth/signin')
    } catch (e) {
      console.log(e)
      toast.error("Failed to logout")
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
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
              className="group h-12 justify-between px-3 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all duration-300 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-9 w-9 border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors ring-2 ring-white dark:ring-gray-900">
                  <AvatarImage 
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                    alt={user.name || 'User'} 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-semibold text-foreground text-sm">{user.name || 'User'}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email || 'No email'}
                  </span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <AnimatePresence>
            {isOpen && (
              <DropdownMenuContent
                className="w-80 rounded-2xl p-3 shadow-2xl border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={12}
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-2"
                >
                  {/* User Info Header */}
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-900/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-gray-300 dark:border-gray-600 ring-2 ring-white dark:ring-gray-900">
                        <AvatarImage 
                          src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                          alt={user.name || 'User'} 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-base text-foreground truncate">{user.name || 'User'}</h4>
                          <PlanBadge plan={user.plan} />
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Appearance Toggle */}
                  <div className="px-2 py-2">
                    <DropdownMenuItem
                      onClick={toggleTheme}
                      className="px-3 py-3 focus:bg-gray-100 dark:focus:bg-gray-800 rounded-lg transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 w-full justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                            <Palette className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                          </div>
                          <span className="font-medium text-sm">Appearance</span>
                        </div>
                        <motion.div
                          animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800"
                        >
                          {theme === 'dark' ? (
                            <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                          ) : (
                            <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                          )}
                        </motion.div>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-800" />

                  {/* Account Menu */}
                  <div className="space-y-1 py-2 px-2">
                    {menuItems.map((item) => (
                      <DropdownMenuItem
                        key={item.label}
                        onClick={() => handleNavigation(item.href)}
                        className="px-3 py-3 focus:bg-gray-100 dark:focus:bg-gray-800 rounded-lg transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                            <item.icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm text-foreground">{item.label}</span>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>

                  <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-800" />

                  {/* Logout */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="p-2"
                  >
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="px-3 py-3 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 focus:bg-red-100 dark:focus:bg-red-900/40 rounded-lg transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-200 dark:bg-red-900/50">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm">Sign out</span>
                          <p className="text-xs text-red-600/80 dark:text-red-400/70">End your session</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-red-600/50 dark:text-red-400/50 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                </motion.div>
              </DropdownMenuContent>
            )}
          </AnimatePresence>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
