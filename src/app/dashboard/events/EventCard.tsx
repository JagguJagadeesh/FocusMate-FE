import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, Ticket } from "lucide-react"
import { useEffect, useState } from "react"
import { MapPin, Calendar, BarChart, Users, Tag, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axiosInstence";
import useUserStore from "@/stores/useUserStore";
import { toast } from "sonner";




export default function EventCard({ event, formatDate }) {
    const [imgError, setImgError] = useState(false)
    const [registered, setRegistered] = useState(false)
    const { user } = useUserStore()

    useEffect(() => {
        (async function isParticipated() {
            try {
                const res = await axiosInstance.post('/events/isregistered', { id: event.id, participantId: user.id });
                setRegistered(res.data.registered)
            } catch (e) {
                toast.error("error at fetching participant")
            }
        })();
    }, [])
    const handleRegister = async () => {
        try {
            await axiosInstance.post('/events/addparticipant', { id: event.id, participantId: user.id })
            toast.success("Thank you for registering")
        } catch (e) {
            toast.error("Error at register")
        }

    }

    //   console.log(event)
    return (
        <Dialog>
            <div className="flex flex-col h-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                <DialogTrigger>
                    <div className="relative h-44 cursor-pointer overflow-hidden">
                        {!imgError && event.image ? (
                            <img
                                src={event.image}
                                alt={event.title}
                                onError={() => setImgError(true)}
                                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                                <CalendarIcon className="w-10 h-10 text-gray-400" />
                            </div>
                        )}

                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/80 dark:bg-neutral-800/70 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                            {event.category}
                        </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="flex flex-col items-start">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 tracking-tight">
                                {event.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {formatDate(event.date)}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-200 dark:border-gray-800">
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                ₹ {event.price === 0 ? "Free" : event.price}
                            </span>

                            <Button
                                className={cn(
                                    "bg-violet-600 hover:bg-violet-700 cursor-pointer text-white text-sm rounded-lg transition-all duration-300 flex items-center"
                                )}
                            >
                                <Ticket className="w-4 h-4 mr-1" /> See More
                            </Button>
                        </div>
                    </div>
                </DialogTrigger>
            </div>

            <DialogContent className="max-w-md w-full rounded-xl p-0 overflow-hidden border border-gray-100 bg-white shadow-2xl">
                <div className="relative">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-52 object-cover brightness-95"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 shadow-sm">
                        {event.category}
                    </span>
                </div>

                <div className="px-6 py-4">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold tracking-tight mb-1">
                            {event.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 mb-5 leading-relaxed">
                            {event.desc}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-wrap gap-2 mb-5">
                        {event.tags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-3 text-sm text-gray-700">
                        <p className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500" />
                            {new Date(event.date).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                        <p className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-500" />
                            {event.location}
                        </p>
                        <p className="flex items-center gap-2">
                            <BarChart size={16} className="text-gray-500" />
                            Difficulty: {event.difficulty}
                        </p>
                        <p className="flex items-center gap-2">
                            <Users size={16} className="text-gray-500" />
                            {event.capacity} spots
                        </p>
                        <p className="flex items-center gap-2">
                            <IndianRupee size={16} className="text-gray-500" />
                            {event.price === 0 ? "Free" : event.price}
                        </p>
                    </div>

                    {registered ? (
                        <button
                            disabled
                            className="mt-6 w-full bg-green-600 cursor-default text-white font-semibold py-3 rounded-lg shadow-lg border border-green-700 select-none"
                        >
                            Already Registered
                        </button>
                    ) : (
                        <button
                            onClick={handleRegister}
                            className="mt-6 w-full bg-violet-600 hover:bg-violet-700 cursor-pointer text-white font-semibold py-3 rounded-lg shadow-lg border border-violet-700 transition focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
                        >
                            Register Now
                        </button>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    )
}