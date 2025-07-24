'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, Bot, User, Sparkles, Minimize2, Maximize2, Minus, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getAIResponse } from '@/lib/chatService'
import { toast } from 'sonner'

type Message = {
  sender: 'user' | 'bot'
  text: string
  timestamp?: Date
  id?: string
}

type ChatState = 'closed' | 'normal' | 'expanded' | 'minimized'

export default function ChatBotPopup() {
  const [chatState, setChatState] = useState<ChatState>('closed')
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'bot', 
      text: '👋 Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
      id: 'welcome-message'
    },
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('chatbot-state')
    if (savedState) {
      const { chatState: savedChatState, messages: savedMessages } = JSON.parse(savedState)
      setChatState(savedChatState || 'closed')
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
        })))
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatbot-state', JSON.stringify({
      chatState,
      messages: messages.slice(-50)
    }))
  }, [chatState, messages])

  const handleOpen = () => setChatState('normal')
  const handleClose = () => setChatState('closed')
  const handleMinimize = () => setChatState('minimized')
  const handleExpand = () => setChatState('expanded')
  const handleNormal = () => setChatState('normal')

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMsg: Message = { 
      sender: 'user', 
      text: input,
      timestamp: new Date(),
      id: `user-${Date.now()}`
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const reply = await getAIResponse(input)
      setIsTyping(false)
      setMessages((prev) => [...prev, { 
        sender: 'bot', 
        text: reply,
        timestamp: new Date(),
        id: `bot-${Date.now()}`
      }])
    } catch (error) {
      setIsTyping(false)
      setMessages((prev) => [...prev, { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        id: `error-${Date.now()}`
      }])
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  useEffect(() => {
    if (chatState !== 'minimized') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, chatState])

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const isNewDay = (currentMsg: Message, prevMsg?: Message) => {
    if (!prevMsg) return true
    const currentDate = new Date(currentMsg.timestamp!).toDateString()
    const prevDate = new Date(prevMsg.timestamp!).toDateString()
    return currentDate !== prevDate
  }

  // Get chat dimensions based on state
  const getChatDimensions = () => {
    switch (chatState) {
      case 'normal':
        return {
          width: 'w-96',
          height: 'h-[500px]',
          maxWidth: 'max-w-[calc(100vw-3rem)]',
          position: 'bottom-4 right-6',
          containerClass: ''
        }
      case 'expanded':
        return {
          width: 'min-w-full',
          height: 'h-screen',
          maxWidth: '',
          position: '',
          containerClass: 'rounded-none border-0 shadow-none'
        }
      default:
        return {
          width: 'w-96',
          height: 'h-[500px]',
          maxWidth: 'max-w-[calc(100vw-3rem)]',
          position: 'bottom-4 right-6',
          containerClass: ''
        }
    }
  }

  const dimensions = getChatDimensions()

  return (
    <>
      {/* Floating Open Button - Only shows when chat is closed */}
      <AnimatePresence>
        {chatState === 'closed' && (
          <motion.div
            className="fixed bottom-4 right-6 z-50"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="relative w-14 h-14 rounded-full shadow-2xl cursor-pointer flex items-center justify-center transition-all duration-300 overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <motion.div
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                className="relative"
              >
                <Bot  className="w-6 h-6 text-white" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                />
              </motion.div>
            </motion.button>

            {/* Notification badge */}
            {messages.length > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
              >
                {messages.filter(m => m.sender === 'bot').length - 1 > 9 ? '9+' : messages.filter(m => m.sender === 'bot').length - 1}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Chat Indicator */}
      <AnimatePresence>
        {chatState === 'minimized' && (
          <motion.div
            className="fixed bottom-4 right-6 z-50"
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNormal}
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl backdrop-blur-xl"
            >
              <Avatar className="w-8 h-8 border-2 border-white/30">
                <AvatarFallback className="bg-white/20 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-semibold">ChatMate</p>
                <p className="text-xs opacity-80">Click to open</p>
              </div>
              {isTyping && (
                <div className="flex space-x-1 ml-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                  ))}
                </div>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Box */}
      <AnimatePresence>
        {(chatState === 'normal' || chatState === 'expanded') && (
          <motion.div
            key={chatState}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed ${dimensions.position} ${dimensions.width} ${dimensions.height} ${dimensions.maxWidth} ${dimensions.containerClass} border-0 rounded-3xl flex flex-col overflow-hidden z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10`}
          >
            {/* Enhanced Header with Controls */}
            <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white px-6 py-4">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <Avatar className="w-12 h-12 border-2 border-white/30 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-white/20 to-white/10 text-white backdrop-blur-sm">
                          <Bot className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      ChatMate
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <p className="text-sm text-white/90">
                        AI Assistant • {chatState === 'expanded' ? 'Expanded Mode' : 'Normal Mode'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleMinimize}
                    className="p-2 rounded-xl hover:bg-white/20 transition-all duration-200"
                    title="Minimize"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={chatState === 'expanded' ? handleNormal : handleExpand}
                    className="p-2 rounded-xl hover:bg-white/20 transition-all duration-200"
                    title={chatState === 'expanded' ? 'Normal Size' : 'Expand Full Width'}
                  >
                    {chatState === 'expanded' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="p-2 rounded-xl hover:bg-white/20 transition-all duration-200"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Enhanced Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/50">
              <div className={`py-4 space-y-1 ${chatState === 'expanded' ? 'max-w-5xl mx-auto px-6' : 'px-4'}`}>
                {messages.map((msg, idx) => {
                  const showDateSeparator = isNewDay(msg, messages[idx - 1])
                  const showTimestamp = idx === 0 || 
                    (msg.timestamp && messages[idx - 1]?.timestamp && 
                     new Date(msg.timestamp).getTime() - new Date(messages[idx - 1].timestamp!).getTime() > 300000) // 5 minutes

                  return (
                    <div key={msg.id || idx}>
                      {/* Date Separator */}
                      {showDateSeparator && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-center my-6"
                        >
                          <Badge variant="secondary" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-sm">
                            {new Date(msg.timestamp!).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Badge>
                        </motion.div>
                      )}

                      {/* Message */}
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          delay: idx * 0.05, 
                          duration: 0.4,
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }}
                        className={`group flex gap-3 mb-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Enhanced Avatar */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex-shrink-0"
                        >
                          <Avatar className="w-10 h-10 shadow-lg ring-2 ring-white/20">
                            <AvatarFallback 
                              className={msg.sender === 'user' 
                                ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 text-white shadow-inner' 
                                : 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-inner'
                              }
                            >
                              {msg.sender === 'user' ? (
                                <User className="w-5 h-5" />
                              ) : (
                                <Bot className="w-5 h-5" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>

                        {/* Enhanced Message Bubble */}
                        <div className={`flex flex-col ${chatState === 'expanded' ? 'max-w-[70%]' : 'max-w-[75%]'} ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          <motion.div
                            whileHover={{ scale: 1.01, y: -1 }}
                            className={`relative group/message ${
                              msg.sender === 'user'
                                ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 text-white shadow-xl'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xl ring-1 ring-slate-200/50 dark:ring-slate-700/50'
                            } px-4 py-3 rounded-2xl ${
                              msg.sender === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                            } backdrop-blur-sm transition-all duration-200`}
                          >
                            {/* Message Content */}
                            <p className={`${chatState === 'expanded' ? 'text-base' : 'text-sm'} leading-relaxed whitespace-pre-wrap font-medium`}>
                              {msg.text}
                            </p>

                            {/* Message Actions (for bot messages) */}
                            {msg.sender === 'bot' && (
                              <div className="opacity-0 group-hover/message:opacity-100 transition-opacity duration-200 absolute -bottom-2 right-2 flex gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => copyToClipboard(msg.text)}
                                  className="p-1.5 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ring-1 ring-slate-200 dark:ring-slate-600"
                                  title="Copy message"
                                >
                                  <Copy className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1.5 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ring-1 ring-slate-200 dark:ring-slate-600"
                                  title="Good response"
                                >
                                  <ThumbsUp className="w-3 h-3 text-green-600" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1.5 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ring-1 ring-slate-200 dark:ring-slate-600"
                                  title="Poor response"
                                >
                                  <ThumbsDown className="w-3 h-3 text-red-600" />
                                </motion.button>
                              </div>
                            )}

                            {/* Glow Effect */}
                            <div className={`absolute inset-0 rounded-2xl ${
                              msg.sender === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                            } ${
                              msg.sender === 'user' 
                                ? 'bg-gradient-to-br from-purple-400/20 to-blue-400/20' 
                                : 'bg-gradient-to-br from-emerald-400/10 to-teal-400/10'
                            } opacity-0 group-hover/message:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                          </motion.div>

                          {/* Timestamp */}
                          {(showTimestamp || msg.timestamp) && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="text-xs text-slate-500 dark:text-slate-400 mt-1 px-2 font-medium"
                            >
                              {formatTime(msg.timestamp!)}
                            </motion.p>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  )
                })}

                {/* Enhanced Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="flex gap-3 mb-4"
                    >
                      <Avatar className="w-10 h-10 shadow-lg ring-2 ring-white/20">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-inner">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl rounded-tl-sm shadow-xl ring-1 ring-slate-200/50 dark:ring-slate-700/50 backdrop-blur-sm">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ 
                                scale: [1, 1.4, 1], 
                                opacity: [0.4, 1, 0.4],
                                y: [0, -2, 0]
                              }}
                              transition={{ 
                                duration: 1.2, 
                                repeat: Infinity, 
                                delay: i * 0.2,
                                ease: "easeInOut"
                              }}
                              className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Enhanced Input Area */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50">
              <div className={`p-4 ${chatState === 'expanded' ? 'max-w-5xl mx-auto' : ''}`}>
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      disabled={isTyping}
                      className={`pr-16 resize-none ${chatState === 'expanded' ? 'min-h-[52px] text-base' : 'min-h-[48px]'} rounded-2xl border-2 border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:border-purple-500/50 dark:focus:border-purple-400/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 shadow-sm font-medium placeholder:text-slate-400`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600">
                        {input.length}/500
                      </Badge>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className={`${chatState === 'expanded' ? 'w-14 h-14' : 'w-12 h-12'} rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 hover:from-purple-600 hover:via-purple-700 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      <motion.div
                        whileTap={{ scale: 0.8 }}
                        className="relative flex items-center justify-center"
                      >
                        <Send className={`${chatState === 'expanded' ? 'w-6 h-6' : 'w-5 h-5'}`} />
                      </motion.div>
                    </Button>
                  </motion.div>
                </div>
                
                {/* Enhanced Quick Actions */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {['Help', 'Examples', 'Features', 'Documentation', 'Support'].map((action, index) => (
                    <motion.button
                      key={action}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setInput(`Tell me about ${action.toLowerCase()}`)}
                      className="px-4 py-2 text-xs font-medium rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-200 border border-slate-300 dark:border-slate-600 shadow-sm hover:shadow-md"
                    >
                      {action}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
