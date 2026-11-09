import { useContent } from '../context/ContentContext'
import { PawPrint, Waves, Camera } from 'lucide-react'

export default function Moments() {
  const { content, loading } = useContent()
  if (loading) return <div className="pt-24 text-center text-green-700">Loading…</div>

  return (
    <div className="pt-20 pb-20">
      {/* Header */}
      <div
        className="relative bg-green-900 text-white py-20"
        style={{
          backgroundImage: 'url(/zebras-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-green-900/75" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">Gallery</span>
          <h1 className="font-display text-4xl md:text-5xl mt-2 text-white">Feel the Excitement</h1>
          <p className="mt-4 text-green-100 max-w-2xl mx-auto text-lg">
            Real moments from real Kenya adventures — wildlife, diving, beaches and more!
          </p>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-green-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">Watch</span>
            <h2 className="font-display text-3xl text-white mt-2">Kenya in Motion</h2>
            <p className="text-green-200 mt-2">See the magic for yourself</p>
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
              <div className="bg-green-800 p-4 flex items-center justify-center gap-2">
                <PawPrint size={16} className="text-[#d4a017]" />
                <p className="text-green-100 font-medium">Kenya Wildlife – Safari Experience</p>
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
              <div className="bg-green-800 p-4 flex items-center justify-center gap-2">
                <Waves size={16} className="text-[#d4a017]" />
                <p className="text-green-100 font-medium">Ocean & Diving – Coastal Adventures</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="text-center mb-10 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center">
            <Camera size={18} />
          </div>
          <span className="text-green-700 text-sm tracking-widest uppercase font-medium">Photos</span>
          <h2 className="font-display text-3xl text-green-900">Captured Moments</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(content?.gallery || []).map((g) => (
            <figure key={g.id} className="group rounded-2xl overflow-hidden bg-green-50 border border-green-100 relative">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={g.image}
                  alt={g.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">{g.caption}</p>
                </div>
              </div>
              <figcaption className="p-4 text-sm text-stone-600 group-hover:text-green-700 transition">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
