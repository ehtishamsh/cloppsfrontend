"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { BidderEnrollment } from "@/services/bidder"
import { ArrowUpDown } from "lucide-react"

interface EnrollmentsTableProps {
  data: BidderEnrollment[]
}

export function EnrollmentsTable({ data }: EnrollmentsTableProps) {
  const columns: ColumnDef<BidderEnrollment>[] = [
    {
      accessorKey: "eventName",
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
      cell: ({ row }) => <span className="font-medium">{row.getValue("eventName")}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "paddleNumber",
      header: "Paddle #",
      cell: ({ row }) => row.getValue("paddleNumber") || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={
            status === 'approved' ? 'default' : 
            status === 'rejected' ? 'destructive' : 'secondary'
          }>
            {status}
          </Badge>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={data} searchKey="eventName" />
}
