import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { Globe, PawPrint, Waves, Map } from 'lucide-react'

const stats = [
  { num: '47+', label: 'Parks & Reserves' },
  { num: '100%', label: 'Local Guides' },
  { num: '5★', label: 'Rated' },
  { num: '200+', label: 'Happy Clients' }
]

const whyUs = [
  { Icon: Globe,    title: 'All Kenya',            desc: 'From Maasai Mara to Diani — we operate across every corner of Kenya, not just one region.' },
  { Icon: PawPrint, title: 'Wildlife Experts',      desc: "Deep knowledge of Kenya's Big Five, marine life, birdlife, and rare species like sable antelope." },
  { Icon: Waves,    title: 'Coastal Specialists',   desc: 'Born on the coast — we know Diani, Watamu, Lamu and every hidden beach and reef.' },
  { Icon: Map,      title: 'Custom Itineraries',    desc: 'No cookie-cutter tours. Every trip is crafted around your dates, budget and dream experiences.' }
]

export default function Home() {
  const { content } = useContent()

  return (
    <div>
      {/* Hero */}
      <section
        className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/zebras-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-white font-semibold leading-tight mb-6 drop-shadow-lg">
            Kenya. <span className="text-[#d4a017]">Wild.</span> Alive.
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">
            From the Savannah to the Ocean – We Take You Everywhere in Kenya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book" className="px-8 py-3.5 rounded-full bg-[#d4a017] text-green-900 font-semibold hover:bg-yellow-400 transition shadow-lg">
              Start Your Adventure
            </Link>
            <Link to="/destinations" className="px-8 py-3.5 rounded-full border-2 border-white/80 text-white font-medium hover:bg-white/10 transition">
              Explore Kenya
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <span className="animate-bounce text-lg">↓</span>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[#d4a017] text-sm font-medium tracking-widest uppercase">Our Reach</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mt-2">We Travel All Kenya</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl text-[#d4a017] font-semibold">{s.num}</div>
                <div className="text-green-200 mt-2 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wildlife Photo Showcase Strip */}
      <section className="py-0 overflow-hidden">
        <div className="flex h-64 md:h-80">
          <div
            className="flex-1 bg-cover bg-center hover:flex-[2] transition-all duration-500 cursor-pointer relative group"
            style={{ backgroundImage: 'url(/assets/wildlife-reserve.jpg)' }}
          >
            <div className="absolute inset-0 bg-green-900/40 group-hover:bg-green-900/20 transition duration-500 flex items-end p-4">
              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition duration-300">🦓 Wildlife Reserve</span>
            </div>
          </div>
          <div
            className="flex-1 bg-cover bg-center hover:flex-[2] transition-all duration-500 cursor-pointer relative group"
            style={{ backgroundImage: 'url(/assets/wildbeest-migration.jpg)' }}
          >
            <div className="absolute inset-0 bg-green-900/40 group-hover:bg-green-900/20 transition duration-500 flex items-end p-4">
              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition duration-300">🦬 Great Migration</span>
            </div>
          </div>
          <div
            className="flex-1 bg-cover bg-center hover:flex-[2] transition-all duration-500 cursor-pointer relative group"
            style={{ backgroundImage: 'url(/assets/elephants.jpg)' }}
          >
            <div className="absolute inset-0 bg-green-900/40 group-hover:bg-green-900/20 transition duration-500 flex items-end p-4">
              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition duration-300">🐘 Elephants</span>
            </div>
          </div>
          <div
            className="flex-1 bg-cover bg-center hover:flex-[2] transition-all duration-500 cursor-pointer relative group"
            style={{ backgroundImage: 'url(/assets/zebras-hero.jpg)' }}
          >
            <div className="absolute inset-0 bg-green-900/40 group-hover:bg-green-900/20 transition duration-500 flex items-end p-4">
              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition duration-300">🦓 Zebra Plains</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-green-700 text-sm font-medium tracking-widest uppercase">Why Us</span>
            <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">Why Choose Utamaduni Safaris</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((w) => (
              <div key={w.title} className="bg-green-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-green-700 text-white flex items-center justify-center mb-4">
                  <w.Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl text-green-900 mb-2">{w.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations preview */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-green-700 text-sm font-medium tracking-widest uppercase">Destinations</span>
            <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">Kenya's Finest Destinations</h2>
            <p className="text-stone-600 mt-3">Every ecosystem. Every adventure. One trusted team.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(content?.destinations || []).map((d) => (
              <Link key={d.id} to={`/destinations#${d.id}`} className="group rounded-2xl overflow-hidden bg-white border border-green-100 hover:shadow-xl transition">
                <div
                  className="aspect-[4/3] bg-cover bg-center group-hover:scale-105 transition duration-500"
                  style={{ backgroundImage: `url(${d.image})` }}
                />
                <div className="p-5">
                  <h3 className="font-display text-lg text-green-900 mb-1">{d.title}</h3>
                  <p className="text-sm text-stone-600 line-clamp-2">{d.short}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/destinations" className="px-6 py-3 rounded-full border border-green-700 text-green-700 font-medium hover:bg-green-700 hover:text-white transition">
              View all destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#d4a017] text-sm font-medium tracking-widest uppercase">Moments</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mt-2">Feel the Excitement</h2>
            <p className="text-green-200 mt-3">Real Kenya. Real wildlife. Real adventure.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative pb-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/BHACKCNDMW8?autoplay=1&mute=1&loop=1&playlist=BHACKCNDMW8"
                  title="Kenya Wildlife"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
              <div className="bg-green-800 p-4 text-center">
                <p className="text-green-100 font-medium">🦁 Kenya Wildlife – Safari Experience</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative pb-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/zLTCJm5JQKM?autoplay=1&mute=1&loop=1&playlist=zLTCJm5JQKM"
                  title="Ocean & Diving"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
              <div className="bg-green-800 p-4 text-center">
                <p className="text-green-100 font-medium">🌊 Ocean & Diving – Coastal Adventures</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Ready for the Adventure of a Lifetime?</h2>
          <p className="text-green-100 mb-8">Tell us your dates and preferences. We'll craft a personal Kenya itinerary just for you.</p>
          <Link to="/book" className="inline-block px-8 py-3.5 rounded-full bg-[#d4a017] text-green-900 font-semibold hover:bg-yellow-400 transition shadow-lg">
            Book Now
          </Link>
        </div>
      </section>
    </div>
  )
}
