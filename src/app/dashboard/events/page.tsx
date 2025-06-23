import React from 'react'

function Event() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 space-y-8">
  <div className="text-center">
    <h1 className="text-4xl font-bold mb-2">📅 Upcoming Events</h1>
    <p className="text-muted-foreground text-sm">Stay updated. Stay involved.</p>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      {
        title: "Hackathon 2025",
        date: "July 10, 2025",
        location: "Online",
        desc: "A 24-hour coding challenge to build real-world apps.",
      },
      {
        title: "Dev Conference",
        date: "Aug 15, 2025",
        location: "Bangalore",
        desc: "Talks, workshops, and networking with tech enthusiasts.",
      }
    ].map((event, i) => (
      <div key={i} className="rounded-xl border p-6 bg-white dark:bg-zinc-900 shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold">{event.title}</h3>
        <p className="text-sm text-muted-foreground">{event.date} · {event.location}</p>
        <p className="mt-2 text-sm">{event.desc}</p>
        <button className="mt-4 px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-500">
          Register
        </button>
      </div>
    ))}
  </div>
</div>

  )
}

export default Event