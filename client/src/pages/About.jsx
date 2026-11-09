import { Link } from 'react-router-dom'
import { Users, Leaf, Star, Compass } from 'lucide-react'

const founders = [
  {
    name: 'Salim Mwamkoba',
    role: 'Co-Founder & CEO',
    from: 'Kombani, Kwale',
    bio: "Salim grew up in Kombani surrounded by the coastal forests and wildlife of Kwale. His passion for Kenya's natural beauty and deep knowledge of local culture drives every safari Utamaduni creates. He leads the company's vision to make Kenya accessible to all.",
    avatar: 'SM',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
  },
  {
    name: 'Abdallah Nyale',
    role: 'Co-Founder & Operations Director',
    from: 'Kombani, Kwale',
    bio: "Abdallah's roots in Kwale County gave him an unparalleled understanding of Kenya's diverse landscapes. From organizing seamless logistics to building relationships with local communities, he ensures every trip runs smoothly and authentically.",
    avatar: 'AN',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'
  }
]

const values = [
  { Icon: Users,   title: 'Community',      desc: 'We employ local guides, partner with community conservancies, and ensure tourism income stays in Kwale and beyond.' },
  { Icon: Leaf,    title: 'Sustainability', desc: 'We work with conservancies, support mangrove protection, and choose eco-friendly accommodations and practices.' },
  { Icon: Star,    title: 'Authenticity',   desc: 'No staged experiences. Every journey honours the real culture, real wildlife, and real people of Kenya.' },
  { Icon: Compass, title: 'Adventure',      desc: "From the Mara to the Indian Ocean — we believe Kenya's greatest asset is its wild, untamed beauty." }
]

export default function About() {
  return (
    <div className="pt-20 pb-20">
      {/* Hero Header */}
      <div
        className="relative bg-green-800 text-white py-24"
        style={{
          backgroundImage: 'url(/elephants.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-green-900/75" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">About Us</span>
          <h1 className="font-display text-4xl md:text-5xl mt-2">Our Story</h1>
          <p className="mt-4 text-green-100 max-w-2xl mx-auto text-lg">
            Two best friends from Kombani, Kwale who turned their love for Kenya's wild beauty into a mission to share it with the world.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-green-700 text-sm font-medium tracking-widest uppercase">The Beginning</span>
            <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">Born in Kombani</h2>
          </div>
          <div className="prose prose-stone max-w-none text-lg leading-relaxed">
            <p className="text-stone-700">
              Utamaduni Safaris was born in Kombani, a small town in Kwale County, from the friendship of two young men who grew up surrounded by Kenya's most incredible natural wonders. Salim and Abdallah saw the beauty of Shimba Hills, the magic of the coast, and the richness of Swahili culture — and decided the world needed to experience it too.
            </p>
            <p className="text-stone-600 mt-6">
              What started as guided walks through the Kaya forests and dhow trips to Wasini Island grew into a full-service safari company covering all of Kenya. From the great wildebeest migration in the Maasai Mara to the flamingos of Lake Nakuru, from Mount Kenya's glaciers to Lamu's ancient Swahili streets — Utamaduni Safaris takes you everywhere.
            </p>
            <p className="text-stone-600 mt-6">
              We are a small, community-rooted team. Our guides are local, our vehicles are well-maintained, and our itineraries are flexible. Whether you want a single day with the sable antelope or a two-week circuit of Kenya's greatest parks, we design the journey around you.
            </p>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-green-700 text-sm font-medium tracking-widest uppercase">The Team</span>
            <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">Meet the Founders</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {founders.map((f) => (
              <div key={f.name} className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-lg hover:shadow-xl transition">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-14 h-14 rounded-full bg-[#d4a017] text-green-900 flex items-center justify-center font-display text-xl font-bold border-2 border-white">
                      {f.avatar}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-green-900">{f.name}</h3>
                  <p className="text-green-700 font-medium text-sm mt-1">{f.role}</p>
                  <p className="text-stone-400 text-xs mt-0.5">📍 {f.from}</p>
                  <p className="text-stone-600 mt-4 text-sm leading-relaxed">{f.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-green-700 text-sm font-medium tracking-widest uppercase">What We Stand For</span>
            <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6 rounded-2xl bg-green-50 border border-green-100 hover:shadow-lg transition">
                <div className="w-14 h-14 rounded-full bg-green-700 text-white flex items-center justify-center mx-auto mb-4">
                  <v.Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl text-green-900 mb-2">{v.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl text-white mb-4">Ready to Explore Kenya with Us?</h2>
          <p className="text-green-200 mb-8">Let Utamaduni team create your perfect Kenya adventure.</p>
          <Link
            to="/book"
            className="inline-block px-8 py-3.5 rounded-full bg-[#d4a017] text-green-900 font-semibold hover:bg-yellow-400 transition shadow-lg"
          >
            Plan Your Trip with Us
          </Link>
        </div>
      </section>
    </div>
  )
}
