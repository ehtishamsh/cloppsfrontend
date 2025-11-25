"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker"
import { Download, TrendingUp, Users, DollarSign, Package } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { LoadingSkeleton } from "@/components/shared/loading"
import { reportsService, type SummaryStat, type RecentSale, type PastReport } from "@/services/reports"
import { RevenueChart, CategoryChart } from "@/components/dashboard/analytics-charts"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { exportToCSV } from "@/lib/export"

const iconMap = {
  DollarSign,
  Package,
  TrendingUp,
  Users,
}

export function ReportsView() {
  const [isLoading, setIsLoading] = useState(true)
  const [summaryData, setSummaryData] = useState<SummaryStat[]>([])
  const [recentSales, setRecentSales] = useState<RecentSale[]>([])
  const [pastReports, setPastReports] = useState<PastReport[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [stats, sales, history] = await Promise.all([
        reportsService.getSummaryStats(),
        reportsService.getRecentSales(),
        reportsService.getPastReports(),
      ])
      setSummaryData(stats)
      setRecentSales(sales)
      setPastReports(history)
    } catch (error) {
      toast.error("Failed to load reports data")
    } finally {
      setIsLoading(false)
    }
  }


  const handleExport = (format: "csv" | "pdf") => {
    if (format === "csv") {
      if (recentSales.length > 0) {
        exportToCSV(recentSales, "recent-sales-report")
        toast.success("Exported recent sales to CSV")
      } else {
        toast.error("No data to export")
      }
    } else {
      toast.success(`Exporting report as ${format.toUpperCase()}...`)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button onClick={() => handleExport("csv")} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryData.map((item) => {
              const Icon = iconMap[item.icon]
              return (
                <Card key={item.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {item.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made {recentSales.length} sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.id}</TableCell>
                          <TableCell>{sale.item}</TableCell>
                          <TableCell>{sale.buyer}</TableCell>
                          <TableCell className="text-right">{sale.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Performing Events</CardTitle>
                <CardDescription>
                  Highest revenue generating auctions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Spring Classic Car Auction</p>
                      <p className="text-sm text-muted-foreground">
                        Apr 15, 2024
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$125,000</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Estate Jewelry Collection</p>
                      <p className="text-sm text-muted-foreground">
                        Mar 20, 2024
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$45,000</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Modern Art Showcase</p>
                      <p className="text-sm text-muted-foreground">
                        Feb 10, 2024
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$32,000</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <RevenueChart />
            </div>
            <div className="col-span-3">
              <CategoryChart />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cosigner Performance</CardTitle>
                <CardDescription>
                  Top performing cosigners by revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "John Smith", revenue: "$125,000", items: 45 },
                    { name: "Alice Johnson", revenue: "$98,500", items: 32 },
                    { name: "Robert Wilson", revenue: "$76,200", items: 28 },
                    { name: "Sarah Davis", revenue: "$54,300", items: 19 },
                  ].map((cosigner, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{cosigner.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cosigner.items} items sold
                        </p>
                      </div>
                      <div className="font-medium">{cosigner.revenue}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Reports</CardTitle>
              <CardDescription>
                Archive of closed event summaries and monthly reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Sales</TableHead>
                    <TableHead className="text-right">Items Sold</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.eventName}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === "Closed" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{report.totalSales}</TableCell>
                      <TableCell className="text-right">{report.itemsSold}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            toast.success(`Downloading ${report.eventName} Report...`)
                          }}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
