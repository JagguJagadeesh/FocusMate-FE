'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CalendarIcon, MapPin, Calendar, Users, IndianRupee, Clock, Loader2, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstence"
import useUserStore from "@/stores/useUserStore"
import { toast } from "sonner"

export default function EventCard({ event, formatDate, viewMode = 'grid' }) {
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
      toast.success("Registration successful!")
    } catch (e) {
      console.error("Error registering:", e)
      toast.error("Registration failed")
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div
          className={`group cursor-pointer bg-white dark:bg-gray-900 rounded-lg border 
                     hover:shadow-md transition-all ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
            }`}
        >
          {/* Image */}
          <div
            className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 
                       ${viewMode === 'list' ? 'sm:w-64 h-48 sm:h-auto' : 'h-48'} 
                       ${viewMode === 'grid' ? 'rounded-t-lg' : 'rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none'}`}
          >
            {!imgError && event.image ? (
              <img
                src={event.image}
                alt={event.title}
                onError={() => setImgError(true)}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <CalendarIcon className="w-12 h-12 text-gray-300 dark:text-gray-700" />
              </div>
            )}

            {/* Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-white dark:bg-gray-900 text-xs font-semibold rounded">
                {event.category}
              </span>
            </div>

            {event.price === 0 && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                  FREE
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 flex-1">
            <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">
              {event.title}
            </h3>

            {viewMode === 'list' && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {event.desc}
              </p>
            )}

            {/* Meta */}
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{event.registered}/{event.capacity} registered</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-1 font-semibold">
                <IndianRupee className="w-4 h-4" />
                {event.price === 0 ? 'Free' : event.price}
              </div>
              <Button size="sm" className="rounded-lg">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </DialogTrigger>

      {/* Dialog */}
      <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh] rounded-lg p-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Image */}
          <div className="relative h-48 sm:h-56 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
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

            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white dark:bg-gray-900 text-sm font-semibold rounded">
                {event.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Description */}
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-3">
                  {event.title}
                </DialogTitle>
              </DialogHeader>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {event.desc}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  Date
                </div>
                <p className="font-semibold">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
                <p className="font-semibold truncate">{event.location}</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Users className="w-4 h-4" />
                  Capacity
                </div>
                <p className="font-semibold">{event.capacity} people</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <IndianRupee className="w-4 h-4" />
                  Price
                </div>
                <p className="font-semibold">
                  {event.price === 0 ? 'Free' : `₹${event.price}`}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Clock className="w-4 h-4" />
                  Type
                </div>
                <p className="font-semibold">{event.type}</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Users className="w-4 h-4" />
                  Registered
                </div>
                <p className="font-semibold">{event.registered} people</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0 p-6 border-t">
            {isLoading ? (
              <div className="flex justify-center py-2">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : registered ? (
              <div className="flex items-center justify-center gap-2 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold">Already Registered</span>
              </div>
            ) : (
              <Button
                onClick={handleRegister}
                disabled={isRegistering}
                className="w-full rounded-lg h-11"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Now'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
