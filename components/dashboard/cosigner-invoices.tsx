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
import { Download, Mail, Printer } from "lucide-react"
import { cosignerService, type Invoice } from "@/services/cosigner"
import { LoadingSkeleton } from "@/components/shared/loading"
import { EmptyState } from "@/components/shared/empty-state"
import { toast } from "sonner"

export function CosignerInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const data = await cosignerService.getInvoices()
      setInvoices(data)
    } catch (error) {
      toast.error("Failed to load invoices")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (invoices.length === 0) {
    return (
      <EmptyState
        title="No Invoices"
        description="You don't have any invoices yet."
      />
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Lots Sold</TableHead>
            <TableHead className="text-right">Sale Price</TableHead>
            <TableHead className="text-right">Commission</TableHead>
            <TableHead className="text-right">Sales Tax</TableHead>
            <TableHead className="text-right">Total Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.eventName}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell className="text-right">{invoice.lotsSold}</TableCell>
              <TableCell className="text-right">${invoice.salePrice.toLocaleString()}</TableCell>
              <TableCell className="text-right text-red-600">-${invoice.commission.toLocaleString()}</TableCell>
              <TableCell className="text-right text-red-600">-${invoice.salesTax.toLocaleString()}</TableCell>
              <TableCell className="text-right font-bold">${invoice.totalDue.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => toast.success(`Emailing Invoice #${invoice.id}...`)}
                    title="Email Invoice"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => toast.success(`Printing Invoice #${invoice.id}...`)}
                    title="Print Invoice"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      toast.success(`Downloading Invoice #${invoice.id}...`)
                      setTimeout(() => {
                        toast.success(`Invoice #${invoice.id} downloaded successfully`)
                      }, 1500)
                    }}
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
