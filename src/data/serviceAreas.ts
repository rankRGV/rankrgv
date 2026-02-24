export interface ServiceArea {
  slug: string;
  name: string;
  county: string;
  state: string;
  geoRegion: string; // e.g. "US-TX"
  population: string;
  neighborhoods: string[];
  landmarks: string[];
  marketContext: string; // 1-2 sentences of city-specific context for content differentiation
}

export const serviceAreas: ServiceArea[] = [
  {
    slug: 'mcallen',
    name: 'McAllen',
    county: 'Hidalgo',
    state: 'TX',
    geoRegion: 'US-TX',
    population: '145,000+',
    neighborhoods: ['North McAllen', 'South McAllen', 'Downtown McAllen', 'La Paloma', 'Sharyland'],
    landmarks: ['McAllen Convention Center', 'La Plaza Mall', 'Quinta Mazatlán', 'McAllen International Airport'],
    marketContext:
      'The economic hub of the Rio Grande Valley, McAllen is one of the fastest-growing metros in Texas with a thriving retail and healthcare sector.',
  },
  {
    slug: 'brownsville',
    name: 'Brownsville',
    county: 'Cameron',
    state: 'TX',
    geoRegion: 'US-TX',
    population: '185,000+',
    neighborhoods: ['Downtown Brownsville', 'Southmost', 'Boca Chica', 'Palm Gardens', 'Sunrise'],
    landmarks: ['SpaceX Starbase', 'Resaca de la Palma State Park', 'Historic Downtown', 'Port of Brownsville'],
    marketContext:
      "Texas's southernmost city and home to SpaceX's Starbase facility, Brownsville is experiencing rapid economic growth and an influx of new businesses.",
  },
  {
    slug: 'edinburg',
    name: 'Edinburg',
    county: 'Hidalgo',
    state: 'TX',
    geoRegion: 'US-TX',
    population: '100,000+',
    neighborhoods: ['Downtown Edinburg', 'North Edinburg', 'UTRGV Area', 'Trenton Road Corridor'],
    landmarks: ['UTRGV Campus', 'Edinburg Convention Center', 'Hidalgo County Courthouse'],
    marketContext:
      'Home to UTRGV and the Hidalgo County seat, Edinburg has a growing professional services sector and a large student-driven economy.',
  },
  {
    slug: 'harlingen',
    name: 'Harlingen',
    county: 'Cameron',
    state: 'TX',
    geoRegion: 'US-TX',
    population: '75,000+',
    neighborhoods: ['Downtown Harlingen', 'North Harlingen', 'Stuart Place', 'Treasure Hills'],
    landmarks: ['Valley International Airport', 'Iwo Jima Memorial', 'UTRGV Health Sciences Campus'],
    marketContext:
      "A major healthcare hub in the RGV, Harlingen anchors Cameron County's economy with Valley Baptist Medical Center and a strong mid-size business community.",
  },
  {
    slug: 'mission',
    name: 'Mission',
    county: 'Hidalgo',
    state: 'TX',
    geoRegion: 'US-TX',
    population: '85,000+',
    neighborhoods: ['Downtown Mission', 'North Mission', 'Bentsen Grove', 'Los Ebanos'],
    landmarks: ['Bentsen-Rio Grande Valley State Park', 'La Joya', 'Mission CISD'],
    marketContext:
      "Known as the home of the Texas Citrus industry, Mission is a rapidly growing suburb of McAllen with an expanding business corridor along Mile 2 Road.",
  },
  {
    slug: 'pharr',
    name: 'Pharr',
    county: 'Hidalgo',
    state: 'TX',
    geoRegion: 'US-TX',
    population: '80,000+',
    neighborhoods: ['Downtown Pharr', 'North Pharr', 'Sharyland Plantation Area', 'Las Milpas'],
    landmarks: ['Pharr International Bridge', 'South Texas International at Edinburg Airport', 'World Birding Center'],
    marketContext:
      'A key international trade gateway between the US and Mexico, Pharr has one of the busiest commercial ports of entry in Texas and a growing logistics and warehouse sector.',
  },
];

export function getAreaBySlug(slug: string): ServiceArea | undefined {
  return serviceAreas.find((a) => a.slug === slug);
}
