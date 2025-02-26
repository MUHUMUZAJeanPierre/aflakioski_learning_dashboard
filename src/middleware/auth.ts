import { authApi } from './api'

const authService = {
  login: async (credentials) => {
    const response = await authApi.login(credentials)
    localStorage.setItem('token', response.data.token)
    return response
  },

  register: async (userData) => {
    const response = await authApi.register(userData)
    return response
  },

  logout: () => {
    localStorage.removeItem('token')
  },

  verifyEmail: async (token) => {
    const response = await authApi.verifyEmail(token)
    return response
  },

  forgotPassword: async (email) => {
    const response = await authApi.forgotPassword(email)
    return response
  },

  resetPassword: async (token, password) => {
    const response = await authApi.resetPassword(token, password)
    return response
  }
}

export default authService

