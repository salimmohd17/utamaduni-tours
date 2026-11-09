# Utamaduni Safaris

**Ladha ya Utamaduni** – Wildlife & Coastal Tourism web application  
Based in **Kombani, Kwale County, Kenya**.

A full-stack tourism website with:

- Immersive **3D hero** (React Three Fiber)
- Destinations, Adventures, Gallery (Moments), About, Booking
- **Reservation system** stored on the server
- **Admin dashboard** (view/manage bookings + edit site content)

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4 + React Router + Three.js / R3F
- **Backend**: Node.js + Express
- **Auth**: JWT (admin)
- **Storage**: JSON files (easy to swap for a real DB later)

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

**Change the password** in production by editing `server/data/admin.json` or re-seeding with a new bcrypt hash.

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
