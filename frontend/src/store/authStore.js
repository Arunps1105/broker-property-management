import { create } from 'zustand'
import { authAPI } from '../api/endpoints'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  login: async (username, password) => {
    set({ loading: true })
    try {
     await authAPI.initialiseCsrf()
      const response = await authAPI.login({ username, password })
      set({ 
        user: response.data.user,
        isAuthenticated: true 
      })
      toast.success('Login successful')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    try {
      await authAPI.logout()
      set({ user: null, isAuthenticated: false })
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Logout failed')
      throw error
    }
  },

  checkAuth: async () => {
    try {
      await authAPI.initialiseCsrf()
      const response = await authAPI.checkAuth()
      set({ 
        user: response.data.user,
        isAuthenticated: response.data.authenticated 
      })
      return response.data
    } catch (error) {
      set({ user: null, isAuthenticated: false })
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}))
