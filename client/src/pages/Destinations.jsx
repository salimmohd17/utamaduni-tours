import { useContent } from '../context/ContentContext'
import { Link } from 'react-router-dom'
import { ExternalLink, MapPin } from 'lucide-react'

// Official links for each destination
const officialLinks = {
  shimba:    { url: 'https://www.kws.go.ke/parks/shimba-hills-national-reserve', label: 'KWS — Shimba Hills' },
  diani:     { url: 'https://www.magicalkenya.com/destinations/coast/', label: 'Magical Kenya — Diani' },
  kisite:    { url: 'https://www.kws.go.ke/parks/kisite-mpunguti-marine-national-park', label: 'KWS — Kisite-Mpunguti' },
  kaya:      { url: 'https://whc.unesco.org/en/list/1231/', label: 'UNESCO — Sacred Kaya Forests' },
  mara:      { url: 'https://www.maasaimara.com/', label: 'Maasai Mara Official' },
  amboseli:  { url: 'https://www.kws.go.ke/parks/amboseli-national-park', label: 'KWS — Amboseli' },
  tsavo:     { url: 'https://www.kws.go.ke/parks/tsavo-east-national-park', label: 'KWS — Tsavo' },
  mtknya:    { url: 'https://www.kws.go.ke/parks/mount-kenya-national-park-and-reserve', label: 'KWS — Mount Kenya' },
  nakuru:    { url: 'https://www.kws.go.ke/parks/lake-nakuru-national-park', label: 'KWS — Lake Nakuru' },
  samburu:   { url: 'https://www.kws.go.ke/parks/samburu-national-reserve', label: 'KWS — Samburu' },
  hellsgate: { url: 'https://www.kws.go.ke/parks/hells-gate-national-park', label: "KWS — Hell's Gate" },
  lamu:      { url: 'https://whc.unesco.org/en/list/1055/', label: 'UNESCO — Lamu Old Town' },
  watamu:    { url: 'https://www.kws.go.ke/parks/watamu-marine-national-park', label: 'KWS — Watamu' },
  malindi:   { url: 'https://www.kws.go.ke/parks/malindi-marine-national-park', label: 'KWS — Malindi Marine' },
  // Forests & Museums
  fortjesus: { url: 'https://www.museums.or.ke/fort-jesus/', label: 'National Museums — Fort Jesus' },
  gedruins:  { url: 'https://www.museums.or.ke/gede-ruins/', label: 'National Museums — Gede Ruins' },
  arabuko:   { url: 'https://www.kws.go.ke/parks/arabuko-sokoke-forest-reserve', label: 'KWS — Arabuko-Sokoke Forest' },
  kakamega:  { url: 'https://www.kws.go.ke/parks/kakamega-forest-national-reserve', label: 'KWS — Kakamega Forest' },
  karura:    { url: 'https://www.friendsofkarura.org/', label: 'Friends of Karura Forest' },
  nairobinm: { url: 'https://www.museums.or.ke/nairobi-national-museum/', label: 'National Museums of Kenya' },
}

// Better images using the uploaded local pics
const destinationImages = {
  shimba:    '/assets/shimba hills waterfals.jpg',
  diani:     '/assets/galu kinondo beach from above.jpg',
  kisite:    '/assets/kisite mpunguti dolphine view.jpg',
  kaya:      '/assets/historic site, gedi ruins.jpg',
  mara:      '/assets/maasai mara ,ostrich.webp',
  amboseli:  '/assets/amboseli,giant elephany herds.webp',
  tsavo:     '/assets/tsavo 1.jpg',
  mtknya:    '/assets/m elgon national park.jpg',
  nakuru:    '/assets/ol pojeta conservercy , rhino.webp',
  samburu:   '/assets/samburu ,crystal pool.webp',
  hellsgate: '/assets/hells gate,view.webp',
  lamu:      '/assets/lamu island.jpg',
  watamu:    '/assets/malindi marine 2.jpg',
  malindi:   '/assets/malindi beach.jpg',
  // Forests & Museums
  fortjesus: '/assets/fort jesus museams.jpg',
  gedruins:  '/assets/historic site, gedi ruins.jpg',
  arabuko:   '/assets/nairobi nature walk.jpg',
  kakamega:  '/assets/shimba hills waterfals.jpg',
  karura:    '/assets/nairobi nature walk.jpg',
  nairobinm: '/assets/mombasa old town.jpg',
}

export default function Destinations() {
  const { content, loading } = useContent()
  if (loading) return <div className="pt-24 text-center text-green-700 min-h-screen flex items-center justify-center"><span className="text-xl animate-pulse">Loading destinations…</span></div>

  const destinations = content?.destinations || []

  return (
    <div className="pt-20 pb-20 bg-[#f0fdf4]">
      {/* Hero Header — mobile-safe (no backgroundAttachment:fixed on mobile) */}
      <div className="relative text-white py-24 sm:py-28">
        <img
          src="/assets/samburu ,crystal pool.webp"
          alt="Destinations hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-900/60 to-green-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">Destinations</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mt-3 text-white drop-shadow-2xl">Places We Love</h1>
          <p className="mt-5 text-green-100 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            From the Maasai Mara to Diani Beach — every corner of Kenya, one trusted team.
          </p>
        </div>
      </div>

      {/* Destination articles — NO pill listing at top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-24 mt-16">
        {destinations.map((d, i) => (
          <article
            id={d.id}
            key={d.id}
            className={`grid md:grid-cols-2 gap-8 sm:gap-12 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
          >
            {/* Image */}
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative group">
              <img
                src={destinationImages[d.id] || d.image}
                alt={d.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
              {/* Official link badge on hover */}
              {officialLinks[d.id] && (
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition duration-300">
                  <a
                    href={officialLinks[d.id].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#d4a017] text-green-900 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-yellow-400 transition shadow"
                  >
                    <ExternalLink size={11} /> {officialLinks[d.id].label}
                  </a>
                </div>
              )}
            </div>

            {/* Text */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-[#d4a017]" />
                <span className="text-[#d4a017] text-sm font-medium uppercase tracking-wider">Kenya</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-green-900 mb-4 leading-tight">{d.title}</h2>
              <p className="text-stone-600 leading-relaxed mb-6 text-base sm:text-lg">{d.description}</p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(d.highlights || []).map((h) => (
                  <span key={h} className="px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium border border-green-200">
                    {h}
                  </span>
                ))}
              </div>

              {/* Official Link */}
              {officialLinks[d.id] && (
                <a
                  href={officialLinks[d.id].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-900 font-semibold mb-6 border-b border-green-200 hover:border-green-900 transition pb-0.5"
                >
                  <ExternalLink size={14} />
                  {officialLinks[d.id].label} ↗
                </a>
              )}

              <div className="flex flex-wrap gap-3 mt-2">
                <Link
                  to={`/book?adventure=${d.id}`}
                  className="inline-block px-7 py-3 rounded-full bg-green-700 text-white text-sm font-bold hover:bg-green-900 transition shadow-lg hover:shadow-xl hover:scale-105 duration-200"
                >
                  Book This Destination
                </Link>
                <Link
                  to="/adventures"
                  className="inline-block px-7 py-3 rounded-full border-2 border-green-700 text-green-700 text-sm font-semibold hover:bg-green-700 hover:text-white transition"
                >
                  See All Adventures
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-24 mx-4 sm:mx-8 rounded-3xl overflow-hidden relative py-20 px-8 text-center">
        <img
          src="/assets/view.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-green-900/85" />
        <div className="relative">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Ready to Explore All of Kenya?</h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto leading-relaxed">
            Our team will design a custom circuit hitting your favourite destinations — wildlife, culture, and coast.
          </p>
          <Link to="/book" className="inline-block px-10 py-4 rounded-full bg-[#d4a017] text-green-900 font-bold text-lg hover:bg-yellow-400 transition shadow-xl hover:scale-105 duration-200">
            Plan My Kenya Trip
          </Link>
        </div>
      </div>
    </div>
  )
}
