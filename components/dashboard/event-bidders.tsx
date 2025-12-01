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
import { Check, X, Mail, UserPlus, Eye, Printer } from "lucide-react"
import { eventService } from "@/services/events"
import { LoadingSkeleton } from "@/components/shared/loading"
import { toast } from "sonner"
import { InviteBidderDialog } from "@/components/dashboard/invite-bidder-dialog"
import { AddBidderDialog } from "@/components/dashboard/add-bidder-dialog"
import { Pencil, Trash2 } from "lucide-react"

interface EventBiddersProps {
  eventId: string
}

export function EventBidders({ eventId }: EventBiddersProps) {
  const [bidders, setBidders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingBidder, setEditingBidder] = useState<any>(null)

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

  const handleEditSuccess = (data: any) => {
    if (editingBidder) {
      setBidders(bidders.map(b => 
        b.id === editingBidder.id ? { ...b, ...data } : b
      ))
      toast.success("Bidder updated successfully")
    }
  }

  const handleDelete = (id: string) => {
    setBidders(bidders.filter(b => b.id !== id))
    toast.success("Bidder deleted")
  }

  const openEdit = (bidder: any) => {
    setEditingBidder(bidder)
    setIsEditOpen(true)
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

      <AddBidderDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        onSuccess={handleEditSuccess}
        initialData={editingBidder}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Buyer ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Items Bought</TableHead>
              <TableHead className="text-center">Statement</TableHead>
              <TableHead className="text-center">View Sales</TableHead>
              <TableHead className="text-right">Status & Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bidders.map((bidder) => (
              <TableRow key={bidder.id}>
                <TableCell className="font-medium">{bidder.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {bidder.name}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 text-muted-foreground hover:text-primary"
                      onClick={() => openEdit(bidder)}
                      title="Edit"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Badge variant="outline" className="ml-2">#{bidder.paddleNumber}</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">{bidder.itemsBought || 0}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                     <Button variant="ghost" size="icon" title="Email Statement">
                       <Mail className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" title="Print Statement">
                       <Printer className="h-4 w-4" />
                     </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                   <Button 
                     variant="ghost" 
                     size="icon"
                     asChild
                     title="View Purchases"
                   >
                     <a href={`/marketplace/events/${eventId}/buyer/${bidder.id}`}>
                       <Eye className="h-4 w-4" />
                     </a>
                   </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Badge variant={bidder.status === 'approved' ? 'default' : 'secondary'}>
                      {bidder.status}
                    </Badge>
                    
                    {bidder.status !== 'approved' && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                        onClick={() => handleStatusChange(bidder.id, 'approved')}
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}

                    {bidder.status !== 'rejected' && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                        onClick={() => handleStatusChange(bidder.id, 'rejected')}
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}

                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDelete(bidder.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
