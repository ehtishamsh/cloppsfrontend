"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, TrendingUp, DollarSign, Users } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { reportsService } from "@/services/reports"
import { LoadingSkeleton } from "@/components/shared/loading"
import { toast } from "sonner"

interface EventReportsProps {
  eventId: string
}

export function EventReports({ eventId }: EventReportsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [salesByCategory, setSalesByCategory] = useState<any[]>([])
  const [topSales, setTopSales] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [eventId])

  const loadData = async () => {
    try {
      const [eventStats, categorySales, top] = await Promise.all([
        reportsService.getEventStats(eventId),
        reportsService.getSalesByCategory(eventId),
        reportsService.getTopSales(eventId),
      ])
      setStats(eventStats)
      setSalesByCategory(categorySales)
      setTopSales(top)
    } catch (error) {
      toast.error("Failed to load event reports")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = (format: "pdf" | "csv") => {
    console.log(`Exporting event ${eventId} report as ${format}`)
    toast.success(`Exporting report as ${format.toUpperCase()}...`)
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Event Performance Report</h3>
          <p className="text-sm text-muted-foreground">
            Detailed analytics and sales breakdown for this event
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              {stats.itemsSold} of {stats.totalItems} items sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averagePrice}</div>
            <p className="text-xs text-muted-foreground">
              Top sale: {stats.topSale}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sell-Through Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.itemsSold / stats.totalItems) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalItems - stats.itemsSold} items unsold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cosigners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cosigners}</div>
            <p className="text-xs text-muted-foreground">
              Active participants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTax}</div>
            <p className="text-xs text-muted-foreground">
              Sales tax
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCommission}</div>
            <p className="text-xs text-muted-foreground">
              Marketplace revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cosigner Payout</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayout}</div>
            <p className="text-xs text-muted-foreground">
              Net due to cosigners
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground">Grand Total</CardTitle>
            <DollarSign className="h-4 w-4 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.grandTotal}</div>
            <p className="text-xs text-primary-foreground/80">
              Total collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
          <CardDescription>
            Revenue breakdown by item category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Items Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesByCategory.map((cat) => (
                <TableRow key={cat.category}>
                  <TableCell className="font-medium">{cat.category}</TableCell>
                  <TableCell className="text-right">{cat.count}</TableCell>
                  <TableCell className="text-right">{cat.revenue}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">
                      {Math.round((cat.count / stats.itemsSold) * 100)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Sales</CardTitle>
          <CardDescription>
            Highest value transactions in this event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot #</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead className="text-right">Sale Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topSales.map((sale) => (
                <TableRow key={sale.lot}>
                  <TableCell className="font-medium">{sale.lot}</TableCell>
                  <TableCell>{sale.item}</TableCell>
                  <TableCell>{sale.buyer}</TableCell>
                  <TableCell className="text-right font-medium">{sale.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
