import { useState, useMemo, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Save, Calculator } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { eventService, type SaleEntry } from "@/services/events"
import { LoadingSkeleton } from "@/components/shared/loading"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface SalesTableProps {
  status?: string
  onPostAuction?: () => void
  onGenerateInvoices?: () => void
}

export function SalesTable({ status, onPostAuction, onGenerateInvoices }: SalesTableProps) {
  const [entries, setEntries] = useState<SaleEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // New row state
  const [newRow, setNewRow] = useState<Partial<SaleEntry>>({
    lotNumber: "",
    bidderNumber: "",
    title: "",
    price: 0,
    buyerName: "",
    category: "",
  })

  // Settings (Mock)
  const taxRate = 0.0825
  const commissionRate = 0.10

  useEffect(() => {
    loadSales()
  }, [])

  const loadSales = async () => {
    try {
      // Assuming we are in an event context, hardcoded ID for now or passed via props if refactored further
      const data = await eventService.getSales("EVT-001") 
      setEntries(data)
    } catch (error) {
      toast.error("Failed to load sales data")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculations
  const totals = useMemo(() => {
    const subtotal = entries.reduce((sum, entry) => sum + (entry.price || 0), 0)
    const commission = subtotal * commissionRate
    const tax = subtotal * taxRate
    const total = subtotal + commission + tax
    return { subtotal, commission, tax, total }
  }, [entries])

  const handleAddRow = async () => {
    if (!newRow.lotNumber || !newRow.bidderNumber || !newRow.price) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const sale = await eventService.addSale("EVT-001", {
        lotNumber: newRow.lotNumber,
        bidderNumber: newRow.bidderNumber,
        title: newRow.title || "",
        price: Number(newRow.price),
        buyerName: newRow.buyerName,
        category: newRow.category,
      })
      
      setEntries([...entries, sale])
      setNewRow({ lotNumber: "", bidderNumber: "", title: "", price: 0, buyerName: "", category: "" })
      toast.success("Sale added")
    } catch (error) {
      toast.error("Failed to add sale")
    }
  }

  const handleDeleteRow = async (id: string) => {
    try {
      await eventService.deleteSale("EVT-001", id)
      setEntries(entries.filter(e => e.id !== id))
      toast.success("Sale removed")
    } catch (error) {
      toast.error("Failed to remove sale")
    }
  }

  const handlePostAuction = () => {
    toast.success("Auction posted! Invoices generated.")
    if (onPostAuction) {
      onPostAuction()
    }
  }

  const handleGenerateInvoices = () => {
    toast.success("Invoices generated.")
    if (onGenerateInvoices) {
      onGenerateInvoices()
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.subtotal.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.commission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {(commissionRate * 100).toFixed(1)}% Buyer&apos;s Premium
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.tax.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {(taxRate * 100).toFixed(2)}% Sales Tax
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grand Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totals.total.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Lot #</TableHead>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead className="w-[80px]">Bidder #</TableHead>
                <TableHead className="w-[150px]">Buyer Name</TableHead>
                <TableHead>Item Title</TableHead>
                <TableHead className="w-[120px]">Category</TableHead>
                <TableHead className="w-[120px] text-right">Price</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.lotNumber}</TableCell>
                  <TableCell>
                    {entry.imageUrl ? (
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                        <img 
                          src={entry.imageUrl} 
                          alt={entry.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{entry.bidderNumber}</TableCell>
                  <TableCell>{entry.buyerName || "-"}</TableCell>
                  <TableCell>{entry.title}</TableCell>
                  <TableCell>{entry.category || "-"}</TableCell>
                  <TableCell className="text-right">${entry.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRow(entry.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Input Row */}
              <TableRow className="bg-muted/50">
                <TableCell>
                  <Input
                    placeholder="Lot #"
                    value={newRow.lotNumber}
                    onChange={(e) => setNewRow({ ...newRow, lotNumber: e.target.value })}
                    className="h-8"
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Input
                    placeholder="Bidder #"
                    value={newRow.bidderNumber}
                    onChange={(e) => setNewRow({ ...newRow, bidderNumber: e.target.value })}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Buyer Name"
                    value={newRow.buyerName || ""}
                    onChange={(e) => setNewRow({ ...newRow, buyerName: e.target.value })}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Item Title"
                    value={newRow.title}
                    onChange={(e) => setNewRow({ ...newRow, title: e.target.value })}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Category"
                    value={newRow.category || ""}
                    onChange={(e) => setNewRow({ ...newRow, category: e.target.value })}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newRow.price || ""}
                    onChange={(e) => setNewRow({ ...newRow, price: parseFloat(e.target.value) })}
                    className="h-8 text-right"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddRow()
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button size="icon" onClick={handleAddRow} className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex justify-end">
        {status === "Live" ? (
          <Button size="lg" disabled>
            Wait for auction to end to generate invoices
          </Button>
        ) : status === "Closed" ? (
          <Button size="lg" onClick={handleGenerateInvoices}>
            <Save className="mr-2 h-4 w-4" />
            Generate Invoices
          </Button>
        ) : status === "Ended" ? (
          <Button size="lg" onClick={handlePostAuction}>
            <Save className="mr-2 h-4 w-4" />
            Generate Invoices
          </Button>
        ) : (
          <Button size="lg" onClick={handlePostAuction}>
            <Save className="mr-2 h-4 w-4" />
            Post Auction & Generate Invoices
          </Button>
        )}
      </div>
    </div>
  )
}

function DollarSign(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
