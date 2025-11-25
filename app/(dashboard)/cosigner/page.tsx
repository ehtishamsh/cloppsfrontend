import { CosignerEventsList } from "@/components/dashboard/cosigner-events-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CosignerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cosigner Dashboard</h2>
        <p className="text-muted-foreground">
          Find events to join and manage your consignments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Events</CardTitle>
          <CardDescription>
            Browse and request enrollment in upcoming auctions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CosignerEventsList type="available" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Events</CardTitle>
          <CardDescription>
            View details and sales for events you are participating in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CosignerEventsList type="enrolled" />
        </CardContent>
      </Card>
    </div>
  )
}
