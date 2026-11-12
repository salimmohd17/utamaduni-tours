import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../api/client'
import { Clock, CheckCircle, XCircle, Phone, Calendar, Users, Search } from 'lucide-react'

const STATUS_CONFIG = {
  pending:   { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock,        label: 'Pending Review' },
  confirmed: { color: 'bg-green-100 text-green-800 border-green-200',   icon: CheckCircle,   label: 'Confirmed ✅' },
  contacted: { color: 'bg-blue-100 text-blue-800 border-blue-200',      icon: Phone,         label: 'Contacted' },
  cancelled: { color: 'bg-stone-100 text-stone-600 border-stone-200',   icon: XCircle,       label: 'Cancelled' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  )
}

// Auth forms
function AuthPanel({ onAuth }) {
  const { login, register } = useUser()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password)
      }
      onAuth()
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="font-display text-3xl text-green-900">My Bookings</h1>
          <p className="text-stone-500 mt-2">
            {mode === 'login'
              ? 'Sign in to view your booking status and history'
              : 'Create a free account to track your safari bookings'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-green-100 shadow-xl p-8">
          {/* Toggle */}
          <div className="flex rounded-2xl bg-green-50 p-1 mb-6">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                  mode === m ? 'bg-green-700 text-white shadow' : 'text-stone-600 hover:text-green-800'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Mwangi"
                  className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="john@email.com"
                className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Password *</label>
              <input
                required
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-green-700 text-white font-bold hover:bg-green-900 transition shadow disabled:opacity-60"
            >
              {loading ? '⏳ Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account & Continue'}
            </button>
          </form>

          <p className="text-center text-xs text-stone-400 mt-5">
            {mode === 'login' ? 'Use the same email you booked with to see your reservations.' : 'Your account is free and secure.'}
          </p>
        </div>

        <p className="text-center text-sm text-stone-500 mt-6">
          Ready to plan your adventure?{' '}
          <Link to="/book" className="text-green-700 font-semibold hover:underline">Book a Safari →</Link>
        </p>
      </div>
    </div>
  )
}

export default function MyBookings() {
  const { user, logout } = useUser()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [authed, setAuthed] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' })
  const [reviewMessage, setReviewMessage] = useState('')
  const [reviewError, setReviewError] = useState('')
  const [savingReview, setSavingReview] = useState(false)

  const loadBookings = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const { data } = await api.get('/users/bookings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('utamaduni_user_token')}` }
      })
      setBookings(data)
    } catch (e) {
      console.error(e)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const loadReviews = async () => {
    try {
      const { data } = await api.get('/users/reviews')
      setReviews(data)
    } catch (e) {
      console.error('Unable to load account reviews:', e)
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    setReviewMessage('')
    setReviewError('')
    setSavingReview(true)
    try {
      const { data } = await api.post('/users/reviews', reviewForm)
      setReviews(current => [data, ...current])
      setReviewForm({ rating: 5, text: '' })
      setReviewMessage('Thank you! Your review has been saved.')
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Unable to save your review. Please try again.')
    } finally {
      setSavingReview(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadBookings()
      loadReviews()
      setAuthed(true)
      const interval = setInterval(() => loadBookings(false), 30000)
      const refreshWhenVisible = () => {
        if (document.visibilityState === 'visible') loadBookings(false)
      }
      document.addEventListener('visibilitychange', refreshWhenVisible)
      return () => {
        clearInterval(interval)
        document.removeEventListener('visibilitychange', refreshWhenVisible)
      }
    }
  }, [user])

  if (!user) {
    return <AuthPanel onAuth={() => setAuthed(true)} />
  }

  const filtered = bookings.filter(b => {
    const matchStatus = filter === 'all' || b.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || b.adventureId?.toLowerCase().includes(q) || b.dates?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    contacted: bookings.filter(b => b.status === 'contacted').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero */}
      <div
        className="relative text-white py-20"
        style={{
          backgroundImage: "url('/assets/images/samburu ,crystal pool.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/85 to-green-900/70" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">My Account</span>
          <h1 className="font-display text-4xl md:text-5xl mt-3 drop-shadow-2xl">My Safari Bookings</h1>
          <p className="mt-3 text-green-100 text-lg">
            Welcome back, <strong>{user.name}</strong> 👋
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={logout}
              className="px-5 py-2 rounded-full bg-white/10 border border-white/30 text-white text-sm hover:bg-white/20 transition"
            >
              Sign Out
            </button>
            <Link
              to="/book"
              className="px-5 py-2 rounded-full bg-[#d4a017] text-green-900 font-bold text-sm hover:bg-yellow-400 transition shadow"
            >
              + New Booking
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-10">
        <section className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 mb-6">
          <h2 className="font-display text-2xl text-green-900 mb-2">Share Your Experience</h2>
          <p className="text-sm text-stone-500 mb-5">Your review will appear on the website for other travelers.</p>
          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label htmlFor="review-rating" className="block text-sm font-semibold text-stone-700 mb-1.5">Your rating</label>
              <select
                id="review-rating"
                value={reviewForm.rating}
                onChange={e => setReviewForm(current => ({ ...current, rating: Number(e.target.value) }))}
                className="px-3 py-2 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
              >
                {[5, 4, 3, 2, 1].map(rating => (
                  <option key={rating} value={rating}>{rating} star{rating === 1 ? '' : 's'}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="review-text" className="block text-sm font-semibold text-stone-700 mb-1.5">Your review</label>
              <textarea
                id="review-text"
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                value={reviewForm.text}
                onChange={e => setReviewForm(current => ({ ...current, text: e.target.value }))}
                placeholder="Tell us about your experience..."
                className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none resize-y"
              />
            </div>
            {reviewError && <p role="alert" className="text-sm text-red-700">{reviewError}</p>}
            {reviewMessage && <p role="status" className="text-sm text-green-700">{reviewMessage}</p>}
            <button
              type="submit"
              disabled={savingReview}
              className="px-6 py-2.5 rounded-full bg-green-700 text-white font-semibold hover:bg-green-900 transition disabled:opacity-60"
            >
              {savingReview ? 'Saving…' : 'Submit Review'}
            </button>
          </form>

          {reviews.length > 0 && (
            <div className="mt-6 border-t border-green-100 pt-5">
              <h3 className="font-semibold text-green-900 mb-3">Your saved reviews</h3>
              <div className="space-y-3">
                {reviews.map(review => (
                  <article key={review.id} className="rounded-xl bg-green-50 p-4">
                    <p className="text-[#d4a017]" aria-label={`${review.rating} out of 5 stars`}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </p>
                    <p className="text-sm text-stone-700 mt-1">{review.text}</p>
                    <p className="text-xs text-stone-400 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Filter + Search */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by adventure or dates…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
              />
            </div>
            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
              {Object.entries(counts).map(([key, count]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    filter === key
                      ? 'bg-green-700 text-white border-green-700'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-green-400'
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking List */}
        {loading ? (
          <div className="text-center py-16 text-green-700 animate-pulse text-lg">Loading your bookings…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-green-100 shadow-sm">
            <div className="text-5xl mb-4">🗓️</div>
            <h3 className="font-display text-xl text-green-900 mb-2">
              {bookings.length === 0 ? 'No bookings yet' : 'No bookings match your filter'}
            </h3>
            <p className="text-stone-500 mb-6">
              {bookings.length === 0
                ? 'Start planning your Kenya adventure today!'
                : 'Try adjusting your search or filter.'}
            </p>
            {bookings.length === 0 && (
              <Link to="/book" className="inline-block px-8 py-3 rounded-full bg-green-700 text-white font-bold hover:bg-green-900 transition shadow">
                Book a Safari →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <StatusBadge status={b.status} />
                      <span className="text-xs text-stone-400 font-mono">
                        Ref: {b.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-stone-700">
                        <Calendar size={14} className="text-green-700 shrink-0" />
                        <span>{b.dates || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-700">
                        <Users size={14} className="text-green-700 shrink-0" />
                        <span>{b.guests} guest{b.guests !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-700">
                        <span className="text-green-700">🗺️</span>
                        <span className="truncate">{b.adventureId || 'Custom itinerary'}</span>
                      </div>
                    </div>

                    {b.message && (
                      <p className="text-sm text-stone-500 mt-3 italic border-t border-green-50 pt-3">
                        "{b.message}"
                      </p>
                    )}

                    <p className="text-xs text-stone-400 mt-3">
                      Submitted {new Date(b.createdAt).toLocaleDateString('en-KE', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Status info box */}
                  <div className={`shrink-0 rounded-xl p-4 text-center w-full sm:w-40 border ${STATUS_CONFIG[b.status]?.color || 'bg-stone-50 border-stone-200'}`}>
                    <div className="text-2xl mb-1">
                      {b.status === 'confirmed' ? '✅' : b.status === 'cancelled' ? '❌' : b.status === 'contacted' ? '📞' : '⏳'}
                    </div>
                    <div className="text-xs font-semibold">
                      {STATUS_CONFIG[b.status]?.label || b.status}
                    </div>
                    {b.status === 'pending' && (
                      <div className="text-xs mt-1 opacity-75">We'll confirm within 24h</div>
                    )}
                    {b.status === 'confirmed' && (
                      <div className="text-xs mt-1 opacity-75">
                        {b.confirmationEmailSent === true
                          ? 'Confirmation email sent'
                          : b.confirmationEmailConfigured === true
                            ? 'Email delivery failed — contact us for details'
                            : b.confirmationEmailConfigured === false
                              ? 'Email notifications are not configured — contact us for details'
                              : 'Your booking is confirmed'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help box */}
        <div className="mt-8 bg-green-700 rounded-2xl p-6 text-white text-center">
          <p className="font-semibold mb-2">Need help with your booking?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="tel:+254798157303" className="hover:text-[#d4a017] transition">📞 +254 798 157 303</a>
            <a href="https://wa.me/254798157303" target="_blank" rel="noopener noreferrer" className="hover:text-[#d4a017] transition">💬 WhatsApp Us</a>
            <a href="mailto:sirleemmuhammad18@gmail.com" className="hover:text-[#d4a017] transition">📧 Email Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}
