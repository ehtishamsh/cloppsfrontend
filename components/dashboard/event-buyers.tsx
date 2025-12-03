"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Mail, UserPlus, Eye, Printer, Pencil, Trash2, ArrowUpDown } from "lucide-react"
import { eventService } from "@/services/events"
import { LoadingSkeleton } from "@/components/shared/loading"
import { toast } from "sonner"
import { InviteBuyerDialog } from "@/components/dashboard/invite-buyer-dialog"
import { AddBuyerDialog } from "@/components/dashboard/add-buyer-dialog"
import { DataTable } from "@/components/ui/data-table"
import Link from "next/link"

interface EventBuyersProps {
  eventId: string
}

export function EventBuyers({ eventId }: EventBuyersProps) {
  const [buyers, setBuyers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingBuyer, setEditingBuyer] = useState<any>(null)

  useEffect(() => {
    loadBuyers()
  }, [eventId])

  const loadBuyers = async () => {
    try {
      const data = await eventService.getEventBuyers(eventId)
      setBuyers(data)
    } catch (error) {
      toast.error("Failed to load buyers")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setBuyers(buyers.map(b => 
      b.id === id ? { ...b, status: newStatus } : b
    ))
    toast.success(`Buyer ${newStatus === 'approved' ? 'approved' : 'rejected'}`)
  }

  const handleInviteSuccess = (data: any) => {
    // Add new buyer to the list
    const newBuyer = {
      id: Math.random().toString(36).substr(2, 9),
      paddleNumber: data.paddleNumber,
      name: data.email.split('@')[0],
      email: data.email,
      phone: "N/A",
      status: "pending"
    }
    setBuyers([...buyers, newBuyer])
  }

  const handleSaveBuyer = (data: any) => {
    if (editingBuyer) {
      setBuyers(buyers.map(b => 
        b.id === editingBuyer.id ? { ...b, ...data } : b
      ))
      toast.success("Buyer updated successfully")
    } else {
      const newBuyer = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "approved",
        itemsBought: 0,
        totalSpent: 0
      }
      setBuyers([...buyers, newBuyer])
      toast.success("Buyer created successfully")
    }
  }

  const handleDelete = (id: string) => {
    setBuyers(buyers.filter(b => b.id !== id))
    toast.success("Buyer deleted")
  }

  const openEdit = (buyer: any) => {
    setEditingBuyer(buyer)
    setIsEditOpen(true)
  }

  const openAdd = () => {
    setEditingBuyer(null)
    setIsEditOpen(true)
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Buyer ID",
      cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.getValue("name")}
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 text-muted-foreground hover:text-primary"
            onClick={() => openEdit(row.original)}
            title="Edit"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Badge variant="outline" className="ml-2">#{row.original.paddleNumber}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "itemsBought",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Items Bought
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-right pr-4">{row.getValue("itemsBought") || 0}</div>,
    },
    {
      id: "statement",
      header: () => <div className="text-center">Statement</div>,
      cell: () => (
        <div className="flex justify-center gap-2">
           <Button variant="ghost" size="icon" title="Email Statement">
             <Mail className="h-4 w-4" />
           </Button>
           <Button variant="ghost" size="icon" title="Print Statement">
             <Printer className="h-4 w-4" />
           </Button>
        </div>
      ),
    },
    {
      id: "viewPurchases",
      header: () => <div className="text-center">View Sales</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="icon"
            asChild
            title="View Purchases"
          >
            <Link href={`/marketplace/events/${eventId}/buyer/${row.original.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Status & Actions</div>,
      cell: ({ row }) => {
        const buyer = row.original
        return (
          <div className="flex justify-end items-center gap-2">
            <Badge variant={buyer.status === 'approved' ? 'default' : 'secondary'}>
              {buyer.status}
            </Badge>
            
            {buyer.status !== 'approved' && (
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                onClick={() => handleStatusChange(buyer.id, 'approved')}
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}

            {buyer.status !== 'rejected' && (
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                onClick={() => handleStatusChange(buyer.id, 'rejected')}
                title="Reject"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => handleDelete(buyer.id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Registered Buyers</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsInviteOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Buyer
          </Button>
          <Button size="sm" onClick={openAdd}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Buyer
          </Button>
        </div>
      </div>

      <InviteBuyerDialog 
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        onSuccess={handleInviteSuccess}
        eventId={eventId}
      />

      <AddBuyerDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        onSuccess={handleSaveBuyer}
        initialData={editingBuyer}
      />

      <DataTable columns={columns} data={buyers} searchKey="name" />
    </div>
  )
}
