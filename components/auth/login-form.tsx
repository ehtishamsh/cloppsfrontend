"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { authService } from "@/services/auth"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    
    try {
      const user = await authService.login(data.email, data.password)
      
      console.log("Login User:", user)
      
      if (user.role === "marketplace") {
        toast.success("Welcome to Marketplace Dashboard!")
        router.push("/marketplace/events")
      } else if (user.role === "bidder") {
        toast.success("Welcome to Bidder Dashboard!")
        router.push("/bidder")
      } else {
        toast.success("Welcome to Cosigner Dashboard!")
        router.push("/cosigner")
      }
    } catch (error) {
      toast.error("Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMockLogin = (type: "marketplace" | "cosigner" | "bidder") => {
    if (type === "marketplace") {
      form.setValue("email", "admin@clopps.com")
      form.setValue("password", "admin123")
    } else if (type === "bidder") {
      form.setValue("email", "john@example.com")
      form.setValue("password", "bidder123")
    } else {
      form.setValue("email", "jane@example.com")
      form.setValue("password", "cosigner123")
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>Mock Login Credentials</AlertTitle>
        <AlertDescription className="space-y-2">
          <div className="mt-2 space-y-1">
            <p className="font-medium">Marketplace Admin:</p>
            <p className="text-sm">Email: <code className="bg-muted px-1 rounded">admin@clopps.com</code></p>
            <p className="text-sm">Password: <code className="bg-muted px-1 rounded">admin123</code></p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleMockLogin("marketplace")}
              className="mt-1"
            >
              Fill Admin Credentials
            </Button>
          </div>
          <div className="mt-3 space-y-1">
            <p className="font-medium">Cosigner:</p>
            <p className="text-sm">Email: <code className="bg-muted px-1 rounded">jane@example.com</code></p>
            <p className="text-sm">Password: <code className="bg-muted px-1 rounded">cosigner123</code></p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleMockLogin("cosigner")}
              className="mt-1"
            >
              Fill Cosigner Credentials
            </Button>
          </div>
          <div className="mt-3 space-y-1">
            <p className="font-medium">Bidder:</p>
            <p className="text-sm">Email: <code className="bg-muted px-1 rounded">john@example.com</code></p>
            <p className="text-sm">Password: <code className="bg-muted px-1 rounded">bidder123</code></p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleMockLogin("bidder")}
              className="mt-1"
            >
              Fill Bidder Credentials
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  )
}
