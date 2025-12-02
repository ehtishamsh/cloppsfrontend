"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { BidderPurchase } from "@/services/bidder"
import { ArrowUpDown } from "lucide-react"

interface PurchasesTableProps {
  data: BidderPurchase[]
}

export function PurchasesTable({ data }: PurchasesTableProps) {
  const columns: ColumnDef<BidderPurchase>[] = [
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
      accessorKey: "lotNumber",
      header: "Lot #",
    },
    {
      accessorKey: "itemTitle",
      header: "Item",
      cell: ({ row }) => <span className="font-medium">{row.getValue("itemTitle")}</span>,
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
      cell: ({ row }) => (
        <div className="text-right">
          ${(row.getValue("price") as number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
    },
  ]

  return <DataTable columns={columns} data={data} searchKey="itemTitle" placeholder="Filter by item..." />
}
