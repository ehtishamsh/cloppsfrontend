"use client"
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, UserPlus } from "lucide-react"
import { toast } from "sonner"
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
import { cosignerService } from "@/services/cosigner"
import { LoadingSkeleton } from "@/components/shared/loading"

export function CosignerManagement() {
  const [cosigners, setCosigners] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  useEffect(() => {
    loadCosigners()
  }, [])

  const loadCosigners = async () => {
    try {
      const data = await cosignerService.getCosigners()
      setCosigners(data)
    } catch (error) {
      toast.error("Failed to load cosigners")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setCosigners(cosigners.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ))
    toast.success(`Cosigner ${newStatus === 'approved' ? 'approved' : 'rejected'}`)
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    setIsInviteOpen(false)
    toast.success("Invitation sent successfully")
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Enrolled Cosigners</h3>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Cosigner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Cosigner</DialogTitle>
              <DialogDescription>
                Send an invitation to a cosigner to join this event.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" placeholder="cosigner@example.com" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Send Invitation</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cosigners.map((cosigner) => (
              <TableRow key={cosigner.id}>
                <TableCell className="font-medium">{cosigner.name}</TableCell>
                <TableCell>{cosigner.nickname}</TableCell>
                <TableCell>
                  <Badge variant={cosigner.status === 'approved' ? 'default' : 'secondary'}>
                    {cosigner.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{cosigner.items}</TableCell>
                <TableCell className="text-right">
                  {cosigner.status === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                        onClick={() => handleStatusChange(cosigner.id, 'approved')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                        onClick={() => handleStatusChange(cosigner.id, 'rejected')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
