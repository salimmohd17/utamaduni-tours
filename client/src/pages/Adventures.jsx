import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { Clock, Banknote, Compass } from 'lucide-react'

export default function Adventures() {
  const { content, loading } = useContent()
  if (loading) return <div className="pt-24 text-center text-green-700">Loading…</div>

  return (
    <div className="pt-20 pb-20 bg-[#f0fdf4]">
      {/* Header */}
      <div
        className="relative bg-green-900 text-white py-20"
        style={{
          backgroundImage: 'url(/wildbeest-migration.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-green-900/75" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">Adventures</span>
          <h1 className="font-display text-4xl md:text-5xl mt-2 text-white">Experiences That Stay With You</h1>
          <p className="mt-4 text-green-100 max-w-xl mx-auto">
            Pick your adventure — from a half-day forest walk to a full week across Kenya's greatest parks.
          </p>
        </div>
      </div>

      {/* Adventure cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-14 space-y-5">
        {(content?.adventures || []).map((a, i) => (
          <div
            key={a.id}
            className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-white border border-green-100 shadow hover:shadow-lg transition group"
          >
            {/* Number badge */}
            <div className="w-14 h-14 shrink-0 rounded-xl bg-green-700 text-white flex items-center justify-center font-display text-xl font-bold group-hover:bg-green-900 transition">
              {String(i + 1).padStart(2, '0')}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-display text-xl text-green-900 mb-1">{a.title}</h3>
              <p className="text-stone-600 mt-1 leading-relaxed">{a.description}</p>
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-sm text-green-700 font-medium">
                  <Clock size={15} /> {a.duration}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-green-700 font-medium">
                  <Banknote size={15} /> From ${a.priceFrom} pp
                </span>
              </div>
            </div>

            <Link
              to={`/book?adventure=${a.id}`}
              className="self-start sm:self-center shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-700 text-white text-sm font-semibold hover:bg-green-900 transition shadow"
            >
              <Compass size={15} /> Book
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
