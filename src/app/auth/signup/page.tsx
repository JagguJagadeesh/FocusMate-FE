'use client'
import Image from "next/image"
import logo from '@/lib/hatlogo.jpeg'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signupUser } from "@/services/authService"
import { useRouter } from "next/navigation"
import useUserStore from "@/stores/useUserStore"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})



function Signup() {
      const setUser = useUserStore(state=>state.setUser)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email:"",
      password:""
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>)=>{
    try {
      const data = await signupUser(values)
      if(!data) console.log("problem signingup");
      setUser({
        id:data.user.id,
        name:data.user.name,
        email:data.user.email
      })
      router.push('/dashboard')
      // console.log('User signed up:', data)
    } catch (err: any) {
      console.error('Signup failed:', err.response?.data?.message || err.message)
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
          <p className="text-2xl font-bold">Sign up to FocusMate</p>
          <p className="text-gray-500 text-sm mb-3">Already have Account ? <Link href='/auth/signin' className="text-blue-500">Login</Link></p>
        </div>
        <div>
          <Button className="w-full bg-black text-white px-36">Continue with Google</Button>
        </div>
        <Separator className="my-4"/>
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
          <Button type="submit" className="mt-2">Create account</Button>
        </div>
      </div>
      </form>
      </Form>
      <div >
        <p className="text-xs mt-4 text-gray-400 ">By creating an account, your agree to the <span className="underline text-blue-500">Terms & Conditions</span></p>
      </div>
    </div>
  )
}

export default Signup