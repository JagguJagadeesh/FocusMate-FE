'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

type Message = {
  sender: 'user' | 'bot'
  text: string
}

export default function ChatBotPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! How can I help you today?' },
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    // const userMsg = { sender: 'user', text: input }
    // setMessages()
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: `You said: ${input}` }])
    }, 500)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsOpen(prev => !prev)}
          className="rounded-full border border-muted p-4 shadow-xl cursor-pointer flex items-center gap-2 backdrop-blur-sm bg-background/80"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Ask Mate</span>
        </motion.div>
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 max-w-[90%] h-96 border rounded-xl flex flex-col overflow-hidden z-50 bg-background/90 backdrop-blur-lg shadow-md">
          <div className="text-sm font-medium text-center py-2 border-b">
            ChatMate
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-muted text-right'
                    : 'bg-muted/50 text-left'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-2 border-t flex gap-2 bg-transparent">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} variant="ghost">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
