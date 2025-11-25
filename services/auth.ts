export interface User {
  id: string
  email: string
  name: string
  role: "marketplace" | "cosigner"
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email.toLowerCase().includes("admin")) {
      return {
        id: "user_1",
        email,
        name: "Marketplace Admin",
        role: "marketplace",
      }
    }

    return {
      id: "user_2",
      email,
      name: "John Doe",
      role: "cosigner",
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
