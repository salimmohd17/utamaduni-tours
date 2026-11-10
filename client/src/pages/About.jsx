import { Link } from 'react-router-dom'
import { Users, Leaf, Star, Compass, Heart, Shield } from 'lucide-react'

const founders = [
  {
    name: 'Salim Mwamkoba',
    role: 'Co-Founder & CEO',
    from: 'Kombani, Kwale',
    bio: "Salim grew up in Kombani surrounded by the coastal forests and wildlife of Kwale. His passion for Kenya's natural beauty and deep knowledge of local culture drives every safari Utamaduni creates. He leads the company's vision to make Kenya accessible to all — from international guests to local families.",
    image: '/assets/salim-mwamkoba.jpeg',
    emoji: '🌿'
  },
  {
    name: 'Abdallah Nyale',
    role: 'Co-Founder & Operations Director',
    from: 'Kombani, Kwale',
    bio: "Abdallah's roots in Kwale County gave him an unparalleled understanding of Kenya's diverse landscapes. From organizing seamless logistics to building relationships with local communities, he ensures every trip runs smoothly and authentically. His warm hospitality is legendary among guests.",
    image: '/assets/abdallah-nyale.jpeg',
    emoji: '⛵'
  }
]

const values = [
  { Icon: Users,   title: 'Community First',   desc: 'We employ local guides, partner with community conservancies, and ensure tourism income stays in Kwale and beyond.' },
  { Icon: Leaf,    title: 'Sustainability',     desc: 'We work with conservancies, support mangrove protection, and choose eco-friendly accommodations and practices.' },
  { Icon: Star,    title: 'Authenticity',       desc: 'No staged experiences. Every journey honours the real culture, real wildlife, and real people of Kenya.' },
  { Icon: Compass, title: 'Adventure',          desc: "From the Mara to the Indian Ocean — we believe Kenya's greatest asset is its wild, untamed beauty." },
  { Icon: Heart,   title: 'Passion',            desc: 'We do this because we love Kenya. Every sunrise game drive, every dhow trip — we feel it as much as you do.' },
  { Icon: Shield,  title: 'Trust & Safety',     desc: 'Licensed, insured, and vetted. Your safety and satisfaction is our highest priority on every trip.' }
]

const milestones = [
  { year: '2019', label: 'Founded in Kombani', desc: 'Two friends begin guiding forest walks and dhow trips around Kwale coast.' },
  { year: '2020', label: 'First Safari Season', desc: 'Expanded to game drives in Shimba Hills and overnight packages.' },
  { year: '2021', label: 'All Kenya Coverage', desc: 'Launched circuits to Maasai Mara, Amboseli, Tsavo and northern Kenya.' },
  { year: '2023', label: '200+ Happy Clients', desc: 'Reached milestone of 200 satisfied guests from 30+ countries.' },
  { year: '2024', label: 'Marine Expansion', desc: 'Added full marine packages: Kisite-Mpunguti, Watamu, Lamu, Malindi.' },
  { year: '2026', label: 'Growing Strong', desc: 'Full-service Kenya operator — wildlife, marine, culture, and bespoke circuits.' }
]

export default function About() {
  return (
    <div className="pt-20 pb-20">
      {/* Hero Header */}
      <div
        className="relative text-white py-28"
        style={{
          backgroundImage: "url('/assets/nairobi nature walk.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-900/65 to-green-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">About Us</span>
          <h1 className="font-display text-5xl md:text-6xl mt-3 drop-shadow-2xl">Our Story</h1>
          <p className="mt-5 text-green-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Two best friends from Kombani, Kwale who turned their love for Kenya's wild beauty into a mission to share it with the world.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-green-700 text-sm font-medium tracking-widest uppercase">The Beginning</span>
              <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2 mb-6">Born in Kombani</h2>
              <div className="space-y-5 text-stone-700 leading-relaxed text-lg">
                <p>
                  Utamaduni Safaris was born in Kombani, a small town in Kwale County, from the friendship of two young men who grew up surrounded by Kenya's most incredible natural wonders. Salim and Abdallah saw the beauty of Shimba Hills, the magic of the coast, and the richness of Swahili culture — and decided the world needed to experience it too.
                </p>
                <p className="text-stone-600">
                  What started as guided walks through the Kaya forests and dhow trips to Wasini Island grew into a full-service safari company covering all of Kenya. From the great wildebeest migration in the Maasai Mara to the flamingos of Lake Nakuru, from Mount Kenya's glaciers to Lamu's ancient Swahili streets — Utamaduni Safaris takes you everywhere.
                </p>
                <p className="text-stone-600">
                  We are a small, community-rooted team. Our guides are local, our vehicles are well-maintained, and our itineraries are flexible. Whether you want a single day with the sable antelope or a thirty-day circuit of Kenya's greatest parks, we design the journey around you.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="/assets/shimba hills waterfals.jpg" alt="Shimba Hills" className="rounded-2xl object-cover h-56 w-full shadow-xl hover:scale-105 transition duration-500" />
              <img src="/assets/kisite mpunguti dolphine view.jpg" alt="Marine" className="rounded-2xl object-cover h-56 w-full shadow-xl hover:scale-105 transition duration-500 mt-8" />
              <img src="/assets/maasai mara ,ostrich.webp" alt="Maasai Mara" className="rounded-2xl object-cover h-56 w-full shadow-xl hover:scale-105 transition duration-500 -mt-4" />
              <img src="/assets/lamu island.jpg" alt="Lamu" className="rounded-2xl object-cover h-56 w-full shadow-xl hover:scale-105 transition duration-500 mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-24 bg-gradient-to-b from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-green-700 text-sm font-medium tracking-widest uppercase">The Team</span>
            <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">Meet the Founders</h2>
            <p className="text-stone-500 mt-3 max-w-xl mx-auto">Two friends from Kwale who built something remarkable — a safari company rooted in community, culture and love for Kenya.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {founders.map((f) => (
              <div key={f.name} className="bg-white rounded-3xl overflow-hidden border border-green-100 shadow-xl hover:shadow-2xl transition hover:-translate-y-1 duration-300">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-display text-2xl text-white drop-shadow-lg">{f.name}</h3>
                        <p className="text-[#d4a017] font-semibold text-sm mt-0.5">{f.role}</p>
                      </div>
                      <span className="text-3xl">{f.emoji}</span>
                    </div>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-stone-400 text-xs flex items-center gap-1 mb-3">📍 {f.from}</p>
                  <p className="text-stone-600 leading-relaxed">{f.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-green-700 text-sm font-medium tracking-widest uppercase">Our Journey</span>
            <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">How We Got Here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200 hidden sm:block" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-6 items-start">
                  <div className="relative shrink-0 w-16 h-16 rounded-full bg-green-700 text-white flex items-center justify-center font-display text-sm font-bold shadow-lg z-10 border-4 border-white">
                    {m.year}
                  </div>
                  <div className="bg-green-50 rounded-2xl p-5 flex-1 border border-green-100 hover:shadow-md transition">
                    <h3 className="font-display text-lg text-green-900 mb-1">{m.label}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gradient-to-b from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-green-700 text-sm font-medium tracking-widest uppercase">What We Stand For</span>
            <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-8 rounded-2xl bg-white border border-green-100 hover:shadow-xl transition hover:-translate-y-1 duration-300">
                <div className="w-16 h-16 rounded-2xl bg-green-700 text-white flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <v.Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl text-green-900 mb-3">{v.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Strip */}
      <section className="py-0 overflow-hidden">
        <div className="flex h-64 md:h-80">
          {[
            '/assets/samburu,impala.webp',
            '/assets/hells gate,zebra.webp',
            '/assets/amboseli views.jpg',
            '/assets/mombasa old town.jpg',
            '/assets/shanzu beach.jpg',
          ].map((img, i) => (
            <div
              key={i}
              className="flex-1 bg-cover bg-center hover:flex-[2] transition-all duration-700"
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-28 relative overflow-hidden"
        style={{ backgroundImage: "url('/assets/view.webp')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-green-900/85 to-green-900/70" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <span className="text-[#d4a017] text-sm font-medium tracking-widest uppercase">Join Us</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mt-3 mb-5">Ready to Explore Kenya with Us?</h2>
          <p className="text-green-200 mb-10 text-lg leading-relaxed">Let the Utamaduni team create your perfect Kenya adventure — crafted with heart, guided by locals.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="inline-block px-10 py-4 rounded-full bg-[#d4a017] text-green-900 font-bold text-lg hover:bg-yellow-400 transition shadow-2xl hover:scale-105 duration-200"
            >
              Plan Your Trip with Us
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
