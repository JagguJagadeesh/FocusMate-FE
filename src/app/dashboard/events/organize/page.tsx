'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import useUserStore from '@/stores/useUserStore'
import { createEvent } from '@/services/userService'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

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
        toast.success('Event created successfully!')
        router.push('/dashboard/events')
      } else {
        toast.error('Failed to create event')
      }
    } catch (error) {
      console.error(error)
      toast.error('Server error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b">
          <div className="flex h-14 sm:h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="font-bold text-lg sm:text-xl">Create Event</h1>
            </div>
            <Link href="/dashboard/events">
              <Button variant="outline" size="sm" className="rounded-lg h-9">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </header>
      </SidebarInset>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border shadow-sm overflow-hidden">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Event Details</h3>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  {...register('title')}
                  placeholder="Enter event title"
                  className="rounded-lg h-10"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    {...register('date')}
                    className="rounded-lg h-10"
                  />
                  {errors.date && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    {...register('location')}
                    placeholder="City or Virtual"
                    className="rounded-lg h-10"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Type & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <Select
                    value={watch('type')}
                    onValueChange={(v) => setValue('type', v as 'Virtual' | 'InPerson')}
                  >
                    <SelectTrigger className="rounded-lg h-10">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select
                    value={watch('category')}
                    onValueChange={(v) => setValue('category', v as 'Coding' | 'Conference' | 'Workshop' | 'Business')}
                  >
                    <SelectTrigger className="rounded-lg h-10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  {...register('desc')}
                  placeholder="Tell us about your event"
                  className="rounded-lg min-h-24 resize-none"
                />
                {errors.desc && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.desc.message}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Additional Info</h3>

              {/* Difficulty & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <Select
                    value={watch('difficulty')}
                    onValueChange={(v) => setValue('difficulty', v as 'Beginner' | 'Intermediate' | 'Advanced')}
                  >
                    <SelectTrigger className="rounded-lg h-10">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.difficulty && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.difficulty.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Capacity</label>
                  <Input
                    type="number"
                    {...register('capacity', { valueAsNumber: true })}
                    placeholder="Max attendees"
                    className="rounded-lg h-10"
                  />
                  {errors.capacity && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.capacity.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹)</label>
                  <Input
                    type="number"
                    {...register('price')}
                    placeholder="0 for free"
                    className="rounded-lg h-10"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input
                    {...register('tags')}
                    placeholder="coding, ai, web (comma separated)"
                    className="rounded-lg h-10"
                  />
                  {errors.tags && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.tags.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  {...register('image')}
                  placeholder="https://example.com/image.jpg"
                  className="rounded-lg h-10"
                />
                {errors.image && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
