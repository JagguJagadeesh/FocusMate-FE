'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import useUserStore from '@/stores/useUserStore'
import { createEvent } from '@/services/userService'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Tag, Zap, Users, DollarSign, Image as ImageIcon, Loader2 } from 'lucide-react'

const eventTypes = ['Virtual', 'InPerson'] as const
const categories = ['Coding', 'Conference', 'Workshop', 'Business'] as const
const difficulties = ['Beginner', 'Intermediate', 'Advanced'] as const

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  date: z.string().min(1, 'Select a date'),
  location: z.string().min(3, 'Enter a location'),
  type: z.enum(eventTypes),
  category: z.enum(categories),
  desc: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0).optional(),
  capacity: z.coerce.number().min(1, 'Capacity must be 1 or more'),
  image: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  tags: z.string().optional(),
  difficulty: z.enum(difficulties),
})

type FormData = z.infer<typeof schema>

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })
  const { user } = useUserStore()
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    const tagsArray = data.tags?.split(',').map(t => t.trim()).filter(Boolean) || []
    const formattedDate = new Date(data.date).toISOString()

    const body = {
      ...data,
      date: formattedDate,
      price: Number(data.price) || 0,
      capacity: Number(data.capacity),
      tags: tagsArray,
      organizerID: user.id,
    }

    setIsSubmitting(true)
    try {
      const res = await createEvent(body)
      if (res) {
        toast.success('Event created successfully! 🎉', {
          description: 'Your event is now live'
        })
        router.push('/dashboard/events')
      } else {
        toast.error('Failed to create event')
      }
    } catch (error) {
      console.error(error)
      toast.error('Server error', {
        description: 'Please try again later'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fixed: icon prop is now optional
  const FieldWrapper = ({ label, error, children, icon: Icon }: { 
    label: string; 
    error?: any; 
    children: React.ReactNode;
    icon?: React.ComponentType<any>
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
    >
      <label className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
        {label}
      </label>
      <div className="relative">
        {children}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1"
          >
            <span className="text-lg">⚠</span> {error.message}
          </motion.p>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/40 dark:from-slate-950 dark:via-purple-950/30 dark:to-slate-900">
      <SidebarInset>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-30 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm"
        >
          <div className="flex h-14 items-center justify-between px-4 md:px-6 gap-2">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-bold text-slate-900 dark:text-white"
              >
                Create Event
              </motion.h1>
            </div>
            <Link href="/dashboard/events">
              <Button variant="outline" size="sm" className="h-9">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </motion.header>
      </SidebarInset>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-3"
          >
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Create Your Event
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Organize seamless, successful events that bring people together
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Form Header */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-8 md:p-12 space-y-8"
            >
              {/* Section 1: Basic Info */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Event Details</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldWrapper label="Event Title" error={errors.title} icon={Tag}>
                    <Input
                      {...register('title')}
                      placeholder="Hackathon 2024, Web Summit..."
                      className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500"
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Date" error={errors.date} icon={Calendar}>
                    <Input
                      type="date"
                      {...register('date')}
                      className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500"
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Location" error={errors.location} icon={MapPin}>
                    <Input
                      {...register('location')}
                      placeholder="City, Venue, or Virtual"
                      className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500"
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Event Type" error={errors.type}>
                    <Select
                      value={watch('type')}
                      onValueChange={(v) => setValue('type', v as "Virtual" | "InPerson")}
                    >
                      <SelectTrigger className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldWrapper>
                </div>

                <FieldWrapper label="Description" error={errors.desc}>
                  <Textarea
                    {...register('desc')}
                    placeholder="Tell us about your event. What will attendees learn or experience?"
                    className="rounded-lg min-h-28 p-4 focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </FieldWrapper>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-800" />

              {/* Section 2: Categories & Difficulty */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Classification</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FieldWrapper label="Category" error={errors.category}>
                    <Select
                      value={watch('category')}
                      onValueChange={(v) => setValue('category', v as "Coding" | "Conference" | "Workshop" | "Business")}
                    >
                      <SelectTrigger className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldWrapper>

                  <FieldWrapper label="Difficulty" error={errors.difficulty} icon={Zap}>
                    <Select
                      value={watch('difficulty')}
                      onValueChange={(v) => setValue('difficulty', v as "Beginner" | "Intermediate" | "Advanced")}
                    >
                      <SelectTrigger className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldWrapper>

                  <FieldWrapper label="Tags" error={errors.tags} icon={Tag}>
                    <Input
                      {...register('tags')}
                      placeholder="coding, innovation, ai"
                      className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500"
                    />
                  </FieldWrapper>
                </div>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-800" />

              {/* Section 3: Capacity & Pricing */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-600 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Capacity & Pricing</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldWrapper label="Capacity" error={errors.capacity} icon={Users}>
                    <Input
                      type="number"
                      {...register('capacity', { valueAsNumber: true })}
                      placeholder="Maximum attendees"
                      className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500"
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Price (₹)" error={errors.price} icon={DollarSign}>
                    <Input
                      type="number"
                      {...register('price')}
                      placeholder="0 for free event"
                      className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500"
                    />
                  </FieldWrapper>
                </div>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-800" />

              {/* Section 4: Media */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Media</h3>
                </motion.div>

                <FieldWrapper label="Event Image URL" error={errors.image} icon={ImageIcon}>
                  <Input
                    {...register('image')}
                    placeholder="https://example.com/image.jpg"
                    className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500"
                  />
                </FieldWrapper>
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-6"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Event...
                    </>
                  ) : (
                    <>
                      <span className="text-lg">✨</span>
                      Create Event
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-slate-600 dark:text-slate-400"
          >
            <p>Fill in all the details above and create your event in seconds! 🚀</p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
