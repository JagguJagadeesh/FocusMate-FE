import React from 'react'

function Team() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 space-y-8">
  <div className="text-center">
    <h1 className="text-4xl font-bold mb-2">👨‍💻 Meet the Team</h1>
    <p className="text-muted-foreground text-sm">Passionate. Skilled. Collaborative.</p>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[
      { name: "Alice", role: "Frontend Developer" },
      { name: "Bob", role: "Backend Developer" },
      { name: "Charlie", role: "DevOps Engineer" },
      { name: "Daisy", role: "UI/UX Designer" },
    ].map((member, i) => (
      <div key={i} className="rounded-xl bg-white dark:bg-zinc-900 border shadow-lg p-5 flex flex-col items-center text-center hover:shadow-xl transition">
        <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-xl font-bold text-blue-700">
          {member.name[0]}
        </div>
        <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
        <p className="text-sm text-muted-foreground">{member.role}</p>
      </div>
    ))}
  </div>
</div>

  )
}

export default Team