import { BuyerSidebar } from "@/components/dashboard/buyer-sidebar"
import { MobileBuyerSidebar } from "@/components/dashboard/mobile-buyer-sidebar"
import { UserNav } from "@/components/dashboard/user-nav"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed inset-y-0 z-30">
        <BuyerSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-72 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 shadow-sm">
          <MobileBuyerSidebar />
          <div className="flex-1 flex items-center gap-4">
            <div className="hidden md:block">
              <Breadcrumbs />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  )
}
