import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user } = useUser()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const isTransparent = isHome && !scrolled

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? isTransparent ? 'text-[#d4a017]' : 'text-green-700'
        : isTransparent ? 'text-white/90 hover:text-[#d4a017]' : 'text-stone-700 hover:text-green-700'
    }`

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      isTransparent
        ? 'bg-transparent border-transparent'
        : 'bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/assets/hippo.jpg"
            alt="Utamaduni Safaris"
            className="w-9 h-9 rounded-full object-cover border-2 border-[#d4a017] shadow group-hover:scale-110 transition duration-300"
          />
          <div className="leading-none">
            <span className={`font-display text-lg font-semibold block transition-colors duration-500 ${isTransparent ? 'text-white' : 'text-green-900'}`}>
              Utamaduni Safaris
            </span>
            <span className={`text-xs transition-colors duration-500 ${isTransparent ? 'text-white/60' : 'text-stone-400'}`}>
              Kenya. Wild. Alive.
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/destinations" className={linkClass}>Destinations</NavLink>
          <NavLink to="/adventures" className={linkClass}>Adventures</NavLink>
          <NavLink to="/moments" className={linkClass}>Moments</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          {/* My Bookings — shows user name when logged in */}
          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? isTransparent ? 'text-[#d4a017]' : 'text-green-700'
                  : isTransparent ? 'text-white/90 hover:text-[#d4a017]' : 'text-stone-700 hover:text-green-700'
              }`
            }
          >
            {user ? `📋 ${user.name.split(' ')[0]}` : 'My Bookings'}
          </NavLink>
          <Link
            to="/book"
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow hover:shadow-md hover:scale-105 ${
              isTransparent
                ? 'bg-[#d4a017] text-green-900 hover:bg-yellow-400'
                : 'bg-green-700 text-white hover:bg-green-900'
            }`}
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="w-6 space-y-1.5">
            <span className={`block h-0.5 transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-green-900'} ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-green-900'} ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-0.5 transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-green-900'} ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="bg-white border-t border-green-100 px-4 py-5 space-y-1 shadow-lg">
          {[
            { to: '/', label: '🏠 Home', end: true },
            { to: '/destinations', label: '📍 Destinations' },
            { to: '/adventures', label: '🧭 Adventures' },
            { to: '/moments', label: '📸 Moments' },
            { to: '/about', label: '👥 About' },
            { to: '/my-bookings', label: user ? `📋 My Bookings (${user.name.split(' ')[0]})` : '📋 My Bookings' },
          ].map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'bg-green-50 text-green-700' : 'text-stone-700 hover:bg-green-50 hover:text-green-700'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/book" className="block px-4 py-3 rounded-full bg-green-700 text-white text-center font-bold hover:bg-green-900 transition mt-2">
            Book Now
          </Link>
          <a
            href="https://wa.me/254798157303"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 rounded-full bg-green-500 text-white text-center font-bold hover:bg-green-600 transition text-sm"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}
