'use client'
import Image from "next/image"
import logo from '@/lib/hatlogo.jpeg'
import analyticsPic from '@/images/chatbotpic.png'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signupUser } from "@/services/authService"
import { useRouter } from "next/navigation"
import useUserStore from "@/stores/useUserStore"
import { toast } from "sonner"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, CheckCircle, Zap, Shield, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import React from 'react'

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
    .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter.")
    .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter.")
    .regex(/(?=.*\d)/, "Password must contain at least one number."),
})

function Signup() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const setUser = useUserStore(state => state.setUser)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  const password = form.watch("password")
  
  const passwordStrength = {
    hasLower: /(?=.*[a-z])/.test(password),
    hasUpper: /(?=.*[A-Z])/.test(password),
    hasNumber: /(?=.*\d)/.test(password),
    hasLength: password.length >= 6
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const data = await signupUser(values)
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      })
      toast.success("Welcome to FocusMate!", {
        description: "Your account has been created successfully.",
      })
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Signup failed:', err.response?.data?.message || err.message)
      toast.error("Account creation failed", {
        description: err.response?.data?.message || "Email may already be in use.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex bg-white dark:bg-black overflow-hidden">
      {/* Left Side - Image Section */}
      <div className="hidden w-full lg:flex lg:w-1/2 relative ">
        {/* Content Overlay */}
        <div className="relative w-full z-10 flex flex-col justify-center p-8 text-center h-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold text-black dark:text-white mb-3">
              Join{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FocusMate
              </span>{' '}
              Today
            </h2>
            <p className="text-lg text-black dark:text-white max-w-sm mx-auto leading-relaxed">
              Start your productivity journey with powerful analytics and AI-driven insights
            </p>
          </motion.div>

          {/* Analytics Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-md mx-auto mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-3  rounded-2xl blur-xl"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-3">
                <Image
                  src={analyticsPic}
                  alt="FocusMate Analytics Dashboard"
                  className="w-full h-auto rounded-xl"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-1">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs font-medium text-black dark:text-white">Fast Setup</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-1">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xs font-medium text-black dark:text-white">Secure</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-1">
                <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs font-medium text-black dark:text-white">Free Forever</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-6 ">
        <div className="w-full max-w-sm">
          {/* Logo Section */}
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image 
                  src={logo} 
                  width={56} 
                  height={56} 
                  alt="FocusMate Logo" 
                  className="relative rounded-md shadow-lg group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
            </Link>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
                      Create your account
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                      Join{' '}
                      <span className="font-semibold text-blue-600 dark:text-blue-400">FocusMate</span>{' '}
                      and boost your productivity
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Already have an account?{' '}
                      <Link 
                        href="/auth/signin" 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input 
                                placeholder="John Doe"
                                className="pl-10 h-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input 
                                type="email" 
                                placeholder="you@example.com"
                                className="pl-10 h-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10 h-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                {...field} 
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </FormControl>
                          
                          {/* Compact Password Strength Indicators */}
                          {password && (
                            <div className="mt-1 flex gap-2 text-[10px]">
                              <div className="flex items-center gap-1">
                                <CheckCircle className={`w-2 h-2 ${passwordStrength.hasLength ? 'text-green-500' : 'text-gray-300'}`} />
                                <span className={passwordStrength.hasLength ? 'text-green-600' : 'text-gray-500'}>6+</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className={`w-2 h-2 ${passwordStrength.hasLower ? 'text-green-500' : 'text-gray-300'}`} />
                                <span className={passwordStrength.hasLower ? 'text-green-600' : 'text-gray-500'}>a-z</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className={`w-2 h-2 ${passwordStrength.hasUpper ? 'text-green-500' : 'text-gray-300'}`} />
                                <span className={passwordStrength.hasUpper ? 'text-green-600' : 'text-gray-500'}>A-Z</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className={`w-2 h-2 ${passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-300'}`} />
                                <span className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>0-9</span>
                              </div>
                            </div>
                          )}
                          
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Create Account Button */}
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-9 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group mt-4"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create account
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Terms */}
                  <div className="mt-3 text-center">
                    <p className="text-[10px] text-gray-500 dark:text-gray-500">
                      By creating an account, you agree to our{' '}
                      <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Signup
