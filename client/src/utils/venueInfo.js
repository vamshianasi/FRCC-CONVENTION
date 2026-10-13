// Venue location details keyed by venue id. Address matches server/db.js seeds.
const VENUE_INFO = {
  VG1: {
    address: 'Plot 1, Road 1, Hitech City, Hyderabad, TS 500081', phone: '+91-40-1234 5678', email: 'hitech@frcc.in',
    lat: 17.4452, lng: 78.3421, parkingCapacity: 200, openingHours: '9:00 AM – 11:00 PM', rating: 4.7,
    landmarks: 'Mindspace IT Park (500 m), Inorbit Mall (1.2 km), Hitech City Metro (900 m)',
    transport: 'Hitech City Metro Station (900 m) • TSRTC buses to Hitech City • Cab drop-off at the gate',
    description: 'FRCC Grand Hitech is our flagship banqueting and conference hub in the heart of Hitech City. Four pillar-less halls, valet parking and in-house catering make it ideal for large weddings and corporate conventions.',
  },
  VG2: {
    address: 'Plot 2, Gachibowli, Hyderabad, TS 500032', phone: '+91-40-2345 6789', email: 'gachibowli@frcc.in',
    lat: 17.4600, lng: 78.3700, parkingCapacity: 180, openingHours: '9:00 AM – 11:00 PM', rating: 4.5,
    landmarks: 'DLF Cyber City (600 m), ISB (2 km), Botanical Garden (2.5 km)',
    transport: 'Gachibowli bus depot (1 km) • Metro (Pedda Gudem, 3 km) • App cabs widely available',
    description: 'FRCC Gachibowli Palace pairs palace-style interiors with a landscaped lawn — a favourite for receptions and garden weddings in Hyderabad\'s financial district.',
  },
  VG3: {
    address: 'Plot 3, Banjara Hills, Hyderabad, TS 500034', phone: '+91-40-3456 7890', email: 'banjara@frcc.in',
    lat: 17.4300, lng: 78.4000, parkingCapacity: 150, openingHours: '9:00 AM – 11:00 PM', rating: 4.8,
    landmarks: 'Jubilee Hills (2 km), GVK One Mall (1.5 km), Banjara Hills Road No. 10 (500 m)',
    transport: 'Road No. 10 bus stop (400 m) • Cab friendly • 20 min from Begumpet Airport',
    description: 'FRCC Banjara Royale is our most premium address — a rocade ballroom, conference suite and an executive board room on Banjara Hills Road No. 12.',
  },
  VG4: {
    address: 'Plot 4, Secunderabad, TS 500003', phone: '+91-40-4567 8901', email: 'secunderabad@frcc.in',
    lat: 17.4500, lng: 78.4700, parkingCapacity: 160, openingHours: '9:00 AM – 11:00 PM', rating: 4.6,
    landmarks: 'Secunderabad Railway Station (1.5 km), Paradise Circle (2 km), Hussain Sagar (5 km)',
    transport: 'Secunderabad Junction (1.5 km) • Parade Ground Metro (2 km) • TSRTC buses',
    description: 'FRCC Secunderabad Pavilion is the city\'s classic party pavilion — grand hall, meeting room and board room steps from Secunderabad Junction.',
  },
  VG5: {
    address: 'Plot 5, Kukatpally, Hyderabad, TS 500072', phone: '+91-40-5678 9012', email: 'kukatpally@frcc.in',
    lat: 17.4200, lng: 78.5200, parkingCapacity: 120, openingHours: '9:00 AM – 11:00 PM', rating: 4.4,
    landmarks: 'KPHB Colony (1 km), Forum Sujana Mall (2 km), JNTU Metro (1.8 km)',
    transport: 'KPHB bus stop (800 m) • JNTU Metro (1.8 km) • Free parking on premises',
    description: 'FRCC Kukatpally Orchid serves North Hyderabad with an air-conditioned Orchid Hall and the value-friendly Snowflake Hall.',
  },
  VG6: {
    address: 'Plot 6, Thullur, AP 522212', phone: '+91-863-123 4567', email: 'central@frcc.amaravathi.in',
    lat: 16.5800, lng: 80.6500, parkingCapacity: 140, openingHours: '9:00 AM – 10:00 PM', rating: 4.3,
    landmarks: 'Amaravathi Secretariat (3 km), Krishna River ghats (6 km), Velagapudi (2 km)',
    transport: 'APS RTC buses from Vijayawada/Guntur • Cab 30 min from Vijayawada airport',
    description: 'FRCC Amaravathi Central is our capital-region hub — a modern AC hall, conference centre and garden venue between Velagapudi and Thullur.',
  },
  VG7: {
    address: 'Plot 7, Tadepalli, AP 522201', phone: '+91-863-234 5678', email: 'crown@frcc.amaravathi.in',
    lat: 16.5500, lng: 80.6000, parkingCapacity: 100, openingHours: '9:00 AM – 10:00 PM', rating: 4.2,
    landmarks: 'Tadepalli bridge (1 km), Mangalagiri temple (4 km), Krishna Canal (500 m)',
    transport: 'Tadepalli bus stop (700 m) • 25 min from Vijayawada • Free parking',
    description: 'FRCC Tadepalli Crown offers mid-scale convenience for Guntur–Vijayawada corridor events with an AC hall and banquet setup.',
  },
  VG8: {
    address: 'Plot 8, Mangalagiri, AP 522503', phone: '+91-863-345 6789', email: 'gardens@frcc.amaravathi.in',
    lat: 16.5300, lng: 80.5800, parkingCapacity: 130, openingHours: '9:00 AM – 10:00 PM', rating: 4.4,
    landmarks: 'Panakala Narasimha Swamy temple (1.5 km), Mangalagiri town (1 km), Undavalli caves (6 km)',
    transport: 'Mangalagiri bus stand (1.2 km) • 20 min from Vijayawada • Free parking',
    description: 'FRCC Mangalagiri Gardens blends an AC hall with open garden seating next to the historic Mangalagiri temple town.',
  },
  VG9: {
    address: 'Plot 9, Benz Circle, Vijayawada, AP 520001', phone: '+91-866-123 4567', email: 'imperial@frcc.vj.in',
    lat: 16.5000, lng: 80.6300, parkingCapacity: 170, openingHours: '9:00 AM – 11:00 PM', rating: 4.6,
    landmarks: 'Benz Circle junction (200 m), PVP Square Mall (1 km), Vijayawada Railway Station (4 km)',
    transport: 'Benz Circle bus stop (300 m) • Railway Station (4 km) • Airport (20 km)',
    description: 'FRCC Benz Circle Imperial is Vijayawada\'s largest venue — a 750-guest imperial hall, conference centre and board room at the city\'s busiest circle.',
  },
  VG10: {
    address: 'Plot 10, MG Road, Vijayawada, AP 520002', phone: '+91-866-234 5678', email: 'heritage@frcc.vj.in',
    lat: 16.5100, lng: 80.6500, parkingCapacity: 150, openingHours: '9:00 AM – 11:00 PM', rating: 4.5,
    landmarks: 'MG Road market (300 m), Rajagopalachari statue (800 m), Railway Station (2.5 km)',
    transport: 'MG Road bus stop (200 m) • Railway Station (2.5 km) • Cab friendly',
    description: 'FRCC MG Road Heritage sits on Vijayawada\'s heritage high street with colonial-style interiors, a 650-guest hall and conference rooms.',
  },
  VG11: {
    address: 'Plot 11, Gannavaram, AP 521101', phone: '+91-866-345 6789', email: 'skyline@frcc.vj.in',
    lat: 16.4800, lng: 80.7000, parkingCapacity: 110, openingHours: '9:00 AM – 10:30 PM', rating: 4.3,
    landmarks: 'Vijayawada Airport (2 km), Gannavaram bus stand (1 km), Krishna River (5 km)',
    transport: 'Airport Road bus stop (500 m) • 10 min from Vijayawada Airport • Free parking',
    description: 'FRCC Gannavaram Skyline is minutes from Vijayawada Airport — ideal for destination weddings and out-of-town conferences.',
  },
  VG12: {
    address: 'Plot 12, Patamata, Vijayawada, AP 520013', phone: '+91-866-456 7890', email: 'meridian@frcc.vj.in',
    lat: 16.5200, lng: 80.6600, parkingCapacity: 125, openingHours: '9:00 AM – 10:30 PM', rating: 4.4,
    landmarks: 'Patamata Lanka (1 km), Autonagar (3 km), Benz Circle (2 km)',
    transport: 'Patamata bus stop (600 m) • Autonagar (3 km) • Free parking',
    description: 'FRCC Patamata Meridian is a contemporary East Vijayawada venue with a 480-guest AC hall and budget-friendly non-AC hall.',
  },
};

export default VENUE_INFO;
