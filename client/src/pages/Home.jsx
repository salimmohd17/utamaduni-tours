import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { Globe, PawPrint, Waves, Map, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

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

const testimonials = [
  {
    name: 'Sarah M.',
    country: '🇬🇧 United Kingdom',
    stars: 5,
    text: 'Utamaduni Safaris gave us the most authentic Kenya experience I could have imagined. Salim and the team knew every hidden waterhole and secret trail. Absolutely magical!'
  },
  {
    name: 'Jonas K.',
    country: '🇩🇪 Germany',
    stars: 5,
    text: 'From Maasai Mara to Diani Beach in one seamless trip. The local knowledge is unbeatable — we saw leopards, dolphins and the most beautiful sunset over the Indian Ocean.'
  },
  {
    name: 'Amara N.',
    country: '🇳🇬 Nigeria',
    stars: 5,
    text: 'As an African visitor, I appreciated how they balanced the wildlife experience with real Swahili cultural immersion. The kaya forest walk was life-changing.'
  },
  {
    name: 'David & Lisa T.',
    country: '🇺🇸 United States',
    stars: 5,
    text: 'Best safari company we\'ve ever used! Abdallah arranged everything perfectly — game drives, dhow trip, beach — all without a single hiccup. Worth every penny!'
  },
  {
    name: 'Fatuma A.',
    country: '🇰🇪 Kenya',
    stars: 5,
    text: 'Nilikuwa sijawahi kwenda Maasai Mara mpaka Utamaduni wakanipanga safari nzuri sana. Bei nzuri kwa Wakenya na huduma ya kwanza kabisa!'
  }
]

// Infinite seamless slides — we duplicate the array so we never "jump"
const heroSlides = [
  {
    image: '/assets/maasai mara ,ostrich.webp',
    title: 'Maasai Mara',
    subtitle: 'The Greatest Wildlife Show on Earth',
    tag: '🦁 Big Five Country',
    cta: '/adventures'
  },
  {
    image: '/assets/amboseli,giant elephany herds.webp',
    title: 'Amboseli',
    subtitle: 'Giants Under Kilimanjaro',
    tag: '🐘 Elephant Paradise',
    cta: '/adventures'
  },
  {
    image: '/assets/samburu ,crystal pool.webp',
    title: 'Samburu',
    subtitle: 'Wild North — Rare Species, Pristine Rivers',
    tag: '🦒 Reticulated Giraffe',
    cta: '/adventures'
  },
  {
    image: '/assets/kisite mpunguti dolphine view.jpg',
    title: 'Kisite-Mpunguti',
    subtitle: 'Dolphins, Dhows & Coral Reefs',
    tag: '🐬 Marine Paradise',
    cta: '/adventures'
  },
  {
    image: '/assets/hells gate,view.webp',
    title: "Hell's Gate",
    subtitle: 'Cycle Through Volcanic Gorges',
    tag: '🚴 Adventure Cycling',
    cta: '/adventures'
  },
  {
    image: '/assets/lamu island.jpg',
    title: 'Lamu Island',
    subtitle: "UNESCO's Living Swahili Heritage",
    tag: '⛵ Dhow Sailing',
    cta: '/adventures'
  }
]

function HeroSlider() {
  // We use a "virtual" approach: slides array is repeated 3x, we start in the middle set
  // so we can scroll left/right infinitely without visible jumps
  const total = heroSlides.length
  const [index, setIndex] = useState(total) // start at the middle set
  const [transitioning, setTransitioning] = useState(true)
  const timerRef = useRef(null)

  // Build a tripled array for infinite illusion
  const tripled = [...heroSlides, ...heroSlides, ...heroSlides]

  const goTo = (nextIndex) => {
    setIndex(nextIndex)
  }

  const next = () => goTo(index + 1)
  const prev = () => goTo(index - 1)

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex(i => i + 1)
    }, 5500)
    return () => clearInterval(timerRef.current)
  }, [])

  // When we reach the end of the third set or start of the first set, silently jump
  useEffect(() => {
    if (index >= total * 2) {
      // Will visually be at total*2, silently snap to total (same visual position)
      const timer = setTimeout(() => {
        setTransitioning(false)
        setIndex(total)
      }, 700) // after transition completes
      return () => clearTimeout(timer)
    }
    if (index < total) {
      const timer = setTimeout(() => {
        setTransitioning(false)
        setIndex(total * 2 - 1)
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [index, total])

  // Re-enable transition after the silent snap
  useEffect(() => {
    if (!transitioning) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitioning(true)
        })
      })
    }
  }, [transitioning])

  const currentSlide = tripled[index] || heroSlides[0]
  const realIndex = index % total

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden">
      {/* Slides container */}
      <div
        className="flex h-full"
        style={{
          width: `${tripled.length * 100}%`,
          transform: `translateX(-${(index / tripled.length) * 100}%)`,
          transition: transitioning ? 'transform 0.75s cubic-bezier(0.77,0,0.175,1)' : 'none'
        }}
      >
        {tripled.map((slide, i) => (
          <div
            key={i}
            className="relative h-full flex-shrink-0"
            style={{ width: `${100 / tripled.length}%` }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i < 3 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
          </div>
        ))}
      </div>

      {/* Content overlay — always on top, fades between slides */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <div key={realIndex} className="animate-fadeIn max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#d4a017]/90 text-green-900 text-sm font-semibold mb-5 shadow-lg">
            {currentSlide.tag}
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-white font-semibold leading-tight mb-5 drop-shadow-2xl">
            {currentSlide.title}
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
            {currentSlide.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book" className="px-9 py-4 rounded-full bg-[#d4a017] text-green-900 font-bold text-lg hover:bg-yellow-400 transition shadow-xl hover:shadow-2xl hover:scale-105 duration-200">
              Start Your Adventure
            </Link>
            <Link to="/destinations" className="px-9 py-4 rounded-full border-2 border-white/80 text-white font-semibold text-lg hover:bg-white/15 transition backdrop-blur-sm">
              Explore Kenya
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => { clearInterval(timerRef.current); prev() }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-sm border border-white/20 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => { clearInterval(timerRef.current); next() }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-sm border border-white/20 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => { clearInterval(timerRef.current); setIndex(total + i) }}
            className={`h-2 rounded-full transition-all duration-500 ${realIndex === i ? 'w-8 bg-[#d4a017]' : 'w-2 bg-white/50 hover:bg-white/80'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-10 right-6 z-20 text-white/60 text-sm font-mono">
        {String(realIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 translate-x-24 z-20 flex flex-col items-center gap-1 text-white/50 hidden sm:flex">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <span className="animate-bounce text-lg">↓</span>
      </div>
    </section>
  )
}

export default function Home() {
  const { content } = useContent()

  return (
    <div>
      {/* Hero Slideshow */}
      <HeroSlider />

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-green-900 via-green-800 to-green-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/assets/view.webp" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[#d4a017] text-sm font-medium tracking-widest uppercase">Our Reach</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mt-2">We Travel All Kenya</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center group">
                <div className="font-display text-5xl md:text-6xl text-[#d4a017] font-semibold group-hover:scale-110 transition duration-300">{s.num}</div>
                <div className="text-green-200 mt-2 text-sm uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wildlife Photo Showcase Strip */}
      <section className="py-0 overflow-hidden">
        <div className="flex h-64 md:h-80 lg:h-96">
          {[
            { img: '/assets/wildlife-reserve.jpg',         label: '🦓 Wildlife Reserve', link: '/destinations#shimba' },
            { img: '/assets/wildbeest-migration.jpg',      label: '🦬 Great Migration',  link: '/destinations#mara' },
            { img: '/assets/samburu,impala.webp',          label: '🦌 Samburu Reserve',  link: '/destinations#samburu' },
            { img: '/assets/kisite mpunguti dolphine view.jpg', label: '🐬 Marine Park', link: '/destinations#kisite' },
            { img: '/assets/hells gate,zebra.webp',        label: '🏔️ Hell\'s Gate',    link: '/destinations#hellsgate' },
          ].map((item) => (
            <Link
              key={item.img}
              to={item.link}
              className="flex-1 bg-cover bg-center hover:flex-[2.5] transition-all duration-700 cursor-pointer relative group"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className="absolute inset-0 bg-green-900/40 group-hover:bg-green-900/10 transition duration-500 flex items-end p-4">
                <span className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 backdrop-blur-sm">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-green-700 text-sm font-medium tracking-widest uppercase">Why Us</span>
            <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">Why Choose Utamaduni Safaris</h2>
            <p className="text-stone-500 mt-3 max-w-xl mx-auto">We're not a booking platform — we are local people who live, breathe and love Kenya.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((w) => (
              <div key={w.title} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-7 border border-green-100 hover:shadow-xl transition group hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 rounded-2xl bg-green-700 text-white flex items-center justify-center mb-5 group-hover:bg-green-900 transition shadow-lg">
                  <w.Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl text-green-900 mb-2">{w.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations preview */}
      <section className="py-24 bg-gradient-to-b from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-green-700 text-sm font-medium tracking-widest uppercase">Destinations</span>
            <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">Kenya's Finest Destinations</h2>
            <p className="text-stone-600 mt-3">Every ecosystem. Every adventure. One trusted team.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(content?.destinations || []).slice(0, 8).map((d) => (
              <Link key={d.id} to={`/destinations#${d.id}`} className="group rounded-2xl overflow-hidden bg-white border border-green-100 hover:shadow-2xl transition hover:-translate-y-1 duration-300">
                <div
                  className="aspect-[4/3] bg-cover bg-center group-hover:scale-110 transition duration-700"
                  style={{ backgroundImage: `url(${d.image})` }}
                />
                <div className="p-5">
                  <h3 className="font-display text-lg text-green-900 mb-1 group-hover:text-green-700 transition">{d.title}</h3>
                  <p className="text-sm text-stone-500 line-clamp-2">{d.short}</p>
                  {d.officialLink && (
                    <a
                      href={d.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 mt-2 font-medium"
                    >
                      🌐 Official page ↗
                    </a>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/destinations" className="px-8 py-3.5 rounded-full border-2 border-green-700 text-green-700 font-semibold hover:bg-green-700 hover:text-white transition shadow hover:shadow-lg duration-200">
              View All Destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* Adventure Preview CTA Strip */}
      <section
        className="py-28 relative overflow-hidden"
        style={{ backgroundImage: 'url(/assets/ol pojeta conservercy , rhino.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-900/70 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="max-w-xl">
            <span className="text-[#d4a017] text-sm font-medium tracking-widest uppercase">Adventures</span>
            <h2 className="font-display text-4xl md:text-5xl text-white mt-3 mb-5 leading-tight">From Half-Day Walks<br />to 30-Day Circuits</h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              Whether you have a few hours or a month, Utamaduni Safaris has the perfect package. Competitive prices for Kenyan citizens and East African residents.
            </p>
            <Link to="/adventures" className="inline-block px-8 py-4 rounded-full bg-[#d4a017] text-green-900 font-bold text-lg hover:bg-yellow-400 transition shadow-xl hover:scale-105 duration-200">
              View All Adventures & Prices
            </Link>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4 ml-auto">
            {[
              { emoji: '🦁', label: 'Big Five Safaris', price: 'From $95/day' },
              { emoji: '🐬', label: 'Marine Adventures', price: 'From $65/day' },
              { emoji: '🏔️', label: 'Mountain Treks', price: 'From $80/day' },
              { emoji: '⛵', label: 'Cultural Retreats', price: 'From $45/day' },
            ].map(item => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-white text-center hover:bg-white/20 transition">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="font-semibold text-sm">{item.label}</div>
                <div className="text-[#d4a017] text-sm mt-1 font-medium">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 bg-green-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src="/assets/nairobi nature walk.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-[#d4a017] text-sm font-medium tracking-widest uppercase">Moments</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mt-2">Feel the Excitement</h2>
            <p className="text-green-200 mt-3">Real Kenya. Real wildlife. Real adventure.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
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
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
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

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-green-700 text-sm font-medium tracking-widest uppercase">Testimonials</span>
            <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">What Our Guests Say</h2>
            <p className="text-stone-500 mt-3">Join hundreds of adventurers who've discovered Kenya with us.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t, i) => (
              <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-7 border border-green-100 hover:shadow-xl transition hover:-translate-y-1 duration-300">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} className="fill-[#d4a017] text-[#d4a017]" />
                  ))}
                </div>
                <p className="text-stone-700 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-green-900">{t.name}</p>
                  <p className="text-sm text-stone-500">{t.country}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-3xl mx-auto">
            {testimonials.slice(3).map((t, i) => (
              <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-7 border border-green-100 hover:shadow-xl transition hover:-translate-y-1 duration-300">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} className="fill-[#d4a017] text-[#d4a017]" />
                  ))}
                </div>
                <p className="text-stone-700 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-green-900">{t.name}</p>
                  <p className="text-sm text-stone-500">{t.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-28 relative overflow-hidden"
        style={{ backgroundImage: 'url(/assets/shanzu beach.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-green-900/80 to-green-900/60" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <span className="text-[#d4a017] text-sm font-medium tracking-widest uppercase">Ready?</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mt-3 mb-5 leading-tight">Your Kenya Adventure<br />Starts Today</h2>
          <p className="text-green-100 mb-10 text-lg leading-relaxed">Tell us your dates and preferences. We'll craft a personal Kenya itinerary just for you — from coast to savannah.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book" className="inline-block px-10 py-4 rounded-full bg-[#d4a017] text-green-900 font-bold text-lg hover:bg-yellow-400 transition shadow-2xl hover:scale-105 duration-200">
              Book Now
            </Link>
            <a
              href="https://wa.me/254798157303"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 rounded-full bg-green-500 text-white font-bold text-lg hover:bg-green-400 transition shadow-xl hover:scale-105 duration-200"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
