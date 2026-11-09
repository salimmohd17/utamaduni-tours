import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const { data } = await api.get('/content')
      setContent(data)
    } catch (e) {
      console.error(e)
      // fallback minimal
      setContent({
        siteName: 'Utamaduni Safaris',
        tagline: 'Ladha ya Utamaduni',
        about: 'Wildlife & coastal tourism from Kombani, Kwale, Kenya.',
        destinations: [],
        adventures: [],
        gallery: []
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <ContentContext.Provider value={{ content, loading, refresh: load, setContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  return useContext(ContentContext)
}
