import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary/10">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Image
              src="/logo.png"
              alt="Clopps"
              width={180}
              height={60}
              style={{ maxWidth: "100%", maxHeight: "60px" }}
            />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#solutions"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Solutions
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="font-medium shadow-lg shadow-primary/20"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-background shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              New: Automated Tax Reporting
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-5xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
              The Operating System for <br />
              <span className="text-primary">Modern Auctions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Streamline operations, manage cosigners, and automate financials
              with the most powerful platform built for forward-thinking
              auctioneers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
                >
                  Start Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base bg-background/50 backdrop-blur-sm hover:bg-background/80"
                >
                  Join as Cosigner
                </Button>
              </Link>
            </div>

            {/* Hero Image / Dashboard Preview */}
            <div className="mt-20 rounded-xl border bg-background/50 backdrop-blur-sm shadow-2xl max-w-6xl mx-auto flex items-center justify-center relative overflow-hidden group animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 ring-1 ring-white/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />
              {/* Abstract UI representation */}
              <Image
                src="/dashboard.png"
                alt="Dashboard Preview"
                width={1200}
                height={675}
                className="relative z-10 w-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-8">
              TRUSTED BY LEADING AUCTION HOUSES
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos */}
              <div className="h-8 w-32 bg-foreground/20 rounded" />
              <div className="h-8 w-32 bg-foreground/20 rounded" />
              <div className="h-8 w-32 bg-foreground/20 rounded" />
              <div className="h-8 w-32 bg-foreground/20 rounded" />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Everything you need to scale
              </h2>
              <p className="text-xl text-muted-foreground">
                From inventory management to final payouts, Clopps handles the
                heavy lifting so you can focus on growing your business.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-muted/30 border-none shadow-none hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl mb-2">
                    Event Management
                  </CardTitle>
                  <p className="text-muted-foreground leading-relaxed">
                    Create and schedule auction events effortlessly. Manage
                    lots, timelines, and locations in one unified interface.
                  </p>
                </CardHeader>
              </Card>

              <Card className="bg-muted/30 border-none shadow-none hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl mb-2">
                    Cosigner Portal
                  </CardTitle>
                  <p className="text-muted-foreground leading-relaxed">
                    Give your cosigners a dedicated dashboard to track their
                    items, view sales, and download invoices automatically.
                  </p>
                </CardHeader>
              </Card>

              <Card className="bg-muted/30 border-none shadow-none hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-600">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl mb-2">
                    Financial Automation
                  </CardTitle>
                  <p className="text-muted-foreground leading-relaxed">
                    Stop using spreadsheets. Automatically calculate
                    commissions, taxes, and generate professional invoices
                    instantly.
                  </p>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Highlight */}
        <section className="py-24 border-t">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Real-time insights for <br />
                  <span className="text-primary">smarter decisions</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Track your auction performance as it happens. Monitor bids,
                  sales velocity, and revenue in real-time with our advanced
                  analytics dashboard.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Live revenue tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="font-medium">
                      Bidder engagement metrics
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="font-medium">
                      Automated post-sale reporting
                    </span>
                  </li>
                </ul>
                <Button size="lg" variant="secondary">
                  View Live Demo
                </Button>
              </div>
              <div className="relative rounded-2xl border bg-muted/50 aspect-square flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl" />
                <div className="relative bg-background rounded-xl shadow-2xl w-full h-full border p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-24 bg-muted/50 rounded" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10" />
                  </div>
                  <div className="flex-1 flex items-end gap-4">
                    <div className="w-full bg-primary/20 rounded-t-lg h-[40%]" />
                    <div className="w-full bg-primary/40 rounded-t-lg h-[70%]" />
                    <div className="w-full bg-primary/60 rounded-t-lg h-[50%]" />
                    <div className="w-full bg-primary rounded-t-lg h-[85%]" />
                    <div className="w-full bg-primary/80 rounded-t-lg h-[60%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-24 text-center relative overflow-hidden">
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                  Ready to modernize your auctions?
                </h2>
                <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto">
                  Join hundreds of marketplaces using Clopps to scale their
                  operations and delight their cosigners.
                </p>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-14 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                  >
                    Get Started for Free
                  </Button>
                </Link>
              </div>
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-16 bg-muted/10">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Image
                src="/logo.png"
                alt="Clopps"
                width={180}
                height={60}
                style={{ maxWidth: "100%", maxHeight: "60px" }}
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The complete operating system for modern auction marketplaces.
              Built for speed, reliability, and growth.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2024 Clopps Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
