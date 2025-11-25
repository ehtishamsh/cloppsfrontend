"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { Fragment } from "react"

export function Breadcrumbs() {
  const pathname = usePathname()
  
  // Remove trailing slash and split into segments
  const segments = pathname.split("/").filter((segment) => segment !== "")

  // Generate breadcrumb items
  const items = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
    const isLast = index === segments.length - 1

    return {
      href,
      label,
      isLast,
    }
  })

  if (items.length === 0) return null

  const isCosigner = pathname.startsWith("/cosigner")
  const homeHref = isCosigner ? "/cosigner" : "/marketplace"

  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      <Link 
        href={homeHref} 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <Fragment key={item.href}>
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.isLast ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
