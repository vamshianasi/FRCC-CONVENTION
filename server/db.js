// JSON-file backed store. Kept behind this module so it can be swapped for SQLite later.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, 'data.json');

// ── City > Area > Venue > Hall hierarchy ────────────────────────────────
const cities = [
  // Hyderabad (Telangana)
  {
    id: 'HYD',
    name: 'Hyderabad',
    state: 'TS',
    areas: [
      {
        id: 'HC',
        name: 'Hitech City',
        venues: [
          {
            id: 'VG1',
            name: 'FRCC Grand Hitech',
            address: 'Plot 1, Road 1, Hitech City, Hyderabad, TS 500081',
            phone: '+91-40-1234 5678',
            email: 'hitech@frcc.in',
            googleMaps: 'https://maps.google.com/?q=17.4452,78.3421',
            lat: 17.4452,
            lng: 78.3421,
            parkingCapacity: 200,
            openingHours: '9:00 AM – 11:00 PM',
            rating: 4.7,
            halls: ['VH1', 'VH2', 'VH3', 'VH4']
          },
        ],
        rating: 4.7
      },
      {
        id: 'GC',
        name: 'Gachibowli',
        venues: [
          {
            id: 'VG2',
            name: 'FRCC Gachibowli Palace',
            address: 'Plot 2, Gachibowli, Hyderabad, TS 500032',
            phone: '+91-40-2345 6789',
            email: 'gachibowli@frcc.in',
            googleMaps: 'https://maps.google.com/?q=17.4600,78.3700',
            lat: 17.4600,
            lng: 78.3700,
            parkingCapacity: 180,
            openingHours: '9:00 AM – 11:00 PM',
            rating: 4.5,
            halls: ['VH5', 'VH6', 'VH7']
          },
        ],
        rating: 4.5
      },
      {
        id: 'BH',
        name: 'Banjara Hills',
        venues: [
          {
            id: 'VG3',
            name: 'FRCC Banjara Royale',
            address: 'Plot 3, Banjara Hills, Hyderabad, TS 500034',
            phone: '+91-40-3456 7890',
            email: 'banjara@frcc.in',
            googleMaps: 'https://maps.google.com/?q=17.4300,78.4000',
            lat: 17.4300,
            lng: 78.4000,
            parkingCapacity: 150,
            openingHours: '9:00 AM – 11:00 PM',
            rating: 4.8,
            halls: ['VH8', 'VH9', 'VH10']
          },
        ],
        rating: 4.8
      },
      {
        id: 'SS',
        name: 'Secunderabad',
        venues: [
          {
            id: 'VG4',
            name: 'FRCC Secunderabad Pavilion',
            address: 'Plot 4, Secunderabad, TS 500003',
            phone: '+91-40-4567 8901',
            email: 'secunderabad@frcc.in',
            googleMaps: 'https://maps.google.com/?q=17.4500,78.4700',
            lat: 17.4500,
            lng: 78.4700,
            parkingCapacity: 160,
            openingHours: '9:00 AM – 11:00 PM',
            rating: 4.6,
            halls: ['VH11', 'VH12', 'VH13']
          },
        ],
        rating: 4.6
      },
      {
        id: 'KP',
        name: 'Kukatpally',
        venues: [
          {
            id: 'VG5',
            name: 'FRCC Kukatpally Orchid',
            address: 'Plot 5, Kukatpally, Hyderabad, TS 500072',
            phone: '+91-40-5678 9012',
            email: 'kukatpally@frcc.in',
            googleMaps: 'https://maps.google.com/?q=17.4200,78.5200',
            lat: 17.4200,
            lng: 78.5200,
            parkingCapacity: 120,
            openingHours: '9:00 AM – 11:00 PM',
            rating: 4.4,
            halls: ['VH14', 'VH15']
          },
        ],
        rating: 4.4
      },
    ],
    rating: 4.5
  },
  // Amaravathi (Andhra Pradesh)
  {
    id: 'AMR',
    name: 'Amaravathi',
    state: 'AP',
    areas: [
      {
        id: 'TU',
        name: 'Thullur',
        venues: [
          {
            id: 'VG6',
            name: 'FRCC Amaravathi Central',
            address: 'Plot 6, Thullur, AP 522212',
            phone: '+91-863-123 4567',
            email: 'central@frcc.amaravathi.in',
            googleMaps: 'https://maps.google.com/?q=16.5800,80.6500',
            lat: 16.5800,
            lng: 80.6500,
            parkingCapacity: 140,
            openingHours: '9:00 AM – 10:00 PM',
            rating: 4.3,
            halls: ['VH16', 'VH17', 'VH18']
          },
        ],
        rating: 4.3
      },
      {
        id: 'TL',
        name: 'Tadepalli',
        venues: [
          {
            id: 'VG7',
            name: 'FRCC Tadepalli Crown',
            address: 'Plot 7, Tadepalli, AP 522201',
            phone: '+91-863-234 5678',
            email: 'crown@frcc.amaravathi.in',
            googleMaps: 'https://maps.google.com/?q=16.5500,80.6000',
            lat: 16.5500,
            lng: 80.6000,
            parkingCapacity: 100,
            openingHours: '9:00 AM – 10:00 PM',
            rating: 4.2,
            halls: ['VH19', 'VH20']
          },
        ],
        rating: 4.2
      },
      {
        id: 'MG',
        name: 'Mangalagiri',
        venues: [
          {
            id: 'VG8',
            name: 'FRCC Mangalagiri Gardens',
            address: 'Plot 8, Mangalagiri, AP 522503',
            phone: '+91-863-345 6789',
            email: 'gardens@frcc.amaravathi.in',
            googleMaps: 'https://maps.google.com/?q=16.5300,80.5800',
            lat: 16.5300,
            lng: 80.5800,
            parkingCapacity: 130,
            openingHours: '9:00 AM – 10:00 PM',
            rating: 4.4,
            halls: ['VH21', 'VH22']
          },
        ],
        rating: 4.4
      },
    ],
    rating: 4.3
  },
  // Vijayawada (Andhra Pradesh)
  {
    id: 'VJA',
    name: 'Vijayawada',
    state: 'AP',
    areas: [
      {
        id: 'BC',
        name: 'Benz Circle',
        venues: [
          {
            id: 'VG9',
            name: 'FRCC Benz Circle Imperial',
            address: 'Plot 9, Benz Circle, Vijayawada, AP 520001',
            phone: '+91-866-123 4567',
            email: 'imperial@frcc.vj.in',
            googleMaps: 'https://maps.google.com/?q=16.5000,80.6300',
            lat: 16.5000,
            lng: 80.6300,
            parkingCapacity: 170,
            openingHours: '9:00 AM – 11:00 PM',
            rating: 4.6,
            halls: ['VH23', 'VH24', 'VH25']
          },
        ],
        rating: 4.6
      },
      {
        id: 'MG',
        name: 'MG Road',
        venues: [
          {
            id: 'VG10',
            name: 'FRCC MG Road Heritage',
            address: 'Plot 10, MG Road, Vijayawada, AP 520002',
            phone: '+91-866-234 5678',
            email: 'heritage@frcc.vj.in',
            googleMaps: 'https://maps.google.com/?q=16.5100,80.6500',
            lat: 16.5100,
            lng: 80.6500,
            parkingCapacity: 150,
            openingHours: '9:00 AM – 11:00 PM',
            rating: 4.5,
            halls: ['VH26', 'VH27', 'VH28']
          },
        ],
        rating: 4.5
      },
      {
        id: 'GN',
        name: 'Gannavaram',
        venues: [
          {
            id: 'VG11',
            name: 'FRCC Gannavaram Skyline',
            address: 'Plot 11, Gannavaram, AP 521101',
            phone: '+91-866-345 6789',
            email: 'skyline@frcc.vj.in',
            googleMaps: 'https://maps.google.com/?q=16.4800,80.7000',
            lat: 16.4800,
            lng: 80.7000,
            parkingCapacity: 110,
            openingHours: '9:00 AM – 10:30 PM',
            rating: 4.3,
            halls: ['VH29', 'VH30']
          },
        ],
        rating: 4.3
      },
      {
        id: 'PA',
        name: 'Patamata',
        venues: [
          {
            id: 'VG12',
            name: 'FRCC Patamata Meridian',
            address: 'Plot 12, Patamata, Vijayawada, AP 520013',
            phone: '+91-866-456 7890',
            email: 'meridian@frcc.vj.in',
            googleMaps: 'https://maps.google.com/?q=16.5200,80.6600',
            lat: 16.5200,
            lng: 80.6600,
            parkingCapacity: 125,
            openingHours: '9:00 AM – 10:30 PM',
            rating: 4.4,
            halls: ['VH31', 'VH32']
          },
        ],
        rating: 4.4
      },
    ],
    rating: 4.5
  },
];

// ── Hall pricing by area ────────────────────────────────────────────────
const pricingByArea = {
  // Hyderabad areas
  HC: { pricePerHour: 15000, pricePerDay: 110000 },   // Hitech City - premium
  GC: { pricePerHour: 12000, pricePerDay: 88000 },    // Gachibowli - mid-premium
  BH: { pricePerHour: 14000, pricePerDay: 105000 },   // Banjara Hills - premium
  SS: { pricePerHour: 10000, pricePerDay: 75000 },    // Secunderabad - mid
  KP: { pricePerHour: 9000, pricePerDay: 65000 },     // Kukatpally - base
  // Amaravathi areas
  TU: { pricePerHour: 8000, pricePerDay: 58000 },     // Thullur - base
  TL: { pricePerHour: 7500, pricePerDay: 54000 },     // Tadepalli - base
  MG: { pricePerHour: 8500, pricePerDay: 62000 },     // Mangalagiri - base
  // Vijayawada areas
  BC: { pricePerHour: 9500, pricePerDay: 70000 },     // Benz Circle - mid
  MG: { pricePerHour: 9000, pricePerDay: 66000 },     // MG Road - mid
  GN: { pricePerHour: 8000, pricePerDay: 58000 },     // Gannavaram - base
  PA: { pricePerHour: 7800, pricePerDay: 56000 },     // Patamata - base
};

// ── Hall definitions (name, type, capacity, amenities, image basenames) ────
const hallDefs = {
  // Hyderabad venues
  VG1: [ // FRCC Grand Hitech - 4 halls
    {
      id: 'VH1',
      name: 'Grand Ballroom',
      type: 'AC',
      capacity: 800,
      pricePerHour: 15000,
      pricePerDay: 110000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Bridal Room'],
      imageBasenames: ['hitech-grand-ballroom-1', 'hitech-grand-ballroom-2', 'hitech-grand-ballroom-3', 'hitech-grand-ballroom-4']
    },
    {
      id: 'VH2',
      name: 'Conference Hall',
      type: 'AC',
      capacity: 400,
      pricePerHour: 10000,
      pricePerDay: 75000,
      amenities: ['Central AC', 'Projector', 'Sound System', 'Wi-Fi', 'Catering'],
      imageBasenames: ['hitech-conf-hall-1', 'hitech-conf-hall-2', 'hitech-conf-hall-3', 'hitech-conf-hall-4']
    },
    {
      id: 'VH3',
      name: 'Banquet Hall',
      type: 'NON_AC',
      capacity: 300,
      pricePerHour: 7500,
      pricePerDay: 55000,
      amenities: ['Fans & Ventilation', 'Outdoor Lawn Access', 'Parking', 'Basic Stage', 'Catering'],
      imageBasenames: ['hitech-banquet-1', 'hitech-banquet-2', 'hitech-banquet-3', 'hitech-banquet-4']
    },
    {
      id: 'VH4',
      name: 'Board Room',
      type: 'BOARD_ROOM',
      capacity: 25,
      pricePerHour: 2000,
      pricePerDay: 15000,
      amenities: ['AC', 'Video Conferencing', 'Whiteboard', 'Coffee Service', 'Valet'],
      imageBasenames: ['hitech-boardroom-1', 'hitech-boardroom-2', 'hitech-boardroom-3']
    },
  ],
  VG2: [ // FRCC Gachibowli Palace - 3 halls
    {
      id: 'VH5',
      name: 'Grand Hall',
      type: 'AC',
      capacity: 600,
      pricePerHour: 12000,
      pricePerDay: 88000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Parking'],
      imageBasenames: ['gachibowli-grand-1', 'gachibowli-grand-2', 'gachibowli-grand-3']
    },
    {
      id: 'VH6',
      name: 'Meeting Room',
      type: 'AC',
      capacity: 150,
      pricePerHour: 8000,
      pricePerDay: 60000,
      amenities: ['Central AC', 'Projector', 'Sound System', 'Wi-Fi'],
      imageBasenames: ['gachibowli-meeting-1', 'gachibowli-meeting-2', 'gachibowli-meeting-3']
    },
    {
      id: 'VH7',
      name: 'Lawn Garden',
      type: 'NON_AC',
      capacity: 250,
      pricePerHour: 7000,
      pricePerDay: 52000,
      amenities: ['Fans & Ventilation', 'Outdoor Lawn', 'Parking', 'Stage', 'Catering'],
      imageBasenames: ['gachibowli-lawn-1', 'gachibowli-lawn-2', 'gachibowli-lawn-3']
    },
  ],
  VG3: [ // FRCC Banjara Royale - 3 halls
    {
      id: 'VH8',
      name: 'Banjara Ballroom',
      type: 'AC',
      capacity: 700,
      pricePerHour: 14000,
      pricePerDay: 105000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Bridal Room', 'Catering'],
      imageBasenames: ['banjara-ballroom-1', 'banjara-ballroom-2', 'banjara-ballroom-3', 'banjara-ballroom-4']
    },
    {
      id: 'VH9',
      name: 'Conference Suite',
      type: 'AC',
      capacity: 350,
      pricePerHour: 9500,
      pricePerDay: 72000,
      amenities: ['Central AC', 'Projector', 'Sound System', 'Wi-Fi', 'Catering'],
      imageBasenames: ['banjara-conf-1', 'banjara-conf-2', 'banjara-conf-3']
    },
    {
      id: 'VH10',
      name: 'Board Room',
      type: 'BOARD_ROOM',
      capacity: 30,
      pricePerHour: 2500,
      pricePerDay: 18000,
      amenities: ['AC', 'Video Conferencing', 'Whiteboard', 'Coffee Service'],
      imageBasenames: ['banjara-boardroom-1', 'banjara-boardroom-2']
    },
  ],
  VG4: [ // FRCC Secunderabad Pavilion - 3 halls
    {
      id: 'VH11',
      name: 'Grand Hall',
      type: 'AC',
      capacity: 650,
      pricePerHour: 10000,
      pricePerDay: 75000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Parking'],
      imageBasenames: ['secunderabad-grand-1', 'secunderabad-grand-2', 'secunderabad-grand-3']
    },
    {
      id: 'VH12',
      name: 'Meeting Room',
      type: 'AC',
      capacity: 120,
      pricePerHour: 7000,
      pricePerDay: 52000,
      amenities: ['Central AC', 'Projector', 'Sound System', 'Wi-Fi'],
      imageBasenames: ['secunderabad-meeting-1', 'secunderabad-meeting-2', 'secunderabad-meeting-3']
    },
    {
      id: 'VH13',
      name: 'Board Room',
      type: 'BOARD_ROOM',
      capacity: 18,
      pricePerHour: 1800,
      pricePerDay: 12000,
      amenities: ['AC', 'Video Conferencing', 'Whiteboard', 'Tea/Coffee'],
      imageBasenames: ['secunderabad-boardroom-1', 'secunderabad-boardroom-2']
    },
  ],
  VG5: [ // FRCC Kukatpally Orchid - 2 halls
    {
      id: 'VH14',
      name: 'Orchid Hall',
      type: 'AC',
      capacity: 450,
      pricePerHour: 9000,
      pricePerDay: 65000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Parking'],
      imageBasenames: ['kukatpally-orchid-1', 'kukatpally-orchid-2', 'kukatpally-orchid-3', 'kukatpally-orchid-4']
    },
    {
      id: 'VH15',
      name: 'Snowflake Hall',
      type: 'NON_AC',
      capacity: 200,
      pricePerHour: 6000,
      pricePerDay: 45000,
      amenities: ['Fans & Ventilation', 'Outdoor Lawn Access', 'Parking', 'Basic Stage'],
      imageBasenames: ['kukatpally-snowflake-1', 'kukatpally-snowflake-2', 'kukatpally-snowflake-3']
    },
  ],

  // Amaravathi venues
  VG6: [ // FRCC Amaravathi Central - 3 halls
    {
      id: 'VH16',
      name: 'Central Hall',
      type: 'AC',
      capacity: 500,
      pricePerHour: 8000,
      pricePerDay: 58000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Catering'],
      imageBasenames: ['amaravathi-central-1', 'amaravathi-central-2', 'amaravathi-central-3']
    },
    {
      id: 'VH17',
      name: 'Conference Hall',
      type: 'AC',
      capacity: 250,
      pricePerHour: 7000,
      pricePerDay: 51000,
      amenities: ['Central AC', 'Projector', 'Sound System', 'Wi-Fi', 'Catering'],
      imageBasenames: ['amaravathi-conf-1', 'amaravathi-conf-2', 'amaravathi-conf-3']
    },
    {
      id: 'VH18',
      name: 'Garden Hall',
      type: 'NON_AC',
      capacity: 200,
      pricePerHour: 6500,
      pricePerDay: 48000,
      amenities: ['Fans & Ventilation', 'Outdoor Lawn', 'Parking', 'Basic Stage', 'Catering'],
      imageBasenames: ['amaravathi-garden-1', 'amaravathi-garden-2', 'amaravathi-garden-3']
    },
  ],
  VG7: [ // FRCC Tadepalli Crown - 2 halls
    {
      id: 'VH19',
      name: 'Crown Hall',
      type: 'AC',
      capacity: 400,
      pricePerHour: 7500,
      pricePerDay: 54000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Parking'],
      imageBasenames: ['tadepalli-crown-1', 'tadepalli-crown-2', 'tadepalli-crown-3']
    },
    {
      id: 'VH20',
      name: 'Banquet Hall',
      type: 'NON_AC',
      capacity: 180,
      pricePerHour: 6000,
      pricePerDay: 44000,
      amenities: ['Fans', 'Stage', 'Dining Tables', 'Parking'],
      imageBasenames: ['tadepalli-banquet-1', 'tadepalli-banquet-2', 'tadepalli-banquet-3']
    },
  ],
  VG8: [ // FRCC Mangalagiri Gardens - 2 halls
    {
      id: 'VH21',
      name: 'Gardens Hall',
      type: 'AC',
      capacity: 450,
      pricePerHour: 8500,
      pricePerDay: 62000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Catering'],
      imageBasenames: ['mangalagiri-gardens-1', 'mangalagiri-gardens-2', 'mangalagiri-gardens-3', 'mangalagiri-gardens-4']
    },
    {
      id: 'VH22',
      name: 'Mangalagiri Hall',
      type: 'NON_AC',
      capacity: 220,
      pricePerHour: 5500,
      pricePerDay: 40000,
      amenities: ['Fans & Ventilation', 'Outdoor Lawn', 'Parking', 'Basic Stage'],
      imageBasenames: ['mangalagiri-hall-1', 'mangalagiri-hall-2', 'mangalagiri-hall-3']
    },
  ],

  // Vijayawada venues
  VG9: [ // FRCC Benz Circle Imperial - 3 halls
    {
      id: 'VH23',
      name: 'Imperial Hall',
      type: 'AC',
      capacity: 750,
      pricePerHour: 9500,
      pricePerDay: 70000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Bridal Room', 'Catering'],
      imageBasenames: ['benzcircle-imperial-1', 'benzcircle-imperial-2', 'benzcircle-imperial-3', 'benzcircle-imperial-4']
    },
    {
      id: 'VH24',
      name: 'Conference Hall',
      type: 'AC',
      capacity: 350,
      pricePerHour: 8000,
      pricePerDay: 58000,
      amenities: ['Central AC', 'Projector', 'Sound System', 'Wi-Fi', 'Catering'],
      imageBasenames: ['benzcircle-conf-1', 'benzcircle-conf-2', 'benzcircle-conf-3']
    },
    {
      id: 'VH25',
      name: 'Board Room',
      type: 'BOARD_ROOM',
      capacity: 35,
      pricePerHour: 2200,
      pricePerDay: 16000,
      amenities: ['AC', 'Video Conferencing', 'Whiteboard', 'Coffee Service'],
      imageBasenames: ['benzcircle-boardroom-1', 'benzcircle-boardroom-2']
    },
  ],
  VG10: [ // FRCC MG Road Heritage - 3 halls
    {
      id: 'VH26',
      name: 'Heritage Hall',
      type: 'AC',
      capacity: 650,
      pricePerHour: 9000,
      pricePerDay: 66000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Parking'],
      imageBasenames: ['mgroad-heritage-1', 'mgroad-heritage-2', 'mgroad-heritage-3']
    },
    {
      id: 'VH27',
      name: 'Conference Room',
      type: 'AC',
      capacity: 200,
      pricePerHour: 7000,
      pricePerDay: 52000,
      amenities: ['Central AC', 'Projector', 'Sound System', 'Wi-Fi', 'Catering'],
      imageBasenames: ['mgroad-conf-1', 'mgroad-conf-2', 'mgroad-conf-3']
    },
    {
      id: 'VH28',
      name: 'Board Room',
      type: 'BOARD_ROOM',
      capacity: 22,
      pricePerHour: 1800,
      pricePerDay: 13000,
      amenities: ['AC', 'Video Conferencing', 'Whiteboard', 'Tea/Coffee'],
      imageBasenames: ['mgroad-boardroom-1', 'mgroad-boardroom-2']
    },
  ],
  VG11: [ // FRCC Gannavaram Skyline - 2 halls
    {
      id: 'VH29',
      name: 'Skyline Hall',
      type: 'AC',
      capacity: 500,
      pricePerHour: 8000,
      pricePerDay: 58000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Catering'],
      imageBasenames: ['gannavaram-skyline-1', 'gannavaram-skyline-2', 'gannavaram-skyline-3', 'gannavaram-skyline-4']
    },
    {
      id: 'VH30',
      name: 'Gannavaram Hall',
      type: 'NON_AC',
      capacity: 250,
      pricePerHour: 6500,
      pricePerDay: 48000,
      amenities: ['Fans & Ventilation', 'Outdoor Lawn', 'Parking', 'Basic Stage'],
      imageBasenames: ['gannavaram-hall-1', 'gannavaram-hall-2', 'gannavaram-hall-3']
    },
  ],
  VG12: [ // FRCC Patamata Meridian - 2 halls
    {
      id: 'VH31',
      name: 'Meridian Hall',
      type: 'AC',
      capacity: 480,
      pricePerHour: 7800,
      pricePerDay: 56000,
      amenities: ['Central AC', 'Stage & Lighting', 'Banquet Seating', 'Valet Parking', 'Wi-Fi', 'Parking'],
      imageBasenames: ['patamata-meridian-1', 'patamata-meridian-2', 'patamata-meridian-3', 'patamata-meridian-4']
    },
    {
      id: 'VH32',
      name: 'Patamata Hall',
      type: 'NON_AC',
      capacity: 200,
      pricePerHour: 5500,
      pricePerDay: 40000,
      amenities: ['Fans & Ventilation', 'Outdoor Lawn', 'Parking', 'Basic Stage'],
      imageBasenames: ['patamata-hall-1', 'patamata-hall-2', 'patamata-hall-3']
    },
  ],
};

// ── Build the full hall list from the hierarchy ───────────────────────────
function buildHalls() {
  const halls = [];
  for (const city of cities) {
    for (const area of city.areas) {
      for (const venue of area.venues) {
        for (const hallDef of hallDefs[venue.id] || []) {
          const images = hallDef.imageBasenames.map(
            ib => `/images/halls/${city.id}/${area.id}/${venue.id}/${ib}.jpg`
          );
          halls.push({
            id: hallDef.id,
            name: hallDef.name,
            type: hallDef.type,
            capacity: hallDef.capacity,
            pricePerHour: hallDef.pricePerHour,
            pricePerDay: hallDef.pricePerDay,
            venueId: venue.id,
            venueName: venue.name,
            areaId: area.id,
            areaName: area.name,
            cityId: city.id,
            cityName: city.name,
            area: area.name,
            city: city.name,
            amenities: hallDef.amenities,
            images: images,
            displayPricePerHour: `Rs. ${hallDef.pricePerHour.toLocaleString('en-IN')}/hr`,
            displayPricePerDay: `Rs. ${hallDef.pricePerDay.toLocaleString('en-IN')}/day`,
          });
        }
      }
    }
  }
  return halls;
}

function buildData() {
  return {
    halls: buildHalls(),
    cities,
    // Reactive-ish convenience for API consumers
    venues: cities.flatMap(c =>
      c.areas.flatMap(a =>
        a.venues.map(v => ({ ...v, cityId: c.id, cityName: c.name, areaId: a.id, areaName: a.name }))
      )
    ),
  };
}

// ── Read / write ────────────────────────────────────────────────────────
function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { users: [], halls: buildHalls(), bookings: [], notifications: [], tickets: [], reviews: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

const uid = (prefix) => `${prefix}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

module.exports = { readDb, writeDb, uid, buildHalls, buildData, cities, pricingByArea, hallDefs };