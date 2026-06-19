// Obsidian Hunt - Mission Control Core Dataset

export const LAUNCH_SITES = [
  {
    id: 'ksc',
    name: 'Kennedy Space Center',
    location: 'Cape Canaveral, Florida, USA',
    lat: 28.5721,
    lng: -80.6480,
    successRate: 97.4,
    totalLaunches: 184,
    activeMissions: ['Falcon 9 Starlink', 'Falcon Heavy Europa'],
    status: 'GO',
    description: 'NASA\'s premier launch facility, hosting SpaceX Falcon 9, Falcon Heavy, and upcoming SLS flights.'
  },
  {
    id: 'starbase',
    name: 'SpaceX Starbase',
    location: 'Boca Chica, Texas, USA',
    lat: 25.9972,
    lng: -97.1561,
    successRate: 85.0,
    totalLaunches: 12,
    activeMissions: ['Starship Flight 7'],
    status: 'WARNING',
    description: 'SpaceX\'s private orbital launch site dedicated to developing, testing, and launching the massive Starship system.'
  },
  {
    id: 'sdsr',
    name: 'Satish Dhawan Space Centre',
    location: 'Sriharikota, Andhra Pradesh, India',
    lat: 13.7200,
    lng: 80.2300,
    successRate: 95.8,
    totalLaunches: 98,
    activeMissions: ['GSLV Mk III Gaganyaan', 'PSLV-C59'],
    status: 'GO',
    description: 'India\'s primary spaceport, managed by ISRO, launching PSLV, GSLV, and LVM3 missions.'
  },
  {
    id: 'csg',
    name: 'Guiana Space Centre',
    location: 'Kourou, French Guiana',
    lat: 5.2372,
    lng: -52.7606,
    successRate: 98.2,
    totalLaunches: 142,
    activeMissions: ['Ariane 6 Webb-Followup'],
    status: 'GO',
    description: 'European Space Agency (ESA) spaceport located in South America, ideal for equatorial launches.'
  }
];

export const UPCOMING_LAUNCHES = [
  {
    id: 'starship-f7',
    missionName: 'Starship Orbital Flight 7',
    rocketName: 'Starship',
    manufacturer: 'SpaceX',
    launchSite: 'SpaceX Starbase, TX',
    siteId: 'starbase',
    launchDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 60 * 5).toISOString(), // 4d 5h from now
    targetOrbit: 'LEO / Telemetry Test',
    payload: 'Starship Core Telemetry & Cargo Simulator',
    status: 'GO',
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80',
    description: 'Full stack orbital test of the Starship and Super Heavy booster, targeting booster catch at the launch tower and Ship ocean landing.',
    checklist: [
      { id: 'propellant', name: 'Methane/Oxygen Fueling', status: 'GO', desc: 'Propellant loading began at T-4h' },
      { id: 'guidance', name: 'Guidance & Navigation Systems', status: 'GO', desc: 'Flight computer alignment complete' },
      { id: 'range', name: 'Range Safety Verification', status: 'GO', desc: 'FAA launch license approved, corridor clear' },
      { id: 'ignition', name: 'Raptor Engine Ignition Sequence', status: 'PENDING', desc: 'Begins at T-3s' },
      { id: 'liftoff', name: 'Liftoff & Tower Clearance', status: 'PENDING', desc: 'Scheduled at T-0' },
      { id: 'separation', name: 'Hot-Staging Separation', status: 'PENDING', desc: 'Expected at T+2m 42s' },
    ],
    telemetryData: [
      { t: -10, speed: 0, altitude: 0 },
      { t: 0, speed: 0, altitude: 0 },
      { t: 30, speed: 410, altitude: 4.8 },
      { t: 60, speed: 980, altitude: 12.5 },
      { t: 90, speed: 1750, altitude: 24.3 },
      { t: 120, speed: 2800, altitude: 42.1 },
      { t: 150, speed: 4100, altitude: 65.8 },
      { t: 180, speed: 5600, altitude: 89.2 },
      { t: 240, speed: 7200, altitude: 115.0 },
    ]
  },
  {
    id: 'falcon-heavy-europa',
    missionName: 'Europa Clipper Followup',
    rocketName: 'Falcon Heavy',
    manufacturer: 'SpaceX',
    launchSite: 'LC-39A, Kennedy Space Center, FL',
    siteId: 'ksc',
    launchDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9 + 1000 * 60 * 60 * 12).toISOString(), // 9d 12h from now
    targetOrbit: 'Jovian Transfer Orbit',
    payload: 'Scientific Probe',
    status: 'GO',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'Deep space trajectory launch using Falcon Heavy in fully expendable mode to send a planetary probe to Jupiter\'s icy moon, Europa.',
    checklist: [
      { id: 'propellant', name: 'LOX & RP-1 Fueling', status: 'GO', desc: 'First stage sub-cooled loading initialized' },
      { id: 'guidance', name: 'Flight Computer Alignment', status: 'GO', desc: 'Triple-redundant guidance checked' },
      { id: 'range', name: 'Cape Range Control', status: 'GO', desc: 'Eastern Range cleared for launch azimuth' },
      { id: 'ignition', name: '27 Merlin 1D Engine Ignition', status: 'PENDING', desc: 'Sequential ignition starts at T-7s' },
      { id: 'liftoff', name: 'Liftoff', status: 'PENDING', desc: 'Scheduled at T-0' },
      { id: 'separation', name: 'Side Booster Separation', status: 'PENDING', desc: 'Dual booster return to LZ-1 & LZ-2' }
    ],
    telemetryData: [
      { t: -10, speed: 0, altitude: 0 },
      { t: 0, speed: 0, altitude: 0 },
      { t: 30, speed: 430, altitude: 3.5 },
      { t: 60, speed: 1100, altitude: 10.2 },
      { t: 90, speed: 2100, altitude: 21.0 },
      { t: 120, speed: 3300, altitude: 38.4 },
      { t: 150, speed: 4900, altitude: 58.7 },
      { t: 180, speed: 6400, altitude: 76.1 }
    ]
  },
  {
    id: 'f9-starlink-g9',
    missionName: 'Starlink Group 9-24',
    rocketName: 'Falcon 9',
    manufacturer: 'SpaceX',
    launchSite: 'SLC-40, Cape Canaveral, FL',
    siteId: 'ksc',
    launchDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 60 * 3).toISOString(), // 1d 3h from now
    targetOrbit: 'LEO',
    payload: '22 Starlink V2 Mini Satellites',
    status: 'GO',
    image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=800&q=80',
    description: 'Deployment of 22 Starlink internet satellites to a circular Low Earth Orbit. The first-stage booster will land on droneship A Shortfall of Gravitas.',
    checklist: [
      { id: 'propellant', name: 'LOX & RP-1 Fueling', status: 'GO', desc: 'Fueling automatic sequence active' },
      { id: 'guidance', name: 'Autonomous Flight Safety', status: 'GO', desc: 'AFSS initialized and locked' },
      { id: 'range', name: 'Droneship Positioning', status: 'GO', desc: 'ASOG droneship anchored at landing zone' },
      { id: 'ignition', name: '9 Merlin 1D Ignition', status: 'PENDING', desc: 'Starts at T-3s' },
      { id: 'liftoff', name: 'Liftoff', status: 'PENDING', desc: 'Scheduled at T-0' }
    ],
    telemetryData: [
      { t: -10, speed: 0, altitude: 0 },
      { t: 0, speed: 0, altitude: 0 },
      { t: 30, speed: 380, altitude: 3.2 },
      { t: 60, speed: 920, altitude: 9.8 },
      { t: 90, speed: 1800, altitude: 19.5 },
      { t: 120, speed: 2900, altitude: 35.1 },
      { t: 150, speed: 4300, altitude: 54.8 }
    ]
  },
  {
    id: 'ariane6-w1',
    missionName: 'MetOp-SG A1 Weather Satellite',
    rocketName: 'Ariane 6',
    manufacturer: 'Arianespace',
    launchSite: 'ELA-4, Kourou, French Guiana',
    siteId: 'csg',
    launchDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 8).toISOString(), // 14d 8h from now
    targetOrbit: 'Polar Sun-Synchronous Orbit',
    payload: 'MetOp Weather Observatory',
    status: 'GO',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    description: 'European meteorological observatory launched into sun-synchronous orbit, monitoring atmospheric temperature and moisture profiles.',
    checklist: [
      { id: 'propellant', name: 'Cryogenic Fueling', status: 'GO', desc: 'Liquid Hydrogen & Oxygen loading checks' },
      { id: 'guidance', name: 'Vinci Upper Stage Prep', status: 'GO', desc: 'Vinci engine reignition calibration done' },
      { id: 'range', name: 'Kourou Range Safety', status: 'GO', desc: 'Radar tracking stations operational' },
      { id: 'ignition', name: 'Vulkan Engine Ignition', status: 'PENDING', desc: 'Starts at T-4s' }
    ],
    telemetryData: [
      { t: -10, speed: 0, altitude: 0 },
      { t: 0, speed: 0, altitude: 0 },
      { t: 30, speed: 450, altitude: 4.1 },
      { t: 60, speed: 1050, altitude: 11.2 },
      { t: 90, speed: 1950, altitude: 22.8 },
      { t: 120, speed: 3100, altitude: 40.5 }
    ]
  },
  {
    id: 'pslv-c59',
    missionName: 'Oceansat-4 & Co-passengers',
    rocketName: 'PSLV-XL',
    manufacturer: 'ISRO',
    launchSite: 'FLP, Satish Dhawan Space Centre, India',
    siteId: 'sdsr',
    launchDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(), // 25d from now
    targetOrbit: 'Polar Sun-Synchronous Orbit',
    payload: 'Oceansat-4 (EOS-06) & 3 Cubesats',
    status: 'GO',
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80',
    description: 'ISRO Earth observation mission carrying specialized ocean monitoring equipment and international cubesats into a polar orbit.',
    checklist: [
      { id: 'propellant', name: 'Solid Motor (PS1) Packing', status: 'GO', desc: 'Core solid booster cast complete' },
      { id: 'guidance', name: 'ISRO Guidance System', status: 'GO', desc: 'Guidance loop validated' },
      { id: 'range', name: 'Bay of Bengal Clearance', status: 'GO', desc: 'Shipping hazard notices issued' }
    ],
    telemetryData: [
      { t: -10, speed: 0, altitude: 0 },
      { t: 0, speed: 0, altitude: 0 },
      { t: 30, speed: 420, altitude: 3.8 },
      { t: 60, speed: 990, altitude: 10.5 },
      { t: 90, speed: 1850, altitude: 21.3 }
    ]
  }
];

export const HISTORICAL_LAUNCHES = [
  {
    id: 'h-1',
    missionName: 'Starship Flight 6',
    rocketName: 'Starship',
    manufacturer: 'SpaceX',
    launchDate: '2025-11-19T22:00:00Z',
    status: 'SUCCESS',
    launchSite: 'SpaceX Starbase, TX',
    payload: 'Telemetry Cargo & Banana Payload Indicator',
    details: 'Booster splashdown in the Gulf of Mexico, ship orbital insertion, and first ever raptor reignition in space. Visual catch of booster aborted due to telemetry limits.',
  },
  {
    id: 'h-2',
    missionName: 'Crew-9 Astronaut Launch',
    rocketName: 'Falcon 9',
    manufacturer: 'SpaceX',
    launchDate: '2024-09-28T17:17:00Z',
    status: 'SUCCESS',
    launchSite: 'SLC-40, Cape Canaveral, FL',
    payload: 'Dragon Crew spacecraft (Nick Hague & Aleksandr Gorbunov)',
    details: 'Sent 2 crew members to the International Space Station to return stranded Starliner crew members. Booster landed at LZ-1.',
  },
  {
    id: 'h-3',
    missionName: 'Psyche Asteroid Mission',
    rocketName: 'Falcon Heavy',
    manufacturer: 'SpaceX',
    launchDate: '2023-10-13T14:19:00Z',
    status: 'SUCCESS',
    launchSite: 'LC-39A, Kennedy Space Center, FL',
    payload: 'NASA Psyche Spacecraft',
    details: 'Deep space trajectory launch to explore the metallic asteroid 16 Psyche. Both side boosters returned to Cape Canaveral successfully.',
  },
  {
    id: 'h-4',
    missionName: 'Artemis I Test Flight',
    rocketName: 'Space Launch System (SLS)',
    manufacturer: 'Boeing / Aerojet',
    launchDate: '2022-11-16T06:47:00Z',
    status: 'SUCCESS',
    launchSite: 'LC-39B, Kennedy Space Center, FL',
    payload: 'Orion Spacecraft (Uncrewed)',
    details: 'Maiden flight of the NASA Space Launch System. Sent an uncrewed Orion capsule to a retrograde lunar orbit, validating heat shield performance on reentry.',
  },
  {
    id: 'h-5',
    missionName: 'James Webb Space Telescope',
    rocketName: 'Ariane 5',
    manufacturer: 'Arianespace',
    launchDate: '2021-12-25T12:20:00Z',
    status: 'SUCCESS',
    launchSite: 'ELA-3, Kourou, French Guiana',
    payload: 'JWST Observatory',
    details: 'Flawless injection into the Second Lagrange Point (L2) with solar panel deployment optimization, doubling the telescope\'s planned fuel life.',
  },
  {
    id: 'h-6',
    missionName: 'Chandrayaan-3 Moon Lander',
    rocketName: 'LVM3 M4',
    manufacturer: 'ISRO',
    launchDate: '2023-07-14T09:05:00Z',
    status: 'SUCCESS',
    launchSite: 'SDSC, Sriharikota, India',
    payload: 'Pragyan Rover & Vikram Lander',
    details: 'Successfully inserted the lunar lander into orbit, leading to the historic first landing near the Moon\'s south pole on August 23, 2023.',
  },
  {
    id: 'h-7',
    missionName: 'Starship Flight 5 Test',
    rocketName: 'Starship',
    manufacturer: 'SpaceX',
    launchDate: '2024-10-13T12:30:00Z',
    status: 'SUCCESS',
    launchSite: 'SpaceX Starbase, TX',
    payload: 'Test Telemetry Pack',
    details: 'First historic mechanical catch of the 232-foot-tall Super Heavy Booster by the Mechazilla launch tower chopstick arms at Boca Chica.',
  },
  {
    id: 'h-8',
    missionName: 'Starlink 6-41 Failure',
    rocketName: 'Falcon 9',
    manufacturer: 'SpaceX',
    launchDate: '2024-07-11T02:35:00Z',
    status: 'FAILED',
    launchSite: 'Vandenberg Space Force Base, CA',
    payload: '20 Starlink Satellites',
    details: 'Second stage liquid oxygen leak occurred during orbital insertion, leading to rapid burn-through of insulation and failure of second burn, deploying satellites in a low orbit.',
  }
];

export const ROCKETS = [
  {
    id: 'falcon9',
    name: 'Falcon 9',
    manufacturer: 'SpaceX',
    height: '70m',
    diameter: '3.7m',
    mass: '549,000 kg',
    stages: '2 (Reusable)',
    thrust: '7,607 kN',
    propellant: 'Liquid Oxygen (LOX) / Rocket Propellant 1 (RP-1)',
    payloadLeo: '22,800 kg',
    payloadGto: '8,300 kg',
    successRate: 99.7,
    description: 'The world\'s first orbital class reusable rocket. It has completed hundreds of launches and is the workhorse of space transportation.',
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80',
    videoLink: 'https://www.youtube.com/watch?v=5Ew5d4a1598'
  },
  {
    id: 'starship',
    name: 'Starship',
    manufacturer: 'SpaceX',
    height: '121m',
    diameter: '9m',
    mass: '5,000,000 kg',
    stages: '2 (Fully Reusable)',
    thrust: '74,400 kN',
    propellant: 'Sub-cooled Liquid Oxygen (LOX) / Liquid Methane (LCH4)',
    payloadLeo: '150,000 - 250,000 kg',
    payloadGto: '100,000 kg',
    successRate: 85.0,
    description: 'The most powerful launch vehicle ever built. Designed for deep space cargo, orbital propellant refilling, and colonizing Mars.',
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80',
    videoLink: 'https://www.youtube.com/watch?v=kY84P21SjP0'
  },
  {
    id: 'falconheavy',
    name: 'Falcon Heavy',
    manufacturer: 'SpaceX',
    height: '70m',
    diameter: '12.2m',
    mass: '1,420,000 kg',
    stages: '2 (Reusable Boosters)',
    thrust: '22,819 kN',
    propellant: 'Liquid Oxygen (LOX) / Rocket Propellant 1 (RP-1)',
    payloadLeo: '63,800 kg',
    payloadGto: '26,700 kg',
    successRate: 100.0,
    description: 'Composed of three Falcon 9 nine-engine cores. Renders massive thrust payload capabilities for interplanetary deep-space probes.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    videoLink: 'https://www.youtube.com/watch?v=A0FZIwabctw'
  },
  {
    id: 'sls',
    name: 'Space Launch System',
    manufacturer: 'NASA (Boeing, Aerojet)',
    height: '98m',
    diameter: '8.4m',
    mass: '2,600,000 kg',
    stages: '2 (Expendable)',
    thrust: '39,000 kN',
    propellant: 'Liquid Oxygen (LOX) / Liquid Hydrogen (LH2)',
    payloadLeo: '95,000 kg',
    payloadGto: 'Lunar: 27,000 kg',
    successRate: 100.0,
    description: 'NASA\'s super-heavy lift launch vehicle, central to the Artemis program aimed at returning humans to the Moon and sending crewed missions to Mars.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    videoLink: ''
  }
];
