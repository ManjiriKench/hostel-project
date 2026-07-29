import { Hostel, NearbyResponse, SearchParams } from '../types/hostel';

const API_BASE_URL = 'http://localhost:8000';

// Fallback Sample Data for Pune Localities (used if Backend/PostgreSQL is offline or empty)
const SAMPLE_HOSTELS: Hostel[] = [
  // Shivajinagar
  {
    id: 101,
    name: 'Sunshine Girls & Boys PG',
    lat: 18.5298,
    lon: 73.8420,
    distance_m: 350,
    food_count: 8,
    grocery_count: 4,
    laundry_count: 2,
    facility_count: 14,
    score: 0.88,
  },
  {
    id: 102,
    name: 'Youth Hostel Shivajinagar',
    lat: 18.5314,
    lon: 73.8446,
    distance_m: 520,
    food_count: 6,
    grocery_count: 3,
    laundry_count: 2,
    facility_count: 11,
    score: 0.84,
  },
  {
    id: 103,
    name: 'FC Road Student Living',
    lat: 18.5245,
    lon: 73.8412,
    distance_m: 780,
    food_count: 12,
    grocery_count: 5,
    laundry_count: 3,
    facility_count: 20,
    score: 0.81,
  },
  {
    id: 104,
    name: 'Deccan Comfort Stays',
    lat: 18.5180,
    lon: 73.8425,
    distance_m: 1100,
    food_count: 5,
    grocery_count: 2,
    laundry_count: 1,
    facility_count: 8,
    score: 0.74,
  },

  // Kothrud
  {
    id: 201,
    name: 'MIT Campus View Hostel',
    lat: 18.5074,
    lon: 73.8077,
    distance_m: 410,
    food_count: 9,
    grocery_count: 4,
    laundry_count: 3,
    facility_count: 16,
    score: 0.89,
  },
  {
    id: 202,
    name: 'Green Stays Kothrud',
    lat: 18.5090,
    lon: 73.8120,
    distance_m: 650,
    food_count: 7,
    grocery_count: 3,
    laundry_count: 2,
    facility_count: 12,
    score: 0.82,
  },

  // Viman Nagar
  {
    id: 301,
    name: 'Stanza Living Viman Nagar',
    lat: 18.5679,
    lon: 73.9143,
    distance_m: 300,
    food_count: 10,
    grocery_count: 6,
    laundry_count: 4,
    facility_count: 20,
    score: 0.92,
  },
  {
    id: 302,
    name: 'Symbiosis Proximity Hostel',
    lat: 18.5650,
    lon: 73.9120,
    distance_m: 550,
    food_count: 8,
    grocery_count: 4,
    laundry_count: 2,
    facility_count: 14,
    score: 0.85,
  },

  // Hinjewadi
  {
    id: 401,
    name: 'Zolo Stays Hinjewadi Phase 1',
    lat: 18.5912,
    lon: 73.7389,
    distance_m: 480,
    food_count: 11,
    grocery_count: 5,
    laundry_count: 3,
    facility_count: 19,
    score: 0.90,
  },

  // Katraj
  {
    id: 501,
    name: 'Bharati Vidyapeeth Student PG',
    lat: 18.4575,
    lon: 73.8508,
    distance_m: 380,
    food_count: 6,
    grocery_count: 3,
    laundry_count: 2,
    facility_count: 11,
    score: 0.83,
  },
];

const MOCK_NEARBY_MAP: Record<number, NearbyResponse> = {
  101: {
    hostel: { id: 101, name: 'Sunshine Girls & Boys PG', lat: 18.5298, lon: 73.8420 },
    nearby: {
      grocery: [
        { id: 1, name: 'D-Mart Express Shivajinagar', category: 'grocery', lat: 18.5300, lon: 73.8430, distance_m: 180 },
        { id: 2, name: 'Reliance Fresh FC Road', category: 'grocery', lat: 18.5280, lon: 73.8410, distance_m: 320 },
      ],
      food: [
        { id: 3, name: 'Goodluck Cafe', category: 'food', lat: 18.5235, lon: 73.8405, distance_m: 210 },
        { id: 4, name: 'Wadeshwar FC Road', category: 'food', lat: 18.5250, lon: 73.8415, distance_m: 410 },
        { id: 5, name: 'Vaishali Restaurant', category: 'food', lat: 18.5220, lon: 73.8410, distance_m: 540 },
      ],
      laundry: [
        { id: 6, name: 'Express Dry Cleaners FC Road', category: 'laundry', lat: 18.5240, lon: 73.8418, distance_m: 290 },
        { id: 7, name: 'Fabric Care Laundry', category: 'laundry', lat: 18.5310, lon: 73.8460, distance_m: 450 },
      ],
    },
  },
};

export async function fetchRankedHostels(params: SearchParams): Promise<Hostel[]> {
  const { lat, lon, radius, w_dist = 0.5, w_food = 0.2, w_laundry = 0.1, w_grocery = 0.1 } = params;
  const url = `${API_BASE_URL}/hostels/ranked?lat=${lat}&lon=${lon}&radius=${radius}&w_dist=${w_dist}&w_food=${w_food}&w_laundry=${w_laundry}&w_grocery=${w_grocery}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data: Hostel[] = await response.json();
      if (data && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend API unavailable. Using fallback sample dataset.', err);
  }

  // Filter sample dataset based on distance to search center
  return SAMPLE_HOSTELS.filter((h) => {
    // Approx Haversine distance in meters
    const dLat = (h.lat - lat) * 111000;
    const dLon = (h.lon - lon) * 111000 * Math.cos((lat * Math.PI) / 180);
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    return dist <= radius + 500;
  });
}

export async function fetchHostelsByRadius(lat: number, lon: number, radius: number): Promise<Hostel[]> {
  return fetchRankedHostels({ lat, lon, radius });
}

export async function searchHostelsByName(query: string): Promise<Hostel[]> {
  const url = `${API_BASE_URL}/hostels/search?q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data: Hostel[] = await response.json();
      if (data && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend API search unavailable. Searching sample dataset.', err);
  }

  const q = query.toLowerCase();
  return SAMPLE_HOSTELS.filter((h) => h.name.toLowerCase().includes(q));
}

export async function fetchNearbyServices(hostelId: number, radius: number = 1000): Promise<NearbyResponse> {
  const url = `${API_BASE_URL}/hostels/${hostelId}/nearby?radius=${radius}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend API nearby services unavailable. Using fallback sample data.', err);
  }

  if (MOCK_NEARBY_MAP[hostelId]) {
    return MOCK_NEARBY_MAP[hostelId];
  }

  // Generic fallback response for any hostel
  const hostel = SAMPLE_HOSTELS.find((h) => h.id === hostelId) || SAMPLE_HOSTELS[0];
  return {
    hostel: { id: hostel.id, name: hostel.name, lat: hostel.lat, lon: hostel.lon },
    nearby: {
      grocery: [
        { id: 801, name: 'Local Supermarket & Grocery', category: 'grocery', lat: hostel.lat + 0.002, lon: hostel.lon + 0.001, distance_m: 240 },
        { id: 802, name: 'Daily Fresh Mart', category: 'grocery', lat: hostel.lat - 0.001, lon: hostel.lon + 0.002, distance_m: 390 },
      ],
      food: [
        { id: 803, name: 'City Cafe & Dining', category: 'food', lat: hostel.lat + 0.001, lon: hostel.lon - 0.001, distance_m: 190 },
        { id: 804, name: 'Student Mess & Restaurant', category: 'food', lat: hostel.lat - 0.002, lon: hostel.lon - 0.002, distance_m: 350 },
        { id: 805, name: 'Fast Food Corner', category: 'food', lat: hostel.lat + 0.003, lon: hostel.lon + 0.002, distance_m: 480 },
      ],
      laundry: [
        { id: 806, name: 'QuickWash Laundry Service', category: 'laundry', lat: hostel.lat + 0.001, lon: hostel.lon + 0.003, distance_m: 310 },
      ],
    },
  };
}
