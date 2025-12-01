"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Loader2, DollarSign, Edit, ShoppingBag, Plus, Pencil, Mail, Printer } from "lucide-react"
import { AddBuyerItemDialog } from "@/components/dashboard/add-buyer-item-dialog"
import { toast } from "sonner"
import { eventService } from "@/services/events"

export default function EventBuyerDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string, buyerId: string }>
}) {
  const { id: eventId, buyerId } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [buyer, setBuyer] = useState<any>(null)
  const [event, setEvent] = useState<any>(null)
  const [purchases, setPurchases] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load buyer details
      const foundBuyer = await eventService.getBuyerDetails(buyerId)
      setBuyer(foundBuyer)

      // Load event details
      const eventDetails = await eventService.getEventDetails(eventId)
      setEvent(eventDetails)

      // Load purchases for this buyer in this event
      const buyerPurchases = await eventService.getBuyerPurchases(buyerId, eventId)
      setPurchases(buyerPurchases)
    } catch (error) {
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Changes saved successfully")
    } catch (error) {
      toast.error("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddItem = (data: any) => {
    if (editingItem) {
      setPurchases(purchases.map(item => item.id === editingItem.id ? { ...item, ...data } : item))
      toast.success("Item updated successfully")
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...data
      }
      setPurchases([...purchases, newItem])
      toast.success("Item added successfully")
    }
    setEditingItem(null)
  }

  const openEditItem = (item: any) => {
    setEditingItem(item)
    setIsAddItemOpen(true)
  }

  const openAddItem = () => {
    setEditingItem(null)
    setIsAddItemOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!buyer || !event) {
    return <div>Data not found</div>
  }

  const totalPurchases = purchases.reduce((acc, item) => acc + item.price, 0)
  const totalPremium = purchases.reduce((acc, item) => acc + item.premium, 0)
  const totalTax = purchases.reduce((acc, item) => acc + item.tax, 0)
  const totalDue = purchases.reduce((acc, item) => acc + item.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {buyer.name}
          </h1>
          <p className="text-muted-foreground">
            Event: {event.name}
          </p>
        </div>
        <Badge variant={buyer.status === 'approved' ? 'default' : 'secondary'} className="ml-auto">
          {buyer.status}
        </Badge>
      </div>

      <AddBuyerItemDialog 
        open={isAddItemOpen} 
        onOpenChange={setIsAddItemOpen} 
        onSuccess={handleAddItem}
        initialData={editingItem}
      />

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Purchases
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalPurchases.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Buyer's Premium</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">+${totalPremium.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tax</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">+${totalTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Due</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Items Purchased</CardTitle>
              <Button size="sm" onClick={openAddItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lot #</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Premium</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.lot}
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 text-muted-foreground hover:text-primary"
                            onClick={() => openEditItem(item)}
                            title="Edit Item"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right text-muted-foreground">+${item.premium.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right text-muted-foreground">+${item.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right font-bold text-green-600">${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>

            <div className="p-6 pt-0 flex justify-end gap-2">
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Email Statement
              </Button>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Statement
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Buyer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={buyer.name.split(' ')[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={buyer.name.split(' ')[1] || ''} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={buyer.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue={buyer.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paddleNumber">Paddle Number</Label>
                <Input id="paddleNumber" defaultValue={buyer.paddleNumber} />
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email Statement
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print Statement
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
