"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, DollarSign, FileText, ArrowLeft, PlayCircle, PauseCircle, StopCircle } from "lucide-react"
import Link from "next/link"
import { SalesTable } from "@/components/dashboard/sales-table"
import { SellerManagement } from "@/components/dashboard/seller-management"
import { EventReports } from "@/components/dashboard/event-reports"
import { EventBidders } from "@/components/dashboard/event-bidders"
import { Separator } from "@/components/ui/separator"
import { eventService } from "@/services/events"
import { LoadingSkeleton } from "@/components/shared/loading"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function EventDetailsView({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<any>(null)
  const [sales, setSales] = useState<any[]>([])
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [eventId])

  const loadData = async () => {
    try {
      const [eventData, salesData] = await Promise.all([
        eventService.getEventDetails(eventId),
        eventService.getSales(eventId)
      ])
      
      if (eventData) {
        setEvent(eventData)
        setStatus(eventData.status)
      }
      setSales(salesData)
    } catch (error) {
      toast.error("Failed to load event details")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculations
  const calculateFinancials = () => {
    if (!event || !sales) return null

    const commissionRate = event.commissionRate / 100
    const buyerPremiumRate = event.buyersPremium / 100
    const taxRate = event.taxRate / 100

    let totalSales = 0
    let totalCommission = 0
    let totalBuyerPremium = 0
    let totalTax = 0

    const detailedSales = sales.map(sale => {
      const price = sale.price
      const commission = price * commissionRate
      const buyerPremium = price * buyerPremiumRate
      const tax = price * taxRate
      // Total is the total amount paid by the buyer
      const total = price + buyerPremium + tax

      totalSales += price
      totalCommission += commission
      totalBuyerPremium += buyerPremium
      totalTax += tax

      return {
        ...sale,
        commission,
        buyerPremium,
        tax,
        total
      }
    })

    const marketplaceEarnings = totalCommission + totalBuyerPremium
    const grandTotal = totalSales + totalBuyerPremium + totalTax

    return {
      totalSales,
      totalCommission,
      totalBuyerPremium,
      totalTax,
      marketplaceEarnings,
      grandTotal,
      detailedSales,
      commissionRate: event.commissionRate,
      buyerPremiumRate: event.buyersPremium,
      taxRate: event.taxRate
    }
  }

  const financials = calculateFinancials()

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!event) return <div>Event not found</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/marketplace/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Badge variant="outline">{eventId}</Badge>
            <Badge 
              variant={status === "Live" ? "destructive" : "default"}
            >
              {status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{event.startDate}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>{event.time}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {(status === "Draft" || status === "Scheduled" || status === "Paused") && (
            <Button onClick={() => setStatus("Live")} className="bg-green-600 hover:bg-green-700">
              <PlayCircle className="mr-2 h-4 w-4" />
              {status === "Paused" ? "Resume Auction" : "Start Auction"}
            </Button>
          )}
          {status === "Live" && (
            <>
              <Button onClick={() => setStatus("Paused")} variant="secondary">
                <PauseCircle className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button onClick={() => setStatus("Ended")} variant="destructive">
                <StopCircle className="mr-2 h-4 w-4" />
                End Auction
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Sales Entry
          </TabsTrigger>

          <TabsTrigger value="summary" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Summary
          </TabsTrigger>
          
          <TabsTrigger value="sellers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sellers
          </TabsTrigger>
          <TabsTrigger value="buyers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Buyers
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <SalesTable 
            status={status}
            onPostAuction={() => {
              setStatus("Closed")
              // Switch to sellers tab to show invoices
              const tabs = document.querySelector('[role="tablist"]') as HTMLElement
              const sellersTab = tabs?.querySelector('[value="sellers"]') as HTMLElement
              sellersTab?.click()
            }}
            onGenerateInvoices={() => {
              // Switch to sellers tab to show invoices
              const tabs = document.querySelector('[role="tablist"]') as HTMLElement
              const sellersTab = tabs?.querySelector('[value="sellers"]') as HTMLElement
              sellersTab?.click()
            }}
          />
        </TabsContent>

        <TabsContent value="summary">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Sales</div>
                    <div className="text-2xl font-bold">
                      {financials?.totalSales.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Commission</div>
                    <div className="text-2xl font-bold text-green-600">
                      {financials?.totalCommission.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ({financials?.commissionRate}%)
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Buyer Premium</div>
                    <div className="text-2xl font-bold text-green-600">
                      {financials?.totalBuyerPremium.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ({financials?.buyerPremiumRate}%)
                    </div>
                  </div>
               
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Tax</div>
                    <div className="text-2xl font-bold text-red-600">
                      {financials?.totalTax.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ({financials?.taxRate}%)
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Transaction</div>
                    <div className="text-2xl font-bold">
                      {financials?.grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seller ID</TableHead>
                      <TableHead>Buyer ID</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead className="text-right">Buyer Premium</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financials?.detailedSales.map((sale: any) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.sellerId || "N/A"}</TableCell>
                        <TableCell>{sale.bidderNumber}</TableCell>
                        <TableCell>{sale.title}</TableCell>
                        <TableCell className="text-right">
                          {sale.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {sale.commission.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {sale.buyerPremium.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {sale.tax.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {sale.total.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Totals Row */}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={3}>Totals</TableCell>
                      <TableCell className="text-right">
                        {financials?.totalSales.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {financials?.totalCommission.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {financials?.totalBuyerPremium.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {financials?.totalTax.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        {financials?.grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sellers">
          <SellerManagement eventId={eventId} />
        </TabsContent>

        <TabsContent value="buyers">
          <EventBidders eventId={eventId} />
        </TabsContent>

        <TabsContent value="reports">
          <EventReports eventId={eventId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
