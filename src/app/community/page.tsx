'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar'
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Edit,
  Folder,
  Heart,
  MessageSquare,
  MapPin,
  Calendar,
  Star,
  Trophy,
  TrendingUp,
  Users,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Bell,
  Settings,
  Crown,
  Zap,
  Target,
  Award,
  Sparkles
} from 'lucide-react'
import Image from 'next/image'
import { Turret_Road } from 'next/font/google'
import useUserStore from '@/stores/useUserStore'
import logo from '@/lib/logo.png'

const geist = Turret_Road({
  subsets: ['latin'],
  weight: ['400', '700'],
})

// Sample data
const leaderboardData = [
  { name: "Sarah Chen", points: 2840, rank: 1, avatar: "SC", trend: "up", badge: "🏆" },
  { name: "Mike Johnson", points: 2650, rank: 2, avatar: "MJ", trend: "up", badge: "🥈" },
  { name: "Alex Thompson", points: 2480, rank: 3, avatar: "AT", trend: "down", badge: "🥉" },
  { name: "Emma Wilson", points: 2320, rank: 4, avatar: "EW", trend: "up", badge: "⭐" },
  { name: "John Doe", points: 2100, rank: 5, avatar: "JD", trend: "up", badge: "🔥" },
]

const posts = [
  {
    id: 1,
    title: "Building the Future of AI",
    image: "https://picsum.photos/id/1018/800/600",
    description: "Exploring the latest trends in artificial intelligence and machine learning. Join our discussion on how AI is reshaping industries and creating new opportunities for innovation.",
    author: "Alex Thompson",
    avatar: "AT",
    time: "2 hours ago",
    likes: 247,
    comments: 38,
    shares: 12,
    category: "Technology",
    isLiked: false,
    isBookmarked: false,
    isPinned: true
  },
  {
    id: 2,
    title: "City Life Photography",
    image: "https://picsum.photos/id/1015/800/600",
    description: "Capturing the essence of urban life through photography. Downtown skyscrapers shining in the evening light, telling stories of dreams and ambitions.",
    author: "Sarah Chen",
    avatar: "SC",
    time: "4 hours ago",
    likes: 156,
    comments: 24,
    shares: 8,
    category: "Photography",
    isLiked: true,
    isBookmarked: true,
    isPinned: false
  },
  {
    id: 3,
    title: "Remote Work Revolution",
    image: "https://picsum.photos/id/1020/800/600",
    description: "How remote work is changing the way we think about productivity and work-life balance. A cozy cabin workspace offering the perfect escape from city life.",
    author: "Mike Johnson",
    avatar: "MJ",
    time: "6 hours ago",
    likes: 89,
    comments: 15,
    shares: 5,
    category: "Lifestyle",
    isLiked: false,
    isBookmarked: false,
    isPinned: false
  },
  {
    id: 4,
    title: "Sustainable Design Practices",
    image: "https://picsum.photos/id/1022/800/600",
    description: "Exploring eco-friendly design approaches that benefit both users and the environment. Creating beautiful experiences while being mindful of our planet.",
    author: "Emma Wilson",
    avatar: "EW",
    time: "8 hours ago",
    likes: 203,
    comments: 31,
    shares: 18,
    category: "Design",
    isLiked: false,
    isBookmarked: true,
    isPinned: false
  }
]

// Enhanced StatCard Component
function StatCard({ value, label, icon, highlight, color = "purple" }: { 
  value: string, 
  label: string, 
  icon: React.ReactNode, 
  highlight?: boolean,
  color?: string 
}) {
  const colorClasses = {
    purple: 'from-purple-500 via-purple-600 to-indigo-600',
    blue: 'from-blue-500 via-blue-600 to-cyan-600', 
    pink: 'from-pink-500 via-pink-600 to-rose-600',
    green: 'from-green-500 via-emerald-600 to-teal-600'
  }

  return (
    <motion.div
      className={`group relative p-4 flex flex-col items-center justify-center rounded-2xl border overflow-hidden backdrop-blur-xl transition-all duration-300
        ${highlight 
          ? `bg-gradient-to-br  text-white shadow-2xl ring-2 ring-white/30 dark:ring-white/20` 
          : 'bg-white/70 dark:bg-zinc-800/70 hover:bg-white/90 dark:hover:bg-zinc-700/90 border-white/30 dark:border-zinc-600/30 hover:shadow-lg'
        }`}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className={`p-3 rounded-xl mb-3 ${highlight ? 'bg-white/20' : 'bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800'} group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs opacity-80 font-medium">{label}</p>
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
      )}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </motion.div>
  )
}

// Enhanced LeaderboardCard Component
function LeaderboardCard({ user, index }: { user: any, index: number }) {
  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return "from-yellow-400 via-yellow-500 to-orange-500"
      case 2: return "from-gray-300 via-gray-400 to-gray-500" 
      case 3: return "from-amber-600 via-amber-700 to-yellow-700"
      default: return "from-purple-400 via-purple-500 to-blue-500"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transition-all duration-300 cursor-pointer"
    >
      <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${getRankColor(user.rank)} flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-200`}>
        {user.rank}
        {user.rank <= 3 && (
          <div className="absolute -top-1 -right-1 text-xs">
            {user.badge}
          </div>
        )}
      </div>
      <Avatar className="w-12 h-12 ring-2 ring-white/50 shadow-md group-hover:ring-purple-400/50 transition-all duration-200">
        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white font-semibold">
          {user.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{user.name}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{user.points.toLocaleString()} pts</p>
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp className={`w-4 h-4 ${user.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">#{user.rank}</span>
      </div>
    </motion.div>
  )
}

// Enhanced PostCard Component
function PostCard({ post, index }: { post: any, index: number }) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)
  const [likesCount, setLikesCount] = useState(post.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const getCategoryColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'technology': return 'from-blue-500 to-indigo-600'
      case 'photography': return 'from-pink-500 to-rose-600'
      case 'lifestyle': return 'from-green-500 to-emerald-600'
      case 'design': return 'from-purple-500 to-violet-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <motion.article
      className="group relative rounded-3xl overflow-hidden shadow-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/30 dark:border-zinc-700/30 hover:shadow-2xl transition-all duration-500"
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.7, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Pinned indicator */}
      {post.isPinned && (
        <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
          📌 Pinned
        </div>
      )}

      {/* Category badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={`bg-gradient-to-r ${getCategoryColor(post.category)} text-white font-semibold px-3 py-1`}>
          {post.category}
        </Badge>
      </div>

      {/* Post Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-12 h-12 ring-2 ring-purple-400/30 shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white font-bold">
                {post.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <p className="font-bold text-base text-zinc-900 dark:text-zinc-100">{post.author}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{post.time}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20">
          <MoreHorizontal size={18} />
        </Button>
      </div>

      {/* Post Image */}
      <motion.div 
        className="relative overflow-hidden mx-6 mb-6 rounded-2xl"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4 }}
      >
        <img
          className="w-full h-80 object-cover"
          src={post.image}
          alt={post.title}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        
        {/* Quick actions overlay */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex gap-2">
            <Button size="sm" className="bg-white/90 text-black hover:bg-white rounded-full shadow-lg backdrop-blur-sm">
              <Heart size={14} />
            </Button>
            <Button size="sm" className="bg-white/90 text-black hover:bg-white rounded-full shadow-lg backdrop-blur-sm">
              <Bookmark size={14} />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Post Content */}
      <div className="px-6 pb-6">
        <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 leading-tight">{post.title}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">{post.description}</p>
      </div>

      {/* Post Actions */}
      <div className="px-6 pb-6">
        <Separator className="mb-6 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 ${
                isLiked 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-red-500'
              }`}
            >
              <Heart 
                size={18} 
                className={isLiked ? 'fill-current' : ''} 
              />
              <span className="text-sm font-semibold">{likesCount}</span>
            </motion.button>

            <Button variant="ghost" size="sm" className="gap-2 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600">
              <MessageCircle size={18} />
              <span className="text-sm font-semibold">{post.comments}</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-2 rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600">
              <Share2 size={18} />
              <span className="text-sm font-semibold">{post.shares}</span>
            </Button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              isBookmarked 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-blue-500'
            }`}
          >
            <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
          </motion.button>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
    </motion.article>
  )
}

// Main Community Component
export default function CommunityPage() {
  const user = useUserStore(s => s.user)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-indigo-100/80 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 ${geist.className}`}>
      {/* Enhanced Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-b border-white/20 dark:border-zinc-700/20 shadow-lg"
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 shadow-lg"></div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Community Hub
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Connect, Share, Grow Together</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold">
                  <Users size={16} />
                  1,234 active
                </span>
                <span className="flex items-center gap-2 px-3 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 font-semibold">
                  <Star size={16} />
                  Featured
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Bell size={18} />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Settings size={18} />
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Enhanced Profile Sidebar */}
          <motion.aside
            className="xl:col-span-3"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="sticky top-28">
              <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-zinc-700/30 overflow-hidden">
                {/* Enhanced Header with Gradient */}
                <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                  
                  <CardHeader className="relative flex flex-col items-center gap-4 p-0">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Avatar className="w-32 h-32 ring-4 ring-white/40 shadow-2xl">
                        <AvatarImage src="https://github.com/evilrabbit.png" />
                        <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">ER</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                    
                    <div className="text-center text-white">
                      <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                      <p className="text-white/90 text-sm mb-3">{user.email}</p>
                      <div className="flex items-center justify-center gap-6 text-sm text-white/80">
                        <span className="flex items-center gap-2">
                          <MapPin size={14} /> San Francisco
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar size={14} /> Joined 2023
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="secondary" 
                      className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-2xl"
                    >
                      <Edit size={16} /> Edit Profile
                    </Button>
                  </CardHeader>
                </div>

                <CardContent className="p-6">
                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <StatCard 
                      value="45" 
                      label="Posts" 
                      icon={<MessageSquare size={22} />} 
                      highlight 
                      color="purple"
                    />
                    <StatCard 
                      value="12" 
                      label="Projects" 
                      icon={<Folder size={22} />} 
                      color="blue"
                    />
                    <StatCard 
                      value="124" 
                      label="Likes" 
                      icon={<Heart size={22} />} 
                      color="pink"
                    />
                  </div>

                  {/* Enhanced Progress Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Profile Completion</p>
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">66%</span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full relative"
                          initial={{ width: 0 }}
                          animate={{ width: '66%' }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Complete your profile to unlock exclusive badges and premium features!
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Separator className="mb-6 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />
                  <div className="w-full">
                    <p className="text-lg font-bold mb-4 text-center flex items-center justify-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Achievements
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-3 py-2 rounded-xl shadow-lg">
                        🌟 Community Star
                      </Badge>
                      <Badge className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold px-3 py-2 rounded-xl shadow-lg">
                        📸 Photographer
                      </Badge>
                      <Badge variant="outline" className="border-dashed border-2 px-3 py-2 rounded-xl">
                        🎯 Next Goal
                      </Badge>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex justify-center"
              >
                <Image className="rounded-2xl shadow-xl" src={logo} alt="logo" width={144} height={48} />
              </motion.div>
            </div>
          </motion.aside>

          {/* Enhanced Main Content */}
          <motion.main
            className="xl:col-span-6"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="space-y-8">
              {/* Enhanced Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Community Posts
                  </h1>
                  <p className="text-zinc-500 dark:text-zinc-400">Discover amazing content from our community</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-2xl border-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm"
                    />
                  </div>
                  <Button variant="outline" className="rounded-2xl gap-2">
                    <Filter size={16} />
                    Filter
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl gap-2 shadow-lg">
                    <Plus size={16} />
                    Create Post
                  </Button>
                </div>
              </div>
              
              {/* Posts Feed */}
              <ScrollArea className="h-[70vh]">
                <div className="space-y-8 pr-4">
                  <AnimatePresence>
                    {posts.map((post, index) => (
                      <PostCard key={post.id} post={post} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          </motion.main>

          {/* Enhanced Leaderboard Sidebar */}
          <motion.aside
            className="xl:col-span-3"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <div className="sticky top-28 space-y-6">
              {/* Leaderboard Card */}
              <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/30 dark:border-zinc-700/30 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Leaderboard</h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Top contributors this week</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {leaderboardData.map((user, index) => (
                      <LeaderboardCard key={user.rank} user={user} index={index} />
                    ))}
                  </div>
                  
                  <div className="p-6 mt-4 border-t border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10">
                    <div className="text-center">
                      <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Compete for the top spot and earn exclusive rewards!
                      </p>
                      <Button className="mt-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl px-6">
                        View All Rankings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats Card */}
              <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/30 dark:border-zinc-700/30 shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="pb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Community Stats
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                      <p className="text-2xl font-bold text-blue-600">247</p>
                      <p className="text-xs text-blue-600/70">Posts Today</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                      <p className="text-2xl font-bold text-green-600">1.2k</p>
                      <p className="text-xs text-green-600/70">Active Users</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                      <p className="text-2xl font-bold text-purple-600">89</p>
                      <p className="text-xs text-purple-600/70">New Members</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                      <p className="text-2xl font-bold text-orange-600">3.4k</p>
                      <p className="text-xs text-orange-600/70">Total Likes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}
