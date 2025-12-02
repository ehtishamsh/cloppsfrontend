export interface SellerEvent {
  id: string
  name: string
  date: string
  time: string
  status: "Open" | "Closed"
  enrollmentStatus: "not_enrolled" | "pending" | "approved"
}

export interface Invoice {
  id: string
  eventId: string
  eventName: string
  date: string
  lotsSold: number
  salePrice: number
  commission: number
  totalDue: number
  status: "Paid" | "Pending"
}

export interface SellerSaleItem {
  id: string
  lot: string
  description: string
  price: number
  commission: number
  
  payout: number
  status: "Sold" | "Unsold"
}

const MOCK_AVAILABLE_EVENTS: SellerEvent[] = [
  {
    id: "EVT-001",
    name: "Spring Classic Car Auction",
    date: "2024-04-15",
    time: "10:00 AM",
    status: "Open",
    enrollmentStatus: "approved",
  },
  {
    id: "EVT-002",
    name: "Estate Jewelry Collection",
    date: "2024-05-20",
    time: "11:00 AM",
    status: "Open",
    enrollmentStatus: "not_enrolled",
  },
  {
    id: "EVT-004",
    name: "Vintage Watch Auction",
    date: "2024-07-01",
    time: "2:00 PM",
    status: "Open",
    enrollmentStatus: "pending",
  },
  {
    id: "EVT-005",
    name: "Modern Art & Sculpture",
    date: "2024-08-10",
    time: "9:30 AM",
    status: "Open",
    enrollmentStatus: "not_enrolled",
  },
  {
    id: "EVT-006",
    name: "Rare Books & Manuscripts",
    date: "2024-09-05",
    time: "1:00 PM",
    status: "Open",
    enrollmentStatus: "not_enrolled",
  },
]

const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-2024-001",
    eventId: "EVT-001",
    eventName: "Spring Classic Car Auction",
    date: "2024-04-16",
    lotsSold: 3,
    salePrice: 15000.00,
    commission: 1500.00,
    totalDue: 13500.00, // 15000 - 1500
    status: "Paid",
  },
  {
    id: "INV-2023-089",
    eventId: "EVT-OLD-1",
    eventName: "Winter Art Sale",
    date: "2023-12-10",
    lotsSold: 5,
    salePrice: 500.00,
    commission: 50.00,
    totalDue: 450.00, // 500 - 50
    status: "Paid",
  },
]

// Mock sales data for specific sellers in specific events
const MOCK_SELLER_SALES: Record<string, Record<string, SellerSaleItem[]>> = {
  "1": { // Seller ID 1
    "EVT-001": [ // Event ID EVT-001
      { id: "1", lot: "101", description: "Vintage Vase", price: 500, commission: 50, payout: 410, status: "Sold" },
      { id: "2", lot: "105", description: "Antique Chair", price: 1200, commission: 120, payout: 984, status: "Sold" },
      { id: "3", lot: "108", description: "Porcelain Doll", price: 300, commission: 30, payout: 246, status: "Sold" },
    ],
    "EVT-002": [
      { id: "4", lot: "201", description: "Gold Necklace", price: 2500, commission: 250, payout: 2050, status: "Sold" },
    ]
  },
  "2": {
    "EVT-001": [
      { id: "5", lot: "110", description: "Oil Painting", price: 800, commission: 80, payout: 656, status: "Sold" },
    ]
  }
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const sellerService = {
  async getAvailableEvents(): Promise<SellerEvent[]> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return [...MOCK_AVAILABLE_EVENTS]
  },

  async requestEnrollment(eventId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const event = MOCK_AVAILABLE_EVENTS.find((e) => e.id === eventId)
    if (event) {
      event.enrollmentStatus = "pending"
    }
  },

  async getInvoices(): Promise<Invoice[]> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return [...MOCK_INVOICES]
  },

  async getSellers() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      { id: "SEL-101", name: "Jane Smith", nickname: "Jane's Autos", email: "jane@example.com", phone: "555-0101", status: "approved", items: 25 },
      { id: "SEL-102", name: "Bob Wilson", nickname: "BW Collectibles", email: "bob@example.com", phone: "555-0102", status: "pending", items: 37 },
      { id: "SEL-103", name: "Alice Brown", nickname: "Alice Antiques", email: "alice@example.com", phone: "555-0103", status: "approved", items: 6 },
    ]
  },

  async getSellerDetails(sellerId: string) {
    await delay(500)
    
    // Mock event history for each seller
    const eventHistoryMap: Record<string, any[]> = {
      "1": [
        {
          id: "EVT-001",
          name: "Spring Classic Car Auction",
          date: "2024-04-15",
          status: "Closed",
          itemsSold: 12,
          totalSales: 45000,
          commission: 4500,
      
          netPayout: 36787.50,
        },
        {
          id: "EVT-003",
          name: "Modern Art Showcase",
          date: "2024-06-10",
          status: "Closed",
          itemsSold: 8,
          totalSales: 28000,
          commission: 2800,
      
          netPayout: 22890,
        },
        {
          id: "EVT-005",
          name: "Vintage Tech & Gaming",
          date: "2024-08-15",
          status: "Live",
          itemsSold: 5,
          totalSales: 12000,
          commission: 1200,
        
          netPayout: 9810,
        },
      ],
      "2": [
        {
          id: "EVT-002",
          name: "Estate Jewelry Collection",
          date: "2024-05-20",
          status: "Closed",
          itemsSold: 15,
          totalSales: 62000,
          commission: 6200,
        
          netPayout: 50685,
        },
        {
          id: "EVT-004",
          name: "Rare Coins & Stamps",
          date: "2024-07-05",
          status: "Closed",
          itemsSold: 22,
          totalSales: 38000,
          commission: 3800,
      
          netPayout: 31065,
        },
      ],
      "3": [
        {
          id: "EVT-001",
          name: "Spring Classic Car Auction",
          date: "2024-04-15",
          status: "Closed",
          itemsSold: 6,
          totalSales: 18500,
          commission: 1850,
      
          netPayout: 15123.75,
        },
      ],
    }

    return eventHistoryMap[sellerId] || []
  },

  async getSellerSales(sellerId: string, eventId: string): Promise<SellerSaleItem[]> {
    await delay(600)
    const sales = MOCK_SELLER_SALES[sellerId]?.[eventId] || []
    
    // If no specific mock data exists, generate some random data for demo purposes
    if (sales.length === 0) {
      return Array.from({ length: 5 }).map((_, i) => {
        const price = Math.floor(Math.random() * 1000) + 100
        const commission = Math.floor(price * 0.1)
     
        return {
          id: `mock-${i}`,
          lot: `${100 + i}`,
          description: `Mock Item ${i + 1}`,
          price,
          commission,
       
          payout: price - commission,
          status: "Sold"
        }
      })
    }
    
    return sales
  },

  async addSeller(data: any) {
    await delay(500)
    const newSeller = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      phone: data.phone,
      nickname: data.nickname,
      status: "pending",
      items: 0,
    }
    return newSeller
  },

  async updateSeller(id: string, data: any) {
    await delay(500)
    return {
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      nickname: data.nickname,
      status: "approved",
      items: 12,
    }
  },
}
