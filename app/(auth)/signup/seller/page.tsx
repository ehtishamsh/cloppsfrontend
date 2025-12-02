import { SellerSignupForm } from "@/components/auth/seller-signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function SellerSignupPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Seller Registration
        </h1>
        <p className="text-sm text-muted-foreground">
          Register as a dealer to sale items in auctions
        </p>
      </div>

      <div className="grid gap-6">
        <SellerSignupForm />
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
