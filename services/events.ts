import { delay } from "@/lib/utils"

export interface Event {
  id: string
  name: string
  startDate: string
  endDate: string
  time?: string
  location: string
  status: "Draft" | "Scheduled" | "Live" | "Ended" | "Closed"
  description?: string
  itemsCount: number
  totalSales: number
  commissionRate: number
  taxRate: number
  buyersPremium: number
}

export interface SaleEntry {
  id: string
  lotNumber: string
  bidderNumber: string
  buyerName?: string
  sellerId?: string
  title: string
  category?: string
  price: number
  imageUrl?: string
}

const MOCK_EVENTS: Event[] = [
  {
    id: "ENR-001",
    name: "Spring Classic Car Auction",
    startDate: "2024-04-15",
    endDate: "2024-04-15",
    time: "10:00 AM",
    location: "Main Hall A",
    status: "Live",
    description: "Annual classic car auction featuring vintage automobiles",
    itemsCount: 45,
    totalSales: 125000,
    commissionRate: 10,
    taxRate: 8,
    buyersPremium: 15,
  },
  {
    id: "ENR-002",
    name: "Estate Jewelry Collection",
    startDate: "2024-05-20",
    endDate: "2024-05-20",
    time: "2:00 PM",
    location: "Gallery B",
    status: "Scheduled",
    description: "Rare and antique jewelry pieces from private estates",
    itemsCount: 120,
    totalSales: 0,
    commissionRate: 12,
    taxRate: 8,
    buyersPremium: 10,
  },
  {
    id: "ENR-003",
    name: "Modern Art Showcase",
    startDate: "2024-06-10",
    endDate: "2024-06-10",
    time: "6:00 PM",
    location: "City Art Center",
    status: "Draft",
    description: "Contemporary art from emerging artists",
    itemsCount: 0,
    totalSales: 0,
    commissionRate: 15,
    taxRate: 8,
    buyersPremium: 12,
  },
  {
    id: "ENR-004",
    name: "Rare Coins & Stamps",
    startDate: "2024-07-05",
    endDate: "2024-07-05",
    time: "11:00 AM",
    location: "Conference Room C",
    status: "Scheduled",
    description: "Numismatic treasures and philatelic rarities",
    itemsCount: 200,
    totalSales: 0,
    commissionRate: 8,
    taxRate: 5,
    buyersPremium: 10,
  },
  {
    id: "ENR-005",
    name: "Vintage Tech & Gaming",
    startDate: "2024-08-15",
    endDate: "2024-08-15",
    time: "3:00 PM",
    location: "Tech Hub",
    status: "Draft",
    description: "Retro gaming consoles and vintage technology",
    itemsCount: 15,
    totalSales: 0,
    commissionRate: 10,
    taxRate: 8,
    buyersPremium: 10,
  },
]

const MOCK_SALES: SaleEntry[] = [
  { 
    id: "1", 
    lotNumber: "101", 
    bidderNumber: "55", 
    title: "1967 Shelby GT500", 
    price: 185000, 
    category: "Automobiles", 
    buyerName: "John Doe",
    sellerId: "COS-001",
    imageUrl: "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&q=80&w=1000"
  },
  { 
    id: "2", 
    lotNumber: "102", 
    bidderNumber: "12", 
    title: "19th Century Oil Painting", 
    price: 1200, 
    category: "Art", 
    buyerName: "Jane Smith",
    sellerId: "COS-002",
    imageUrl: "https://images.unsplash.com/photo-1578321272128-769a1979a11a?auto=format&fit=crop&q=80&w=1000"
  },
  { 
    id: "3", 
    lotNumber: "103", 
    bidderNumber: "89", 
    title: "Vintage Rolex Submariner", 
    price: 12500, 
    category: "Jewelry", 
    buyerName: "Robert Johnson",
    sellerId: "COS-001",
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1000"
  },
  { 
    id: "4", 
    lotNumber: "104", 
    bidderNumber: "33", 
    title: "Eames Lounge Chair", 
    price: 4500, 
    category: "Furniture", 
    buyerName: "Sarah Williams",
    sellerId: "COS-003",
    imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1000"
  },
  { 
    id: "5", 
    lotNumber: "105", 
    bidderNumber: "12", 
    title: "Gibson Les Paul 1959 Reissue", 
    price: 6500, 
    category: "Musical Instruments", 
    buyerName: "Jane Smith",
    sellerId: "COS-002",
    imageUrl: "https://images.unsplash.com/photo-1550985543-f47f38aee65d?auto=format&fit=crop&q=80&w=1000"
  },
  { 
    id: "6", 
    lotNumber: "106", 
    bidderNumber: "77", 
    title: "Diamond Tennis Bracelet", 
    price: 8900, 
    category: "Jewelry", 
    buyerName: "Michael Brown",
    sellerId: "COS-001",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000"
  },
  { 
    id: "7", 
    lotNumber: "107", 
    bidderNumber: "42", 
    title: "First Edition Harry Potter", 
    price: 2500, 
    category: "Books", 
    buyerName: "Emily Davis",
    sellerId: "COS-004",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1000"
  },
]

export const eventService = {
  async getEvents(): Promise<Event[]> {
    await delay(800)
    return [...MOCK_EVENTS]
  },

  async getEventById(id: string): Promise<Event | undefined> {
    await delay(500)
    return MOCK_EVENTS.find((e) => e.id === id)
  },

  async getEventDetails(id: string) {
    await delay(500)
    const event = MOCK_EVENTS.find((e) => e.id === id)
    if (!event) return null
    
    return {
      ...event,
      stats: {
        totalItems: event.itemsCount || 0,
        totalSales: event.totalSales || 0,
        sellers: 12,
      }
    }
  },

  async createEvent(data: Omit<Event, "id" | "status" | "itemsCount" | "totalSales">): Promise<Event> {
    await delay(1000)
    const newEvent: Event = {
      id: `EVT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...data,
      status: "Draft",
      itemsCount: 0,
      totalSales: 0,
    }
    MOCK_EVENTS.push(newEvent)
    return newEvent
  },

  async updateEvent(id: string, data: Partial<Omit<Event, "id" | "status" | "itemsCount" | "totalSales">>): Promise<Event | undefined> {
    await delay(1000)
    const event = MOCK_EVENTS.find((e) => e.id === id)
    if (event) {
      Object.assign(event, data)
      return event
    }
    return undefined
  },

  async updateStatus(id: string, status: Event["status"]): Promise<void> {
    await delay(500)
    const event = MOCK_EVENTS.find((e) => e.id === id)
    if (event) {
      event.status = status
    }
  },

  async deleteEvent(id: string): Promise<void> {
    await delay(800)
    const index = MOCK_EVENTS.findIndex((e) => e.id === id)
    if (index !== -1) {
      MOCK_EVENTS.splice(index, 1)
    }
  },

  async getSales(eventId: string): Promise<SaleEntry[]> {
    await delay(500)
    return [...MOCK_SALES]
  },

  async addSale(eventId: string, sale: Omit<SaleEntry, "id">): Promise<SaleEntry> {
    await delay(500)
    const newSale = { ...sale, id: Math.random().toString(36).substr(2, 9) }
    MOCK_SALES.push(newSale)
    return newSale
  },

  async getEventBidders(eventId: string) {
    await delay(500)
    return [
      { id: "BID-101", paddleNumber: "101", name: "John Smith", email: "john@example.com", phone: "555-0101", status: "approved", itemsBought: 5, totalSpent: 12500 },
      { id: "BID-102", paddleNumber: "102", name: "Alice Johnson", email: "alice@example.com", phone: "555-0102", status: "approved", itemsBought: 8, totalSpent: 24000 },
      { id: "BID-103", paddleNumber: "103", name: "Bob Wilson", email: "bob@example.com", phone: "555-0103", status: "pending", itemsBought: 0, totalSpent: 0 },
    ]
  },

  async deleteSale(eventId: string, saleId: string): Promise<void> {
    await delay(500)
    const index = MOCK_SALES.findIndex(s => s.id === saleId)
    if (index !== -1) {
      MOCK_SALES.splice(index, 1)
    }
  },

  async getBuyerDetails(buyerId: string) {
    await delay(500)
    // Mock buyer details
    const bidders = await this.getEventBidders("any")
    return bidders.find(b => b.id === buyerId)
  },

  async getBuyerPurchases(buyerId: string, eventId: string) {
    await delay(600)
    // Mock purchases
    return Array.from({ length: 5 }).map((_, i) => {
      const price = Math.floor(Math.random() * 5000) + 100
      const premium = Math.floor(price * 0.15)
      const tax = Math.floor(price * 0.08)
      return {
        id: `purchase-${i}`,
        lot: `${200 + i}`,
        description: `Mock Purchase Item ${i + 1}`,
        price,
        premium,
        tax,
        total: price + premium + tax,
        date: "2024-04-15"
      }
    })
  }
}
