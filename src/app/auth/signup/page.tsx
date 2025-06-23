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
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

function Signup() {
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = await signupUser(values)
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      })
      toast.success("Account created!", {
        description: "Thank you. Have a great day!",
      })
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Signup failed:', err.response?.data?.message || err.message)
      toast.error("Signup failed", {
        description: "Email may already be in use.",
      })
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Link href="/">
            <Image src={logo} width={55} height={40} alt="FocusMate Logo" className="rounded" />
          </Link>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border border-gray-300 bg-white dark:bg-neutral-900 shadow-xl rounded-xl p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-1">Create your <span className="text-blue-500">FocusMate</span> account</h1>
              <p className="text-sm text-muted-foreground">Already have an account? <Link href="/auth/signin" className="text-blue-500 underline">Login</Link></p>
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button type="submit" className="w-full text-lg">Create account</Button>
          </form>
        </Form>

        <p className="text-xs mt-4 text-center text-muted-foreground">
          By creating an account, you agree to our <span className="underline text-blue-500">Terms & Conditions</span>
        </p>
      </div>
    </div>
  )
}

export default Signup
