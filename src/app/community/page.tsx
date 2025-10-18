'use client'

import React, { useState } from 'react'
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar'
import { 
  Card, 
  CardHeader, 
  CardContent 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Search,
  Trophy,
  TrendingUp
} from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import ProductLogo from '@/components/ProductLogo'

// Sample data
const leaderboardData = [
  { name: "Sarah Chen", points: 2840, rank: 1, avatar: "SC" },
  { name: "Mike Johnson", points: 2650, rank: 2, avatar: "MJ" },
  { name: "Alex Thompson", points: 2480, rank: 3, avatar: "AT" },
  { name: "Emma Wilson", points: 2320, rank: 4, avatar: "EW" },
  { name: "John Doe", points: 2100, rank: 5, avatar: "JD" },
]

const posts = [
  {
    id: 1,
    title: "Building the Future of AI",
    image: "https://picsum.photos/id/1018/800/600",
    description: "Exploring the latest trends in artificial intelligence and machine learning.",
    author: "Alex Thompson",
    avatar: "AT",
    time: "2 hours ago",
    likes: 247,
    comments: 38,
    category: "Technology"
  },
  {
    id: 2,
    title: "City Life Photography",
    image: "https://picsum.photos/id/1015/800/600",
    description: "Capturing the essence of urban life through photography.",
    author: "Sarah Chen",
    avatar: "SC",
    time: "4 hours ago",
    likes: 156,
    comments: 24,
    category: "Photography"
  },
  {
    id: 3,
    title: "Remote Work Revolution",
    image: "https://picsum.photos/id/1020/800/600",
    description: "How remote work is changing the way we think about productivity.",
    author: "Mike Johnson",
    avatar: "MJ",
    time: "6 hours ago",
    likes: 89,
    comments: 15,
    category: "Lifestyle"
  }
]

// Simple Post Card
function PostCard({ post }: { post: any }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  return (
    <Card className="overflow-hidden">
      {/* Post Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback>{post.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{post.author}</p>
            <p className="text-xs text-gray-500">{post.time}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal size={18} />
        </Button>
      </CardHeader>

      {/* Post Image */}
      <img
        className="w-full h-64 object-cover"
        src={post.image}
        alt={post.title}
        loading="lazy"
      />

      {/* Post Content */}
      <CardContent className="p-4 space-y-3">
        <div>
          <h2 className="text-lg font-bold mb-1">{post.title}</h2>
          <p className="text-sm text-gray-600">{post.description}</p>
        </div>

        <Separator />

        {/* Post Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={isLiked ? 'text-red-500' : ''}
            >
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
              <span className="ml-1 text-sm">{likesCount}</span>
            </Button>

            <Button variant="ghost" size="sm">
              <MessageCircle size={18} />
              <span className="ml-1 text-sm">{post.comments}</span>
            </Button>

            <Button variant="ghost" size="sm">
              <Share2 size={18} />
            </Button>
          </div>

          <Button variant="ghost" size="sm">
            <Bookmark size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Simple Leaderboard Item
function LeaderboardItem({ user }: { user: any }) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold">
        {user.rank}
      </div>
      <Avatar className="w-10 h-10">
        <AvatarFallback>{user.avatar}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-semibold text-sm">{user.name}</p>
        <p className="text-xs text-gray-500">{user.points.toLocaleString()} pts</p>
      </div>
      <TrendingUp className="w-4 h-4 text-green-500" />
    </div>
  )
}

// Main Component
export default function CommunityPage() {
  const user = useUserStore(s => s.user)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className='flex items-center gap-3'><ProductLogo/>
            <h1 className="text-2xl font-bold mt-1">Community</h1>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Sidebar */}
          <aside className="lg:col-span-3">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src="https://github.com/evilrabbit.png" />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <h2 className="font-bold">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-gray-500">Projects</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">124</p>
                    <p className="text-xs text-gray-500">Likes</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Profile</span>
                    <span className="text-sm font-bold">66%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '66%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 pr-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </ScrollArea>
          </main>

          {/* Leaderboard Sidebar */}
          <aside className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <h2 className="font-bold">Leaderboard</h2>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {leaderboardData.map((user) => (
                  <LeaderboardItem key={user.rank} user={user} />
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
