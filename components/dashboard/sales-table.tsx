"use client"

import { useState, useMemo, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Save, Calculator, Pencil, ArrowUpDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { eventService, type SaleEntry } from "@/services/events"
import { LoadingSkeleton } from "@/components/shared/loading"
import { DataTable } from "@/components/ui/data-table"
import { AddSaleDialog } from "@/components/dashboard/add-sale-dialog"

interface SalesTableProps {
  status?: string
  onPostAuction?: () => void
  onGenerateInvoices?: () => void
}

export function SalesTable({ status, onPostAuction, onGenerateInvoices }: SalesTableProps) {
  const [entries, setEntries] = useState<SaleEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRow, setEditRow] = useState<Partial<SaleEntry>>({})

  // Settings (Mock)
  const commissionRate = 0.10

  useEffect(() => {
    loadSales()
  }, [])

  const loadSales = async () => {
    try {
      // Assuming we are in an event context, hardcoded ID for now or passed via props if refactored further
      const data = await eventService.getSales("EVT-001") 
      setEntries(data)
    } catch (error) {
      toast.error("Failed to load sales data")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculations
  const totals = useMemo(() => {
    const subtotal = entries.reduce((sum, entry) => sum + (entry.price || 0), 0)
    const commission = subtotal * commissionRate
    return { subtotal, commission }
  }, [entries])

  const handleAddSuccess = (sale: SaleEntry) => {
    setEntries([...entries, sale])
  }

  const handleDeleteRow = async (id: string) => {
    try {
      await eventService.deleteSale("EVT-001", id)
      setEntries(entries.filter(e => e.id !== id))
      toast.success("Sale removed")
    } catch (error) {
      toast.error("Failed to remove sale")
    }
  }

  const startEdit = (entry: SaleEntry) => {
    setEditingId(entry.id)
    setEditRow(entry)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditRow({})
  }

  const saveEdit = async () => {
    if (!editingId || !editRow.lotNumber || !editRow.buyerNumber || !editRow.price) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      // Mock update call
      const updatedEntry = { ...editRow, id: editingId } as SaleEntry
      // await eventService.updateSale("EVT-001", editingId, updatedEntry)
      
      setEntries(entries.map(e => e.id === editingId ? updatedEntry : e))
      setEditingId(null)
      setEditRow({})
      toast.success("Sale updated")
    } catch (error) {
      toast.error("Failed to update sale")
    }
  }

  const handlePostAuction = () => {
    toast.success("Auction posted! Invoices generated.")
    if (onPostAuction) {
      onPostAuction()
    }
  }

  const handleGenerateInvoices = () => {
    toast.success("Invoices generated.")
    if (onGenerateInvoices) {
      onGenerateInvoices()
    }
  }

  const columns: ColumnDef<SaleEntry>[] = [
    {
      accessorKey: "lotNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Lot #
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id
        return isEditing ? (
          <Input 
            value={editRow.lotNumber} 
            onChange={(e) => setEditRow({...editRow, lotNumber: e.target.value})}
            className="h-8 w-full"
          />
        ) : (
          <span className="font-medium">{row.getValue("lotNumber")}</span>
        )
      },
    },
    {
      accessorKey: "buyerNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Buyer #
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id
        return isEditing ? (
          <Input 
            value={editRow.buyerNumber} 
            onChange={(e) => setEditRow({...editRow, buyerNumber: e.target.value})}
            className="h-8 w-full"
          />
        ) : (
          <span>{row.getValue("buyerNumber")}</span>
        )
      },
    },
    {
      accessorKey: "title",
      header: "Item Title",
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id
        return isEditing ? (
          <Input 
            value={editRow.title} 
            onChange={(e) => setEditRow({...editRow, title: e.target.value})}
            className="h-8 w-full"
          />
        ) : (
          <span>{row.getValue("title")}</span>
        )
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Price
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id
        return isEditing ? (
          <Input 
            type="number"
            value={editRow.price} 
            onChange={(e) => setEditRow({...editRow, price: Number(e.target.value)})}
            className="h-8 w-full text-right"
          />
        ) : (
          <div className="text-right">
            ${(row.getValue("price") as number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id
        return isEditing ? (
          <div className="flex justify-end gap-2">
            <Button size="icon" variant="ghost" onClick={saveEdit} className="h-8 w-8 text-green-600">
              <Save className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-8 w-8">
              <Trash2 className="h-4 w-4 rotate-45" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEdit(row.original)}
              className="mr-2"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteRow(row.original.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.commission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              {(commissionRate * 100).toFixed(1)}% Buyer&apos;s Premium
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <AddSaleDialog eventId="EVT-001" onSuccess={handleAddSuccess} />
      </div>

      <DataTable columns={columns} data={entries} searchKey="title" placeholder="Filter by item title..." />

      <div className="flex justify-end">
        {status === "Live" ? (
          <Button size="lg" disabled>
            Wait for auction to end to generate invoices
          </Button>
        ) : status === "Closed" ? (
          <Button size="lg" onClick={handleGenerateInvoices}>
            <Save className="mr-2 h-4 w-4" />
            Generate Invoices
          </Button>
        ) : status === "Ended" ? (
          <Button size="lg" onClick={handlePostAuction}>
            <Save className="mr-2 h-4 w-4" />
            Generate Invoices
          </Button>
        ) : (
          <Button size="lg" onClick={handlePostAuction}>
            <Save className="mr-2 h-4 w-4" />
            Post Auction & Generate Invoices
          </Button>
        )}
      </div>
    </div>
  )
}

function DollarSign(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
