export interface MarketplaceSettings {
  businessName: string
  email: string
  phone: string
  website?: string
  taxRate: number
  commissionRate: number
  buyersPremium: number
  address: string
  city: string
  state: string
  zip: string
  logoUrl?: string
}

let MOCK_SETTINGS: MarketplaceSettings = {
  businessName: "Acme Auctions",
  email: "admin@acmeauctions.com",
  phone: "555-0123",
  website: "https://acmeauctions.com",
  taxRate: 8.25,
  commissionRate: 10,
  buyersPremium: 15,
  address: "123 Auction Lane",
  city: "New York",
  state: "NY",
  zip: "10001",
}

export const marketplaceService = {
  async getSettings(): Promise<MarketplaceSettings> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { ...MOCK_SETTINGS }
  },

  async updateSettings(settings: MarketplaceSettings): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    MOCK_SETTINGS = { ...settings }
  }
}
