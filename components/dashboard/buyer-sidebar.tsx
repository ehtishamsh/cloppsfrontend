"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Gavel, FileText, User, LogOut, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const navItems = [
  { href: "/buyer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/buyer/events", label: "Events", icon: Calendar },
  { href: "/buyer/bids", label: "My Bids", icon: Gavel },
  { href: "/buyer/statements", label: "Statements", icon: FileText },
  { href: "/buyer/profile", label: "Profile", icon: User },
]

export function BuyerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 max-sm:border-none border-r max-sm:h-auto h-full bg-card p-6 flex flex-col">
      <div className="mb-8">
        <Image src="/logo.png" alt="Clopps" width={180} height={60} style={{maxWidth: '100%', maxHeight: '60px'}} />
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Button variant="ghost" className="justify-start gap-3 mt-4">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </aside>
  )
}
