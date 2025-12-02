import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, Users, Gavel } from "lucide-react"

export default function SignupPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose how you want to use the platform
        </p>
      </div>

      <div className="grid gap-4">
        <Link href="/signup/marketplace">
          <Card className="hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center justify-center text-primary">
                <Store className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base">Marketplace</CardTitle>
                <CardDescription>
                  I want to host auctions and manage events
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/signup/seller">
          <Card className="hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base">Seller</CardTitle>
                <CardDescription>
                  I want to sell items to marketplaces
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/signup/bidder">
          <Card className="hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center justify-center text-primary">
                <Gavel className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base">Bidder</CardTitle>
                <CardDescription>
                  I want to bid on items in auctions
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link href="/login" className="hover:text-brand underline underline-offset-4">
          Already have an account? Sign In
        </Link>
      </p>
    </>
  )
}
