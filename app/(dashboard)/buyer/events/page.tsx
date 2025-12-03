"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Loader2, Eye } from "lucide-react"
import { buyerService ,type AvailableEvent } from "@/services/bidder"
import { LoadingSkeleton } from "@/components/shared/loading"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function EventsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<AvailableEvent[]>([])
  const [requestingId, setRequestingId] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await buyerService.getAvailableEvents()
      setEvents(data)
    } catch (error) {
      toast.error("Failed to load events")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestEnrollment = async (eventId: string) => {
    setRequestingId(eventId)
    try {
      await buyerService.requestEnrollment(eventId)
      
      // Update the event status locally
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, enrollmentStatus: 'pending' } : e
      ))
      
      toast.success("Enrollment request submitted successfully!")
      toast.info("You will be notified once approved by the admin")
    } catch (error) {
      toast.error("Failed to submit enrollment request")
    } finally {
      setRequestingId(null)
    }
  }

  const handleInvitationResponse = async (eventId: string, accept: boolean) => {
    try {
      await buyerService.respondToInvitation(eventId, accept)
      
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, enrollmentStatus: accept ? 'approved' : 'rejected' } : e
      ))
      
      toast.success(accept ? "Invitation accepted!" : "Invitation declined")
    } catch (error) {
      toast.error("Failed to update invitation status")
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  const upcomingEvents = events.filter(e => e.status === 'upcoming')
  const enrolledEvents = events.filter(e => e.enrollmentStatus !== 'not_enrolled')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Available Events</h2>
        <p className="text-muted-foreground">
          Browse upcoming auctions and request enrollment to participate.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for enrollment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Enrollments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.enrollmentStatus === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Approved to bid
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.enrollmentStatus === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Auctions</CardTitle>
          <CardDescription>
            Request enrollment to participate in these events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    {event.date}
                  </TableCell>
                  <TableCell>
                    {event.time}
                  </TableCell>
                  <TableCell>
                    {event.enrollmentStatus === 'not_enrolled' && (
                      <Badge variant="default" className="bg-gray-400">not enrolled</Badge>
                    )}
                    {event.enrollmentStatus === 'pending' && (
                      <Badge variant="secondary">
                        pending
                      </Badge>
                    )}
                       
                    {event.enrollmentStatus === 'approved' && (
                      <Badge variant="default" >
                        approved
                      </Badge>
                    )}
                    {event.enrollmentStatus === 'rejected' && (
                      <Badge variant="destructive">rejected</Badge>
                    )}
                    {event.enrollmentStatus === 'invited' && (
                      <Badge variant="outline" className="border-blue-500 text-blue-600">
                        Invited
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{event.name}</DialogTitle>
                            <DialogDescription>Event Details</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium text-muted-foreground">Date</div>
                                <div>{event.date}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground">Time</div>
                                <div>{event.time}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground">Location</div>
                                <div>{event.location}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground">Status</div>
                                <Badge variant="outline">{event.status}</Badge>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
                              <p className="text-sm text-muted-foreground">
                                {event.description || "No description available."}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {event.enrollmentStatus === 'not_enrolled' && (
                        <Button 
                          size="sm"
                          onClick={() => handleRequestEnrollment(event.id)}
                          disabled={requestingId === event.id}
                        >
                          {requestingId === event.id && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Request Enrollment
                        </Button>
                      )}
                      
                      {event.enrollmentStatus === 'invited' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                        variant="default"
                            onClick={() => handleInvitationResponse(event.id, true)}
                          >
                            accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                          
                            onClick={() => handleInvitationResponse(event.id, false)}
                          >
                            decline
                          </Button>
                        </div>
                      )}

                      {event.enrollmentStatus === 'pending' && (
                        <span className="flex items-center text-sm text-muted-foreground px-3">Awaiting approval</span>
                      )}
                      {event.enrollmentStatus === 'approved' && (
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          
                          Enrolled
                        </Badge>
                      )}
                      {event.enrollmentStatus === 'rejected' && (
                        <Badge variant="outline" className="border-red-600 text-red-600">
                         
                          Declined
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
