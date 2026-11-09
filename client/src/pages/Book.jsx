import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/client'
import { useContent } from '../context/ContentContext'

export default function Book() {
  const { content } = useContent()
  const [params] = useSearchParams()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dates: '', guests: 2, adventureId: '', message: ''
  })
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const adv = params.get('adventure')
    if (adv) setForm(f => ({ ...f, adventureId: adv }))
  }, [params])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await api.post('/bookings', form)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', dates: '', guests: 2, adventureId: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.response?.data?.error || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="pt-20 pb-20">
      {/* Hero Header */}
      <div
        className="relative bg-green-800 text-white py-20"
        style={{
          backgroundImage: 'url(/zebras-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-green-900/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">Reservation</span>
          <h1 className="font-display text-4xl md:text-5xl mt-2">Book Your Kenya Adventure</h1>
          <p className="mt-4 text-green-100 max-w-xl mx-auto">
            We will reply within 24 hours with a tailored Kenya itinerary just for you.
          </p>
        </div>
      </div>

      {/* Form + Contact */}
      <div
        className="min-h-[600px] py-16 px-4"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'
        }}
      >
        <div className="max-w-xl mx-auto">
          {status === 'success' ? (
            <div className="bg-white border border-green-200 rounded-2xl p-10 text-center shadow-lg">
              <div className="text-5xl mb-4">🌿</div>
              <h2 className="font-display text-2xl text-green-900 mb-2">Asante Sana!</h2>
              <p className="text-green-700">Your reservation request has been received. Our team will contact you within 24 hours.</p>
              <button onClick={() => setStatus(null)} className="mt-6 text-sm text-green-700 underline">
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-green-100 shadow-xl p-8 space-y-5"
            >
              <div className="text-center mb-2">
                <h2 className="font-display text-2xl text-green-900">Your Safari Starts Here</h2>
                <p className="text-sm text-stone-500 mt-1">Fill in your details and we'll be in touch</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full name *</label>
                <input
                  required name="name" value={form.name} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="John Mwangi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                <input
                  required type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="john@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone / WhatsApp</label>
                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Preferred dates *</label>
                  <input
                    required name="dates" value={form.dates} onChange={handleChange}
                    placeholder="e.g. 12–18 Jul 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Guests</label>
                  <input
                    type="number" min="1" name="guests" value={form.guests} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Adventure (optional)</label>
                <select
                  name="adventureId" value={form.adventureId} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">— Select or leave blank for custom —</option>
                  {(content?.adventures || []).map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Message / special requests</label>
                <textarea
                  name="message" rows={4} value={form.message} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Tell us about your dream Kenya adventure..."
                />
              </div>

              {status === 'error' && <p className="text-red-600 text-sm">{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 rounded-full bg-green-700 text-white font-semibold hover:bg-green-900 transition disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending…' : 'Submit Reservation'}
              </button>
            </form>
          )}

          {/* Contact Section */}
          <div className="mt-8 bg-white rounded-2xl border border-green-100 shadow p-6">
            <h3 className="font-medium text-green-900 mb-3 text-center">Need help? Contact us directly</h3>
            <div className="space-y-2 text-sm text-stone-600">
              <p>📞 <a href="tel:+254798157303" className="hover:text-green-700">+254798157303</a></p>
              <p>📞 <a href="tel:+254750135285" className="hover:text-green-700">+254750135285</a></p>
              <p>✉️ <a href="mailto:sirleemmuhammad18@gmail.com" className="hover:text-green-700">sirleemmuhammad18@gmail.com</a></p>
            </div>
            <a
              href="https://wa.me/254798157303"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
