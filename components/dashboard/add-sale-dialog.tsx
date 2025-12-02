"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { eventService } from "@/services/events"

interface AddSaleDialogProps {
  eventId: string
  onSuccess: (sale: any) => void
}

export function AddSaleDialog({ eventId, onSuccess }: AddSaleDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    lotNumber: "",
    bidderNumber: "",
    title: "",
    price: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.lotNumber || !formData.bidderNumber || !formData.price) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      const sale = await eventService.addSale(eventId, {
        lotNumber: formData.lotNumber,
        bidderNumber: formData.bidderNumber,
        title: formData.title,
        price: Number(formData.price),
      })
      onSuccess(sale)
      setOpen(false)
      setFormData({ lotNumber: "", bidderNumber: "", title: "", price: "" })
      toast.success("Sale added successfully")
    } catch (error) {
      toast.error("Failed to add sale")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Sale Entry</DialogTitle>
          <DialogDescription>
            Enter the details for the new sale.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lotNumber" className="text-right">
                Lot #
              </Label>
              <Input
                id="lotNumber"
                value={formData.lotNumber}
                onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bidderNumber" className="text-right">
                Bidder #
              </Label>
              <Input
                id="bidderNumber"
                value={formData.bidderNumber}
                onChange={(e) => setFormData({ ...formData, bidderNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Item
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Sale"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
