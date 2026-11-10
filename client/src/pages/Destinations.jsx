import { useContent } from '../context/ContentContext'
import { Link } from 'react-router-dom'

export default function Destinations() {
  const { content, loading } = useContent()
  if (loading) return <div className="pt-24 text-center text-green-700">Loading…</div>

  return (
    <div className="pt-20 pb-20 bg-[#f0fdf4]">
      {/* Header */}
      <div
        className="relative bg-green-900 text-white py-20"
        style={{
          backgroundImage: 'url(/assets/wildlife-reserve.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-green-900/75" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">Destinations</span>
          <h1 className="font-display text-4xl md:text-5xl mt-2 text-white">Places We Love</h1>
          <p className="mt-4 text-green-100 max-w-2xl mx-auto text-lg">
            From the Maasai Mara to Diani Beach — every corner of Kenya, one trusted team.
          </p>
        </div>
      </div>

      {/* Destination articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20 mt-16">
        {(content?.destinations || []).map((d, i) => (
          <article
            id={d.id}
            key={d.id}
            className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img src={d.image} alt={d.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
            </div>
            <div>
              <h2 className="font-display text-3xl text-green-900 mb-3">{d.title}</h2>
              <p className="text-stone-600 leading-relaxed mb-5">{d.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(d.highlights || []).map((h) => (
                  <span key={h} className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium border border-green-200">
                    {h}
                  </span>
                ))}
              </div>
              <Link
                to={`/book?adventure=${d.id}`}
                className="inline-block px-6 py-2.5 rounded-full bg-green-700 text-white text-sm font-semibold hover:bg-green-900 transition shadow"
              >
                Book This Destination
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
