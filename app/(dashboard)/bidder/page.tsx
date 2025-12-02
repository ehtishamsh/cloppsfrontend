"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gavel, FileText, Calendar } from "lucide-react"
import { bidderService, type BidderEnrollment, type BidderPurchase, type BidderStatement } from "@/services/bidder"
import { LoadingSkeleton } from "@/components/shared/loading"
import { toast } from "sonner"
import { EnrollmentsTable } from "@/components/dashboard/bidder/enrollments-table"
import { PurchasesTable } from "@/components/dashboard/bidder/purchases-table"
import { StatementsTable } from "@/components/dashboard/bidder/statements-table"

export default function BidderDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [enrollments, setEnrollments] = useState<BidderEnrollment[]>([])
  const [purchases, setPurchases] = useState<BidderPurchase[]>([])
  const [statements, setStatements] = useState<BidderStatement[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [enrollmentData, purchaseData, statementData] = await Promise.all([
        bidderService.getEnrollments(),
        bidderService.getPurchases(),
        bidderService.getStatements(),
      ])
      setEnrollments(enrollmentData)
      setPurchases(purchaseData)
      setStatements(statementData)
    } catch (error) {
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bidder Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your auction activities, purchases, and statements.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.filter(e => e.status === 'approved').length}</div>
            <p className="text-xs text-muted-foreground">
              Approved for bidding
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Won</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases.length}</div>
            <p className="text-xs text-muted-foreground">
              Total items purchased
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statements Due</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statements.filter(s => s.status === 'unpaid').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending payment
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="enrollments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Enrollments</CardTitle>
              <CardDescription>
                Status of your registration for upcoming and past auctions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnrollmentsTable data={enrollments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>
                Items you have won in auctions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PurchasesTable data={purchases} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statements</CardTitle>
              <CardDescription>
                View and download your billing statements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatementsTable data={statements} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
