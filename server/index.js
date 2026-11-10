const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

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
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

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

// Seed default content
if (!fs.existsSync(CONTENT_FILE)) {
  writeJSON(CONTENT_FILE, {
    siteName: 'Utamaduni Safaris',
    tagline: 'Kenya. Wild. Alive. — From the Savannah to the Ocean',
    about: 'Utamaduni Safaris was born in Kombani, a small town in Kwale County, from the friendship of two young men who grew up surrounded by Kenya\'s most incredible natural wonders. Salim and Abdallah saw the beauty of Shimba Hills, the magic of the coast, and the richness of Swahili culture — and decided the world needed to experience it too.',
    contactPhone: '+254798157303',
    contactEmail: 'sirleemmuhammad18@gmail.com',
    address: 'Kombani, Matuga Sub-County, Kwale County, Kenya',
    destinations: [
      {
        id: 'shimba',
        title: 'Shimba Hills National Reserve',
        short: 'Coastal rainforest, elephants & Kenya\'s only sable antelope.',
        description: 'Just inland from the coast, Shimba Hills protects one of East Africa\'s last large coastal rainforests. Home to elephants, the rare sable antelope, and the beautiful Sheldrick Falls.',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
        highlights: ['Sable antelope', 'Elephants', 'Sheldrick Falls', 'Birdwatching']
      },
      {
        id: 'diani',
        title: 'Diani & Tiwi Beaches',
        short: 'Powder-white sands and turquoise Indian Ocean waters.',
        description: 'Diani Beach is repeatedly voted among Africa\'s best. Long stretches of soft sand, calm lagoons, kitesurfing, and relaxed Swahili coastal life.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
        highlights: ['White sand', 'Water sports', 'Sunset dhows', 'Beach restaurants']
      },
      {
        id: 'kisite',
        title: 'Kisite-Mpunguti Marine Park',
        short: 'Dolphins, coral reefs and dhow sailing to Wasini Island.',
        description: 'Kenya\'s premier marine park. Snorkel vibrant reefs, swim with dolphins, sail traditional dhows and enjoy fresh seafood on car-free Wasini Island.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
        highlights: ['Dolphins', 'Snorkelling', 'Wasini Island', 'Coral reefs']
      },
      {
        id: 'kaya',
        title: 'Kaya Forests & Culture',
        short: 'Sacred Mijikenda forests and living coastal heritage.',
        description: 'Guided walks into sacred kaya forests with community elders. Learn about traditional beliefs, conservation practices, local dances and Swahili coastal cuisine.',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
        highlights: ['Sacred forests', 'Cultural guides', 'Traditional dance', 'Local markets']
      },
      {
        id: 'mara',
        title: 'Maasai Mara National Reserve',
        short: 'The Great Migration and Africa\'s most iconic safari destination.',
        description: 'The Maasai Mara is Kenya\'s most celebrated reserve, home to the annual wildebeest migration, the Big Five, and spectacular open savannah landscapes that define the African safari experience.',
        image: '/assets/wildbeest-migration.jpg',
        highlights: ['Great Migration', 'Big Five', 'Hot air balloon', 'Maasai culture']
      },
      {
        id: 'amboseli',
        title: 'Amboseli National Park',
        short: 'Elephants against the backdrop of mighty Mount Kilimanjaro.',
        description: 'Amboseli offers some of Africa\'s most iconic views — massive elephant herds roaming freely beneath the snow-capped peak of Mount Kilimanjaro. A photographer\'s paradise.',
        image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1200&q=80',
        highlights: ['Elephant herds', 'Mount Kilimanjaro views', 'Big Five', 'Photography']
      },
      {
        id: 'tsavo',
        title: 'Tsavo East & West',
        short: 'Kenya\'s largest park — red elephants, lava flows and vast wilderness.',
        description: 'Tsavo is Kenya\'s largest national park system, divided into Tsavo East and West. Famous for its red-dusted elephants, the Mzima Springs, Lugard Falls, and incredible biodiversity.',
        image: '/assets/elephants.jpg',
        highlights: ['Red elephants', 'Mzima Springs', 'Lugard Falls', 'Vast wilderness']
      },
      {
        id: 'mtknya',
        title: 'Mount Kenya',
        short: 'Africa\'s second-highest peak — trekking, glaciers and unique alpine wildlife.',
        description: 'Mount Kenya offers dramatic trekking routes through bamboo forests, moorlands and glaciated peaks. The surrounding national park is home to buffalo, leopard, and rare mountain bongo.',
        image: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=1200&q=80',
        highlights: ['Trekking routes', 'Glaciers', 'Mountain bongo', 'Alpine scenery']
      },
      {
        id: 'nakuru',
        title: 'Lake Nakuru National Park',
        short: 'Flamingos, rhinos and a lake that turns pink.',
        description: 'Lake Nakuru is famous for its stunning flamingo flocks that colour the water pink. The park is also one of Kenya\'s most reliable places to spot both black and white rhinos.',
        image: 'https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?w=1200&q=80',
        highlights: ['Flamingos', 'Black & white rhinos', 'Rothschild giraffe', 'Scenic lake']
      },
      {
        id: 'samburu',
        title: 'Samburu National Reserve',
        short: 'Rare northern species in a dramatic semi-arid landscape.',
        description: 'Samburu is home to species found nowhere else in Kenya — the Grevy\'s zebra, reticulated giraffe, Somali ostrich, Beisa oryx and the gerenuk. Set in a stunning semi-arid landscape along the Ewaso Ng\'iro River.',
        image: 'https://images.unsplash.com/photo-1455287278107-115faab3049c?w=1200&q=80',
        highlights: ['Grevy\'s zebra', 'Reticulated giraffe', 'Gerenuk', 'River wildlife']
      },
      {
        id: 'hellsgate',
        title: "Hell's Gate National Park",
        short: "Cycle through gorges, geysers and dramatic cliffs — no car needed.",
        description: "Hell's Gate is Kenya's most unique park — you can cycle or hike through it. Dramatic volcanic cliffs, Ol Njorowa Gorge, Fischer's Tower, and natural geothermal geysers make it unforgettable.",
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
        highlights: ['Cycling safari', 'Gorge hiking', 'Geothermal geysers', 'Rock climbing']
      },
      {
        id: 'lamu',
        title: 'Lamu Island',
        short: 'UNESCO-listed Swahili city, dhow sailing and pristine beaches.',
        description: 'Lamu Old Town is a UNESCO World Heritage Site — Kenya\'s oldest living Swahili settlement. No cars, just donkeys and dhows. Stunning beaches, fresh seafood and a timeless coastal atmosphere.',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=80',
        highlights: ['Swahili architecture', 'Dhow sailing', 'Pristine beaches', 'Cultural heritage']
      },
      {
        id: 'watamu',
        title: 'Watamu Marine Park',
        short: 'Sea turtles, world-class diving and pristine coral reefs.',
        description: 'Watamu is a marine biodiversity hotspot. The marine national park protects nesting sea turtles, vibrant coral gardens, tropical fish, and offers some of East Africa\'s best snorkelling and diving.',
        image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',
        highlights: ['Sea turtles', 'Coral diving', 'Snorkelling', 'Blue Cave']
      },
      {
        id: 'malindi',
        title: 'Malindi',
        short: 'Historic Swahili coast town with beaches, heritage and marine life.',
        description: 'Malindi blends Portuguese colonial history with Swahili coastal culture. Visit the Vasco da Gama pillar, explore the marine park, enjoy the nightlife, or simply relax on wide sandy beaches.',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80',
        highlights: ['Vasco da Gama pillar', 'Marine park', 'Swahili culture', 'Beaches']
      }
    ],
    adventures: [
      { id: 'a1', title: 'Shimba Hills Safari Day', duration: 'Full day', priceFrom: 95, description: 'Game drive + forest walk + Sheldrick Falls. Picnic lunch included.' },
      { id: 'a2', title: 'Dhow & Dolphin Experience', duration: 'Full day', priceFrom: 85, description: 'Boat to Kisite, snorkelling, dolphin spotting, Wasini seafood lunch.' },
      { id: 'a3', title: 'Cultural Kaya Immersion', duration: 'Half day', priceFrom: 45, description: 'Guided sacred forest walk with elders + traditional performance.' },
      { id: 'a4', title: 'Mwaluganje Elephant Sanctuary', duration: 'Half / Full day', priceFrom: 55, description: 'Community conservancy focused on elephants and local livelihoods.' },
      { id: 'a5', title: 'Coastal Free Day Package', duration: 'Flexible', priceFrom: 30, description: 'Beach transfer, optional kitesurf intro or colobus conservation visit.' },
      { id: 'a6', title: 'Multi-day Utamaduni Circuit', duration: '3–7 days', priceFrom: 320, description: 'Custom mix of wildlife, marine and cultural days with accommodation options.' },
      { id: 'a7', title: 'Maasai Mara Migration Safari', duration: '3–5 days', priceFrom: 450, description: 'Fly-in or drive to the Mara for the greatest wildlife show on Earth. Game drives, Big Five, Maasai village visit.' },
      { id: 'a8', title: 'Amboseli Elephants & Kilimanjaro', duration: '2–3 days', priceFrom: 320, description: 'Photograph elephant families with Mount Kilimanjaro as the backdrop. Unforgettable.' },
      { id: 'a9', title: 'Lamu Island Cultural Retreat', duration: '2–4 days', priceFrom: 280, description: 'Dhow cruise, old town walking tour, beach relaxation and fresh seafood on Lamu Island.' },
      { id: 'a10', title: "Hell's Gate Cycling Adventure", duration: 'Full day', priceFrom: 65, description: 'Cycle through dramatic gorges and geothermal features. Great for adventurous travelers.' }
    ],
    gallery: [
      { id: 'g1', caption: 'Zebra herd roaming free on the open plains', image: '/assets/zebras-hero.jpg' },
      { id: 'g2', caption: 'The Great Wildebeest Migration — a spectacle like no other', image: '/assets/wildbeest-migration.jpg' },
      { id: 'g3', caption: 'Elephants crossing the river at Tsavo', image: '/assets/elephants.jpg' },
      { id: 'g4', caption: 'Mixed wildlife grazing together in the reserve', image: '/assets/wildlife-reserve.jpg' },
      { id: 'g5', caption: 'Dolphin surprise on the way to Wasini', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80' },
      { id: 'g6', caption: 'That Diani sunset feeling', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
      { id: 'g7', caption: 'Flamingos at Lake Nakuru at sunset', image: 'https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?w=800&q=80' },
      { id: 'g8', caption: 'Lamu dhow sailing at golden hour', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80' },
      { id: 'g9', caption: 'Hot air balloon over Maasai Mara at sunrise', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80' }
    ]
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
  const { name, email, phone, dates, guests, adventureId, message } = req.body;
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
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(booking);
  await writeBookingsData(bookings);
  res.status(201).json({ success: true, booking });
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
