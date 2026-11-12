/**
 * EmailJS helper — sends emails directly from the browser.
 * Credentials live in VITE_ env vars (safe to expose in frontend).
 *
 * Set these in client/.env (local) and in Vercel dashboard (production):
 *   VITE_EMAILJS_SERVICE_ID   = your service ID  (e.g. service_xxxxxxx)
 *   VITE_EMAILJS_PUBLIC_KEY   = your public key  (e.g. xxxxxxxxxxxxxxxx)
 *   VITE_EMAILJS_BOOKING_TEMPLATE = template for new booking notifications
 *   VITE_EMAILJS_CONFIRM_TEMPLATE = template for booking confirmed by admin
 */
import emailjs from '@emailjs/browser'

const SERVICE_ID        = import.meta.env.VITE_EMAILJS_SERVICE_ID
const PUBLIC_KEY        = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const BOOKING_TEMPLATE  = import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE
const CONFIRM_TEMPLATE  = import.meta.env.VITE_EMAILJS_CONFIRM_TEMPLATE

function isConfigured() {
  return SERVICE_ID && PUBLIC_KEY
}

/**
 * Notify admin that a new booking came in.
 * Template variables: {{from_name}}, {{from_email}}, {{phone}},
 *   {{dates}}, {{guests}}, {{adventure}}, {{message}}, {{booking_ref}}
 */
export async function notifyNewBooking(booking) {
  if (!isConfigured() || !BOOKING_TEMPLATE) return
  try {
    await emailjs.send(
      SERVICE_ID,
      BOOKING_TEMPLATE,
      {
        from_name:   booking.name,
        from_email:  booking.email,
        phone:       booking.phone || '—',
        dates:       booking.dates,
        guests:      booking.guests,
        adventure:   booking.adventureId || 'Custom itinerary',
        message:     booking.message || '—',
        booking_ref: booking.id?.slice(0, 8).toUpperCase(),
      },
      { publicKey: PUBLIC_KEY }
    )
  } catch (err) {
    console.warn('EmailJS booking notification failed:', err?.text || err?.message || err)
  }
}

/**
 * Send confirmation email to guest when admin confirms their booking.
 * Template variables: {{to_name}}, {{to_email}}, {{dates}},
 *   {{guests}}, {{adventure}}, {{booking_ref}}
 */
export async function sendConfirmationToGuest(booking) {
  if (!isConfigured() || !CONFIRM_TEMPLATE) return
  try {
    await emailjs.send(
      SERVICE_ID,
      CONFIRM_TEMPLATE,
      {
        to_name:     booking.name,
        to_email:    booking.email,
        dates:       booking.dates,
        guests:      booking.guests,
        adventure:   booking.adventureId || 'Custom itinerary',
        booking_ref: booking.id?.slice(0, 8).toUpperCase(),
      },
      { publicKey: PUBLIC_KEY }
    )
  } catch (err) {
    console.warn('EmailJS confirmation failed:', err?.text || err?.message || err)
  }
}
