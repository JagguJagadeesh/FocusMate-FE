'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import logo from '@/lib/hatlogo.jpeg'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { signinUser } from '@/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import useUserStore from "@/stores/useUserStore"
import { toast } from "sonner"

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

function Login() {
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
    try {
      const data = await signinUser(values)
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      })
      toast.success("Signed in successfully!", {
        description: "Welcome back!",
      })
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Sign in failed:', err.response?.data?.message || err.message)
      toast.error("Sign in failed", {
        description: "Please check your credentials.",
      })
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Link href="/">
            <Image src={logo} width={50} height={50} alt="FocusMate Logo" className="rounded" />
          </Link>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border border-gray-300 bg-white dark:bg-neutral-900 shadow-xl rounded-xl p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-1">Sign in to <span className="text-blue-500">FocusMate</span></h1>
              <p className="text-sm text-muted-foreground">Don’t have an account? <Link href="/auth/signup" className="text-blue-500 underline">Register</Link></p>
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full text-lg">Sign in</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Login
