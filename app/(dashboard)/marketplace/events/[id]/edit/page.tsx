"use client"

import { useEffect, useState } from "react"
import { EventForm } from "@/components/dashboard/event-form"
import { eventService, type Event } from "@/services/events"
import { LoadingSkeleton } from "@/components/shared/loading"
import { useRouter } from "next/navigation"

export default async function EditEventPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  return <EditEventContent eventId={id} />
}

function EditEventContent({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadEvent()
  }, [eventId])

  const loadEvent = async () => {
    try {
      const data = await eventService.getEventById(eventId)
      if (data) {
        setEvent(data)
      } else {
        router.push("/marketplace/events")
      }
    } catch (error) {
      router.push("/marketplace/events")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!event) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
        <p className="text-muted-foreground">
          Update the details for {event.name}.
        </p>
      </div>
      <EventForm mode="edit" event={event} />
    </div>
  )
}
