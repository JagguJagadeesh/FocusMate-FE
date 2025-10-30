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
import { signupUser } from '@/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import useUserStore from "@/stores/useUserStore"
import { toast } from "sonner"
import { Eye, EyeOff, Mail, Lock, User, Loader2, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { withoutAuth } from '@/utils/AuthWarpper'

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
    <div className="min-h-screen flex">

      {/* Left Side - Form Section (Full Width) */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-6 sm:px-8 py-2 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Get Started
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create your account and start your study journey with FocusMate
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            placeholder="John Doe"
                            className="pl-12 h-12 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-base"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />

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
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Password
                      </FormLabel>
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

                      {/* Password Strength Indicators */}
                      {password && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 ${passwordStrength.hasLength ? 'text-green-500' : 'text-gray-300'}`} />
                              <span className={`text-xs ${passwordStrength.hasLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                6+ characters
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 ${passwordStrength.hasLower ? 'text-green-500' : 'text-gray-300'}`} />
                              <span className={`text-xs ${passwordStrength.hasLower ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                Lowercase
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 ${passwordStrength.hasUpper ? 'text-green-500' : 'text-gray-300'}`} />
                              <span className={`text-xs ${passwordStrength.hasUpper ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                Uppercase
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 ${passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-300'}`} />
                              <span className={`text-xs ${passwordStrength.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                Number
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                {/* Sign Up Button - Simple Design */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
                      Already have an account?
                    </span>
                  </div>
                </div>

                {/* Sign In Link */}
                <div className="text-center">
                  <Link
                    href="/auth/signin"
                    className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline transition-colors"
                  >
                    Sign in instead
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
            className="mt-2 text-center"
          >
            <p className="text-xs text-gray-500 dark:text-gray-500">
              By creating an account, you agree to our{' '}
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

export default withoutAuth(Signup)
