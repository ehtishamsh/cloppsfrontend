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
import { Download, FileText, DollarSign } from "lucide-react"
import { buyerService, type BuyerStatement } from "@/services/bidder"
import { LoadingSkeleton } from "@/components/shared/loading"
import { toast } from "sonner"

export default function StatementsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [statements, setStatements] = useState<BuyerStatement[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const statementData = await buyerService.getStatements()
      setStatements(statementData)
    } catch (error) {
      toast.error("Failed to load statements")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (statementId: string) => {
    toast.success(`Downloading Statement #${statementId}...`)
    setTimeout(() => {
      toast.success("Download complete")
    }, 1000)
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  const totalDue = statements
    .filter(s => s.status === 'unpaid')
    .reduce((sum, s) => sum + s.totalAmount, 0)

  const totalPaid = statements
    .filter(s => s.status === 'paid')
    .reduce((sum, s) => sum + s.totalAmount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Statements</h2>
        <p className="text-muted-foreground">
          View and download your billing statements.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Statements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statements.length}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Due</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Pending payment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Completed payments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Statements</CardTitle>
          <CardDescription>
            Download and view your billing statements for each event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Statement ID</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statements.map((statement) => (
                <TableRow key={statement.id}>
                  <TableCell className="font-medium">{statement.id}</TableCell>
                  <TableCell>{statement.eventName}</TableCell>
                  <TableCell>{statement.date}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${statement.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statement.status === 'paid' ? 'default' : 'destructive'}>
                      {statement.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownload(statement.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
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
