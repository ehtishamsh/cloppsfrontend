"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

const basicInfoSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dealerNickname: z.string().min(2, "Dealer nickname is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const addressInfoSchema = z.object({
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "Zip code is required"),
});

const formSchema = basicInfoSchema.merge(addressInfoSchema);

type FormData = z.infer<typeof formSchema>;

export function CosignerSignupForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dealerNickname: "",
      email: "",
      phone: "",
      password: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
    },
    mode: "onChange",
  });

  const { trigger, handleSubmit } = form;

  const onNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (step === 1) {
      fieldsToValidate = [
        "firstName",
        "lastName",
        "dealerNickname",
        "email",
        "phone",
        "password",
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const onBack = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Cosigner Form Data:", data);

    setIsLoading(false);
    toast.success("Cosigner registered successfully!");
    // Redirect would happen here
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step Indicator */}
        <div className="flex justify-center mb-8 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  step >= i
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted text-muted-foreground"
                }`}
              >
                {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
              </div>
              <span className="text-xs mt-1 text-muted-foreground">
                {i === 1 ? "Basic Info" : "Address"}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dealerNickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dealer Nickname</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane's Autos" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jane@example.com"
                      {...field}
                    />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" className="w-full" onClick={onNext}>
              Next: Address Info
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <FormField
              control={form.control}
              name="address1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="456 Oak Ave" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apt 2B" {...field} />
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
                      <Input placeholder="Los Angeles" {...field} />
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
                      <Input placeholder="CA" {...field} />
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
                      <Input placeholder="90001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4 flex-col">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="w-full"
              >
                Back
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Registration
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
