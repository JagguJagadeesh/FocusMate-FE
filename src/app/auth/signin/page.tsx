'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import logo from '@/lib/hatlogo.jpeg'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { signinUser } from '@/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import useUserStore from "@/stores/useUserStore";
import { toast } from "sonner"



const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})


function Login() {
    const setUser = useUserStore(state=>state.setUser)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email:"",
      password:""
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>)=>{
    try {
      const data =  await signinUser(values)
      setUser({
        id:data.user.id,
        name:data.user.name,
        email:data.user.email
      })
      toast.success("Signed in successfully!", {
      description: "Welcome back!",
      duration: 3000})
      router.push('/dashboard')
      } catch (err: any) {
    console.error('Signup failed:', err.response?.data?.message || err.message)
    toast.error("Sign in failed", {
      description: "Please check your credentials.",
    });
  }
}

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div>
        <Link href='/'><Image src={logo} width={40} height={40} className="mb-4 rounded-sm" alt=""  /></Link>
          
      </div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex flex-col gap-3 border rounded-lg shadow-2xl px-6 py-8">
        <div className="flex flex-col gap-4 items-center">
          <p className="text-2xl font-bold">Sign in to FocusMate</p>
          <p className="text-gray-500 text-sm mb-1">Don`t have Account ? <Link href='/auth/signup' className="text-blue-500">Register</Link></p>
        </div>
        <Separator className="my-4"/>
        <div className="flex flex-col gap-2">
          
          {/* Email Field */}
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

          {/* Password Field */}
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
          <Button type="submit" className="mt-2 px-40">Sign in</Button>
        </div>
      </div>
      </form>
      </Form>
    </div>
  )
}

export default Login