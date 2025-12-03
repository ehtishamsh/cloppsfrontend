export interface User {
  id: string
  email: string
  name: string
  role: "marketplace" | "seller" | "buyer"
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Admin/Marketplace login
    if (email.toLowerCase().includes("admin") || email === "admin@clopps.com") {
      return {
        id: "user_1",
        email,
        name: "Marketplace Admin",
        role: "marketplace",
      }
    }

    // buyer login
    if (email.includes("john@example.com") || email.includes("alice.j@example.com") || email.includes("bob.w@example.com")) {
      return {
        id: "buyer_" + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        role: "buyer",
      }
    }

    // seller login (default)
    return {
      id: "user_2",
      email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      role: "seller",
    }
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
  },

  async getCurrentUser(): Promise<User | null> {
    // In a real app, this would check the session/token
    return null
  }
}
