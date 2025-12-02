"use client"
import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, UserPlus, Mail, Printer, Eye, Trash2, Pencil, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { sellerService } from "@/services/seller" 
import { AddSellerDialog } from "@/components/dashboard/add-seller-dialog"
import { InviteSellerDialog } from "@/components/dashboard/invite-seller-dialog"
import { LoadingSkeleton } from "@/components/shared/loading"
import { DataTable } from "@/components/ui/data-table"
import Link from "next/link"

interface SellerManagementProps {
  eventId?: string
}

export function SellerManagement({ eventId }: SellerManagementProps) {
  const [sellers, setSellers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingSeller, setEditingSeller] = useState<any>(null)

  useEffect(() => {
    loadSellers()
  }, [])

  const loadSellers = async () => {
    try {
      const data = await sellerService.getSellers()
      setSellers(data)
    } catch (error) {
      toast.error("Failed to load sellers")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setSellers(sellers.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    ))
    toast.success(`Seller ${newStatus === 'approved' ? 'approved' : 'rejected'}`)
  }

  const handleDelete = (id: string) => {
    setSellers(sellers.filter(s => s.id !== id))
    toast.success("Seller deleted")
  }

  const handleAddSeller = async (data: any) => {
    try {
      if (editingSeller) {
        const updated = await sellerService.updateSeller(editingSeller.id, data)
        setSellers(sellers.map(s => s.id === updated.id ? updated : s))
        toast.success("Seller updated successfully")
      } else {
        const newSeller = await sellerService.addSeller(data)
        setSellers([...sellers, newSeller])
        toast.success("Seller added successfully")
      }
    } catch (error) {
      toast.error("Failed to save seller")
    }
  }

  const openEdit = (seller: any) => {
    setEditingSeller(seller)
    setIsAddOpen(true)
  }

  const openAdd = () => {
    setEditingSeller(null)
    setIsAddOpen(true)
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Seller ID",
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
        </div>
      ),
    },
    {
      accessorKey: "items",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Items Sold
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-right pr-4">{row.getValue("items")}</div>,
    },
    {
      id: "invoice",
      header: () => <div className="text-center">Invoice</div>,
      cell: ({ row }) => {
        const seller = row.original
        return seller.status === 'approved' ? (
          <div className="flex justify-center gap-2">
             <Button variant="ghost" size="icon" title="Email Invoice">
               <Mail className="h-4 w-4" />
             </Button>
             <Button variant="ghost" size="icon" title="Print Invoice">
               <Printer className="h-4 w-4" />
             </Button>
          </div>
        ) : null
      },
    },
    {
      id: "viewSales",
      header: () => <div className="text-center">View Sales</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="icon"
            asChild
            title="View Sales Details"
          >
            <Link href={`/marketplace/events/${eventId}/seller/${row.original.id}`}>
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
        const seller = row.original
        return (
          <div className="flex justify-end items-center gap-2">
            <Badge variant={seller.status === 'approved' ? 'default' : 'secondary'}>
              {seller.status}
            </Badge>
            
            {seller.status !== 'approved' && (
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                onClick={() => handleStatusChange(seller.id, 'approved')}
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}

            {seller.status !== 'rejected' && (
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                onClick={() => handleStatusChange(seller.id, 'rejected')}
                title="Reject"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => handleDelete(seller.id)}
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
        <h3 className="text-lg font-medium">Enrolled Sellers</h3>
        <div className="flex gap-2">
          {eventId && <InviteSellerDialog eventId={eventId} />}
          <Button size="sm" onClick={openAdd}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Seller
          </Button>
        </div>
        <AddSellerDialog 
          open={isAddOpen} 
          onOpenChange={setIsAddOpen}
          onSuccess={handleAddSeller}
          initialData={editingSeller}
        />
      </div>

      <DataTable columns={columns} data={sellers} searchKey="name" />
    </div>
  )
}
