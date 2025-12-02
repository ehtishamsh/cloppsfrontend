import { delay } from "@/lib/utils"

export interface BidderEnrollment {
  id: string
  eventId: string
  eventName: string
  status: "pending" | "approved" | "rejected"
  paddleNumber?: string
  date: string
}

export interface BidderPurchase {
  id: string
  lotNumber: string
  itemTitle: string
  price: number
  premium: number
  tax: number
  total: number
  date: string
  eventId: string
  eventName: string
}

export interface BidderStatement {
  id: string
  eventId: string
  eventName: string
  date: string
  totalAmount: number
  status: "paid" | "unpaid"
  url: string
}

export interface AvailableEvent {
  id: string
  name: string
  date: string
  time: string
  location: string
  status: "upcoming" | "live" | "ended"
  enrollmentStatus: "not_enrolled" | "pending" | "approved" | "rejected" | "invited"
  description?: string
}

const MOCK_ENROLLMENTS: BidderEnrollment[] = [
  {
    id: "ENR-001",
    eventId: "1",
    eventName: "Spring Classic Car Auction",
    status: "approved",
    paddleNumber: "105",
    date: "2024-04-15",
  },
  {
    id: "ENR-002",
    eventId: "2",
    eventName: "Estate Jewelry Collection",
    status: "pending",
    date: "2024-05-20",
  },
]

const MOCK_PURCHASES: BidderPurchase[] = [
  {
    id: "PUR-001",
    lotNumber: "105",
    itemTitle: "1965 Ford Mustang",
    price: 45000,
    premium: 6750, // 15%
    tax: 2812.50, // 6.25%
    total: 54562.50,
    date: "2024-04-15",
    eventId: "1",
    eventName: "Spring Classic Car Auction",
  },
  {
    id: "PUR-002",
    lotNumber: "112",
    itemTitle: "Vintage Gas Pump",
    price: 2500,
    premium: 375, // 15%
    tax: 156.25, // 6.25%
    total: 3031.25,
    date: "2024-04-15",
    eventId: "1",
    eventName: "Spring Classic Car Auction",
  },
]

const MOCK_STATEMENTS: BidderStatement[] = [
  {
    id: "STMT-2024-001",
    eventId: "1",
    eventName: "Spring Classic Car Auction",
    date: "2024-04-16",
    totalAmount: 47500, // 45000 + 2500
    status: "unpaid",
    url: "/statements/stmt-001.pdf",
  },
]

const MOCK_AVAILABLE_EVENTS: AvailableEvent[] = [
  {
    id: "1",
    name: "Spring Classic Car Auction",
    date: "2024-04-15",
    time: "10:00 AM",
    location: "Main Hall A",
    status: "upcoming",
    enrollmentStatus: "approved",
    description: "Annual classic car auction featuring vintage automobiles",
  },
  {
    id: "2",
    name: "Estate Jewelry Collection",
    date: "2024-05-20",
    time: "2:00 PM",
    location: "Gallery B",
    status: "upcoming",
    enrollmentStatus: "pending",
    description: "Rare and antique jewelry pieces from private estates",
  },
  {
    id: "3",
    name: "Modern Art Showcase",
    date: "2024-06-10",
    time: "6:00 PM",
    location: "City Art Center",
    status: "upcoming",
    enrollmentStatus: "not_enrolled",
    description: "Contemporary art from emerging artists",
  },
  {
    id: "4",
    name: "Rare Coins & Stamps",
    date: "2024-07-05",
    time: "11:00 AM",
    location: "Conference Room C",
    status: "upcoming",
    enrollmentStatus: "not_enrolled",
    description: "Numismatic treasures and philatelic rarities",
  },
  {
    id: "5",
    name: "Vintage Tech & Gaming",
    date: "2024-08-15",
    time: "3:00 PM",
    location: "Tech Hub",
    status: "upcoming",
    enrollmentStatus: "rejected",
    description: "Retro gaming consoles and vintage technology",
  },
  {
    id: "6",
    name: "Luxury Handbags & Accessories",
    date: "2024-09-20",
    time: "1:00 PM",
    location: "Fashion District Hall",
    status: "upcoming",
    enrollmentStatus: "invited",
    description: "Exclusive collection of designer handbags and accessories",
  },
]

export const bidderService = {
  getEnrollments: async (): Promise<BidderEnrollment[]> => {
    await delay(500)
    return MOCK_ENROLLMENTS
  },

  getPurchases: async (): Promise<BidderPurchase[]> => {
    await delay(500)
    return MOCK_PURCHASES
  },

  getStatements: async (): Promise<BidderStatement[]> => {
    await delay(500)
    return MOCK_STATEMENTS
  },

  getAvailableEvents: async (): Promise<AvailableEvent[]> => {
    await delay(800)
    return MOCK_AVAILABLE_EVENTS
  },

  requestEnrollment: async (eventId: string): Promise<void> => {
    await delay(1000)
    // In a real app, this would send a request to the backend
    const event = MOCK_AVAILABLE_EVENTS.find(e => e.id === eventId)
    if (event) {
      event.enrollmentStatus = "pending"
    }
  },

  respondToInvitation: async (eventId: string, accept: boolean): Promise<void> => {
    await delay(1000)
    const event = MOCK_AVAILABLE_EVENTS.find(e => e.id === eventId)
    if (event) {
      event.enrollmentStatus = accept ? "approved" : "rejected"
    }
  },

  register: async (data: any): Promise<void> => {
    await delay(1000)
    // In a real app, this would create a new bidder account
    console.log("Registered bidder:", data)
  },
}
