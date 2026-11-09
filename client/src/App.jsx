import { Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <ContentProvider>
      <div className="min-h-screen flex flex-col">
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
      </div>
    </ContentProvider>
  )
}
