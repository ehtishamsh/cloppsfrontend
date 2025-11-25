"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cosignerService, type CosignerEvent } from "@/services/cosigner"
import { LoadingSkeleton } from "@/components/shared/loading"
import { EmptyState } from "@/components/shared/empty-state"

export function CosignerEventsList({ type = "available" }: { type?: "available" | "enrolled" }) {
  const [events, setEvents] = useState<CosignerEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [requestingId, setRequestingId] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await cosignerService.getAvailableEvents()
      // Filter events based on type
      const filtered = data.filter(event => {
        if (type === "available") {
          return event.enrollmentStatus === "not_enrolled" || event.enrollmentStatus === "pending"
        } else {
          return event.enrollmentStatus === "approved"
        }
      })
      setEvents(filtered)
    } catch (error) {
      toast.error("Failed to load events")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestEnrollment = async (eventId: string) => {
    setRequestingId(eventId)
    try {
      await cosignerService.requestEnrollment(eventId)
      toast.success("Enrollment requested successfully")
      // Refresh list to show updated status
      await loadEvents()
    } catch (error) {
      toast.error("Failed to request enrollment")
    } finally {
      setRequestingId(null)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (events.length === 0) {
    return (
      <EmptyState
        title={type === "available" ? "No Available Events" : "No Enrolled Events"}
        description={
          type === "available" 
            ? "There are no upcoming events available to join at this time."
            : "You have not enrolled in any events yet."
        }
      />
    )
  }

  return (
    <div className="rounded-md border">
     <div className="w-full max-md:max-w-[600px] max-sm:max-w-[350px]">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            {type === "enrolled" && <TableHead>Items</TableHead>}
            {type === "enrolled" && <TableHead>Sales</TableHead>}
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.name}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <Badge variant="secondary">{event.status}</Badge>
              </TableCell>
              {type === "enrolled" && <TableCell>0</TableCell>}
              {type === "enrolled" && <TableCell>$0.00</TableCell>}
              <TableCell className="text-right">
                {event.enrollmentStatus !== "not_enrolled" ? (
                  <Badge variant={event.enrollmentStatus === "approved" ? "default" : "secondary"}>
                    {event.enrollmentStatus === "approved" ? "Enrolled" : "Pending"}
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleRequestEnrollment(event.id)}
                    disabled={requestingId === event.id}
                  >
                    {requestingId === event.id ? "Requesting..." : "Request Enrollment"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
      </ScrollArea>
      </div>
    </div>
  )
}
