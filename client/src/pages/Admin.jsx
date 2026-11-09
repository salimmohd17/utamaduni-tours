import { useState, useEffect } from 'react'
import api from '../api/client'
import { useContent } from '../context/ContentContext'

const TAB_STYLES = (active) =>
  `pb-3 px-2 text-sm font-medium transition ${
    active
      ? 'border-b-2 border-green-700 text-green-700'
      : 'text-stone-500 hover:text-stone-700'
  }`

function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    contacted: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-stone-100 text-stone-600'
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-stone-100 text-stone-600'}`}>
      {status}
    </span>
  )
}

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('utamaduni_token'))
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [bookings, setBookings] = useState([])
  const [tab, setTab] = useState('bookings')
  const [contentEdit, setContentEdit] = useState(null)
  const { refresh } = useContent()

  // Sites state
  const [sites, setSites] = useState([])
  const [newSite, setNewSite] = useState({ id: '', title: '', short: '', description: '', image: '', highlights: '' })
  const [editSiteId, setEditSiteId] = useState(null)

  // Adventures state
  const [adventures, setAdventures] = useState([])
  const [newAdv, setNewAdv] = useState({ id: '', title: '', duration: '', priceFrom: '', description: '' })
  const [editAdvId, setEditAdvId] = useState(null)

  // Gallery state
  const [gallery, setGallery] = useState([])
  const [newGallery, setNewGallery] = useState({ caption: '', image: '' })

  const login = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const { data } = await api.post('/admin/login', loginForm)
      localStorage.setItem('utamaduni_token', data.token)
      setToken(data.token)
    } catch {
      setLoginError('Invalid credentials')
    }
  }

  const logout = () => {
    localStorage.removeItem('utamaduni_token')
    setToken(null)
  }

  const loadBookings = async () => {
    try {
      const { data } = await api.get('/admin/bookings')
      setBookings(data)
    } catch (e) {
      if (e.response?.status === 401) logout()
    }
  }

  const loadContent = async () => {
    try {
      const { data } = await api.get('/admin/content')
      setContentEdit(data)
      setSites(data.destinations || [])
      setAdventures(data.adventures || [])
      setGallery(data.gallery || [])
    } catch (e) {
      if (e.response?.status === 401) logout()
    }
  }

  useEffect(() => {
    if (token) {
      loadBookings()
      loadContent()
    }
  }, [token])

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/bookings/${id}`, { status })
    loadBookings()
  }

  const deleteBooking = async (id) => {
    if (!confirm('Delete this booking?')) return
    await api.delete(`/admin/bookings/${id}`)
    loadBookings()
  }

  const sendConfirmationEmail = (b) => {
    const subject = encodeURIComponent(`Booking Confirmed – Utamaduni Safaris`)
    const body = encodeURIComponent(
      `Dear ${b.name},\n\nYour booking for ${b.dates} has been confirmed!\n\nGuests: ${b.guests}\nAdventure: ${b.adventureId || 'Custom'}\n\nWe look forward to hosting you on an incredible Kenya adventure.\n\nWarm regards,\nUtamaduni Safaris Team\n+254798157303 | +254750135285\nsirleemmuhammad18@gmail.com`
    )
    window.open(`mailto:${b.email}?subject=${subject}&body=${body}`)
  }

  const saveContent = async () => {
    await api.put('/admin/content', contentEdit)
    await refresh()
    alert('Content saved!')
  }

  // ---- Sites CRUD ----
  const saveSitesToServer = async (updatedSites) => {
    const updated = { ...contentEdit, destinations: updatedSites }
    await api.put('/admin/content', updated)
    setContentEdit(updated)
    setSites(updatedSites)
    await refresh()
  }

  const addSite = async () => {
    if (!newSite.title || !newSite.id) return alert('ID and Title are required')
    const site = {
      ...newSite,
      highlights: newSite.highlights ? newSite.highlights.split(',').map(h => h.trim()) : []
    }
    const updated = [...sites, site]
    await saveSitesToServer(updated)
    setNewSite({ id: '', title: '', short: '', description: '', image: '', highlights: '' })
  }

  const removeSite = async (id) => {
    if (!confirm('Remove this destination?')) return
    const updated = sites.filter(s => s.id !== id)
    await saveSitesToServer(updated)
  }

  // ---- Adventures CRUD ----
  const saveAdvsToServer = async (updatedAdvs) => {
    const updated = { ...contentEdit, adventures: updatedAdvs }
    await api.put('/admin/content', updated)
    setContentEdit(updated)
    setAdventures(updatedAdvs)
    await refresh()
  }

  const addAdventure = async () => {
    if (!newAdv.title) return alert('Title is required')
    const adv = { ...newAdv, id: newAdv.id || `adv-${Date.now()}`, priceFrom: Number(newAdv.priceFrom) || 0 }
    const updated = [...adventures, adv]
    await saveAdvsToServer(updated)
    setNewAdv({ id: '', title: '', duration: '', priceFrom: '', description: '' })
  }

  const removeAdventure = async (id) => {
    if (!confirm('Remove this adventure?')) return
    const updated = adventures.filter(a => a.id !== id)
    await saveAdvsToServer(updated)
  }

  // ---- Gallery CRUD ----
  const saveGalleryToServer = async (updatedGallery) => {
    const updated = { ...contentEdit, gallery: updatedGallery }
    await api.put('/admin/content', updated)
    setContentEdit(updated)
    setGallery(updatedGallery)
    await refresh()
  }

  const addGalleryItem = async () => {
    if (!newGallery.image || !newGallery.caption) return alert('Caption and image URL are required')
    const item = { ...newGallery, id: `g-${Date.now()}` }
    const updated = [...gallery, item]
    await saveGalleryToServer(updated)
    setNewGallery({ caption: '', image: '' })
  }

  const removeGalleryItem = async (id) => {
    if (!confirm('Remove this gallery item?')) return
    const updated = gallery.filter(g => g.id !== id)
    await saveGalleryToServer(updated)
  }

  // ---- LOGIN SCREEN ----
  if (!token) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4 bg-green-50">
        <form onSubmit={login} className="w-full max-w-sm bg-white p-8 rounded-2xl border border-green-100 shadow-lg space-y-4">
          <div className="text-center mb-2">
            <h1 className="font-display text-2xl text-green-900">Admin Login</h1>
            <p className="text-center text-sm text-stone-500 mt-1">Default: admin / utamaduni2026</p>
          </div>
          <input
            placeholder="Username"
            value={loginForm.username}
            onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-green-200 outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-green-200 outline-none focus:ring-2 focus:ring-green-500"
          />
          {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
          <button type="submit" className="w-full py-2.5 rounded-full bg-green-700 text-white font-medium hover:bg-green-900 transition">
            Login
          </button>
        </form>
      </div>
    )
  }

  // ---- DASHBOARD ----
  return (
    <div className="pt-20 pb-16 min-h-screen bg-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pt-4">
          <h1 className="font-display text-3xl text-green-900">🛡️ Admin Dashboard</h1>
          <button onClick={logout} className="text-sm text-stone-500 hover:text-red-600 transition">Logout</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-4 mb-8 border-b border-green-200 overflow-x-auto">
          {[
            { key: 'bookings', label: `Bookings (${bookings.length})` },
            { key: 'sites', label: 'Sites to Visit' },
            { key: 'schedule', label: 'Schedule & Pricing' },
            { key: 'content', label: 'Content' },
            { key: 'gallery', label: 'Gallery' }
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={TAB_STYLES(tab === t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ---- BOOKINGS TAB ---- */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 && <p className="text-stone-500">No reservations yet.</p>}
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-xl border border-green-100 p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div>
                    <div className="font-medium text-green-900 text-lg">{b.name}</div>
                    <div className="text-sm text-stone-500 mt-0.5">
                      📧 {b.email} · 📞 {b.phone || '—'}
                    </div>
                    <div className="text-sm text-stone-500 mt-1">
                      👥 Guests: {b.guests} · 📅 Dates: {b.dates}
                    </div>
                    {b.adventureId && (
                      <div className="text-sm text-stone-500">🗺️ Adventure: {b.adventureId}</div>
                    )}
                    {b.message && <p className="text-sm text-stone-600 mt-2 italic">"{b.message}"</p>}
                    <div className="text-xs text-stone-400 mt-2 flex items-center gap-2">
                      {new Date(b.createdAt).toLocaleString()} · <StatusBadge status={b.status} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-start shrink-0">
                    <button onClick={() => updateStatus(b.id, 'confirmed')} className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition">✅ Confirm</button>
                    <button onClick={() => updateStatus(b.id, 'contacted')} className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition">📞 Contacted</button>
                    <button onClick={() => updateStatus(b.id, 'cancelled')} className="px-3 py-1 text-xs rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition">✖ Cancel</button>
                    <button onClick={() => sendConfirmationEmail(b)} className="px-3 py-1 text-xs rounded-full bg-[#d4a017]/20 text-yellow-800 hover:bg-[#d4a017]/40 transition">📧 Email Reply</button>
                    <button onClick={() => deleteBooking(b.id)} className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">🗑 Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- SITES TO VISIT TAB ---- */}
        {tab === 'sites' && (
          <div>
            <h2 className="font-display text-2xl text-green-900 mb-6">Destinations / Sites to Visit</h2>

            {/* Add new site */}
            <div className="bg-white rounded-xl border border-green-100 p-6 mb-8 shadow-sm">
              <h3 className="font-medium text-green-800 mb-4">Add New Destination</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">ID (unique slug)*</label>
                  <input value={newSite.id} onChange={e => setNewSite({ ...newSite, id: e.target.value })} placeholder="e.g. mara" className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Title*</label>
                  <input value={newSite.title} onChange={e => setNewSite({ ...newSite, title: e.target.value })} placeholder="Maasai Mara" className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Short description</label>
                  <input value={newSite.short} onChange={e => setNewSite({ ...newSite, short: e.target.value })} placeholder="One-line teaser" className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Image URL</label>
                  <input value={newSite.image} onChange={e => setNewSite({ ...newSite, image: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-stone-500 block mb-1">Full description</label>
                  <textarea rows={3} value={newSite.description} onChange={e => setNewSite({ ...newSite, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-stone-500 block mb-1">Highlights (comma separated)</label>
                  <input value={newSite.highlights} onChange={e => setNewSite({ ...newSite, highlights: e.target.value })} placeholder="Big Five, River crossings, Hot air balloon" className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              </div>
              <button onClick={addSite} className="mt-4 px-6 py-2 rounded-full bg-green-700 text-white text-sm font-medium hover:bg-green-900 transition">
                + Add Destination
              </button>
            </div>

            {/* Existing sites */}
            <div className="space-y-3">
              {sites.map((s) => (
                <div key={s.id} className="bg-white rounded-xl border border-green-100 p-4 flex gap-4 items-start shadow-sm">
                  {s.image && <img src={s.image} alt={s.title} className="w-20 h-16 rounded-lg object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-green-900">{s.title}</div>
                    <div className="text-xs text-stone-400">ID: {s.id}</div>
                    <p className="text-sm text-stone-500 mt-1 line-clamp-1">{s.short}</p>
                  </div>
                  <button onClick={() => removeSite(s.id)} className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shrink-0">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- SCHEDULE & PRICING TAB ---- */}
        {tab === 'schedule' && (
          <div>
            <h2 className="font-display text-2xl text-green-900 mb-6">Schedule & Pricing</h2>

            {/* Add new adventure */}
            <div className="bg-white rounded-xl border border-green-100 p-6 mb-8 shadow-sm">
              <h3 className="font-medium text-green-800 mb-4">Add New Adventure</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Title*</label>
                  <input value={newAdv.title} onChange={e => setNewAdv({ ...newAdv, title: e.target.value })} placeholder="Maasai Mara Safari" className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Duration</label>
                  <input value={newAdv.duration} onChange={e => setNewAdv({ ...newAdv, duration: e.target.value })} placeholder="Full day / 3 days" className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Price from (USD)</label>
                  <input type="number" value={newAdv.priceFrom} onChange={e => setNewAdv({ ...newAdv, priceFrom: e.target.value })} placeholder="150" className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">ID (optional, auto-generated)</label>
                  <input value={newAdv.id} onChange={e => setNewAdv({ ...newAdv, id: e.target.value })} placeholder="auto" className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-stone-500 block mb-1">Description</label>
                  <textarea rows={2} value={newAdv.description} onChange={e => setNewAdv({ ...newAdv, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              </div>
              <button onClick={addAdventure} className="mt-4 px-6 py-2 rounded-full bg-green-700 text-white text-sm font-medium hover:bg-green-900 transition">
                + Add Adventure
              </button>
            </div>

            {/* Existing adventures */}
            <div className="space-y-3">
              {adventures.map((a) => (
                <div key={a.id} className="bg-white rounded-xl border border-green-100 p-4 flex gap-4 items-start shadow-sm">
                  <div className="flex-1">
                    <div className="font-medium text-green-900">{a.title}</div>
                    <div className="text-sm text-stone-500">{a.duration} · From ${a.priceFrom}</div>
                    <p className="text-sm text-stone-400 mt-1">{a.description}</p>
                  </div>
                  <button onClick={() => removeAdventure(a.id)} className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shrink-0">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- CONTENT TAB ---- */}
        {tab === 'content' && contentEdit && (
          <div className="bg-white rounded-xl border border-green-100 p-6 shadow-sm space-y-4 max-w-2xl">
            <h2 className="font-display text-2xl text-green-900 mb-4">Site Content</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Site name</label>
              <input value={contentEdit.siteName || ''} onChange={e => setContentEdit({ ...contentEdit, siteName: e.target.value })} className="w-full px-3 py-2 border border-green-200 rounded-lg outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tagline</label>
              <input value={contentEdit.tagline || ''} onChange={e => setContentEdit({ ...contentEdit, tagline: e.target.value })} className="w-full px-3 py-2 border border-green-200 rounded-lg outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">About text</label>
              <textarea rows={5} value={contentEdit.about || ''} onChange={e => setContentEdit({ ...contentEdit, about: e.target.value })} className="w-full px-3 py-2 border border-green-200 rounded-lg outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input value={contentEdit.contactPhone || ''} onChange={e => setContentEdit({ ...contentEdit, contactPhone: e.target.value })} className="w-full px-3 py-2 border border-green-200 rounded-lg outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input value={contentEdit.contactEmail || ''} onChange={e => setContentEdit({ ...contentEdit, contactEmail: e.target.value })} className="w-full px-3 py-2 border border-green-200 rounded-lg outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input value={contentEdit.address || ''} onChange={e => setContentEdit({ ...contentEdit, address: e.target.value })} className="w-full px-3 py-2 border border-green-200 rounded-lg outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <button onClick={saveContent} className="px-6 py-2.5 rounded-full bg-green-700 text-white font-medium hover:bg-green-900 transition">
              Save Changes
            </button>
          </div>
        )}

        {/* ---- GALLERY TAB ---- */}
        {tab === 'gallery' && (
          <div>
            <h2 className="font-display text-2xl text-green-900 mb-6">Gallery Management</h2>

            {/* Add gallery item */}
            <div className="bg-white rounded-xl border border-green-100 p-6 mb-8 shadow-sm">
              <h3 className="font-medium text-green-800 mb-4">Add Gallery Item</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Caption*</label>
                  <input value={newGallery.caption} onChange={e => setNewGallery({ ...newGallery, caption: e.target.value })} placeholder="Amazing sunrise at the Mara..." className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Image URL*</label>
                  <input value={newGallery.image} onChange={e => setNewGallery({ ...newGallery, image: e.target.value })} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              </div>
              {newGallery.image && (
                <img src={newGallery.image} alt="preview" className="mt-3 h-24 rounded-lg object-cover" />
              )}
              <button onClick={addGalleryItem} className="mt-4 px-6 py-2 rounded-full bg-green-700 text-white text-sm font-medium hover:bg-green-900 transition">
                + Add to Gallery
              </button>
            </div>

            {/* Existing gallery */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="bg-white rounded-xl border border-green-100 overflow-hidden shadow-sm">
                  <img src={g.image} alt={g.caption} className="w-full h-40 object-cover" />
                  <div className="p-3 flex items-start justify-between gap-2">
                    <p className="text-sm text-stone-600 flex-1">{g.caption}</p>
                    <button onClick={() => removeGalleryItem(g.id)} className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shrink-0">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
