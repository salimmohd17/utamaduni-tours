import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { ContentProvider } from './context/ContentContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import Adventures from './pages/Adventures'
import Moments from './pages/Moments'
import About from './pages/About'
import Book from './pages/Book'
import Admin from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={[
        'fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#d4a017] bg-green-800 text-white shadow-lg transition-all duration-300 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      ].join(' ')}
    >
      <ArrowUp size={20} className="sm:h-5 sm:w-5" />
    </button>
  )
}

export default function App() {
  return (
    <ContentProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/adventures" element={<Adventures />} />
            <Route path="/moments" element={<Moments />} />
            <Route path="/about" element={<About />} />
            <Route path="/book" element={<Book />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <BackToTopButton />
      </div>
    </ContentProvider>
  )
}
