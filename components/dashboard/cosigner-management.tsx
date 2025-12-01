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
import { Check, X, UserPlus, Mail, Printer, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { cosignerService } from "@/services/cosigner"
import { AddCosignerDialog } from "@/components/dashboard/add-cosigner-dialog"
import { InviteCosignerDialog } from "@/components/dashboard/invite-cosigner-dialog"
import { LoadingSkeleton } from "@/components/shared/loading"
import { Pencil } from "lucide-react"

interface CosignerManagementProps {
  eventId?: string
}

export function CosignerManagement({ eventId }: CosignerManagementProps) {
  const [cosigners, setCosigners] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingCosigner, setEditingCosigner] = useState<any>(null)

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

  const handleDelete = (id: string) => {
    setCosigners(cosigners.filter(c => c.id !== id))
    toast.success("Cosigner deleted")
  }

  const handleAddCosigner = async (data: any) => {
    try {
      if (editingCosigner) {
        const updated = await cosignerService.updateCosigner(editingCosigner.id, data)
        setCosigners(cosigners.map(c => c.id === updated.id ? updated : c))
        toast.success("Cosigner updated successfully")
      } else {
        const newCosigner = await cosignerService.addCosigner(data)
        setCosigners([...cosigners, newCosigner])
        toast.success("Cosigner added successfully")
      }
    } catch (error) {
      toast.error("Failed to save cosigner")
    }
  }

  const openEdit = (cosigner: any) => {
    setEditingCosigner(cosigner)
    setIsAddOpen(true)
  }

  const openAdd = () => {
    setEditingCosigner(null)
    setIsAddOpen(true)
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Enrolled Cosigners</h3>
        <div className="flex gap-2">
          {eventId && <InviteCosignerDialog eventId={eventId} />}
          <Button size="sm" onClick={openAdd}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Cosigner
          </Button>
        </div>
        <AddCosignerDialog 
          open={isAddOpen} 
          onOpenChange={setIsAddOpen}
          onSuccess={handleAddCosigner}
          initialData={editingCosigner}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cosigner ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Items Sold</TableHead>
              <TableHead className="text-center">Invoice</TableHead>
              <TableHead className="text-center">View Sales</TableHead>
              <TableHead className="text-right">Status & Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cosigners.map((cosigner) => (
              <TableRow key={cosigner.id}>
                <TableCell className="font-medium">{cosigner.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {cosigner.name}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 text-muted-foreground hover:text-primary"
                      onClick={() => openEdit(cosigner)}
                      title="Edit"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">{cosigner.items}</TableCell>
                <TableCell className="text-center">
                  {cosigner.status === 'approved' && (
                    <div className="flex justify-center gap-2">
                       <Button variant="ghost" size="icon" title="Email Invoice">
                         <Mail className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" title="Print Invoice">
                         <Printer className="h-4 w-4" />
                       </Button>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                   <Button 
                     variant="ghost" 
                     size="icon"
                     asChild
                     title="View Sales Details"
                   >
                     <a href={`/marketplace/events/${eventId}/cosigner/${cosigner.id}`}>
                       <Eye className="h-4 w-4" />
                     </a>
                   </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Badge variant={cosigner.status === 'approved' ? 'default' : 'secondary'}>
                      {cosigner.status}
                    </Badge>
                    
                    {cosigner.status !== 'approved' && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                        onClick={() => handleStatusChange(cosigner.id, 'approved')}
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}

                    {cosigner.status !== 'rejected' && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                        onClick={() => handleStatusChange(cosigner.id, 'rejected')}
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}

                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDelete(cosigner.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
