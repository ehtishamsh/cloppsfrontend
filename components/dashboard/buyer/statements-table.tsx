"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { BuyerStatement } from "@/services/bidder" 
import { ArrowUpDown, Download } from "lucide-react"
import { toast } from "sonner"

interface StatementsTableProps {
  data: BuyerStatement[]
}

export function StatementsTable({ data }: StatementsTableProps) {
  const columns: ColumnDef<BuyerStatement>[] = [
    {
      accessorKey: "id",
      header: "Statement ID",
      cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "eventName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Total Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="text-right">
          ${(row.getValue("totalAmount") as number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === 'paid' ? 'default' : 'destructive'}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              toast.success(`Downloading Statement #${row.original.id}...`)
              setTimeout(() => {
                toast.success("Download complete")
              }, 1000)
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={data} searchKey="eventName" placeholder="Filter by event..." />
}
