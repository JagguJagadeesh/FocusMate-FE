'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import authImage from '@/images/authimage.png'
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
    <div className="min-h-screen flex">

      {/* Left Side - Form Section (Full Width) */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-2 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Sign in to continue your study journey with FocusMate
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-12 h-12 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-base"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Password
                        </FormLabel>
                        <Link
                          href="/#"
                          className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline transition-colors font-medium"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-12 pr-12 h-12 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-base"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
                      New to FocusMate?
                    </span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <Link
                    href="/auth/signup"
                    className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline transition-colors"
                  >
                    Create a new account
                  </Link>
                </div>
              </form>
            </Form>
          </motion.div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-gray-500 dark:text-gray-500">
              By signing in, you agree to our{' '}
              <Link href="/#" className="text-violet-600 dark:text-violet-400 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/#" className="text-violet-600 dark:text-violet-400 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Image Section */}
      <div className="hidden lg:flex lg:w-7/12 relative overflow-hidden">
        {/* Background Image */}
        <Image
          src={authImage}
          alt="FocusMate Study Platform"
          fill
          priority
          className="object-fill"
        />
      </div>
    </div>
  )
}

export default withoutAuth(Login)
