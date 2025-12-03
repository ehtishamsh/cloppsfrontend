"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, Gavel, FileText, User, LogOut, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

const navItems = [
  { href: "/buyer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/buyer/events", label: "Events", icon: Calendar },
  { href: "/buyer/bids", label: "My Bids", icon: Gavel },
  { href: "/buyer/statements", label: "Statements", icon: FileText },
  { href: "/buyer/profile", label: "Profile", icon: User },
]

export function MobileBuyerSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <aside className="flex h-full flex-col p-6">
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
                  onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  )
}
