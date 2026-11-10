import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  // Admin token
  const token = localStorage.getItem('utamaduni_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  // User token (for /users/bookings endpoint)
  const userToken = localStorage.getItem('utamaduni_user_token')
  if (userToken && !token) config.headers.Authorization = `Bearer ${userToken}`
  return config
})

export default api
