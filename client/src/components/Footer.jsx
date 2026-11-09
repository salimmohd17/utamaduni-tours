import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { LionLogo } from './Navbar'

export default function Footer() {
  const { content } = useContent()
  return (
    <footer className="bg-green-900 text-green-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LionLogo />
            <span className="font-display text-xl text-white">Utamaduni Safaris</span>
          </div>
          <p className="text-sm text-green-200 leading-relaxed">
            Kenya's wildlife &amp; coastal safari specialists. Born in Kombani, Kwale — serving all of Kenya.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-white mb-3">Explore</h4>
          <div className="space-y-2 text-sm">
            <Link to="/destinations" className="block hover:text-gold transition">Destinations</Link>
            <Link to="/adventures" className="block hover:text-gold transition">Adventures</Link>
            <Link to="/moments" className="block hover:text-gold transition">Moments</Link>
            <Link to="/book" className="block hover:text-gold transition">Book</Link>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-white mb-3">Company</h4>
          <div className="space-y-2 text-sm">
            <Link to="/about" className="block hover:text-gold transition">About us</Link>
            <Link to="/book" className="block hover:text-gold transition">Contact</Link>
            <Link to="/admin" className="block hover:text-gold transition">Admin</Link>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-white mb-3">Contact Us</h4>
          <p className="text-sm text-green-200">{content?.address || 'Kombani, Kwale, Kenya'}</p>
          <p className="text-sm mt-2">📞 +254798157303</p>
          <p className="text-sm">📞 +254750135285</p>
          <p className="text-sm mt-1">✉️ sirleemmuhammad18@gmail.com</p>
          <a
            href="https://wa.me/254798157303"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-medium hover:bg-green-400 transition"
          >
            💬 WhatsApp Us
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-green-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-green-300">
        <span>© {new Date().getFullYear()} Utamaduni Safaris. All rights reserved. Hakuna matata.</span>
        <a
          href="https://salim-mwamkoba.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 rounded-full bg-green-800 hover:bg-green-700 text-green-200 text-xs transition"
        >
          Designed by BMS TECHS
        </a>
      </div>
    </footer>
  )
}
