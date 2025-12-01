import { delay } from "@/lib/utils"

export interface SummaryStat {
  title: string
  value: string
  description: string
  icon: "DollarSign" | "Package" | "TrendingUp" | "Users"
}

export interface RecentSale {
  id: string
  item: string
  buyer: string
  amount: string
  date: string
}

export interface PastReport {
  id: string
  eventName: string
  date: string
  totalSales: string
  itemsSold: number
  status: "Closed" | "Archived"
}


// Mock Data
const summaryData: SummaryStat[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "+20.1% from last month",
    icon: "DollarSign",
  },
  {
    title: "Active Events",
    value: "12",
    description: "+2 new this week",
    icon: "Package",
  },
  {
    title: "Total Sales",
    value: "2,345",
    description: "+180 since last hour",
    icon: "TrendingUp",
  },
  {
    title: "Active Cosigners",
    value: "573",
    description: "+201 since last month",
    icon: "Users",
  },
]

const recentSales: RecentSale[] = [
  {
    id: "ORD-001",
    item: "Vintage Rolex Submariner",
    buyer: "John Smith",
    amount: "$12,500.00",
    date: "2024-03-15",
  },
  {
    id: "ORD-002",
    item: "1965 Ford Mustang",
    buyer: "Alice Johnson",
    amount: "$45,000.00",
    date: "2024-03-14",
  },
  {
    id: "ORD-003",
    item: "Eames Lounge Chair",
    buyer: "Robert Wilson",
    amount: "$4,200.00",
    date: "2024-03-14",
  },
  {
    id: "ORD-004",
    item: "Gibson Les Paul 1959",
    buyer: "Mike Brown",
    amount: "$28,000.00",
    date: "2024-03-13",
  },
  {
    id: "ORD-005",
    item: "Diamond Necklace",
    buyer: "Sarah Davis",
    amount: "$8,900.00",
    date: "2024-03-12",
  },
]

const pastReports: PastReport[] = [
  {
    id: "RPT-2024-001",
    eventName: "Winter Estate Auction",
    date: "2024-01-15",
    totalSales: "$125,450.00",
    itemsSold: 45,
    status: "Closed",
  },
  {
    id: "RPT-2023-012",
    eventName: "Holiday Jewelry Special",
    date: "2023-12-20",
    totalSales: "$89,200.00",
    itemsSold: 32,
    status: "Archived",
  },
  {
    id: "RPT-2023-011",
    eventName: "November Art Gala",
    date: "2023-11-10",
    totalSales: "$210,500.00",
    itemsSold: 18,
    status: "Archived",
  },
]


export const reportsService = {
  getSummaryStats: async (): Promise<SummaryStat[]> => {
    await delay(500)
    return summaryData
  },

  getRecentSales: async (): Promise<RecentSale[]> => {
    await delay(500)
    return recentSales
  },

  getPastReports: async (): Promise<PastReport[]> => {
    await delay(500)
    return pastReports
  },


  getEventStats: async (eventId: string) => {
    await delay(500)
    return {
      totalRevenue: "$125,450.00",
      totalItems: 45,
      itemsSold: 38,
      averagePrice: "$3,301.32",
      topSale: "$45,000.00",
      cosigners: 8,
      totalTax: "$10,349.63",
      totalCommission: "$12,545.00",
      totalPayout: "$102,555.37",
      grandTotal: "$148,344.63",
    }
  },

  getSalesByCategory: async (eventId: string) => {
    await delay(500)
    return [
      { category: "Automobiles", count: 15, revenue: "$78,500.00" },
      { category: "Jewelry", count: 12, revenue: "$28,900.00" },
      { category: "Art", count: 8, revenue: "$14,200.00" },
      { category: "Collectibles", count: 3, revenue: "$3,850.00" },
    ]
  },

  getTopSales: async (eventId: string) => {
    await delay(500)
    return [
      { lot: "101", item: "1965 Ford Mustang", price: "$45,000.00", buyer: "John Smith" },
      { lot: "115", item: "Diamond Necklace", price: "$18,500.00", buyer: "Alice Johnson" },
      { lot: "103", item: "Vintage Rolex", price: "$12,000.00", buyer: "Robert Wilson" },
      { lot: "127", item: "Oil Painting", price: "$8,900.00", buyer: "Sarah Davis" },
      { lot: "142", item: "Antique Clock", price: "$6,200.00", buyer: "Mike Brown" },
    ]
  },
}
