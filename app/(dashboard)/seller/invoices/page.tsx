import { SellerInvoices } from "@/components/dashboard/seller-invoices"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SellerInvoicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Invoices</h2>
        <p className="text-muted-foreground">
          View and download invoices from completed auctions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>
            All invoices are available for download as PDF.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SellerInvoices />
        </CardContent>
      </Card>
    </div>
  )
}
