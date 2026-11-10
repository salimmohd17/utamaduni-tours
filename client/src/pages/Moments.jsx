import { useContent } from '../context/ContentContext'
import { PawPrint, Waves, Camera, Image } from 'lucide-react'
import { Link } from 'react-router-dom'

// Extra gallery items using the uploaded local images
const extraGallery = [
  { id: 'e1', caption: 'Amboseli scenery — golden hour on the savannah', image: '/assets/amboseli scenery.jpg' },
  { id: 'e2', caption: 'Amboseli views — wide open plains', image: '/assets/amboseli views.jpg' },
  { id: 'e3', caption: 'Diving in Mombasa Marine — underwater paradise', image: '/assets/Diving-Mombasa-Marine.jpg' },
  { id: 'e4', caption: "Hell's Gate — warthog encounter", image: "/assets/hels,wathog.webp" },
  { id: 'e5', caption: 'Lamu Island — timeless Swahili island life', image: '/assets/lamu.jpg' },
  { id: 'e6', caption: 'Malindi Beach — the wide golden coast', image: '/assets/malindi beach.jpg' },
  { id: 'e7', caption: 'Malindi Marine — coral reef wonders', image: '/assets/malindi marine 2.jpg' },
  { id: 'e8', caption: 'Mombasa Old Town — history in every stone', image: '/assets/mombasa old town.jpg' },
  { id: 'e9', caption: 'Nairobi National Park — bird life at sunset', image: "/assets/nairobi nationa park, bird.webp" },
  { id: 'e10', caption: 'Nguuni Sanctuary — where wildlife roams free', image: '/assets/nguuni sanctuary.jpg' },
  { id: 'e11', caption: 'Sand dunes — the hidden desert of Kenya coast', image: '/assets/sand dunes.jpg' },
  { id: 'e12', caption: 'Shanzu Beach — peaceful northern coast', image: '/assets/shanzu beach.jpg' },
  { id: 'e13', caption: 'Samburu Reserve — impala on the plains', image: '/assets/samburu,impala.webp' },
  { id: 'e14', caption: "Hell's Gate — zebra in the gorge", image: "/assets/hells gate,zebra.webp" },
  { id: 'e15', caption: 'Sibiloi National Park — the jade sea', image: '/assets/sibiloi view.jpg' },
  { id: 'e16', caption: 'Tsavo East — red earth and big sky', image: '/assets/tsavo 2.jpg' },
  { id: 'e17', caption: 'Nairobi nature walk — urban wild beauty', image: '/assets/nairobi nature walk.jpg' },
]

export default function Moments() {
  const { content, loading } = useContent()
  if (loading) return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <span className="text-xl text-green-700 animate-pulse">Loading gallery…</span>
    </div>
  )

  const gallery = [...(content?.gallery || []), ...extraGallery]

  return (
    <div className="pt-20 pb-20">
      {/* Hero Header */}
      <div className="relative text-white py-28">
        <img
          src="/assets/nairobi nationa park, bird.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-900/60 to-green-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">Gallery</span>
          <h1 className="font-display text-5xl md:text-6xl mt-3 drop-shadow-2xl">Captured Moments</h1>
          <p className="mt-5 text-green-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Real photos from real Kenya adventures — wildlife, diving, beaches, culture and more. Every image tells a story.
          </p>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-green-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">Watch</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mt-2">Kenya in Motion</h2>
            <p className="text-green-200 mt-3">See the magic for yourself — no filter, no staging.</p>
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
              <div className="bg-green-800 p-4 flex items-center justify-center gap-2">
                <PawPrint size={16} className="text-[#d4a017]" />
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
              <div className="bg-green-800 p-4 flex items-center justify-center gap-2">
                <Waves size={16} className="text-[#d4a017]" />
                <p className="text-green-100 font-medium">🌊 Ocean & Diving – Coastal Adventures</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-700 text-white mb-4 shadow-lg">
            <Camera size={22} />
          </div>
          <span className="block text-green-700 text-sm tracking-widest uppercase font-medium">Photos</span>
          <h2 className="font-display text-3xl md:text-4xl text-green-900 mt-2">Our Kenya in Pictures</h2>
          <p className="text-stone-500 mt-3 max-w-xl mx-auto">From the savannah to the sea — every destination we operate, captured in its full glory.</p>
        </div>

        {/* Masonry-style grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
          {gallery.map((g) => (
            <figure key={g.id} className="break-inside-avoid group rounded-2xl overflow-hidden bg-green-50 border border-green-100 relative shadow hover:shadow-xl transition duration-300 hover:-translate-y-0.5">
              <div className="overflow-hidden relative">
                <img
                  src={g.image}
                  alt={g.caption}
                  className="w-full object-cover group-hover:scale-110 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium leading-snug">{g.caption}</p>
                </div>
              </div>
              <figcaption className="px-4 py-3 text-xs text-stone-500 group-hover:text-green-700 transition leading-snug">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-20">
        <div
          className="rounded-3xl overflow-hidden relative py-16 px-8 text-center"
          style={{ backgroundImage: "url('/assets/view.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-green-900/85" />
          <div className="relative">
            <Image size={40} className="text-[#d4a017] mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Your Photos Could Be Here</h2>
            <p className="text-green-100 mb-8 max-w-xl mx-auto leading-relaxed">
              Book your Kenya adventure with Utamaduni Safaris and create memories that will last a lifetime.
            </p>
            <Link to="/book" className="inline-block px-10 py-4 rounded-full bg-[#d4a017] text-green-900 font-bold text-lg hover:bg-yellow-400 transition shadow-xl hover:scale-105 duration-200">
              Book Your Adventure
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
