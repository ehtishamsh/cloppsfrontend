"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { eventService, type Event } from "@/services/events"

const eventSchema = z.object({
  name: z.string().min(5, "Event name must be at least 5 characters"),
  startDate: z.date({
    error: (issue) =>
      issue.input === undefined
        ? "Event date is required"
        : "Invalid date",
  }),
  time: z.string().min(1, "Time is required"),
  location: z.string().optional(),
  status: z.enum(["Draft", "Scheduled", "Live", "Ended", "Closed"]),
  description: z.string().optional(),
  commissionRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "Rate must be between 0 and 100",
  }),
  taxRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "Rate must be between 0 and 100",
  }),
  buyersPremium: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "Rate must be between 0 and 100",
  }),
})

type FormData = z.infer<typeof eventSchema>

interface EventFormProps {
  event?: Event
  mode: "create" | "edit"
}

export function EventForm({ event, mode }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event?.name || "",
      startDate: event?.startDate ? new Date(event.startDate) : undefined,
      time: event?.startDate ? format(new Date(event.startDate), "HH:mm") : "09:00",
      location: event?.location || "TBD",
      status: (event?.status as any) || "Draft",
      description: event?.description || "",
      commissionRate: event?.commissionRate?.toString() || "10",
      taxRate: event?.taxRate?.toString() || "8",
      buyersPremium: event?.buyersPremium?.toString() || "15",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    
    try {
      // Combine Date and Time
      const dateTime = new Date(data.startDate)
      const [hours, minutes] = data.time.split(":").map(Number)
      dateTime.setHours(hours, minutes)

      // Default End Date to 4 hours later
      const endDateTime = new Date(dateTime)
      endDateTime.setHours(endDateTime.getHours() + 4)

      const eventData = {
        name: data.name,
        startDate: dateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        location: data.location || "TBD",
        status: data.status,
        description: data.description,
        commissionRate: Number(data.commissionRate),
        taxRate: Number(data.taxRate),
        buyersPremium: Number(data.buyersPremium),
      }

      if (mode === "edit" && event) {
        await eventService.updateEvent(event.id, eventData)
        toast.success("Event updated successfully")
      } else {
        await eventService.createEvent(eventData)
        toast.success("Event created successfully")
      }
      
      router.push("/marketplace/events")
    } catch (error) {
      toast.error(`Failed to ${mode} event`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Spring Classic Car Auction" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Ended">Ended</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Hidden */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Financial Settings</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Tax Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buyersPremium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buyer&apos;s Premium (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the event..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/marketplace/events">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "edit" ? "Update Event" : "Create Draft Event"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
