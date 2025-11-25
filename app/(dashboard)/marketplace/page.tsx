import { ReportsView } from "@/components/dashboard/reports-view"

export default function MarketplaceDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your auction marketplace performance.
        </p>
      </div>
      <ReportsView />
    </div>
  )
}
