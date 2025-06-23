import React from 'react'
import Image from 'next/image'

const reviews = [
  {
    name: 'Aarav Mehta',
    role: 'CS Student @ BITS Pilani',
    quote:
      'FocusMate helped me crack my GATE preparation. I could track my study sessions and avoid distractions. Highly recommended!',
    img: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    name: 'Diya Sharma',
    role: 'Product Designer @ Zoho',
    quote:
      'I use FocusMate to organize design sprints. The clean interface and AI suggestions keep me productive!',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    name: 'Kabir Verma',
    role: 'Freelance Developer',
    quote:
      'The calendar sync, smart reminders, and habit tracker are life-changing. My productivity shot up 2x!',
    img: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    name: 'Riya Sen',
    role: 'MBA Aspirant',
    quote:
      'FocusMate gives me structure and clarity in my CAT prep. The analytics are simple but powerful.',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
  },
]

const StarRating = () => (
  <div className="flex gap-1">
    {Array(5)
      .fill(0)
      .map((_, i) => (
        <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967 4.174.012c.97.003 1.371 1.243.588 1.81l-3.375 2.457 1.272 3.96c.295.917-.755 1.68-1.538 1.118L10 13.347l-3.358 2.904c-.783.562-1.833-.2-1.538-1.118l1.272-3.96-3.375-2.457c-.783-.567-.382-1.807.588-1.81l4.174-.012 1.286-3.967z" />
        </svg>
      ))}
  </div>
)

const TestimonialCard = ({ name, role, quote, img }: typeof reviews[0]) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
    <div className="flex items-center gap-4">
      <Image src={img} alt={name} width={56} height={56} className="rounded-full object-cover" />
      <div>
        <h4 className="text-lg font-semibold">{name}</h4>
        <p className="text-sm uppercase font-medium text-muted-foreground">{role}</p>
        <StarRating />
      </div>
    </div>
    <p className="mt-4 text-gray-600 text-base leading-relaxed">“{quote}”</p>
  </div>
)

export default function ReviewLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 px-4 mt-6">
      {reviews.map((review, i) => (
        <TestimonialCard key={i} {...review} />
      ))}
    </div>
  )
}
