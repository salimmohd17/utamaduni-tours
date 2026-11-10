const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || '';
const pool = DATABASE_URL ? new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
}) : null;
const JWT_SECRET = process.env.JWT_SECRET || 'utamaduni-kwale-2026-secret-key-change-in-prod';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn('WARN: JWT_SECRET is not configured. Using a temporary fallback secret until it is set in Render.');
}

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const CONTENT_FILE  = path.join(DATA_DIR, 'content.json');
const ADMIN_FILE    = path.join(DATA_DIR, 'admin.json');
const USERS_FILE    = path.join(DATA_DIR, 'users.json');

// Helpers
function readJSON(file, fallback = []) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {}
  return fallback;
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ---- Nodemailer transporter ----
function createTransporter() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendConfirmationEmail(booking) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('SMTP not configured — skipping confirmation email for', booking.email);
    return false;
  }
  try {
    await transporter.sendMail({
      from: `"Utamaduni Safaris" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: booking.email,
      subject: 'Booking Confirmed – Utamaduni Safaris 🌿',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f0fdf4;padding:30px;border-radius:12px;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#14532d;font-size:28px;margin:0;">🌿 Utamaduni Safaris</h1>
            <p style="color:#15803d;font-size:14px;margin:4px 0;">Kenya. Wild. Alive.</p>
          </div>
          <div style="background:#fff;padding:28px;border-radius:10px;border:1px solid #bbf7d0;">
            <h2 style="color:#14532d;margin-top:0;">Your Booking is Confirmed! ✅</h2>
            <p style="color:#374151;">Dear <strong>${booking.name}</strong>,</p>
            <p style="color:#374151;">We're thrilled to confirm your reservation. Here are your details:</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">📅 Dates</td><td style="padding:8px 0;font-weight:600;color:#14532d;">${booking.dates}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">👥 Guests</td><td style="padding:8px 0;font-weight:600;color:#14532d;">${booking.guests}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">🗺️ Adventure</td><td style="padding:8px 0;font-weight:600;color:#14532d;">${booking.adventureId || 'Custom itinerary'}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">🔖 Reference</td><td style="padding:8px 0;font-weight:600;color:#14532d;">${booking.id.slice(0,8).toUpperCase()}</td></tr>
            </table>
            <p style="color:#374151;">Our team will be in touch shortly with your full itinerary and payment details.</p>
            <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;text-align:center;">
              <p style="margin:0;font-size:14px;color:#374151;">Need help? Contact us:</p>
              <p style="margin:4px 0;color:#15803d;font-weight:600;">📞 +254 798 157 303 &nbsp;|&nbsp; +254 750 135 285</p>
              <p style="margin:4px 0;color:#15803d;">💬 WhatsApp us anytime</p>
            </div>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:20px;">
            Utamaduni Safaris · Kombani, Kwale County, Kenya<br>
            &copy; 2026 Utamaduni Safaris. All rights reserved.
          </p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error('Email send failed:', err.message);
    return false;
  }
}

async function ensureDatabaseSchema() {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const content = readJSON(CONTENT_FILE, {});
  if (Object.keys(content).length > 0) {
    await pool.query(
      `INSERT INTO site_content (key, payload)
       VALUES ('main', $1)
       ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
      [content]
    );
  }
}

async function readContentData() {
  if (!pool) return readJSON(CONTENT_FILE, {});

  const { rows } = await pool.query(
    `SELECT payload FROM site_content WHERE key = 'main' LIMIT 1`
  );

  return rows[0]?.payload || readJSON(CONTENT_FILE, {});
}

async function writeContentData(content) {
  if (!pool) {
    writeJSON(CONTENT_FILE, content);
    return;
  }

  await pool.query(
    `INSERT INTO site_content (key, payload)
     VALUES ('main', $1)
     ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
    [content]
  );
}

async function readBookingsData() {
  if (!pool) return readJSON(BOOKINGS_FILE, []);

  const { rows } = await pool.query(
    `SELECT payload FROM bookings ORDER BY created_at DESC`
  );

  return rows.map(row => row.payload);
}

async function writeBookingsData(bookings) {
  if (!pool) {
    writeJSON(BOOKINGS_FILE, bookings);
    return;
  }

  await pool.query('DELETE FROM bookings');

  for (const booking of bookings) {
    await pool.query(
      `INSERT INTO bookings (id, payload) VALUES ($1, $2)`,
      [booking.id, booking]
    );
  }
}

// Seed admin (password: utamaduni2026)
if (!fs.existsSync(ADMIN_FILE)) {
  const hash = bcrypt.hashSync('utamaduni2026', 10);
  writeJSON(ADMIN_FILE, { username: 'admin', passwordHash: hash });
}

// Seed users file
if (!fs.existsSync(USERS_FILE)) writeJSON(USERS_FILE, []);

// Seed default content
if (!fs.existsSync(CONTENT_FILE)) {
  writeJSON(CONTENT_FILE, {
    siteName: 'Utamaduni Safaris',
    tagline: 'Kenya. Wild. Alive. — From the Savannah to the Ocean',
    about: "Utamaduni Safaris was born in Kombani, a small town in Kwale County, from the friendship of two young men who grew up surrounded by Kenya's most incredible natural wonders.",
    contactPhone: '+254798157303',
    contactEmail: 'sirleemmuhammad18@gmail.com',
    address: 'Kombani, Matuga Sub-County, Kwale County, Kenya',
    destinations: [],
    adventures: [],
    gallery: []
  });
}

if (!fs.existsSync(BOOKINGS_FILE)) writeJSON(BOOKINGS_FILE, []);

app.use(cors());
app.use(express.json({ limit: '2mb' }));

ensureDatabaseSchema().catch((error) => {
  console.error('Database initialization failed:', error.message);
});

// ========== PUBLIC ROUTES ==========
app.get('/api/health', (req, res) => res.json({ status: 'ok', company: 'Utamaduni Safaris' }));

app.get('/api/content', async (req, res) => {
  res.json(await readContentData());
});

app.post('/api/bookings', async (req, res) => {
  const { name, email, phone, dates, guests, adventureId, message, userId } = req.body;
  if (!name || !email || !dates) {
    return res.status(400).json({ error: 'Name, email and preferred dates are required' });
  }

  const bookings = await readBookingsData();
  const booking = {
    id: uuidv4(),
    name,
    email,
    phone: phone || '',
    dates,
    guests: guests || 1,
    adventureId: adventureId || '',
    message: message || '',
    userId: userId || null,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(booking);
  await writeBookingsData(bookings);
  res.status(201).json({ success: true, booking });
});

// ========== USER AUTH ==========
app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const users = readJSON(USERS_FILE, []);
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = { id: uuidv4(), name, email, passwordHash, createdAt: new Date().toISOString() };
  users.push(user);
  writeJSON(USERS_FILE, users);

  const token = jwt.sign({ userId: user.id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readJSON(USERS_FILE, []);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ userId: user.id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Get user's own bookings (by email or userId)
app.get('/api/users/bookings', async (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  let payload;
  try {
    payload = jwt.verify(header.slice(7), JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const bookings = await readBookingsData();
  const userBookings = bookings.filter(b =>
    b.userId === payload.userId || b.email === payload.email
  );

  res.json(userBookings.map(b => ({
    id: b.id,
    dates: b.dates,
    guests: b.guests,
    adventureId: b.adventureId,
    status: b.status,
    createdAt: b.createdAt,
    message: b.message,
  })));
});

// ========== AUTH ==========
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = readJSON(ADMIN_FILE, {});
  if (username !== admin.username) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, username: admin.username });
});

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ========== ADMIN ROUTES ==========
app.get('/api/admin/bookings', auth, async (req, res) => {
  res.json(await readBookingsData());
});

app.patch('/api/admin/bookings/:id', auth, async (req, res) => {
  const bookings = await readBookingsData();
  const idx = bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  bookings[idx] = { ...bookings[idx], ...req.body, updatedAt: new Date().toISOString() };
  await writeBookingsData(bookings);

  // Auto-send confirmation email when status set to 'confirmed'
  if (req.body.status === 'confirmed') {
    const sent = await sendConfirmationEmail(bookings[idx]);
    return res.json({ ...bookings[idx], emailSent: sent });
  }

  res.json(bookings[idx]);
});

app.delete('/api/admin/bookings/:id', auth, async (req, res) => {
  let bookings = await readBookingsData();
  bookings = bookings.filter(b => b.id !== req.params.id);
  await writeBookingsData(bookings);
  res.json({ success: true });
});

app.put('/api/admin/content', auth, async (req, res) => {
  const current = await readContentData();
  const updated = { ...current, ...req.body };
  await writeContentData(updated);
  res.json(updated);
});

app.get('/api/admin/content', auth, async (req, res) => {
  res.json(await readContentData());
});

// ========== DESTINATIONS CRUD ==========
app.post('/api/admin/sites', auth, async (req, res) => {
  const content = await readContentData();
  const destinations = content.destinations || [];
  const newSite = { ...req.body, id: req.body.id || uuidv4() };
  destinations.push(newSite);
  content.destinations = destinations;
  await writeContentData(content);
  res.status(201).json(newSite);
});

app.delete('/api/admin/sites/:id', auth, async (req, res) => {
  const content = await readContentData();
  content.destinations = (content.destinations || []).filter(d => d.id !== req.params.id);
  await writeContentData(content);
  res.json({ success: true });
});

// ========== ADVENTURES CRUD ==========
app.post('/api/admin/adventures', auth, async (req, res) => {
  const content = await readContentData();
  const adventures = content.adventures || [];
  const newAdv = { ...req.body, id: req.body.id || uuidv4() };
  adventures.push(newAdv);
  content.adventures = adventures;
  await writeContentData(content);
  res.status(201).json(newAdv);
});

app.delete('/api/admin/adventures/:id', auth, async (req, res) => {
  const content = await readContentData();
  content.adventures = (content.adventures || []).filter(a => a.id !== req.params.id);
  await writeContentData(content);
  res.json({ success: true });
});

// ========== GALLERY CRUD ==========
app.post('/api/admin/gallery', auth, async (req, res) => {
  const content = await readContentData();
  const gallery = content.gallery || [];
  const newItem = { ...req.body, id: req.body.id || uuidv4() };
  gallery.push(newItem);
  content.gallery = gallery;
  await writeContentData(content);
  res.status(201).json(newItem);
});

app.delete('/api/admin/gallery/:id', auth, async (req, res) => {
  const content = await readContentData();
  content.gallery = (content.gallery || []).filter(g => g.id !== req.params.id);
  await writeContentData(content);
  res.json({ success: true });
});

// Serve React build in production
const clientBuild = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🌿 Utamaduni Safaris API running on http://localhost:${PORT}`);
  console.log(`   Admin login: username "admin" / password "utamaduni2026"\n`);
});
