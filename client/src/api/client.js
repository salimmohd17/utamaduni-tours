import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const url = config.url || ''

  // Admin-only routes: use admin token
  const isAdminRoute = url.startsWith('/admin')
  const adminToken = localStorage.getItem('utamaduni_token')

  // User routes: use user token
  const userToken = localStorage.getItem('utamaduni_user_token')

  if (isAdminRoute && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`
  } else if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  }

  return config
})

export default api
