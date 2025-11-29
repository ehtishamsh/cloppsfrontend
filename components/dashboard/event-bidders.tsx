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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Mail, UserPlus } from "lucide-react"
import { eventService } from "@/services/events"
import { LoadingSkeleton } from "@/components/shared/loading"
import { toast } from "sonner"
import { InviteBidderDialog } from "@/components/dashboard/invite-bidder-dialog"

interface EventBiddersProps {
  eventId: string
}

export function EventBidders({ eventId }: EventBiddersProps) {
  const [bidders, setBidders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  useEffect(() => {
    loadBidders()
  }, [eventId])

  const loadBidders = async () => {
    try {
      const data = await eventService.getEventBidders(eventId)
      setBidders(data)
    } catch (error) {
      toast.error("Failed to load bidders")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setBidders(bidders.map(b => 
      b.id === id ? { ...b, status: newStatus } : b
    ))
    toast.success(`Bidder ${newStatus === 'approved' ? 'approved' : 'rejected'}`)
  }

  const handleInviteSuccess = (data: any) => {
    // Add new bidder to the list
    const newBidder = {
      id: Math.random().toString(36).substr(2, 9),
      paddleNumber: data.paddleNumber,
      name: data.email.split('@')[0],
      email: data.email,
      phone: "N/A",
      status: "pending"
    }
    setBidders([...bidders, newBidder])
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Registered Bidders</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsInviteOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Bidder
          </Button>
          <Button size="sm" variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email All Bidders
          </Button>
        </div>
      </div>

      <InviteBidderDialog 
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        onSuccess={handleInviteSuccess}
        eventId={eventId}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paddle #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bidders.map((bidder) => (
              <TableRow key={bidder.id}>
                <TableCell className="font-medium">{bidder.paddleNumber}</TableCell>
                <TableCell>{bidder.name}</TableCell>
                <TableCell>{bidder.email}</TableCell>
                <TableCell>{bidder.phone}</TableCell>
                <TableCell>
                  <Badge variant={bidder.status === 'approved' ? 'default' : 'secondary'}>
                    {bidder.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {bidder.status === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                        onClick={() => handleStatusChange(bidder.id, 'approved')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                        onClick={() => handleStatusChange(bidder.id, 'rejected')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
