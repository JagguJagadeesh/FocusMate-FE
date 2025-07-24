'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Mail, MessageSquare, User, Brain, Target, Zap, Users, Clock, Star } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(10, "Message should be at least 10 characters."),
})

function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Contact submission:", values)
    toast.success("Message sent!", {
      description: "Thanks for reaching out. We'll get back to you soon!",
    })
    form.reset()
  }

  return (
    <>
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative ">
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div> */}
        
        <div className="relative h-full flex">
          {/* Left Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12"
          >
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/30 mb-4">
                  <span className="text-xs font-medium text-indigo-300">✨ Get in Touch</span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-3">Contact Us</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Have questions about FocusMate? We&apos;re here to help you maximize your study potential.
                </p>
              </div>

              {/* Contact Form */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                
                <div className="relative z-10">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  placeholder="Your Name"
                                  {...field}
                                  className="pl-10 h-11 text-sm rounded-lg border-0 bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all duration-300"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400 mt-1 text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  placeholder="you@example.com"
                                  type="email"
                                  {...field}
                                  className="pl-10 h-11 text-sm rounded-lg border-0 bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all duration-300"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400 mt-1 text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Textarea
                                  placeholder="Tell us about your study goals or questions..."
                                  rows={4}
                                  {...field}
                                  className="pl-10 pt-3 text-sm rounded-lg border-0 bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all duration-300 resize-none"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400 mt-1 text-xs" />
                          </FormItem>
                        )}
                      />

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-11 text-sm font-semibold tracking-wide text-white rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl border-0"
                        >
                          Send Message
                          <motion.div
                            className="ml-2"
                            initial={{ x: 0 }}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            →
                          </motion.div>
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </div>
              </div>

              {/* Quick Contact Info */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: "⚡", title: "Fast Response" },
                  { icon: "🎯", title: "Focused Support" },
                  { icon: "🚀", title: "Always Improving" }
                ].map((item, index) => (
                  <div key={index} className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="text-lg mb-1">{item.icon}</div>
                    <h3 className="font-medium text-white text-xs">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex w-1/2 flex-col justify-center p-12"
          >
            <div className="max-w-lg">
              {/* Product Header */}
              <div className="mb-8">
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-4">
                  FocusMate
                </h1>
                <p className="text-xl font-medium text-purple-200 mb-4">
                  Your Personal Study Planner, Reinvented
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Transform your study sessions with AI-powered productivity tools designed to maximize your learning potential and academic success.
                </p>
              </div>

              {/* Key Features */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                    <Brain className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Learning</h3>
                    <p className="text-gray-300 text-sm">Personalized study plans that adapt to your learning style and progress.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                    <Target className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Smart Goal Setting</h3>
                    <p className="text-gray-300 text-sm">Set achievable milestones and track your progress with intelligent insights.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                    <Zap className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Focus Enhancement</h3>
                    <p className="text-gray-300 text-sm">Built-in tools to eliminate distractions and maintain deep focus sessions.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                    <Clock className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Time Management</h3>
                    <p className="text-gray-300 text-sm">Advanced scheduling and time-blocking features for optimal productivity.</p>
                  </div>
                </div>
              </div>

              {/* Stats or Testimonial */}
              <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-white font-semibold">4.9/5</span>
                </div>
                <blockquote className="text-gray-300 text-sm italic mb-3">
                  {'"'}FocusMate completely transformed how I approach studying. My productivity increased by 300% in just two weeks!{'"'}
                </blockquote>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Sarah M.</p>
                    <p className="text-gray-400 text-xs">Medical Student</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default ContactPage
