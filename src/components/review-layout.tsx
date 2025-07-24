import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Aarav Mehta',
    role: 'CS Student @ BITS Pilani',
    quote: 'FocusMate helped me crack my GATE preparation. I could track my study sessions and avoid distractions. The AI study planner is a game-changer!',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    rating: 5,
    location: 'India'
  },
  {
    name: 'Diya Sharma',
    role: 'Product Designer @ Zoho',
    quote: 'I use FocusMate to organize design sprints. The clean interface and AI suggestions keep me productive. Love the analytics dashboard!',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    rating: 5,
    location: 'Chennai'
  },
  {
    name: 'Riya Sen',
    role: 'MBA Aspirant',
    quote: 'FocusMate gives me structure and clarity in my CAT prep. The analytics are simple but powerful. Best study companion ever!',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    rating: 5,
    location: 'Kolkata'
  },
  {
    name: 'Arjun Patel',
    role: 'JEE Aspirant',
    quote: 'The Pomodoro timer with custom focus sessions helped me maintain concentration for hours. Scored 99.2 percentile in JEE Advanced!',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    rating: 5,
    location: 'Ahmedabad'
  },
  {
    name: 'Sneha Reddy',
    role: 'Medical Student @ AIIMS',
    quote: 'Preparing for NEET was overwhelming until I found FocusMate. The progress tracking and streak counter kept me motivated throughout!',
    img: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    rating: 5,
    location: 'Hyderabad'
  },
  {
    name: 'Rahul Kumar',
    role: 'Software Engineer @ Microsoft',
    quote: 'Even as a working professional, FocusMate helps me upskill efficiently. The AI creates perfect learning schedules around my work hours.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    rating: 5,
    location: 'Bangalore'
  },
  {
    name: 'Priya Malhotra',
    role: 'CA Finalist',
    quote: 'Studying for CA Final was intense, but FocusMate made it manageable. The smart break reminders prevented burnout completely.',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    rating: 5,
    location: 'Delhi'
  },
  {
    name: 'Vikram Singh',
    role: 'UPSC Aspirant',
    quote: 'The comprehensive analytics helped me identify weak areas in my UPSC prep. Cleared prelims in my first attempt thanks to FocusMate!',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
    rating: 5,
    location: 'Lucknow'
  }
]

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array(5)
      .fill(0)
      .map((_, i) => (
        <svg 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967 4.174.012c.97.003 1.371 1.243.588 1.81l-3.375 2.457 1.272 3.96c.295.917-.755 1.68-1.538 1.118L10 13.347l-3.358 2.904c-.783.562-1.833-.2-1.538-1.118l1.272-3.96-3.375-2.457c-.783-.567-.382-1.807.588-1.81l4.174-.012 1.286-3.967z" />
        </svg>
      ))}
  </div>
)

const TestimonialCard = ({ name, role, quote, img, rating, location }: typeof reviews[0]) => (
  <motion.div 
    className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
  >
    {/* Gradient Background Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    {/* Quote Icon */}
    <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
      <Quote className="w-8 h-8 text-blue-500" />
    </div>

    <div className="relative z-10">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <Image 
            src={img} 
            alt={name} 
            width={64} 
            height={64} 
            className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors duration-300" 
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </h4>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {role}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={rating} />
            <span className="text-xs text-gray-500 dark:text-gray-500">
              • {location}
            </span>
          </div>
        </div>
      </div>

      {/* Quote */}
      <blockquote className="text-gray-700 dark:text-gray-300 text-base leading-relaxed italic">
        {quote}
      </blockquote>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
    </div>
  </motion.div>
)

export default function ReviewLayout() {
  // Shuffle and select random testimonials
  const shuffledReviews = React.useMemo(() => {
    const shuffled = [...reviews].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 6) // Show 6 random testimonials
  }, [])

  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-full text-sm font-medium text-amber-700 dark:text-amber-300 mb-4">
          <div className="flex">
            {Array(5).fill(0).map((_, i) => (
              <svg key={i} className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967 4.174.012c.97.003 1.371 1.243.588 1.81l-3.375 2.457 1.272 3.96c.295.917-.755 1.68-1.538 1.118L10 13.347l-3.358 2.904c-.783.562-1.833-.2-1.538-1.118l1.272-3.96-3.375-2.457c-.783-.567-.382-1.807.588-1.81l4.174-.012 1.286-3.967z" />
              </svg>
            ))}
          </div>
          <span>4.9/5 from 10,000+ users</span>
        </div>
      </motion.div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {shuffledReviews.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <TestimonialCard {...review} />
          </motion.div>
        ))}
      </div>

      {/* Bottom Stats */}
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Happy Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">98%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">4.9★</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
