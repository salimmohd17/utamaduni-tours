import { Link } from 'react-router-dom'
import { Clock, Compass, MapPin, Users, ChevronDown, ExternalLink } from 'lucide-react'
import { useState } from 'react'

// 1 USD ≈ 130 KES (indicative rate)
const USD_TO_KES = 130

// Official park/reserve links
const parkLinks = {
  'Maasai Mara':        'https://www.maasaimara.com/',
  'Amboseli':           'https://www.kws.go.ke/parks/amboseli-national-park',
  'Tsavo':              'https://www.kws.go.ke/parks/tsavo-east-national-park',
  'Shimba Hills':       'https://www.kws.go.ke/parks/shimba-hills-national-reserve',
  'Lake Nakuru':        'https://www.kws.go.ke/parks/lake-nakuru-national-park',
  'Samburu':            'https://www.kws.go.ke/parks/samburu-national-reserve',
  "Hell's Gate":        'https://www.kws.go.ke/parks/hells-gate-national-park',
  'Nairobi NP':         'https://www.kws.go.ke/parks/nairobi-national-park',
  'Mount Kenya':        'https://www.kws.go.ke/parks/mount-kenya-national-park-and-reserve',
  'Kisite-Mpunguti':    'https://www.kws.go.ke/parks/kisite-mpunguti-marine-national-park',
  'Watamu':             'https://www.kws.go.ke/parks/watamu-marine-national-park',
  'Lamu':               'https://www.lamuarchipelago.org/',
  'Ol Pejeta':          'https://www.olpejetaconservancy.org/',
  'Mwaluganje':         'https://www.kws.go.ke/',
  // Museums & Forests
  'Fort Jesus':         'https://www.museums.or.ke/fort-jesus/',
  'Gede Ruins':         'https://www.museums.or.ke/gede-ruins/',
  'Arabuko-Sokoke':     'https://www.kws.go.ke/parks/arabuko-sokoke-forest-reserve',
  'Kakamega Forest':    'https://www.kws.go.ke/parks/kakamega-forest-national-reserve',
  'Karura Forest':      'https://www.friendsofkarura.org/',
  'Nairobi Museum':     'https://www.museums.or.ke/nairobi-national-museum/',
}

const adventures = [
  {
    id: 'a1',
    title: 'Shimba Hills Safari',
    emoji: '🌿',
    park: 'Shimba Hills',
    image: '/assets/shimba hills waterfals.jpg',
    minDays: 1,
    maxDays: 5,
    description: "Game drive through one of East Africa's last coastal rainforests. See Kenya's only sable antelope, elephants, and the breathtaking Sheldrick Falls. Picnic lunch included.",
    highlights: ['Sable antelope', 'Elephants', 'Sheldrick Falls', 'Forest birding'],
    foreignerBase: 195,
    residentBase: 95,
    citizenBase: 45,
    includes: ['Park fees', 'Game drive vehicle', 'Picnic lunch', 'Naturalist guide', 'Bottled water'],
    category: 'Wildlife'
  },
  {
    id: 'a2',
    title: 'Dhow & Dolphin — Kisite-Mpunguti',
    emoji: '🐬',
    park: 'Kisite-Mpunguti',
    image: '/assets/kisite mpunguti dolphine view.jpg',
    minDays: 1,
    maxDays: 3,
    description: 'Sail a traditional dhow to Wasini Island, snorkel vibrant coral reefs, swim with wild spinner dolphins, and feast on a fresh crab and coconut seafood lunch.',
    highlights: ['Dolphin spotting', 'Snorkelling', 'Wasini Island', 'Seafood lunch'],
    foreignerBase: 165,
    residentBase: 85,
    citizenBase: 40,
    includes: ['Dhow boat', 'Marine park fees', 'Snorkel gear', 'Seafood lunch', 'Guide'],
    category: 'Marine'
  },
  {
    id: 'a3',
    title: 'Kaya Forest Cultural Immersion',
    emoji: '🌳',
    park: 'Lamu',
    image: '/assets/historic site, gedi ruins.jpg',
    minDays: 1,
    maxDays: 2,
    description: 'Walk into sacred Mijikenda kaya forests with community elders. Learn traditional beliefs, healing plants, village dances, and enjoy authentic Swahili coastal cuisine.',
    highlights: ['Sacred forests', 'Elder guides', 'Traditional dance', 'Swahili cuisine'],
    foreignerBase: 95,
    residentBase: 55,
    citizenBase: 25,
    includes: ['Community elder guide', 'Cultural performance', 'Traditional lunch', 'Forest entry'],
    category: 'Culture'
  },
  {
    id: 'a4',
    title: 'Mwaluganje Elephant Sanctuary',
    emoji: '🐘',
    park: 'Mwaluganje',
    image: '/assets/ol pojeta conservercy , rhino.webp',
    minDays: 1,
    maxDays: 2,
    description: "Walk or drive through Kenya's community-owned elephant conservancy. Encounter free-roaming elephants, rare birds and the remarkable story of local conservation success.",
    highlights: ['Elephant herds', 'Community conservancy', 'Birdwatching', 'Conservation story'],
    foreignerBase: 125,
    residentBase: 65,
    citizenBase: 30,
    includes: ['Conservancy entry', 'Game drive', 'Community guide', 'Packed lunch'],
    category: 'Wildlife'
  },
  {
    id: 'a5',
    title: 'Diani & Tiwi Beach Escape',
    emoji: '🏖️',
    park: null,
    image: '/assets/tiwi beach.jpg',
    minDays: 1,
    maxDays: 7,
    description: "Relax on Africa's finest white-sand beaches. Includes hotel/resort transfers, optional kitesurf intro lesson, colobus monkey forest walk, and sunset dhow cocktail cruise.",
    highlights: ['White sand beach', 'Kitesurfing', 'Colobus forest', 'Sunset dhow'],
    foreignerBase: 85,
    residentBase: 55,
    citizenBase: 25,
    includes: ['Transfers', 'Beach access', 'Kitesurf intro or colobus walk', 'Sunset dhow'],
    category: 'Beach'
  },
  {
    id: 'a6',
    title: 'Maasai Mara Migration Safari',
    emoji: '🦁',
    park: 'Maasai Mara',
    image: '/assets/maasai mara ,ostrich.webp',
    minDays: 3,
    maxDays: 14,
    description: 'Witness the greatest wildlife spectacle on Earth — millions of wildebeest and zebra crossing the Mara River. Big Five game drives, Maasai village visits, and optional hot-air balloon.',
    highlights: ['Great Migration', 'Big Five', 'Mara River crossing', 'Maasai culture', 'Balloon safari'],
    foreignerBase: 450,
    residentBase: 225,
    citizenBase: 95,
    includes: ['Fly-in or road transfers', 'Full-board camp/lodge', 'Twice-daily game drives', 'Park fees', 'Maasai village'],
    category: 'Premium Safari'
  },
  {
    id: 'a7',
    title: 'Amboseli Elephants & Kilimanjaro',
    emoji: '🏔️',
    park: 'Amboseli',
    image: '/assets/amboseli,giant elephany herds.webp',
    minDays: 2,
    maxDays: 5,
    description: "Photograph the largest free-roaming elephant herds in Africa with the majestic snow-capped Kilimanjaro as your backdrop. A photographer's ultimate dream destination.",
    highlights: ['Elephant families', 'Kilimanjaro views', 'Big Five', 'Photography', 'Maasai guides'],
    foreignerBase: 380,
    residentBase: 185,
    citizenBase: 80,
    includes: ['Lodge/camp', 'Game drives', 'Park fees', 'All meals', 'Expert guide'],
    category: 'Premium Safari'
  },
  {
    id: 'a8',
    title: 'Samburu Northern Frontier',
    emoji: '🦒',
    park: 'Samburu',
    image: '/assets/samburu ,crystal pool.webp',
    minDays: 2,
    maxDays: 7,
    description: "Discover the rare 'Samburu Special Five' — Grevy's zebra, reticulated giraffe, Somali ostrich, Beisa oryx and gerenuk — in a dramatic semi-arid landscape along the Ewaso Ng'iro River.",
    highlights: ["Grevy's zebra", 'Reticulated giraffe', 'Gerenuk', 'River wildlife', 'Samburu culture'],
    foreignerBase: 390,
    residentBase: 195,
    citizenBase: 85,
    includes: ['Lodge/camp', 'Morning & evening drives', 'Park fees', 'All meals', 'Cultural visit'],
    category: 'Wildlife'
  },
  {
    id: 'a9',
    title: "Hell's Gate Cycling Adventure",
    emoji: '🚴',
    park: "Hell's Gate",
    image: '/assets/hells gate,view.webp',
    minDays: 1,
    maxDays: 2,
    description: "Cycle or hike through Africa's most unique national park — dramatic volcanic cliffs, the Ol Njorowa Gorge, Fischer's Tower, and natural geothermal geysers. No game-drive vehicle needed.",
    highlights: ["Cycling safari", 'Gorge hiking', 'Geothermal geysers', 'Rock climbing', "Fischer's Tower"],
    foreignerBase: 115,
    residentBase: 65,
    citizenBase: 28,
    includes: ['Park entry', 'Bicycle hire', 'Gorge guide', 'Packed lunch', 'Transport'],
    category: 'Adventure'
  },
  {
    id: 'a10',
    title: 'Lamu Island Cultural Retreat',
    emoji: '⛵',
    park: 'Lamu',
    image: '/assets/lamu island.jpg',
    minDays: 2,
    maxDays: 7,
    description: "Arrive by dhow to Kenya's oldest living Swahili town — a UNESCO World Heritage Site with no cars, only donkeys and dhows. Explore ancient architecture, pristine beaches, and fresh seafood.",
    highlights: ['UNESCO Old Town', 'Dhow sailing', 'Swahili architecture', 'Pristine beaches', 'Fresh seafood'],
    foreignerBase: 220,
    residentBase: 120,
    citizenBase: 55,
    includes: ['Dhow transfers', 'Guesthouse/lodge', 'Old town walking tour', 'Dhow cruise', 'Most meals'],
    category: 'Culture'
  },
  {
    id: 'a11',
    title: 'Tsavo Red Elephant Wilderness',
    emoji: '🦏',
    park: 'Tsavo',
    image: '/assets/tsavo 1.jpg',
    minDays: 2,
    maxDays: 10,
    description: "Explore Kenya's largest national park — famous for its distinctive red-dusted elephants, the crystal-clear Mzima Springs, dramatic Lugard Falls and vast untouched wilderness.",
    highlights: ['Red elephants', 'Mzima Springs', 'Lugard Falls', 'Big Five', 'Vast wilderness'],
    foreignerBase: 340,
    residentBase: 165,
    citizenBase: 70,
    includes: ['Lodge/tented camp', 'Game drives', 'Park fees', 'Full board', 'Expert guide'],
    category: 'Wildlife'
  },
  {
    id: 'a12',
    title: 'Lake Nakuru Flamingo & Rhino Safari',
    emoji: '🦩',
    park: 'Lake Nakuru',
    image: '/assets/ol pojeta conservercy , rhino.webp',
    minDays: 1,
    maxDays: 3,
    description: "Watch the lake turn pink with thousands of flamingos. Lake Nakuru is Kenya's most reliable spot for both black and white rhinos, plus Rothschild giraffe and tree-climbing lions.",
    highlights: ['Flamingo flocks', 'Black & white rhinos', 'Tree-climbing lions', 'Rothschild giraffe'],
    foreignerBase: 285,
    residentBase: 140,
    citizenBase: 60,
    includes: ['Lodge', 'Game drives', 'Park fees', 'All meals', 'Naturalist guide'],
    category: 'Wildlife'
  },
  {
    id: 'a13',
    title: 'Mombasa Old Town & Fort Jesus',
    emoji: '🏛️',
    park: null,
    image: '/assets/fort jesus museams.jpg',
    minDays: 1,
    maxDays: 1,
    description: 'Walk the narrow streets of Mombasa Old Town with an expert historian guide. Visit the UNESCO-listed Fort Jesus, spice markets, ancient mosques and vibrant Indian-Swahili architecture.',
    highlights: ['Fort Jesus', 'Old town streets', 'Spice market', 'Swahili heritage', 'Street food'],
    foreignerBase: 75,
    residentBase: 45,
    citizenBase: 20,
    includes: ['Transport', 'Historian guide', 'Fort entry', 'Street food tasting'],
    category: 'Culture'
  },
  {
    id: 'a14',
    title: 'Malindi Marine Park & Gedi Ruins',
    emoji: '🐠',
    park: 'Watamu',
    image: '/assets/malindi marine.jpg',
    minDays: 1,
    maxDays: 3,
    description: 'Snorkel spectacular coral gardens, then explore the mysterious 15th-century ruins of Gede — a lost Swahili city hidden in the coastal forest near Watamu.',
    highlights: ['Coral snorkelling', 'Gedi Ruins', 'Sea turtles', 'Tropical fish', 'Swahili history'],
    foreignerBase: 145,
    residentBase: 75,
    citizenBase: 35,
    includes: ['Boat', 'Marine park entry', 'Snorkel gear', 'Gedi Ruins entry', 'Guide', 'Lunch'],
    category: 'Marine'
  },
  {
    id: 'a15',
    title: 'Utamaduni Grand Circuit',
    emoji: '🗺️',
    park: null,
    image: '/assets/view.webp',
    minDays: 7,
    maxDays: 30,
    description: 'The ultimate Kenya experience — a custom circuit combining wildlife parks, marine adventures and cultural immersion across the entire country. Completely tailored to your dream trip.',
    highlights: ['Multiple parks', 'Coast & safari', 'Cultural experiences', 'Flexible itinerary', 'All-inclusive'],
    foreignerBase: 420,
    residentBase: 210,
    citizenBase: 90,
    includes: ['All park fees', 'Mixed accommodation', 'All meals', 'Internal flights/transfers', 'Expert team'],
    category: 'Premium Safari'
  },
  // ── Forests & Museums ─────────────────────────────
  {
    id: 'a16',
    title: 'Fort Jesus Museum — Mombasa',
    emoji: '🏛️',
    park: 'Fort Jesus',
    image: '/assets/fort jesus museams.jpg',
    minDays: 1,
    maxDays: 1,
    description: "Step inside a UNESCO World Heritage Site — a 16th-century Portuguese fortress that guarded East Africa's most strategic harbour. Expert historian guides walk you through Swahili, Arab, Portuguese and British chapters written in stone.",
    highlights: ['UNESCO World Heritage', 'Portuguese fortress 1593', 'Swahili artefacts', 'Old Town walk', 'Ocean views'],
    foreignerBase: 55,
    residentBase: 30,
    citizenBase: 12,
    includes: ['Historian guide', 'Fort entry', 'Old Town walk', 'Spice market visit', 'Transport'],
    category: 'Museums & Heritage'
  },
  {
    id: 'a17',
    title: 'Gede Ruins — Lost City of Watamu',
    emoji: '🏚️',
    park: 'Gede Ruins',
    image: '/assets/historic site, gedi ruins.jpg',
    minDays: 1,
    maxDays: 2,
    description: "Discover the hauntingly beautiful ruins of Gede — a prosperous 15th-century Swahili trading town abandoned mysteriously and slowly consumed by the coastal forest. Palace, mosque, houses and tombs wrapped in ancient fig trees.",
    highlights: ['15th-century ruins', 'Swahili palace & mosque', 'Ancient fig trees', 'Museum on site', 'Combine with snorkelling'],
    foreignerBase: 60,
    residentBase: 35,
    citizenBase: 15,
    includes: ['Licensed archaeo-guide', 'Entry fee', 'Site museum', 'Combine with Arabuko Forest or marine snorkel'],
    category: 'Museums & Heritage'
  },
  {
    id: 'a18',
    title: 'Arabuko-Sokoke Forest Walk',
    emoji: '🌿',
    park: 'Arabuko-Sokoke',
    image: '/assets/nairobi nature walk.jpg',
    minDays: 1,
    maxDays: 2,
    description: "East Africa's largest coastal forest — a globally critical bird habitat. Walk misty forest trails with an expert birding guide to spot three species found nowhere else on Earth: the Sokoke scops owl, Sokoke pipit, and Clarke's weaver.",
    highlights: ['3 endemic bird species', 'Golden-rumped elephant shrew', 'Sokoke scops owl', 'Mida Creek estuary', 'Butterfly walk'],
    foreignerBase: 75,
    residentBase: 40,
    citizenBase: 18,
    includes: ['Expert birding guide', 'Forest entry', 'Binoculars hire', 'Mida Creek boat trip (optional)'],
    category: 'Forests & Nature'
  },
  {
    id: 'a19',
    title: 'Kakamega Rainforest Experience',
    emoji: '🌲',
    park: 'Kakamega Forest',
    image: '/assets/shimba hills waterfals.jpg',
    minDays: 1,
    maxDays: 3,
    description: "Kenya's only tropical rainforest — a Congo Basin relic full of red-tailed monkeys, colobus, 330+ bird species, rare butterflies and giant moss-draped trees. Guided canopy walks and night walks reveal a world few travellers ever see.",
    highlights: ['Tropical rainforest', 'Red-tailed monkeys', '330+ birds', 'Night walk', 'Canopy view tower'],
    foreignerBase: 95,
    residentBase: 50,
    citizenBase: 22,
    includes: ['Birding/nature guide', 'Forest entry', 'Canopy walk', 'Night walk (optional)', 'Lodge or bandas on site'],
    category: 'Forests & Nature'
  },
  {
    id: 'a20',
    title: 'Karura Forest — Nairobi City Walk',
    emoji: '🌳',
    park: 'Karura Forest',
    image: '/assets/nairobi nature walk.jpg',
    minDays: 1,
    maxDays: 1,
    description: "One of the world's largest urban forests, right inside Nairobi. Walk or cycle through bamboo groves and riverine forest, discover hidden waterfalls and colonial-era caves, spot colobus monkeys and over 200 bird species — a perfect half-day escape.",
    highlights: ['Colobus monkeys', 'Hidden waterfalls', 'Bamboo groves', 'Cycling trails', 'Colonial caves'],
    foreignerBase: 35,
    residentBase: 20,
    citizenBase: 10,
    includes: ['Gate entry', 'Nature guide', 'Bicycle hire (optional)', 'Waterfall hike'],
    category: 'Forests & Nature'
  },
  {
    id: 'a21',
    title: 'Nairobi National Museum & Snake Park',
    emoji: '🦴',
    park: 'Nairobi Museum',
    image: '/assets/mombasa old town.jpg',
    minDays: 1,
    maxDays: 1,
    description: "Kenya's premier museum tells the full story — from early human fossils found in the Great Rift Valley to contemporary East African art, diverse cultures, natural history and the famous 'Turkana Boy' skull. The adjacent Snake Park and botanical gardens complete a full day.",
    highlights: ['Human evolution fossils', 'Turkana Boy skull', 'Kenyan cultures exhibit', 'Snake Park', 'Botanical garden'],
    foreignerBase: 45,
    residentBase: 25,
    citizenBase: 10,
    includes: ['Museum entry', 'Expert guide', 'Snake Park', 'Botanical garden walk'],
    category: 'Museums & Heritage'
  }
]

const categories = ['All', 'Wildlife', 'Marine', 'Culture', 'Beach', 'Adventure', 'Forests & Nature', 'Museums & Heritage', 'Premium Safari']

function formatUSD(n) {
  return `$${n.toLocaleString()}`
}
function formatKES(n) {
  return `KES ${Math.round(n * USD_TO_KES).toLocaleString()}`
}

function getDayMultiplier(days, minDays) {
  if (days <= minDays) return 1
  const extra = days - minDays
  const discount = Math.min(extra * 0.04, 0.30)
  return 1 - discount
}

function PriceCard({ adventure }) {
  const [days, setDays] = useState(adventure.minDays)
  const [visitorType, setVisitorType] = useState('foreigner')

  const basePrice = visitorType === 'foreigner'
    ? adventure.foreignerBase
    : visitorType === 'resident'
    ? adventure.residentBase
    : adventure.citizenBase

  const mult = getDayMultiplier(days, adventure.minDays)
  const totalPerPerson = Math.round(basePrice * days * mult)
  const perDay = Math.round(basePrice * mult)

  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={adventure.image}
          alt={adventure.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
            adventure.category === 'Premium Safari' ? 'bg-[#d4a017]' :
            adventure.category === 'Marine' ? 'bg-blue-600' :
            adventure.category === 'Culture' ? 'bg-purple-600' :
            adventure.category === 'Beach' ? 'bg-cyan-500' :
            adventure.category === 'Adventure' ? 'bg-orange-500' :
            'bg-green-700'
          }`}>
            {adventure.category}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display text-xl text-white font-semibold drop-shadow-lg">
            {adventure.emoji} {adventure.title}
          </h3>
          {adventure.park && parkLinks[adventure.park] && (
            <a
              href={parkLinks[adventure.park]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#d4a017] hover:text-yellow-300 mt-1 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <MapPin size={11} /> {adventure.park} — Official Site <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-sm text-stone-600 leading-relaxed mb-4">{adventure.description}</p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {adventure.highlights.map((h) => (
            <span key={h} className="px-2.5 py-1 rounded-full bg-green-50 text-green-800 text-xs font-medium border border-green-100">
              {h}
            </span>
          ))}
        </div>

        {/* Duration Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
            <Clock size={12} className="inline mr-1" /> Duration (days)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={adventure.minDays}
              max={adventure.maxDays}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="flex-1 accent-green-700"
            />
            <span className="w-16 text-center px-3 py-1 rounded-xl bg-green-50 text-green-800 font-bold text-sm border border-green-200">
              {days}d
            </span>
          </div>
          {days > adventure.minDays && (
            <p className="text-xs text-green-600 mt-1 font-medium">
              🎉 {Math.round((1 - getDayMultiplier(days, adventure.minDays)) * 100)}% multi-day discount applied!
            </p>
          )}
        </div>

        {/* Visitor Type Toggle */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
            <Users size={12} className="inline mr-1" /> Visitor Type
          </label>
          <div className="grid grid-cols-3 gap-1 bg-green-50 rounded-xl p-1 border border-green-100">
            {[
              { key: 'foreigner', label: '🌍 International' },
              { key: 'resident',  label: '🌍 E.A. Resident' },
              { key: 'citizen',   label: '🇰🇪 Citizen' }
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setVisitorType(opt.key)}
                className={`text-xs py-2 px-1 rounded-lg font-semibold transition ${
                  visitorType === opt.key
                    ? 'bg-green-700 text-white shadow'
                    : 'text-stone-600 hover:bg-green-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Display */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-5 border border-green-100">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold">Per person / day</p>
              <p className="text-2xl font-bold text-green-900">{formatUSD(perDay)}</p>
              <p className="text-xs text-stone-400">{formatKES(perDay)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold">{days} day{days > 1 ? 's' : ''} total</p>
              <p className="text-2xl font-bold text-[#d4a017]">{formatUSD(totalPerPerson)}</p>
              <p className="text-xs text-stone-400">{formatKES(totalPerPerson)}</p>
            </div>
          </div>
          {visitorType === 'citizen' && (
            <div className="mt-2 text-xs text-green-700 font-medium bg-green-100 rounded-lg px-3 py-1.5">
              🇰🇪 Special Kenyan resident pricing — National ID required at park entry
            </div>
          )}
          {visitorType === 'resident' && (
            <div className="mt-2 text-xs text-blue-700 font-medium bg-blue-50 rounded-lg px-3 py-1.5">
              🌍 East African Community resident rate — EAC passport required
            </div>
          )}
        </div>

        {/* Includes */}
        <details className="mb-5">
          <summary className="text-xs font-semibold text-green-700 cursor-pointer flex items-center gap-1 hover:text-green-900 select-none">
            <ChevronDown size={14} />
            What&apos;s included
          </summary>
          <ul className="mt-2 space-y-1">
            {adventure.includes.map((inc) => (
              <li key={inc} className="text-xs text-stone-600 flex items-center gap-1.5">
                <span className="text-green-500">✓</span> {inc}
              </li>
            ))}
          </ul>
        </details>

        <Link
          to={`/book?adventure=${adventure.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-green-700 text-white text-sm font-bold hover:bg-green-900 transition shadow hover:shadow-lg"
        >
          <Compass size={15} /> Book This Adventure
        </Link>
      </div>
    </div>
  )
}

export default function Adventures() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = adventures.filter((a) => {
    const catOk = activeCategory === 'All' || a.category === activeCategory
    const searchOk = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase())
    return catOk && searchOk
  })

  return (
    <div className="pt-20 pb-20 bg-[#f0fdf4]">
      {/* Hero Header */}
      <div
        className="relative text-white py-28"
        style={{
          backgroundImage: "url('/assets/maasai mara ,ostrich.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-900/70 to-green-900/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm tracking-widest uppercase font-medium">Adventures</span>
          <h1 className="font-display text-5xl md:text-6xl mt-3 text-white drop-shadow-2xl">
            Experiences That Stay With You
          </h1>
          <p className="mt-5 text-green-100 max-w-2xl mx-auto text-lg leading-relaxed">
            From a half-day forest walk to a 30-day Kenya circuit — real prices, transparent quotes, different rates for Kenyan citizens and international visitors.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            {['💱 Prices in USD & KES', '🇰🇪 Special citizen rates', '📅 1–30 day packages', '🎉 Multi-day discounts'].map(t => (
              <div key={t} className="bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20 text-white">{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Explanation */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-white rounded-2xl border border-green-100 shadow p-6 md:p-8">
          <h2 className="font-display text-2xl text-green-900 mb-6">How Our Pricing Works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { emoji: '🌍', bg: 'bg-orange-50', border: 'border-orange-100', title: 'International Visitors', color: 'text-orange-900', desc: 'Full rate — includes all park entry fees set by Kenya Wildlife Service (KWS) for non-residents. Standard global rate.' },
              { emoji: '🌍', bg: 'bg-blue-50', border: 'border-blue-100', title: 'E.A. Community Residents', color: 'text-blue-900', desc: 'Residents of Uganda, Tanzania, Rwanda, Burundi, South Sudan, DRC. Show your EAC passport for the resident rate.' },
              { emoji: '🇰🇪', bg: 'bg-green-50', border: 'border-green-100', title: 'Kenyan Citizens', color: 'text-green-900', desc: 'Special citizen pricing. Show your National ID, Kenyan passport, or Huduma Number card at the park gate.' }
            ].map(item => (
              <div key={item.title} className={`text-center p-5 ${item.bg} rounded-xl border ${item.border}`}>
                <div className="text-3xl mb-2">{item.emoji}</div>
                <h3 className={`font-semibold ${item.color} mb-2`}>{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800">
            <strong>Multi-day discount:</strong> Book 2+ days and save up to 30%! Use the day slider on each adventure card to see your exact total. Prices are per person. Group discounts available on request.
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-green-700 text-white shadow'
                    : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="Search adventures…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-full border border-green-200 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white w-full sm:w-56"
          />
        </div>
      </div>

      {/* Adventure Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-500">No adventures found. Try a different filter.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((a) => (
              <PriceCard key={a.id} adventure={a} />
            ))}
          </div>
        )}
      </div>

      {/* Custom Quote CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-16">
        <div
          className="rounded-3xl overflow-hidden relative py-14 px-8 text-center"
          style={{ backgroundImage: "url('/assets/view.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-green-900/85" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Need a Custom Quote?</h2>
            <p className="text-green-100 mb-8 max-w-xl mx-auto leading-relaxed">
              Group travel? Honeymoon package? Multi-park circuit? Tell us your dream and we will design it — with transparent pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book" className="px-8 py-3.5 rounded-full bg-[#d4a017] text-green-900 font-bold hover:bg-yellow-400 transition shadow-lg">
                Get a Free Quote
              </Link>
              <a
                href="https://wa.me/254798157303"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full bg-green-500 text-white font-bold hover:bg-green-400 transition shadow-lg"
              >
                💬 WhatsApp Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
