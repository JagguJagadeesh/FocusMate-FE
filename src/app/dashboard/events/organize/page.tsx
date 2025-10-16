'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
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
import { ArrowBigLeft, ArrowLeft } from 'lucide-react'

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
    const route = useRouter()

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

        try {
            const res = await createEvent(body)
            if (res) toast.success('Event created successfully!')
            else toast.error('Failed to create event')
            route.push('/dashboard/events')
        } catch (error) {
            toast.error('Server error: ')
        }
    }

    // Helper component for label + input + error
    const FieldWrapper = ({ label, error, children }) => (
        <div className="flex flex-col">
            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            {children}
            {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/40 dark:from-gray-950 dark:via-purple-950/30 dark:to-gray-900">
            <SidebarInset>
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="sticky top-0 z-30 backdrop-blur-xl bg-white/60 dark:bg-gray-950/60 border-b border-gray-200/40 dark:border-gray-700/50 shadow-[0_2px_16px_rgba(136,84,208,0.08)]"
                >
                    <div className="flex h-16 items-center justify-between mx-auto max-w-7xl px-6">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger />
                            <h1 className="font-semibold text-lg sm:text-xl bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                                Organize Event
                            </h1>
                        </div>
                        <Link href={'/dashboard/events'}><Button><ArrowLeft/> Events</Button></Link>
                    </div>
                </motion.header>
            </SidebarInset>

            <div className="max-w-7xl mx-auto px-8 py-2">
                <h1 className='text-3xl my-6 text-center'>Organize seamless, successful hackathons</h1>
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="backdrop-blur-lg bg-white/60 dark:bg-gray-900/60 border border-violet-600 rounded-lg shadow-lg p-8"
                >
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6"
                    >
                        <FieldWrapper label="Event Title" error={errors.title}>
                            <Input {...register('title')} placeholder="Event Title" />
                        </FieldWrapper>

                        <FieldWrapper label="Date" error={errors.date}>
                            <Input type="date" {...register('date')} />
                        </FieldWrapper>

                        <FieldWrapper label="Location" error={errors.location}>
                            <Input {...register('location')} placeholder="Location" />
                        </FieldWrapper>

                        <FieldWrapper label="Event Type" error={errors.type}>
                            <Select
                                value={watch('type')}
                                onValueChange={(v) => setValue('type', v as "Virtual" | "InPerson")}
                            >
                                <SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger>
                                <SelectContent>
                                    {eventTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </FieldWrapper>

                        <FieldWrapper label="Category" error={errors.category}>
                            <Select
                                value={watch('category')}
                                onValueChange={(v) => setValue('category', v as "Coding" | "Conference" | "Workshop" | "Workshop" | "Business")}
                            >
                                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </FieldWrapper>

                        <FieldWrapper label="Description" error={errors.desc} >
                            <Textarea {...register('desc')} placeholder="Description" />
                        </FieldWrapper>

                        <FieldWrapper label="Price" error={errors.price}>
                            <Input {...register('price')} placeholder="Price (optional)" />
                        </FieldWrapper>

                        <FieldWrapper label="Capacity" error={errors.capacity}>
                            <Input type="number" {...register('capacity', { valueAsNumber: true })} placeholder="Capacity" />
                        </FieldWrapper>

                        <FieldWrapper label="Image URL" error={errors.image}>
                            <Input {...register('image')} placeholder="Image URL (optional)" />
                        </FieldWrapper>

                        <FieldWrapper label="Tags (comma separated)" error={errors.tags}>
                            <Input {...register('tags')} placeholder="e.g. coding, innovation" />
                        </FieldWrapper>

                        <FieldWrapper label="Difficulty" error={errors.difficulty}>
                            <Select
                                value={watch('difficulty')}
                                onValueChange={(v) => setValue('difficulty', v as "Beginner" | "Intermediate" | "Advanced")}
                                // onValueChange={v => setValue('difficulty', v)}
                            >
                                <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                                <SelectContent>
                                    {difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </FieldWrapper>
                        {/* Submit button spans full width */}
                        <div className="col-span-full items-center justify-center">
                            <Button
                                type="submit"
                                className=" mt-4  rounded-full"
                            >
                                Create Event
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
