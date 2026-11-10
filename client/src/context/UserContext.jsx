// User auth context
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('utamaduni_user')) } catch { return null }
  })
  const [userToken, setUserToken] = useState(() => localStorage.getItem('utamaduni_user_token'))

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password })
    localStorage.setItem('utamaduni_user_token', data.token)
    localStorage.setItem('utamaduni_user', JSON.stringify(data.user))
    setUserToken(data.token)
    setUser(data.user)
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/users/register', { name, email, password })
    localStorage.setItem('utamaduni_user_token', data.token)
    localStorage.setItem('utamaduni_user', JSON.stringify(data.user))
    setUserToken(data.token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('utamaduni_user_token')
    localStorage.removeItem('utamaduni_user')
    setUserToken(null)
    setUser(null)
  }

  // Inject user token into api requests
  useEffect(() => {
    if (userToken) {
      api.defaults.headers.common['X-User-Token'] = userToken
    } else {
      delete api.defaults.headers.common['X-User-Token']
    }
  }, [userToken])

  return (
    <UserContext.Provider value={{ user, userToken, login, register, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
