# Utamaduni Safaris

**Ladha ya Utamaduni** – Wildlife & Coastal Tourism web application  
Based in **Kombani, Kwale County, Kenya**.

A full-stack tourism website with:

- Immersive **3D hero** (React Three Fiber)
- Destinations, Adventures, Gallery (Moments), About, Booking
- **User accounts** with booking status tracking and saved reviews
- **Reservation system** stored on the server and linked to signed-in accounts
- **Admin dashboard** (view/manage bookings + edit site content)

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4 + React Router + Three.js / R3F
- **Backend**: Node.js + Express
- **Auth**: JWT (admin and customer accounts)
- **Storage**: PostgreSQL in production; JSON files for local development

## Quick Start

### 1. Install dependencies

```bash
cd utamaduni-safaris
# Server
cd server && npm install && cd ..
# Client
cd client && npm install --legacy-peer-deps && cd ..
```

### 2. Run development

**Terminal 1 – API**
```bash
cd server
npm start
# → http://localhost:5000
```

**Terminal 2 – React**
```bash
cd client
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies `/api` to the Express backend.

### 3. Production build

```bash
cd client && npm run build
cd ../server && npm start
```

Express will serve the built React app from `client/dist`.

## Admin

- URL: `/admin`
- Username: `admin`
- Password: `utamaduni2026`

**Change the password before deploying** by replacing the credentials in `server/data/admin.json` with a bcrypt hash for a strong password.

## Deployment

### Render (API)

The root `render.yaml` configures the API as a Render web service. Create a new Blueprint from this repository; Render installs dependencies from `server/package-lock.json`, starts the API, generates a `JWT_SECRET`, and checks `/api/health`.

Set `DATABASE_URL` in the Render service's Environment settings to the Supabase PostgreSQL connection URI. On startup, the API creates its `bookings`, `site_content`, `users`, `reviews`, `admin_users`, and migration tables. Legacy JSON data is imported once only into a completely empty database; after that, PostgreSQL is authoritative and deleted content is not restored from JSON. New bookings, accounts, and reviews are stored in PostgreSQL.

Render Free web services block outbound SMTP on ports 25, 465, and 587. Use Resend's HTTPS API for booking emails: set `RESEND_API_KEY` and `RESEND_FROM` in Render's Environment settings. For initial testing, Resend permits its `onboarding@resend.dev` sender only to your own Resend account email. To send to customers, verify a domain in Resend and set `RESEND_FROM` to an address on that domain. When `RESEND_API_KEY` is set, the API uses Resend instead of SMTP. For local development, copy `server/.env.example` to `server/.env`; `.env` files are ignored by Git.

In local development, omitting `DATABASE_URL` keeps data in JSON files. Production startup requires `DATABASE_URL` so the API cannot silently use Render's temporary filesystem. JSON records already present in `server/data` are imported into PostgreSQL without overwriting existing database records.

### Vercel (website)

Create a Vercel project from this repository with **Root Directory** set to `client`. Use the Vite defaults (`npm run build`, output directory `dist`). `client/vercel.json` enables client-side route fallback.

Set this Vercel environment variable for Production (and Preview if needed):

```text
VITE_API_URL=https://<your-render-service>.onrender.com/api
```

Replace the example host with the URL assigned to the Render API. The frontend reads this value at build time. For local frontend development, copy `client/.env.example` to `client/.env.local`; alternatively leave `VITE_API_URL` unset to use the Vite `/api` proxy.

## Features

| Feature | Description |
|---------|-------------|
| 3D Hero | Interactive terrain + ocean + floating elements |
| Destinations | Shimba Hills, Diani, Kisite-Mpunguti, Kaya forests |
| Adventures | Bookable experiences with prices |
| Moments | Guest photo gallery |
| Booking form | Saves to server, visible in admin |
| Admin | Login, view/update/delete bookings, edit site text |

## Company info

- **Name**: Utamaduni Safaris  
- **Location**: Kombani, Matuga, Kwale, Kenya  
- **Focus**: Wildlife (Shimba Hills, elephants, sable) + Coastal (Diani, marine park) + Cultural (Kaya forests, Swahili heritage)

Built with ❤️ for the south coast of Kenya.
