export interface CosignerEvent {
  id: string
  name: string
  date: string
  location: string
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
  salesTax: number
  totalDue: number
  status: "Paid" | "Pending"
}

const MOCK_AVAILABLE_EVENTS: CosignerEvent[] = [
  {
    id: "EVT-001",
    name: "Spring Classic Car Auction",
    date: "2024-04-15",
    location: "Main Hall A",
    status: "Open",
    enrollmentStatus: "approved",
  },
  {
    id: "EVT-002",
    name: "Estate Jewelry Collection",
    date: "2024-05-20",
    location: "Gallery B",
    status: "Open",
    enrollmentStatus: "not_enrolled",
  },
  {
    id: "EVT-004",
    name: "Vintage Watch Auction",
    date: "2024-07-01",
    location: "Online",
    status: "Open",
    enrollmentStatus: "pending",
  },
  {
    id: "EVT-005",
    name: "Modern Art & Sculpture",
    date: "2024-08-10",
    location: "City Art Center",
    status: "Open",
    enrollmentStatus: "not_enrolled",
  },
  {
    id: "EVT-006",
    name: "Rare Books & Manuscripts",
    date: "2024-09-05",
    location: "Library Hall",
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
    salesTax: 1200.00,
    totalDue: 12300.00,
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
    salesTax: 40.00,
    totalDue: 410.00,
    status: "Paid",
  },
]

export const cosignerService = {
  async getAvailableEvents(): Promise<CosignerEvent[]> {
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

  async getCosigners() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      { id: "1", name: "Jane Smith", nickname: "Jane's Autos", status: "approved", items: 12 },
      { id: "2", name: "Bob Wilson", nickname: "BW Collectibles", status: "pending", items: 0 },
      { id: "3", name: "Alice Brown", nickname: "Alice Antiques", status: "pending", items: 0 },
    ]
  }
}
