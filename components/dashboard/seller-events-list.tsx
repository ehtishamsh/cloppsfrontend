"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { sellerService, type SellerEvent } from "@/services/seller"
import { LoadingSkeleton } from "@/components/shared/loading"
import { EmptyState } from "@/components/shared/empty-state"
import { DataTable } from "@/components/ui/data-table"
import { ArrowUpDown } from "lucide-react"

export function SellerEventsList({ type = "available" }: { type?: "available" | "enrolled" }) {
  const [events, setEvents] = useState<SellerEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [requestingId, setRequestingId] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await sellerService.getAvailableEvents()
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
      await sellerService.requestEnrollment(eventId)
      toast.success("Enrollment requested successfully")
      // Refresh list to show updated status
      await loadEvents()
    } catch (error) {
      toast.error("Failed to request enrollment")
    } finally {
      setRequestingId(null)
    }
  }

  const columns: ColumnDef<SellerEvent>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => row.getValue("time") || 'TBD',
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant="secondary">{row.getValue("status")}</Badge>,
    },
    ...(type === "enrolled" ? [
      {
        id: "items",
        header: "Items",
        cell: () => "0", // Placeholder
      },
      {
        id: "sales",
        header: "Sales",
        cell: () => "$0.00", // Placeholder
      }
    ] : []),
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        const event = row.original
        return (
          <div className="text-right">
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
          </div>
        )
      },
    },
  ]

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
    <DataTable columns={columns} data={events} searchKey="name" />
  )
}
