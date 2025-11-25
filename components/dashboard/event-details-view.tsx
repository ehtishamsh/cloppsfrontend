"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, DollarSign, FileText, ArrowLeft, PlayCircle, PauseCircle, StopCircle } from "lucide-react"
import Link from "next/link"
import { SalesTable } from "@/components/dashboard/sales-table"
import { CosignerManagement } from "@/components/dashboard/cosigner-management"
import { EventReports } from "@/components/dashboard/event-reports"
import { Separator } from "@/components/ui/separator"
import { eventService } from "@/services/events"
import { LoadingSkeleton } from "@/components/shared/loading"
import { toast } from "sonner"

export function EventDetailsView({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<any>(null)
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEvent()
  }, [eventId])

  const loadEvent = async () => {
    try {
      const data = await eventService.getEventDetails(eventId)
      if (data) {
        setEvent(data)
        setStatus(data.status)
      }
    } catch (error) {
      toast.error("Failed to load event details")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!event) return <div>Event not found</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/marketplace/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Badge variant="outline">{eventId}</Badge>
            <Badge 
              variant={status === "Live" ? "destructive" : "default"}
            >
              {status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{event.startDate} - {event.endDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {(status === "Draft" || status === "Scheduled" || status === "Paused") && (
            <Button onClick={() => setStatus("Live")} className="bg-green-600 hover:bg-green-700">
              <PlayCircle className="mr-2 h-4 w-4" />
              {status === "Paused" ? "Resume Auction" : "Start Auction"}
            </Button>
          )}
          {status === "Live" && (
            <>
              <Button onClick={() => setStatus("Paused")} variant="secondary">
                <PauseCircle className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button onClick={() => setStatus("Ended")} variant="destructive">
                <StopCircle className="mr-2 h-4 w-4" />
                End Auction
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Sales Entry
          </TabsTrigger>
          
          <TabsTrigger value="cosigners" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Cosigners
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <SalesTable 
            status={status}
            onPostAuction={() => {
              setStatus("Closed")
              // Switch to cosigners tab to show invoices
              const tabs = document.querySelector('[role="tablist"]') as HTMLElement
              const cosignersTab = tabs?.querySelector('[value="cosigners"]') as HTMLElement
              cosignersTab?.click()
            }}
            onGenerateInvoices={() => {
              // Switch to cosigners tab to show invoices
              const tabs = document.querySelector('[role="tablist"]') as HTMLElement
              const cosignersTab = tabs?.querySelector('[value="cosigners"]') as HTMLElement
              cosignersTab?.click()
            }}
          />
        </TabsContent>

        <TabsContent value="cosigners">
          <CosignerManagement />
        </TabsContent>

        <TabsContent value="reports">
          <EventReports eventId={eventId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
