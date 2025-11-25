"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, Upload, CheckCircle2 } from "lucide-react"
import { marketplaceService, type MarketplaceSettings } from "@/services/marketplace"
import { LoadingSkeleton } from "@/components/shared/loading"

const settingsSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  commissionRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "Commission rate must be between 0 and 100",
  }),
  taxRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "Tax rate must be between 0 and 100",
  }),
  buyersPremium: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "Buyer's premium must be between 0 and 100",
  }),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "Zip code is required"),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(true)
  const [logo, setLogo] = useState<string | null>(null)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      businessName: "",
      email: "",
      phone: "",
      website: "",
      commissionRate: "",
      taxRate: "",
      buyersPremium: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await marketplaceService.getSettings()
      form.reset({
        businessName: settings.businessName,
        email: settings.email,
        phone: settings.phone,
        website: settings.website || "",
        commissionRate: settings.commissionRate.toString(),
        taxRate: settings.taxRate.toString(),
        buyersPremium: settings.buyersPremium.toString(),
        address: settings.address,
        city: settings.city,
        state: settings.state,
        zip: settings.zip,
      })
      if (settings.logoUrl) {
        setLogo(settings.logoUrl)
      }
    } catch (error) {
      toast.error("Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true)
    try {
      // Get current settings to preserve taxRate
      const currentSettings = await marketplaceService.getSettings()
      
      await marketplaceService.updateSettings({
        ...currentSettings,
        ...data,
        commissionRate: Number(data.commissionRate),
        taxRate: Number(data.taxRate),
        buyersPremium: Number(data.buyersPremium),
        logoUrl: logo || undefined,
      })
      toast.success("Settings updated successfully")
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Mock upload - in real app would upload to storage
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading && !form.formState.isDirty) {
    return <LoadingSkeleton />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Business Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Financial Settings</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Tax Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Default sales tax rate for your region.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Commission Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    This rate will be applied to new consignments by default.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buyersPremium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buyer&apos;s Premium (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Additional fee charged to winning bidders.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Address</h3>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Branding</h3>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/10 overflow-hidden relative">
                {logo ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <FormLabel>Marketplace Logo</FormLabel>
              <Input type="file" accept="image/*" onChange={handleLogoChange} />
              <p className="text-sm text-muted-foreground">
                Upload a high-resolution logo for invoices and statements.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
