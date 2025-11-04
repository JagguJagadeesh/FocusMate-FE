'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, Ticket, MapPin, Calendar, Users, Tag, IndianRupee, Clock, Zap, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstence"
import useUserStore from "@/stores/useUserStore"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Loader2, X } from "lucide-react"

export default function EventCard({ event, formatDate }) {
    const [imgError, setImgError] = useState(false)
    const [registered, setRegistered] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isRegistering, setIsRegistering] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const { user } = useUserStore()

    useEffect(() => {
        (async function isParticipated() {
            try {
                const res = await axiosInstance.post('/events/isregistered', { 
                    id: event.id, 
                    participantId: user.id 
                })
                setRegistered(res.data.registered)
            } catch (e) {
                console.error("Error fetching participant:", e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [event.id, user.id])

    const handleRegister = async () => {
        setIsRegistering(true)
        try {
            await axiosInstance.post('/events/addparticipant', { 
                id: event.id, 
                participantId: user.id 
            })
            setRegistered(true)
            toast.success("Registration successful!", {
                description: "You're all set for this event"
            })
        } catch (e) {
            console.error("Error registering:", e)
            toast.error("Registration failed", {
                description: "Please try again later"
            })
        } finally {
            setIsRegistering(false)
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6 }}
                className="group"
            >
                <DialogTrigger asChild>
                    <div className="flex flex-col h-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer">
                        {/* Image Container */}
                        <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-900">
                            {!imgError && event.image ? (
                                <motion.img
                                    src={event.image}
                                    alt={event.title}
                                    onError={() => setImgError(true)}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <CalendarIcon className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                                </div>
                            )}

                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                                <span className="px-2.5 py-1 bg-gray-900/80 dark:bg-gray-100/80 text-white dark:text-gray-900 text-xs font-semibold rounded-md backdrop-blur-sm">
                                    {event.category}
                                </span>
                            </div>

                            {event.difficulty && (
                                <div className="absolute top-3 right-3">
                                    <span className="px-2.5 py-1 bg-gray-900/80 dark:bg-gray-100/80 text-white dark:text-gray-900 text-xs font-semibold rounded-md backdrop-blur-sm">
                                        {event.difficulty}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                            {/* Title */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(event.date)}
                                </p>
                            </div>

                            {/* Footer */}
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
                            >
                                <div className="text-sm font-bold text-gray-900 dark:text-white">
                                    {event.price === 0 ? 'Free' : `₹${event.price}`}
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        size="sm"
                                        className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold rounded-lg text-xs flex items-center gap-1.5 h-8 px-3"
                                    >
                                        View
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </DialogTrigger>
            </motion.div>

            {/* Dialog Content */}
            <DialogContent className="max-w-2xl w-full rounded-xl p-0 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="flex flex-col h-full max-h-[85vh]"
                >
                    {/* Header with Image */}
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative h-52 bg-gray-100 dark:bg-gray-900 overflow-hidden"
                    >
                        {!imgError && event.image ? (
                            <img
                                src={event.image}
                                alt={event.title}
                                onError={() => setImgError(true)}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <CalendarIcon className="w-16 h-16 text-gray-300 dark:text-gray-700" />
                            </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

                        {/* Close Button */}
                        <motion.button
                            onClick={() => setDialogOpen(false)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-800 transition-all"
                        >
                            <X className="w-4 h-4 text-gray-900 dark:text-white" />
                        </motion.button>

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute bottom-4 left-4 px-3 py-1.5 bg-gray-900/90 dark:bg-gray-100/90 text-white dark:text-gray-900 text-xs font-bold rounded-lg backdrop-blur-sm"
                        >
                            {event.category}
                        </motion.div>
                    </motion.div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                        {/* Title & Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-3"
                        >
                            <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                                {event.title}
                            </DialogTitle>
                            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                                {event.desc}
                            </p>
                        </motion.div>

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="flex flex-wrap gap-2"
                            >
                                {event.tags.map((tag, idx) => (
                                    <motion.span
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.15 + idx * 0.05 }}
                                        className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </motion.span>
                                ))}
                            </motion.div>
                        )}

                        {/* Details Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                            {/* Date */}
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Date</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {new Date(event.date).toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>

                            {/* Location */}
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Location</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                    {event.location}
                                </p>
                            </div>

                            {/* Difficulty */}
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Level</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {event.difficulty}
                                </p>
                            </div>

                            {/* Capacity */}
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Capacity</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {event.capacity} spots
                                </p>
                            </div>

                            {/* Price */}
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <IndianRupee className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Price</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {event.price === 0 ? 'Free' : `₹${event.price}`}
                                </p>
                            </div>

                            {/* Type */}
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Type</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {event.type}
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Action Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex-shrink-0 px-6 py-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                className="flex items-center justify-center"
                            >
                                <Loader2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </motion.div>
                        ) : registered ? (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                disabled
                                className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-lg cursor-default flex items-center justify-center gap-2 transition-all"
                            >
                                <span className="text-lg">✓</span>
                                Already Registered
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={handleRegister}
                                disabled={isRegistering}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-75 transition-all flex items-center justify-center gap-2"
                            >
                                {isRegistering ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <Ticket className="w-5 h-5" />
                                        Register Now
                                    </>
                                )}
                            </motion.button>
                        )}
                    </motion.div>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
