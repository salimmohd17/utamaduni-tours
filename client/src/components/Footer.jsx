import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'

export default function Footer() {
  const { content } = useContent()

  const destinations = [
    { label: 'Maasai Mara', id: 'mara' },
    { label: 'Amboseli', id: 'amboseli' },
    { label: 'Tsavo', id: 'tsavo' },
    { label: 'Samburu', id: 'samburu' },
    { label: 'Shimba Hills', id: 'shimba' },
    { label: "Hell's Gate", id: 'hellsgate' },
    { label: 'Lamu Island', id: 'lamu' },
    { label: 'Diani Beach', id: 'diani' },
  ]

  return (
    <footer className="bg-green-900 text-green-100">
      {/* Top image strip */}
      <div className="flex h-32 overflow-hidden">
        {[
          '/assets/images/maasai mara ,ostrich.webp',
          '/assets/images/kisite mpunguti dolphine view.jpg',
          '/assets/images/lamu island.jpg',
          '/assets/images/amboseli,giant elephany herds.webp',
          '/assets/images/hells gate,view.webp',
          '/assets/images/tiwi beach.jpg',
        ].map((img, i) => (
          <div
            key={i}
            className="flex-1 bg-cover bg-center hover:flex-[2] transition-all duration-500"
            style={{ backgroundImage: `url('${img}')`, filter: 'brightness(0.6)' }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <img
              src="/assets/images/zebras-hero.jpg"
              alt="Utamaduni Safaris"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#d4a017]"
            />
            <div className="leading-tight">
              <span className="font-display text-lg text-white block">Utamaduni Safaris</span>
              <span className="text-xs text-green-300">Kenya. Wild. Alive.</span>
            </div>
          </div>
          <p className="text-sm text-green-200 leading-relaxed mb-5">
            Kenya's wildlife &amp; coastal safari specialists. Born in Kombani, Kwale — serving all of Kenya with heart and local knowledge.
          </p>
          <div className="flex gap-3">
            <a
              href="https://wa.me/254798157303"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-500 text-white text-xs font-bold hover:bg-green-400 transition shadow"
            >
              💬 WhatsApp
            </a>
            <a
              href="mailto:sirleemmuhammad18@gmail.com"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-800 text-green-100 text-xs font-bold hover:bg-green-700 transition"
            >
              ✉️ Email
            </a>
          </div>
        </div>

        {/* Destinations */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Destinations</h4>
          <div className="space-y-2">
            {destinations.map(d => (
              <Link
                key={d.id}
                to={`/destinations#${d.id}`}
                className="block text-sm text-green-200 hover:text-[#d4a017] transition"
              >
                → {d.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Adventures */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Adventures</h4>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Wildlife Safaris', path: '/adventures' },
              { label: 'Marine Adventures', path: '/adventures' },
              { label: 'Cultural Tours', path: '/adventures' },
              { label: 'Beach Escapes', path: '/adventures' },
              { label: 'Cycling Safaris', path: '/adventures' },
              { label: 'Grand Circuits (7–30 days)', path: '/adventures' },
              { label: 'View All & Pricing', path: '/adventures' },
            ].map(item => (
              <Link key={item.label} to={item.path} className="block text-green-200 hover:text-[#d4a017] transition">
                → {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
          <div className="space-y-3 text-sm text-green-200">
            <p>📍 {content?.address || 'Kombani, Matuga Sub-County, Kwale County, Kenya'}</p>
            <p>📞 <a href="tel:+254798157303" className="hover:text-[#d4a017] transition">+254 798 157 303</a></p>
            <p>📞 <a href="tel:+254750135285" className="hover:text-[#d4a017] transition">+254 750 135 285</a></p>
            <p>✉️ <a href="mailto:sirleemmuhammad18@gmail.com" className="hover:text-[#d4a017] transition break-all">sirleemmuhammad18@gmail.com</a></p>
          </div>

          {/* Quick links */}
          <div className="mt-5 space-y-2 text-sm">
            {[
              { label: 'Book Your Safari', path: '/book' },
              { label: 'About Utamaduni', path: '/about' },
              { label: 'Photo Gallery', path: '/moments' },
            ].map(item => (
              <Link key={item.label} to={item.path} className="block text-green-200 hover:text-[#d4a017] transition">
                → {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* KWS Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <div className="bg-green-800/50 rounded-xl p-4 text-xs text-green-300 leading-relaxed">
          <strong className="text-green-200">Pricing Disclaimer:</strong> All prices displayed are indicative and subject to change. Government park entry fees (KWS / County Government) are set externally and may change without notice. Kenyan citizen and East African resident rates require valid ID at the park gate. Final pricing confirmed at time of booking.
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 pt-4 border-t border-green-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-green-400">
        <span>© {new Date().getFullYear()} Utamaduni Safaris. All rights reserved. <span className="text-green-500">Hakuna Matata.</span></span>
        <a
          href="https://salim-mwamkoba.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 rounded-full bg-green-800 hover:bg-green-700 text-green-300 transition"
        >
          Designed by BMS TECHS
        </a>
      </div>
    </footer>
  )
}
