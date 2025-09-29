'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import analyticsPic from '@/images/chatbotpic.png'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { signinUser } from '@/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import useUserStore from "@/stores/useUserStore"
import { toast } from "sonner"
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { withoutAuth } from '@/utils/AuthWarpper'
import ProductLogo from '@/components/ProductLogo'

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

function Login() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const setUser = useUserStore(state => state.setUser)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const data = await signinUser(values)
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      })
      toast.success("Welcome back!", {
        description: "You've been signed in successfully.",
      })
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Sign in failed:', err.response?.data?.message || err.message)
      toast.error("Sign in failed", {
        description: err.response?.data?.message || "Please check your credentials.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex bg-white dark:text-white dark:bg-black overflow-hidden">
      {/* Left Side - Image Section */}
      <div className="w-full h-full lg:w-2/5 flex items-center justify-center px-4 py-6 ">
        <div className="w-full max-w-sm">


          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-6">
                  {/* Header */}
                  <div className="text-center mb-5">
                    <div className='flex w-full justify-center mb-2'><ProductLogo /></div>

                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Don&apos;t have an account?{' '}
                      <Link
                        href="/auth/signup"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                      >
                        Create one
                      </Link>
                    </p>
                  </div>

                  <div className="space-y-4">
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
                                className="pl-10 h-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Password
                            </FormLabel>
                            <Link
                              href="/#"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10 h-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Sign In Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 text-sm font-medium bg-violet-500 hover:bg-violet-700 active:bg-violet-800 text-white rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </Button>

                  </div>

                  {/* Terms */}
                  <div className="mt-4 text-center">
                    <p className="text-[10px] text-gray-500 dark:text-gray-500">
                      By signing in, you agree to our{' '}
                      <Link href="/#" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/#" className="text-blue-600 dark:text-blue-400 hover:underline">
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
      <div className="hidden lg:flex lg:w-3/5 h-full pb-7 relative overflow-hidden">
        {/* Full coverage background image */}
        <Image
          src={analyticsPic}
          alt="FocusMate Analytics Dashboard"
          fill
          priority
          style={{
            objectFit: 'cover',
          }}
          className="absolute inset-0"
        />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-end items-end p-8 text-white w-full h-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-4">
              Welcome back to{' '}
              <span className="">
                Focus<span className='bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>Mate</span>
              </span>
            </h2>
            <p className="text-xl opacity-90 leading-relaxed max-w-md">
              Continue your productivity journey with powerful analytics and insights
            </p>
          </motion.div>
        </div>
      </div>




    </div>
  )
}

export default withoutAuth(Login)
