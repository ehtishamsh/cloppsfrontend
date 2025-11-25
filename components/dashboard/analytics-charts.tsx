"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, LabelList } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

// Mock Data for Revenue Trends
const revenueData = [
  { month: "January", revenue: 18600 },
  { month: "February", revenue: 30500 },
  { month: "March", revenue: 23700 },
  { month: "April", revenue: 73000 },
  { month: "May", revenue: 20900 },
  { month: "June", revenue: 21400 },
]

const revenueConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

// Mock Data for Category Distribution
const categoryData = [
  { category: "Automobiles", sales: 275, fill: "hsl(var(--chart-1))" },
  { category: "Jewelry", sales: 200, fill: "hsl(var(--chart-2))" },
  { category: "Art", sales: 187, fill: "hsl(var(--chart-3))" },
  { category: "Furniture", sales: 173, fill: "hsl(var(--chart-4))" },
  { category: "Other", sales: 90, fill: "hsl(var(--chart-5))" },
]

const categoryConfig = {
  sales: {
    label: "Sales",
  },
  Automobiles: {
    label: "Automobiles",
    color: "hsl(var(--chart-1))",
  },
  Jewelry: {
    label: "Jewelry",
    color: "hsl(var(--chart-2))",
  },
  Art: {
    label: "Art",
    color: "hsl(var(--chart-3))",
  },
  Furniture: {
    label: "Furniture",
    color: "hsl(var(--chart-4))",
  },
  Other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig}>
          <BarChart accessibilityLayer data={revenueData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8}>
                <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total revenue for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

export function CategoryChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sales by Category</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={categoryConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={categoryData}
              dataKey="sales"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
            </Pie>
            <ChartLegend content={<ChartLegendContent />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Automobiles lead by 15% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing sales distribution across categories
        </div>
      </CardFooter>
    </Card>
  )
}
