import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function SiteLogo({ size = 36 }) {
  return (
    <img
      src="/hippo.jpg"
      alt="Utamaduni Safaris"
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4a017' }}
    />
  )
}

export { SiteLogo as LionLogo }

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? 'text-green-700' : 'text-stone-700 hover:text-green-700'}`

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-green-50/90 backdrop-blur-md border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <SiteLogo />
          <span className="font-display text-xl font-semibold text-green-900">Utamaduni Safaris</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/destinations" className={linkClass}>Destinations</NavLink>
          <NavLink to="/adventures" className={linkClass}>Adventures</NavLink>
          <NavLink to="/moments" className={linkClass}>Moments</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <Link to="/book" className="px-4 py-2 rounded-full bg-green-700 text-white text-sm font-medium hover:bg-green-900 transition">
            Book Now
          </Link>
          <NavLink to="/admin" className="text-xs text-stone-400 hover:text-stone-600">Admin</NavLink>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="w-6 space-y-1.5">
            <span className={`block h-0.5 bg-green-900 transition ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-green-900 transition ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-green-900 transition ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-green-50 border-t border-green-100 px-4 py-4 space-y-3">
          <NavLink to="/" onClick={() => setOpen(false)} className="block py-2 text-stone-700">Home</NavLink>
          <NavLink to="/destinations" onClick={() => setOpen(false)} className="block py-2 text-stone-700">Destinations</NavLink>
          <NavLink to="/adventures" onClick={() => setOpen(false)} className="block py-2 text-stone-700">Adventures</NavLink>
          <NavLink to="/moments" onClick={() => setOpen(false)} className="block py-2 text-stone-700">Moments</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)} className="block py-2 text-stone-700">About</NavLink>
          <Link to="/book" onClick={() => setOpen(false)} className="block py-2 font-medium text-green-700">Book Now</Link>
          <NavLink to="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm text-stone-400">Admin</NavLink>
        </div>
      )}
    </header>
  )
}
