import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/client'
import { useContent } from '../context/ContentContext'
import { Calendar, Users, MessageSquare, Phone, Mail, MapPin } from 'lucide-react'

// USD to KES conversion
const USD_TO_KES = 130

// Duration-based pricing helpers (mirrors Adventures page logic)
function getDayMultiplier(days, minDays) {
  if (days <= minDays) return 1
  const extra = days - minDays
  return 1 - Math.min(extra * 0.04, 0.30)
}

export default function Book() {
  const { content } = useContent()
  const [params] = useSearchParams()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dates: '', days: 2, guests: 2,
    adventureId: '', visitorType: 'foreigner', message: ''
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
      setForm({ name: '', email: '', phone: '', dates: '', days: 2, guests: 2, adventureId: '', visitorType: 'foreigner', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.response?.data?.error || 'Something went wrong. Please try again.')
    }
  }

  // Find selected adventure for price estimation
  const selectedAdv = (content?.adventures || []).find(a => a.id === form.adventureId)
  const minDays = selectedAdv ? parseInt(selectedAdv.duration?.split('–')[0] || '1') : 1
  const basePrice = selectedAdv
    ? form.visitorType === 'citizen' ? selectedAdv.priceCitizen || selectedAdv.priceFrom
      : form.visitorType === 'resident' ? selectedAdv.priceResident || selectedAdv.priceFrom
      : selectedAdv.priceFrom
    : null
  const mult = getDayMultiplier(Number(form.days), minDays)
  const totalPerPerson = basePrice ? Math.round(basePrice * Number(form.days) * mult) : null
  const totalParty = totalPerPerson ? totalPerPerson * Number(form.guests) : null

  return (
    <div className="pt-20 pb-20">
      {/* Hero Header */}
      <div
        className="relative text-white py-28"
        style={{
          backgroundImage: "url('/assets/amboseli scenery.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-900/65 to-green-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">Reservation</span>
          <h1 className="font-display text-5xl md:text-6xl mt-3 drop-shadow-2xl">Book Your Kenya Adventure</h1>
          <p className="mt-5 text-green-100 max-w-xl mx-auto text-lg leading-relaxed">
            We will reply within 24 hours with a tailored Kenya itinerary and final pricing just for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            {['⚡ 24h response', '💰 Free quote', '🇰🇪 Citizen rates available', '💬 WhatsApp support'].map(t => (
              <div key={t} className="bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20">{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Form + Contact */}
      <div
        className="min-h-[600px] py-16 px-4"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)' }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-start">

          {/* Main Form */}
          <div className="md:col-span-2">
            {status === 'success' ? (
              <div className="bg-white border border-green-200 rounded-3xl p-12 text-center shadow-xl">
                <div className="text-6xl mb-5">🌿</div>
                <h2 className="font-display text-3xl text-green-900 mb-3">Asante Sana!</h2>
                <p className="text-green-700 text-lg leading-relaxed mb-2">Your reservation request has been received.</p>
                <p className="text-stone-500">Our team will contact you within 24 hours with your personalised itinerary and quote.</p>
                <button onClick={() => setStatus(null)} className="mt-8 px-8 py-3 rounded-full bg-green-700 text-white font-semibold hover:bg-green-900 transition shadow">
                  Send another request
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl border border-green-100 shadow-xl p-8 md:p-10 space-y-6"
              >
                <div className="text-center mb-2">
                  <h2 className="font-display text-3xl text-green-900">Your Safari Starts Here</h2>
                  <p className="text-stone-500 mt-2">Fill in your details and we'll be in touch within 24 hours</p>
                </div>

                {/* Personal Info */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full name *</label>
                    <input
                      required name="name" value={form.name} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                      placeholder="John Mwangi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email *</label>
                    <input
                      required type="email" name="email" value={form.email} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                      placeholder="john@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      <Phone size={13} className="inline mr-1" /> Phone / WhatsApp
                    </label>
                    <input
                      name="phone" value={form.phone} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      <Calendar size={13} className="inline mr-1" /> Preferred dates *
                    </label>
                    <input
                      required name="dates" value={form.dates} onChange={handleChange}
                      placeholder="e.g. 12–18 Jul 2026"
                      className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Adventure + Visitor Type */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Adventure (optional)</label>
                  <select
                    name="adventureId" value={form.adventureId} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                  >
                    <option value="">— Select an adventure or leave blank for custom —</option>
                    {(content?.adventures || []).map(a => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>

                {/* Duration + Guests + Visitor Type */}
                <div className="grid sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      Duration (days)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range" min="1" max="30" name="days" value={form.days}
                        onChange={handleChange}
                        className="flex-1 accent-green-700"
                      />
                      <span className="w-14 text-center px-2 py-1.5 rounded-xl bg-green-50 text-green-800 font-bold text-sm border border-green-200">
                        {form.days}d
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      <Users size={13} className="inline mr-1" /> Guests
                    </label>
                    <input
                      type="number" min="1" max="50" name="guests" value={form.guests} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Visitor Type</label>
                    <select
                      name="visitorType" value={form.visitorType} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                    >
                      <option value="foreigner">🌍 International visitor</option>
                      <option value="resident">🌍 E.A. Community resident</option>
                      <option value="citizen">🇰🇪 Kenyan citizen</option>
                    </select>
                  </div>
                </div>

                {/* Price Estimate */}
                {selectedAdv && totalPerPerson && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                    <p className="text-sm font-semibold text-green-900 mb-3">💰 Estimated Cost</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Per person ({form.days} days)</p>
                        <p className="text-xl font-bold text-green-900">${totalPerPerson.toLocaleString()}</p>
                        <p className="text-xs text-stone-400">KES {(totalPerPerson * USD_TO_KES).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Total ({form.guests} guests)</p>
                        <p className="text-xl font-bold text-[#d4a017]">${totalParty.toLocaleString()}</p>
                        <p className="text-xs text-stone-400">KES {(totalParty * USD_TO_KES).toLocaleString()}</p>
                      </div>
                    </div>
                    {Number(form.days) > minDays && (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        🎉 {Math.round((1 - mult) * 100)}% multi-day discount applied!
                      </p>
                    )}
                    <p className="text-xs text-stone-400 mt-2">* Estimate only. Final price confirmed within 24h.</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                    <MessageSquare size={13} className="inline mr-1" /> Message / special requests
                  </label>
                  <textarea
                    name="message" rows={4} value={form.message} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition resize-none"
                    placeholder="Tell us about your dream Kenya adventure — favourite parks, accommodation style, group composition..."
                  />
                </div>

                {status === 'error' && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 rounded-full bg-green-700 text-white font-bold text-lg hover:bg-green-900 transition shadow-lg disabled:opacity-60 hover:shadow-xl duration-200"
                >
                  {status === 'loading' ? '⏳ Sending…' : '🌿 Submit Reservation Request'}
                </button>

                <p className="text-xs text-center text-stone-400">
                  By submitting you agree to be contacted by Utamaduni Safaris. We never share your data.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl border border-green-100 shadow-lg p-6">
              <h3 className="font-display text-xl text-green-900 mb-4">Need help? Contact us</h3>
              <div className="space-y-3 text-sm text-stone-600">
                <div className="flex items-center gap-2">
                  <Phone size={15} className="text-green-700 shrink-0" />
                  <a href="tel:+254798157303" className="hover:text-green-700 font-medium">+254 798 157 303</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={15} className="text-green-700 shrink-0" />
                  <a href="tel:+254750135285" className="hover:text-green-700 font-medium">+254 750 135 285</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-green-700 shrink-0" />
                  <a href="mailto:sirleemmuhammad18@gmail.com" className="hover:text-green-700 break-all">sirleemmuhammad18@gmail.com</a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-green-700 shrink-0 mt-0.5" />
                  <span>Kombani, Matuga Sub-County, Kwale County, Kenya</span>
                </div>
              </div>
              <a
                href="https://wa.me/254798157303"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition shadow"
              >
                💬 Chat on WhatsApp
              </a>
            </div>

            {/* Why Book With Us */}
            <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-display text-xl mb-4">Why Book With Us?</h3>
              <ul className="space-y-3 text-sm text-green-100">
                {[
                  '✅ Licensed & insured Kenya operator',
                  '✅ 100% local guides from Kwale',
                  '✅ Transparent pricing — no hidden fees',
                  '✅ Special Kenyan citizen rates',
                  '✅ WhatsApp support throughout',
                  '✅ 24h booking response guarantee',
                  '✅ Flexible cancellation policy',
                  '✅ Community & eco-conscious'
                ].map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Price Reminder */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900 mb-2">💡 Did You Know?</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Kenyan citizens pay up to <strong>90% less</strong> on park entry fees! Select "🇰🇪 Kenyan citizen" above to see your rates. East African Community residents also get significant discounts.
              </p>
            </div>

            {/* Featured image */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/assets/samburu ,crystal pool.webp"
                alt="Samburu"
                className="w-full h-48 object-cover hover:scale-105 transition duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
