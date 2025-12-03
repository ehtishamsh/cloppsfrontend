"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const buyerSchema = z.object({
  email: z.string().email("Invalid email address"),
  paddleNumber: z.string().optional(),
})

type FormData = z.infer<typeof buyerSchema>

interface InviteBuyerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (data: any) => void
  eventId: string
}

export function InviteBuyerDialog({ open, onOpenChange, onSuccess, eventId }: InviteBuyerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      email: "",
      paddleNumber: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const paddleNumber = data.paddleNumber || `${Math.floor(100 + Math.random() * 900)}`
      
      toast.success(`Invitation sent to ${data.email}`)
      toast.success(`Paddle number ${paddleNumber} assigned`)
      
      onSuccess({ ...data, paddleNumber })
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error("Failed to send invitation")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Buyer to Event</DialogTitle>
          <DialogDescription>
            Send an invitation email to enroll a buyer in this auction event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="buyer@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paddleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paddle Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Auto-assign if left blank" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
